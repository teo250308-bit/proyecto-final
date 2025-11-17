<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => true, 'message' => 'No autenticado']);
    exit;
}

if (($_SESSION['rol'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => true, 'message' => 'Acceso denegado']);
    exit;
}

require_once __DIR__ . '/../conexion.php';
require_once __DIR__ . '/../analytics/helpers.php';

try {
    ensureAnalyticsSchema($conn);

    $data = [
        'generatedAt' => gmdate('c'),
        'reservasPedidos' => buildReservasPedidos($conn),
        'conversion' => buildConversion($conn),
        'actividad' => buildActividad($conn),
        'platosPedidos' => buildTopPlatosPedidos($conn),
    ];

    echo json_encode($data, JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => true, 'message' => $e->getMessage()]);
}

function buildReservasPedidos(PDO $conn): array
{
    $today = new DateTimeImmutable('today');
    $startForAll = (new DateTimeImmutable('first day of this month'))->modify('-11 months');

    $reservasMap = fetchDailyCounts($conn, 'Reserva', 'Fecha', $startForAll, "COALESCE(Origen, 'Web') = 'Web'");
    $pedidosMap = fetchDailyCounts($conn, 'Pedido', 'Fecha_hora', $startForAll, "COALESCE(Origen, 'Web') = 'Web'");

    $dailyStart = $today->modify('-6 days');
    $weeklyStart = (new DateTimeImmutable('monday this week'))->modify('-7 weeks');
    $monthlyStart = (new DateTimeImmutable('first day of this month'))->modify('-11 months');

    return [
        'diario' => buildDailySeries($reservasMap, $pedidosMap, $dailyStart, $today),
        'semanal' => buildWeeklySeries($reservasMap, $pedidosMap, $weeklyStart, 8),
        'mensual' => buildMonthlySeries($reservasMap, $pedidosMap, $monthlyStart, 12),
    ];
}

function buildConversion(PDO $conn): array
{
    $today = new DateTimeImmutable('today');
    $start = $today->modify('-29 days');

    $visitasMap = fetchDailyCounts($conn, 'Visita', 'fecha', $start);
    $reservasMap = fetchDailyCounts($conn, 'Reserva', 'Fecha', $start, "COALESCE(Origen, 'Web') = 'Web'");
    $pedidosMap = fetchDailyCounts($conn, 'Pedido', 'Fecha_hora', $start, "COALESCE(Origen, 'Web') = 'Web'");

    $visitas = array_sum($visitasMap);
    $reservasPedidos = array_sum($reservasMap) + array_sum($pedidosMap);
    $porcentaje = $visitas > 0 ? round(($reservasPedidos / $visitas) * 100, 2) : 0;

    $series = buildDailySeries($reservasMap, $pedidosMap, $start, $today);
    $series['visitas'] = [];
    for ($cursor = $start; $cursor <= $today; $cursor = $cursor->modify('+1 day')) {
        $key = $cursor->format('Y-m-d');
        $series['visitas'][] = $visitasMap[$key] ?? 0;
    }

    return [
        'periodo' => [
            'desde' => $start->format('Y-m-d'),
            'hasta' => $today->format('Y-m-d'),
        ],
        'visitas' => $visitas,
        'reservasPedidos' => $reservasPedidos,
        'porcentaje' => $porcentaje,
        'serie' => $series,
    ];
}

function buildActividad(PDO $conn): array
{
    $startVisitas = (new DateTimeImmutable('today'))->modify('-6 days');
    $stmt = $conn->prepare("
        SELECT HOUR(fecha) AS hora, COUNT(*) AS total
        FROM Visita
        WHERE fecha >= :start
        GROUP BY HOUR(fecha)
    ");
    $stmt->execute([':start' => $startVisitas->format('Y-m-d')]);
    $visitasPorHora = array_fill(0, 24, 0);
    foreach ($stmt->fetchAll() as $row) {
        $hora = (int)$row['hora'];
        if ($hora >= 0 && $hora <= 23) {
            $visitasPorHora[$hora] = (int)$row['total'];
        }
    }

    $visitasSerie = [
        'labels' => array_map(fn ($h) => str_pad($h, 2, '0', STR_PAD_LEFT) . 'h', range(0, 23)),
        'valores' => array_values($visitasPorHora),
    ];
    return [
        'visitasPorHora' => $visitasSerie,
    ];
}

function buildTopPlatosPedidos(PDO $conn): array
{
    $sql = "
        SELECT dp.Id_producto AS id, p.Nombre, SUM(dp.Cantidad) AS cantidad
        FROM Detalle_pedido dp
        INNER JOIN Pedido ped ON ped.Id_pedido = dp.Id_pedido
        LEFT JOIN Producto p ON p.Id_producto = dp.Id_producto
        WHERE COALESCE(ped.Origen, 'Web') = 'Web'
        GROUP BY dp.Id_producto, p.Nombre
        ORDER BY cantidad DESC
        LIMIT 10
    ";
    $rows = $conn->query($sql)->fetchAll();
    return array_map(fn ($row) => [
        'id' => isset($row['id']) ? (int)$row['id'] : null,
        'nombre' => $row['Nombre'] ?: 'Sin nombre',
        'cantidad' => (int)$row['cantidad'],
    ], $rows);
}

function fetchDailyCounts(PDO $conn, string $table, string $dateField, DateTimeImmutable $start, string $extraWhere = ''): array
{
    $conditions = [
        "{$dateField} >= :start",
        "{$dateField} IS NOT NULL",
    ];
    if ($extraWhere) {
        $conditions[] = $extraWhere;
    }
    $sql = sprintf(
        "SELECT DATE(%s) AS fecha, COUNT(*) AS total FROM %s WHERE %s GROUP BY DATE(%s) ORDER BY fecha",
        $dateField,
        $table,
        implode(' AND ', $conditions),
        $dateField
    );
    $stmt = $conn->prepare($sql);
    $stmt->execute([':start' => $start->format('Y-m-d')]);
    $map = [];
    foreach ($stmt->fetchAll() as $row) {
        if ($row['fecha']) {
            $map[$row['fecha']] = (int)$row['total'];
        }
    }
    return $map;
}

function buildDailySeries(array $reservas, array $pedidos, DateTimeImmutable $start, DateTimeImmutable $end): array
{
    $labels = [];
    $resVals = [];
    $pedVals = [];
    $totals = [];
    for ($cursor = $start; $cursor <= $end; $cursor = $cursor->modify('+1 day')) {
        $key = $cursor->format('Y-m-d');
        $labels[] = $cursor->format('d/m');
        $r = $reservas[$key] ?? 0;
        $p = $pedidos[$key] ?? 0;
        $resVals[] = $r;
        $pedVals[] = $p;
        $totals[] = $r + $p;
    }
    return [
        'labels' => $labels,
        'reservas' => $resVals,
        'pedidos' => $pedVals,
        'totales' => $totals,
    ];
}

function buildWeeklySeries(array $reservas, array $pedidos, DateTimeImmutable $startWeek, int $weeks): array
{
    $labels = [];
    $resVals = [];
    $pedVals = [];
    $totals = [];
    $cursor = $startWeek;
    for ($i = 0; $i < $weeks; $i++) {
        $labels[] = 'Sem ' . $cursor->format('W');
        $weekRes = 0;
        $weekPed = 0;
        for ($d = 0; $d < 7; $d++) {
            $dayKey = $cursor->modify("+{$d} day")->format('Y-m-d');
            $weekRes += $reservas[$dayKey] ?? 0;
            $weekPed += $pedidos[$dayKey] ?? 0;
        }
        $resVals[] = $weekRes;
        $pedVals[] = $weekPed;
        $totals[] = $weekRes + $weekPed;
        $cursor = $cursor->modify('+1 week');
    }
    return [
        'labels' => $labels,
        'reservas' => $resVals,
        'pedidos' => $pedVals,
        'totales' => $totals,
    ];
}

function buildMonthlySeries(array $reservas, array $pedidos, DateTimeImmutable $startMonth, int $months): array
{
    $labels = [];
    $resVals = [];
    $pedVals = [];
    $totals = [];
    $cursor = $startMonth;
    $meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    for ($i = 0; $i < $months; $i++) {
        $labels[] = $meses[(int)$cursor->format('n') - 1] . ' ' . $cursor->format('y');
        $finMes = $cursor->modify('last day of this month');
        $resTotal = sumRange($reservas, $cursor, $finMes);
        $pedTotal = sumRange($pedidos, $cursor, $finMes);
        $resVals[] = $resTotal;
        $pedVals[] = $pedTotal;
        $totals[] = $resTotal + $pedTotal;
        $cursor = $cursor->modify('first day of next month');
    }
    return [
        'labels' => $labels,
        'reservas' => $resVals,
        'pedidos' => $pedVals,
        'totales' => $totals,
    ];
}

function sumRange(array $map, DateTimeImmutable $start, DateTimeImmutable $end): int
{
    $sum = 0;
    for ($cursor = $start; $cursor <= $end; $cursor = $cursor->modify('+1 day')) {
        $key = $cursor->format('Y-m-d');
        $sum += $map[$key] ?? 0;
    }
    return $sum;
}

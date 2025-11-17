<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../conexion.php';
require_once __DIR__ . '/news_utils.php';

$fallback = function () {
    return [
        'items' => [
            [
                'id' => null,
                'titulo' => 'Nuestra App',
                'descripcion' => 'Descargala en tu tienda y obtené descuentos.',
                'imagen' => 'img/app.jpg',
                'orden' => 2,
                'activo' => 1,
            ],
            [
                'id' => null,
                'titulo' => 'Nueva Barra De Tragos',
                'descripcion' => 'Vení a conocerla y probá nuestros clásicos.',
                'imagen' => 'img/barradetragos.jpg',
                'orden' => 1,
                'activo' => 1,
            ],
        ],
        'admin' => false,
        'fallback' => true,
    ];
};

try {
    ensureNewsTable($conn);

    $limit = isset($_GET['limit']) ? max(1, (int)$_GET['limit']) : 6;
    $limit = min($limit, 20);
    $showAll = !empty($_GET['all']) && isAdminSession();

    $sql = "SELECT id, titulo, descripcion, imagen, orden, activo, creado_en
            FROM Novedad";
    $conds = [];
    $params = [];
    if (!$showAll) {
        $conds[] = "activo = 1";
    }
    if ($conds) {
        $sql .= ' WHERE ' . implode(' AND ', $conds);
    }
    $sql .= ' ORDER BY orden DESC, creado_en DESC LIMIT ' . (int)$limit;

    $stmt = $conn->prepare($sql);
    $stmt->execute($params);

    $items = $stmt->fetchAll();
    if (!$items) {
        echo json_encode($fallback(), JSON_UNESCAPED_UNICODE);
        return;
    }

    echo json_encode([
        'items' => $items,
        'admin' => $showAll,
        'fallback' => false,
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    // En caso de error, devolvemos fallback para no romper la UI
    echo json_encode($fallback() + ['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

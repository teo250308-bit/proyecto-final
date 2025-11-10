<?php
header('Content-Type: application/json');
session_start();
include '../conexion.php';

try {
    if (!isset($_SESSION['user_id'])) {
        http_response_code(401);
        echo json_encode(["error" => "No autenticado"]);
        exit;
    }
    $id_usuario = $_SESSION['user_id'];

    $sql = "SELECT c.Id_producto, p.Nombre, p.Precio, c.Cantidad,
                   (p.Precio * c.Cantidad) AS Subtotal
            FROM Carrito c
            INNER JOIN Producto p ON c.Id_producto = p.Id_producto
            WHERE c.Id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id_usuario]);
    $carrito = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (count($carrito) === 0) {
        echo json_encode(["error" => "Carrito vacío"]);
        exit;
    }

    $total = 0;
    foreach ($carrito as $item) {
        $total += $item['Subtotal'];
    }

    $stmtPedido = $conn->prepare("INSERT INTO Pedido (Id_usuario, Total) VALUES (?, ?)");
    $stmtPedido->execute([$id_usuario, $total]);
    $id_pedido = $conn->lastInsertId();

    $stmtDetalle = $conn->prepare(
        "INSERT INTO DetallePedido (Id_pedido, Id_producto, Nombre, Precio, Cantidad, Subtotal)
         VALUES (?, ?, ?, ?, ?, ?)"
    );

    foreach ($carrito as $item) {
        $stmtDetalle->execute([
            $id_pedido,
            $item['Id_producto'],
            $item['Nombre'],
            $item['Precio'],
            $item['Cantidad'],
            $item['Subtotal']
        ]);
    }

    $stmtDel = $conn->prepare("DELETE FROM Carrito WHERE Id_usuario = ?");
    $stmtDel->execute([$id_usuario]);

    echo json_encode(["success" => true, "id_pedido" => $id_pedido]);

} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>

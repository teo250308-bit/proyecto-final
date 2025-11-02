<?php
header('Content-Type: application/json');
include '../conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
  // Mostrar carrito
  case 'GET':
    if (!isset($_GET['id_usuario'])) {
      echo json_encode(["error" => "Falta id_usuario"]);
      exit;
    }

    $id_usuario = $_GET['id_usuario'];

    $sql = "SELECT c.Id_carrito, p.Id_producto, p.Nombre, p.Precio, p.Imagen, c.Cantidad,
                   (p.Precio * c.Cantidad) AS Subtotal
            FROM Carrito c
            INNER JOIN Producto p ON c.Id_producto = p.Id_producto
            WHERE c.Id_usuario = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$id_usuario]);
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($data);
    break;

  // Agregar producto
  case 'POST':
    $json = file_get_contents("php://input");
    $body = json_decode($json, true);

    if (!$body || !isset($body['id_usuario'], $body['id_producto'])) {
      echo json_encode(["error" => "Datos incompletos"]);
      exit;
    }

    $id_usuario = $body['id_usuario'];
    $id_producto = $body['id_producto'];
    $cantidad = $body['cantidad'] ?? 1;

    $check = $conn->prepare("SELECT Cantidad FROM Carrito WHERE Id_usuario = ? AND Id_producto = ?");
    $check->execute([$id_usuario, $id_producto]);
    $existe = $check->fetch(PDO::FETCH_ASSOC);

    if ($existe) {
      $nueva = $existe['Cantidad'] + $cantidad;
      $upd = $conn->prepare("UPDATE Carrito SET Cantidad = ? WHERE Id_usuario = ? AND Id_producto = ?");
      $upd->execute([$nueva, $id_usuario, $id_producto]);
    } else {
      $ins = $conn->prepare("INSERT INTO Carrito (Id_usuario, Id_producto, Cantidad) VALUES (?, ?, ?)");
      $ins->execute([$id_usuario, $id_producto, $cantidad]);
    }

    echo json_encode(["success" => true]);
    break;
}
?>

<?php
header('Content-Type: application/json');
session_start();
include '../conexion.php';

$email = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

try {
    $sql = "SELECT * FROM usuarios WHERE correo = ?";
    $stmt = $conn->prepare($sql);
    $stmt->execute([$email]);
    $resultado = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($resultado && password_verify($password, $resultado['contrasena'])) {
        $_SESSION['email'] = $email;
        $_SESSION['rol'] = $resultado['rol'];
        $_SESSION['nombre'] = $resultado['nombre'];
        echo json_encode(["success" => $resultado['rol']]);
    } else {
        echo json_encode(["Error" => "Credenciales inválidas."]);
    }
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(["Error" => $e->getMessage()]);
}
?>


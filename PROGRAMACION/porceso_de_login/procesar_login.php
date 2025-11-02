<?php
session_start();
include '../conexion.php';

$email = $_POST['email'];
$password = $_POST['password'];

$sql = "SELECT * FROM usuarios WHERE Correo = ?";
$stmt = $conn->prepare($sql);
$stmt->execute([$email]);

$resultado = $stmt->fetch(PDO::FETCH_ASSOC);

if ($resultado) {
    if (password_verify($password, $resultado['contrasena'])) {
        $_SESSION['email'] = $email;
        $_SESSION['rol'] = $resultado['rol'];
        $_SESSION['nombre'] = $resultado['nombre'];
        echo json_encode (["success" => $resultado['rol']]);
        // header("Location: index.html");
    } else {
        echo json_encode (["Error" => "Contraseña incorrecta."]);
    }
} else {
    echo json_encode (["Error" => "Usuario no encontrado."]);
}

?>

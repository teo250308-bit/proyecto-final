<?php
include '../conexion.php';

$nombre = $_POST['nombre'];
$email = $_POST['email'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT); // seguridad
// USEN try/catch para capturar errores
$sql = "INSERT INTO usuarios (nombre, Correo, pass) VALUES (?, ?, ?)";
$stmt = $conn->prepare($sql);
if ($stmt->execute([$nombre, $email, $password])){

    echo json_encode (["success" => true]);
} else {
    echo json_encode (["Error" => $stmt->error]);
}

?>

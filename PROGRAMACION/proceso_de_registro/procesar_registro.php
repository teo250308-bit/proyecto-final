<?php
header('Content-Type: application/json'); // siempre que respondas JSON

require '../conexion.php'; // mejor usar require para evitar errores si no se incluye

// Recibir datos por POST (desde fetch)
$nombre   = $_POST['nombre'] ?? '';
$email    = $_POST['email'] ?? '';
$password = $_POST['password'] ?? '';

// Validar campos
if (empty($nombre) || empty($email) || empty($password)) {
    echo json_encode(["success" => false, "msg" => "Todos los campos son obligatorios"]);
    exit;
}

// Hashear contraseña de forma segura
$hashed = password_hash($password, PASSWORD_DEFAULT);

try {
    // Preparar consulta con parámetros
    $stmt = $conexion->prepare("INSERT INTO usuarios (nombre, correo, contrasena) VALUES (?, ?, ?)");
    $stmt->bind_param("sss", $nombre, $email, $hashed);

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "msg" => "Usuario registrado correctamente"]);
    } else {
        echo json_encode(["success" => false, "msg" => "Error al registrar usuario"]);
    }

    $stmt->close();
    $conexion->close();
} catch (Exception $e) {
    echo json_encode(["success" => false, "msg" => "Error: " . $e->getMessage()]);
}
?>

// include '../conexion.php';

// $nombre = $_POST['nombre'];
// $email = $_POST['email'];
// $password = password_hash($_POST['password'], PASSWORD_DEFAULT); // seguridad
// // USEN try/catch para capturar errores
// $sql = "INSERT INTO usuarios (nombre, Correo, contrasena) VALUES (?, ?, ?)";
// $stmt = $conn->prepare($sql);
// if ($stmt->execute([$nombre, $email, $password])){

//     echo json_encode (["success" => true]);
// } else {
//     echo json_encode (["Error" => $stmt->error]);
// }



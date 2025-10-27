<?php
// adduser.php
header("Content-Type: application/json");
require_once "conexion.php"; // tu conexión PDO

try {
    // Leer los datos enviados desde el fetch
    $data = json_decode(file_get_contents("php://input"), true);

    if (isset($data["nombre"], $data["correo"], $data["pass"])) {
        $nombre = trim($data["nombre"]);
        $correo = trim($data["correo"]);
        $pass = password_hash($data["pass"], PASSWORD_DEFAULT);

        // Preparar la consulta con parámetros
        $stmt = $conn->prepare("INSERT INTO usuarios (nombre, correo, pass) VALUES (:nombre, :correo, :pass)");
        $stmt->bindParam(":nombre", $nombre);
        $stmt->bindParam(":correo", $correo);
        $stmt->bindParam(":pass", $pass);

        if ($stmt->execute()) {
            echo json_encode(["success" => true, "message" => "Usuario agregado correctamente"]);
        } else {
            echo json_encode(["success" => false, "message" => "Error al insertar el usuario"]);
        }

    } else {
        echo json_encode(["success" => false, "message" => "Datos incompletos"]);
    }

} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error de base de datos: " . $e->getMessage()]);
}
?>





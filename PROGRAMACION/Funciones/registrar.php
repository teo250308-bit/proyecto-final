<?php
<?php
include "../conexion.php";

$nombre_usuario = $_POST["nombre_usuario"] ?? '';
$contrasena = $_POST["contrasena"] ?? '';

if (empty($nombre_usuario) || empty($contrasena)) {
    echo "Debe completar todos los campos.";
} else {
    // Verificar si el usuario ya existe
    $sql = "SELECT * FROM usuario WHERE Nombre_usuario = ?";
    $sentencia = $conn->prepare($sql);
    $sentencia->bind_param("s", $nombre_usuario);
    $sentencia->execute();
    $result = $sentencia->get_result();

    if ($result->num_rows > 0) {
        echo "El nombre de usuario ya está registrado.";
    } else {
        // Insertar el nuevo usuario
        $hash = password_hash($contrasena, PASSWORD_DEFAULT);
        $sql = "INSERT INTO usuario (Nombre_usuario, Contrasena_hash) VALUES (?, ?)";
        $sentencia = $conn->prepare($sql);
        $sentencia->bind_param("ss", $nombre_usuario, $hash);

        if ($sentencia->execute()) {
            echo "¡Usuario registrado exitosamente!";
        } else {
            echo "Error al registrar el usuario.";
        }
    }
}

echo "<br><br><a href='../index.html'>Inicio</a>";

$conn->close();
?>
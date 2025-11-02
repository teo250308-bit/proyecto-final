<?php
// Cargar conexión
require 'conexion.php'; // Asegúrate que la ruta sea correcta
// Si tu conexion.php está en otra carpeta, ajustá la ruta (ej: ../conexion.php)

// Contraseña actual (en texto plano) del admin que querés hashear
$old_password = '123456'; // cámbiala si tu admin usa otra contraseña

// Generar hash seguro
$hashed = password_hash($old_password, PASSWORD_DEFAULT);

// Mostrar el hash generado en pantalla
echo "Hash generado:<br>$hashed<br><br>";

// Verificar que la conexión exista
if (!isset($conexion) || $conexion->connect_error) {
    die("❌ Error de conexión: " . $conexion->connect_error);
}

// Actualizar la contraseña del usuario admin
$sql = "UPDATE usuarios SET contrasena = '$hashed' WHERE rol = 'admin'";
if ($conexion->query($sql) === TRUE) {
    echo "✅ Contraseña del administrador actualizada correctamente.";
} else {
    echo "❌ Error al actualizar: " . $conexion->error;
}

$conexion->close();
?>


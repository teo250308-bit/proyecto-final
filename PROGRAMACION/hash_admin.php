<?php
// Usar PDO para actualizar la contrasena del admin
require 'conexion.php'; // Debe definir $conn (PDO)

// Contrasena actual (en texto plano) del admin a hashear
$old_password = '123456'; // cambiala si tu admin usa otra contrasena

// Generar hash seguro
$hashed = password_hash($old_password, PASSWORD_DEFAULT);

// Mostrar el hash generado
echo "Hash generado:<br>$hashed<br><br>";

try {
    if (!isset($conn) || !($conn instanceof PDO)) {
        throw new Exception('Conexion PDO no disponible');
    }

    $stmt = $conn->prepare("UPDATE usuarios SET contrasena = ? WHERE rol = 'admin'");
    $stmt->execute([$hashed]);

    echo "Contrasena del administrador actualizada correctamente.";
} catch (Throwable $e) {
    echo "Error al actualizar: " . $e->getMessage();
} finally {
    // Liberar recursos PDO
    if (isset($stmt)) { $stmt = null; }
    if (isset($conn)) { $conn = null; }
}
?>


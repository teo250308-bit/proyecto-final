
<?php
$host = "localhost";
$usuario = "root";
$contrasena = "";
$basedatos = "proyecto";

try {
    $conn = new PDO("mysql:host=$host;dbname=$basedatos", $usuario, $contrasena);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    // Conexión exitosa
} catch (PDOException $e) {
    die("❌ Error en la conexión: " . $e->getMessage());
}
?>
<?php
$host = "localhost";
$usuario = "root";
$contrasena = "";
$basedatos = "proyecto";

try {
    $dsn = "mysql:host=$host;dbname=$basedatos;charset=utf8mb4";
    $conn = new PDO($dsn, $usuario, $contrasena, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
} catch (PDOException $e) {
    die("Error en la conexion: " . $e->getMessage());
}
?>


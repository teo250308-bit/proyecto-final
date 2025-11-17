<?php
require_once "../conexion.php";
require_once __DIR__ . "/imagen_utils.php";
header("Content-Type: application/json");

try {
    $nombre = trim($_POST["nombre"] ?? "");
    $descripcion = trim($_POST["descripcion"] ?? "");
    $precioRaw = $_POST["precio"] ?? "";
    $tipo = trim($_POST["tipo"] ?? "");
    $imagenRuta = normalizeImageInput($_POST["imagenUrl"] ?? "");

    if ($nombre === "" || $descripcion === "" || $precioRaw === "" || $tipo === "") {
        throw new RuntimeException("Datos incompletos.");
    }

    if (!is_numeric($precioRaw)) {
        throw new RuntimeException("El precio debe ser numerico.");
    }
    $precio = (float) $precioRaw;

    $imagenSubida = saveUploadedImage("imagenArchivo");
    if ($imagenSubida) {
        $imagenRuta = $imagenSubida;
    }

    if ($imagenRuta === "") {
        throw new RuntimeException("Debes proporcionar una URL o subir una imagen.");
    }

    $stmt = $conn->prepare("INSERT INTO Producto (Nombre, Descripcion, Imagen, Precio, Tipo) VALUES (:n, :d, :i, :p, :t)");
    $stmt->execute([
        ":n" => $nombre,
        ":d" => $descripcion,
        ":i" => $imagenRuta,
        ":p" => $precio,
        ":t" => $tipo
    ]);

    echo json_encode(["success" => true, "message" => "Plato agregado correctamente"]);
} catch (RuntimeException $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>

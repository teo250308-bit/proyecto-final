<?php
require_once "../conexion.php";
require_once __DIR__ . "/imagen_utils.php";
header("Content-Type: application/json");

try {
    $id = $_POST["id"] ?? "";
    $nombre = trim($_POST["nombre"] ?? "");
    $descripcion = trim($_POST["descripcion"] ?? "");
    $precioRaw = $_POST["precio"] ?? "";
    $tipo = trim($_POST["tipo"] ?? "");
    $imagenFormulario = normalizeImageInput($_POST["imagenUrl"] ?? "");

    if ($id === "" || $nombre === "" || $descripcion === "" || $precioRaw === "" || $tipo === "") {
        throw new RuntimeException("Datos incompletos.");
    }
    if (!is_numeric($precioRaw)) {
        throw new RuntimeException("El precio debe ser numerico.");
    }
    $precio = (float) $precioRaw;

    $stmt = $conn->prepare("SELECT Imagen FROM Producto WHERE Id_producto = :id");
    $stmt->execute([":id" => $id]);
    $plato = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$plato) {
        throw new RuntimeException("Plato no encontrado.");
    }

    $imagenRuta = $plato["Imagen"];
    if ($imagenFormulario !== "") {
        $imagenRuta = $imagenFormulario;
    }

    $nuevaImagen = saveUploadedImage("imagenArchivo");
    if ($nuevaImagen) {
        deleteLocalImage($plato["Imagen"]);
        $imagenRuta = $nuevaImagen;
    }

    if ($imagenRuta === "") {
        throw new RuntimeException("Debes mantener o proporcionar una imagen.");
    }

    $stmt = $conn->prepare("
        UPDATE Producto
        SET Nombre = :n, Descripcion = :d, Imagen = :i, Precio = :p, Tipo = :t
        WHERE Id_producto = :id
    ");

    $stmt->execute([
        ":n"  => $nombre,
        ":d"  => $descripcion,
        ":i"  => $imagenRuta,
        ":p"  => $precio,
        ":t"  => $tipo,
        ":id" => $id
    ]);

    echo json_encode(["success" => true, "message" => "Plato actualizado correctamente"]);
} catch (RuntimeException $e) {
    http_response_code(400);
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}

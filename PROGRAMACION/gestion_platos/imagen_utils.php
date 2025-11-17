<?php

function normalizeImageInput(?string $value): string
{
    $value = trim((string) $value);
    if ($value === "") {
        return "";
    }

    if (preg_match("#^(https?:)?//#i", $value) || strpos($value, "data:") === 0) {
        return $value;
    }

    $value = str_replace("\\", "/", $value);
    $value = preg_replace("#^(\.\./)+#", "", $value);
    $value = preg_replace("#^\./#", "", $value);
    if (strpos($value, "img/") === 0) {
        $value = substr($value, 4);
    }

    return ltrim(str_replace("..", "", $value), "/");
}

function saveUploadedImage(string $campo = "imagenArchivo"): ?string
{
    if (!isset($_FILES[$campo]) || $_FILES[$campo]["error"] === UPLOAD_ERR_NO_FILE) {
        return null;
    }

    $archivo = $_FILES[$campo];
    if ($archivo["error"] !== UPLOAD_ERR_OK) {
        throw new RuntimeException("No se pudo subir la imagen (codigo {$archivo["error"]}).");
    }

    $ext = strtolower(pathinfo($archivo["name"], PATHINFO_EXTENSION));
    $permitidas = ["jpg", "jpeg", "png", "gif", "webp"];
    if (!in_array($ext, $permitidas, true)) {
        throw new RuntimeException("Formato de imagen no permitido.");
    }

    $info = @getimagesize($archivo["tmp_name"]);
    if ($info === false) {
        throw new RuntimeException("El archivo seleccionado no es una imagen valida.");
    }

    $directorio = dirname(__DIR__) . "/img/platos";
    if (!is_dir($directorio) && !mkdir($directorio, 0775, true)) {
        throw new RuntimeException("No se pudo crear la carpeta de imagenes.");
    }

    $nombre = uniqid("plato_", true) . "." . $ext;
    $destino = $directorio . "/" . $nombre;

    if (!move_uploaded_file($archivo["tmp_name"], $destino)) {
        throw new RuntimeException("No se pudo guardar la imagen en el servidor.");
    }

    return "platos/" . $nombre;
}

function deleteLocalImage(?string $ruta): void
{
    $real = resolveUploadedImagePath($ruta);
    if ($real && is_file($real)) {
        @unlink($real);
    }
}

function resolveUploadedImagePath(?string $ruta): ?string
{
    $ruta = normalizeImageInput($ruta);
    if ($ruta === "" || strpos($ruta, "platos/") !== 0) {
        return null;
    }

    return dirname(__DIR__) . "/img/" . $ruta;
}

?>

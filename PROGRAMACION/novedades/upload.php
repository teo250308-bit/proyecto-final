<?php
session_start();
header('Content-Type: application/json; charset=utf-8');

if (!isset($_SESSION['user_id']) || ($_SESSION['rol'] ?? '') !== 'admin') {
    http_response_code(403);
    echo json_encode(['error' => 'Acceso denegado']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST' || empty($_FILES['imagen'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Archivo faltante']);
    exit;
}

$file = $_FILES['imagen'];
if ($file['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'Error al subir el archivo']);
    exit;
}

$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mime = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mime, $allowedTypes, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Formato no permitido']);
    exit;
}

$ext = '';
switch ($mime) {
    case 'image/png': $ext = 'png'; break;
    case 'image/webp': $ext = 'webp'; break;
    case 'image/gif': $ext = 'gif'; break;
    default: $ext = 'jpg';
}

$targetDir = realpath(__DIR__ . '/../img');
if ($targetDir === false) {
    http_response_code(500);
    echo json_encode(['error' => 'Directorio de imágenes no disponible']);
    exit;
}

$newsDir = $targetDir . DIRECTORY_SEPARATOR . 'novedades';
if (!is_dir($newsDir)) {
    if (!mkdir($newsDir, 0775, true) && !is_dir($newsDir)) {
        http_response_code(500);
        echo json_encode(['error' => 'No se pudo crear el directorio de novedades']);
        exit;
    }
}

$filename = 'news_' . uniqid('', true) . '.' . $ext;
$path = $newsDir . DIRECTORY_SEPARATOR . $filename;
if (!move_uploaded_file($file['tmp_name'], $path)) {
    http_response_code(500);
    echo json_encode(['error' => 'No se pudo guardar la imagen']);
    exit;
}

$relativePath = 'img/novedades/' . $filename;
echo json_encode(['ok' => true, 'path' => $relativePath]);

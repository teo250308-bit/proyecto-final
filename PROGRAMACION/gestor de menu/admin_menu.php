<?php
// admin_menu.php

// 1. Configuración de la Conexión a la Base de Datos
$host = 'localhost'; // O la dirección de tu servidor de BD
$db   = 'proyecto';   // El nombre de la base de datos de tu SQL
$user = 'root';      // Tu usuario de MySQL
$pass = '';          // Tu contraseña de MySQL

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $e->getMessage()]));
}

// Recibir la acción a realizar
$action = $_POST['action'] ?? $_GET['action'] ?? '';

// Array para la respuesta JSON
$response = ['success' => false, 'message' => ''];

switch ($action) {
    case 'read':
        // **LEER/BUSCAR Productos**
        $searchTerm = $_GET['search'] ?? '';
        $sql = "SELECT * FROM Producto";
        $params = [];
        
        if (!empty($searchTerm)) {
            $sql .= " WHERE Nombre LIKE :search OR Descripcion LIKE :search OR Tipo LIKE :search";
            $params[':search'] = '%' . $searchTerm . '%';
        }
        $sql .= " ORDER BY Id_producto DESC";

        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $productos = $stmt->fetchAll();
            $response['success'] = true;
            $response['productos'] = $productos;
        } catch (PDOException $e) {
            $response['message'] = 'Error al leer productos: ' . $e->getMessage();
        }
        break;

    case 'create':
        // **CREAR Producto**
        $nombre = $_POST['Nombre'] ?? '';
        $descripcion = $_POST['Descripcion'] ?? '';
        $precio = $_POST['Precio'] ?? 0;
        $imagen = $_POST['Imagen'] ?? '';
        $tipo = $_POST['Tipo'] ?? '';

        if (empty($nombre) || empty($descripcion) || empty($precio)) {
            $response['message'] = 'Faltan campos requeridos (Nombre, Descripción, Precio).';
        } else {
            $sql = "INSERT INTO Producto (Nombre, Descripcion, Imagen, Precio, Tipo) 
                    VALUES (:nombre, :descripcion, :imagen, :precio, :tipo)";
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':nombre' => $nombre,
                    ':descripcion' => $descripcion,
                    ':imagen' => $imagen,
                    ':precio' => $precio,
                    ':tipo' => $tipo
                ]);
                $response['success'] = true;
                $response['message'] = 'Plato creado con éxito.';
            } catch (PDOException $e) {
                $response['message'] = 'Error al crear el plato: ' . $e->getMessage();
            }
        }
        break;

    case 'update':
        // **ACTUALIZAR Producto**
        $id_producto = $_POST['Id_producto'] ?? 0;
        $nombre = $_POST['Nombre'] ?? '';
        $descripcion = $_POST['Descripcion'] ?? '';
        $precio = $_POST['Precio'] ?? 0;
        $imagen = $_POST['Imagen'] ?? '';
        $tipo = $_POST['Tipo'] ?? '';

        if (empty($id_producto) || empty($nombre) || empty($descripcion) || empty($precio)) {
            $response['message'] = 'Faltan campos requeridos para la actualización.';
        } else {
            $sql = "UPDATE Producto SET Nombre = :nombre, Descripcion = :descripcion, 
                    Imagen = :imagen, Precio = :precio, Tipo = :tipo 
                    WHERE Id_producto = :id";
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute([
                    ':nombre' => $nombre,
                    ':descripcion' => $descripcion,
                    ':imagen' => $imagen,
                    ':precio' => $precio,
                    ':tipo' => $tipo,
                    ':id' => $id_producto
                ]);
                $response['success'] = true;
                $response['message'] = 'Plato actualizado con éxito.';
            } catch (PDOException $e) {
                $response['message'] = 'Error al actualizar el plato: ' . $e->getMessage();
            }
        }
        break;

    case 'delete':
        // **ELIMINAR Producto**
        $id_producto = $_POST['Id_producto'] ?? 0;

        if (empty($id_producto)) {
            $response['message'] = 'ID de producto no especificado.';
        } else {
            // NOTA: Debes considerar la restricción de llave foránea con Producto_Ingrediente.
            // Para que funcione, podrías necesitar eliminar primero las referencias en Producto_Ingrediente
            // o configurar la FK con ON DELETE CASCADE.
            $sql = "DELETE FROM Producto WHERE Id_producto = :id";
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute([':id' => $id_producto]);
                $response['success'] = true;
                $response['message'] = 'Plato eliminado con éxito.';
            } catch (PDOException $e) {
                $response['message'] = 'Error al eliminar el plato. Asegúrate de que no tenga ingredientes asociados (FK): ' . $e->getMessage();
            }
        }
        break;

    default:
        $response['message'] = 'Acción no válida.';
        break;
}

// Devolver la respuesta como JSON
header('Content-Type: application/json');
echo json_encode($response);
?>
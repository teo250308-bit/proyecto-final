<?php
function ensureNewsTable(PDO $conn): void
{
    $conn->exec("
        CREATE TABLE IF NOT EXISTS Novedad (
            id INT AUTO_INCREMENT PRIMARY KEY,
            titulo VARCHAR(150) NOT NULL,
            descripcion TEXT NULL,
            imagen VARCHAR(255) NULL,
            orden INT NOT NULL DEFAULT 0,
            activo TINYINT(1) NOT NULL DEFAULT 1,
            creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    ");

    $count = (int)$conn->query("SELECT COUNT(*) FROM Novedad")->fetchColumn();
    if ($count === 0) {
        $seed = $conn->prepare("
            INSERT INTO Novedad (titulo, descripcion, imagen, orden, activo)
            VALUES
            (:titulo1, :desc1, :img1, 2, 1),
            (:titulo2, :desc2, :img2, 1, 1)
        ");
        $seed->execute([
            ':titulo1' => 'Nuestra App',
            ':desc1' => 'Descargala en tu tienda y obtené descuentos.',
            ':img1' => 'img/app.jpg',
            ':titulo2' => 'Nueva Barra De Tragos',
            ':desc2' => 'Vení a conocerla y probá nuestros clásicos.',
            ':img2' => 'img/barradetragos.jpg',
        ]);
    }
}

function isAdminSession(): bool
{
    return isset($_SESSION['rol']) && $_SESSION['rol'] === 'admin';
}

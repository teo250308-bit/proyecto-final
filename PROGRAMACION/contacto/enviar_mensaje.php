<?php
// Fuerza UTF-8 para evitar caracteres mal codificados
header('Content-Type: text/html; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $nombre  = htmlspecialchars(trim($_POST['nombre'] ?? ''), ENT_QUOTES, 'UTF-8');
  $email   = htmlspecialchars(trim($_POST['email'] ?? ''), ENT_QUOTES, 'UTF-8');
  $mensaje = htmlspecialchars(trim($_POST['mensaje'] ?? ''), ENT_QUOTES, 'UTF-8');

  $destinatario = 'santibernal881@gmail.com';
  $asunto       = 'Nuevo mensaje de contacto - NUTRANT';
  // Codificar asunto en UTF-8 para cabeceras de mail
  $asuntoEnc    = '=?UTF-8?B?' . base64_encode($asunto) . '?=';

  $contenido = "Has recibido un nuevo mensaje desde la página de contacto:\n\n" .
               "Nombre: $nombre\n" .
               "Correo: $email\n" .
               "Mensaje:\n$mensaje\n";

  $headers  = "From: $email\r\n";
  $headers .= "Reply-To: $email\r\n";
  $headers .= "MIME-Version: 1.0\r\n";
  $headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
  $headers .= 'X-Mailer: PHP/' . phpversion();

  $ok = @mail($destinatario, $asuntoEnc, $contenido, $headers);

  $redirect = 'contactov2.html';
  if ($ok) {
    echo "<script>alert('¡Listo! Tu mensaje fue enviado correctamente. Gracias por contactarnos.'); window.location.href='$redirect';</script>";
  } else {
    echo "<script>alert('Error al enviar el mensaje. Por favor, intentá de nuevo.'); window.location.href='$redirect';</script>";
  }
}
?>

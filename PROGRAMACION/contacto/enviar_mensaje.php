 <?php
 if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nombre = htmlspecialchars($_POST['nombre']);
    $email = htmlspecialchars($_POST['email']);
    $mensaje = htmlspecialchars($_POST['mensaje']);

    
    $destinatario = "santibernal881@gmail.com";
    $asunto = "Nuevo mensaje de contacto - NUTRANT";

    $contenido = "
    Has recibido un nuevo mensaje desde la página de contacto:\n\n
    Nombre: $nombre\n
    Correo: $email\n
    Mensaje:\n$mensaje
    ";

    $headers = "From: $email\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP/" . phpversion();

    if (mail($destinatario, $asunto, $contenido, $headers)) {
        echo "<script>
                alert('✅ Tu mensaje fue enviado correctamente. Gracias por contactarnos.');
                window.location.href = 'contacto.html';
              </script>";
    } else {
        echo "<script>
                alert('❌ Error al enviar el mensaje. Por favor, intentá de nuevo.');
                window.location.href = 'contacto.html';
              </script>";
    }
}
?>

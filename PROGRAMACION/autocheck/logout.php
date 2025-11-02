<?php
session_start();
$_SESSION = [];

$params = session_get_cookie_params();
setcookie(session_name(), '', time() - 3600, $params['path'], $params['domain'], $params['secure'], $params['httponly']);

session_destroy();

echo json_encode(["ok" => true, "msg" => "Sesión cerrada correctamente"]);
?>
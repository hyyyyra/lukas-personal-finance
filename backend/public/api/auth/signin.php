<?php
require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../helpers/helpers.php';
require_once __DIR__ . '/../../../models/Usuario.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Manejar solicitudes OPTIONS (preflight)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);

    // Validar datos obligatorios
    if (empty($datos['email']) || empty($datos['password'])) {
        enviarRespuestaJson(['error' => 'El correo y la contraseña son obligatorios'], 400);
        exit;
    }

    // Buscar usuario por email
    $usuario = Usuario::buscarPorEmail($datos['email']);

    if (!$usuario) {
        enviarRespuestaJson(['error' => 'No existe una cuenta con ese correo'], 404);
        exit;
    }

    // Verificar contraseña
    if (!$usuario->verificarContraseña($datos['password'])) {
        enviarRespuestaJson(['error' => 'Contraseña incorrecta'], 401);
        exit;
    }

    // Actualizar último login
    $usuario->actualizarUltimoLogin();

    enviarRespuestaJson(['usuario' => $usuario->toArray()]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

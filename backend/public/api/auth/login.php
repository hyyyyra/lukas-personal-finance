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
    
    // Validar datos
    if (!isset($datos['name']) || !isset($datos['email']) || !isset($datos['provider'])) {
        enviarRespuestaJson(['error' => 'Faltan datos obligatorios'], 400);
    }
    
    // Buscar usuario por email
    $usuario = Usuario::buscarPorEmail($datos['email']);
    
    if (!$usuario) {
        // Si no existe, crear nuevo usuario
        $nuevoUsuario = new Usuario();
        $nuevoUsuario->setNombre($datos['name']);
        $nuevoUsuario->setEmail($datos['email']);
        $nuevoUsuario->setProveedor($datos['provider']);
        $resultado = $nuevoUsuario->guardar();
        
        if (!$resultado['exito']) {
            enviarRespuestaJson(['error' => 'Error al crear el usuario'], 500);
        }
        
        $usuario = new Usuario($resultado['datos'][0]);
    }
    
    enviarRespuestaJson(['usuario' => $usuario->toArray()]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

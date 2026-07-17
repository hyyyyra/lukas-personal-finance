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
    if (!isset($datos['email']) || !isset($datos['password'])) {
        enviarRespuestaJson(['error' => 'Faltan datos obligatorios (email y contraseña)'], 400);
        exit;
    }
    
    // Buscar usuario por email
    $usuario = Usuario::buscarPorEmail($datos['email']);
    
    if (!$usuario) {
        // Si no existe y vienen nombres, crear nuevo usuario (registro)
        $nombres = $datos['nombres'] ?? '';
        $apellidos = $datos['apellidos'] ?? '';

        if (!empty($nombres) && !empty($apellidos)) {
            $nuevoUsuario = new Usuario();
            $nuevoUsuario->setNombres($nombres);
            $nuevoUsuario->setApellidos($apellidos);
            $nuevoUsuario->setEmailUsuario($datos['email']);
            $nuevoUsuario->setContraseñaUsuario($datos['password']);
            $resultado = $nuevoUsuario->guardar();
            
            if (!$resultado['exito']) {
                enviarRespuestaJson(['error' => 'Error al crear el usuario: ' . ($resultado['mensaje'] ?? '')], 500);
                exit;
            }
            
            $usuario = new Usuario($resultado['datos'][0]);
        } else {
            enviarRespuestaJson(['error' => 'Usuario no encontrado'], 404);
            exit;
        }
    } else {
        // Verificar contraseña
        if (!$usuario->verificarContraseña($datos['password'])) {
            enviarRespuestaJson(['error' => 'Contraseña incorrecta'], 401);
            exit;
        }
    }
    
    // Actualizar último login
    $usuario->actualizarUltimoLogin();
    
    enviarRespuestaJson(['usuario' => $usuario->toArray()]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

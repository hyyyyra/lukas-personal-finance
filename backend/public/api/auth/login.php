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
    }
    
    // Buscar usuario por email
    $usuario = Usuario::buscarPorEmail($datos['email']);
    
    if (!$usuario) {
        // Si no existe y vienen nombres y apellidos, crear nuevo usuario (registro)
        error_log("datos: " . json_encode($datos));
        if (isset($datos['email']) && isset($datos['password'])) {
            error_log("ENTRO A REGISTRAR USUARIO");
            $nuevoUsuario = new Usuario();
            $nuevoUsuario->setNombres($datos['nombres']);
            $nuevoUsuario->setApellidos($datos['apellidos']);
            $nuevoUsuario->setEmailUsuario($datos['email']);
            $nuevoUsuario->setEmailUsuario($datos['email']);
            $nuevoUsuario->setContraseñaUsuario($datos['password']);
            $resultado = $nuevoUsuario->guardar();
            
            if (!$resultado['exito']) {
                enviarRespuestaJson(['error' => 'Error al crear el usuario'], 500);
            }
            
            $usuario = new Usuario($resultado['datos'][0]);
        } else {
            enviarRespuestaJson(['error' => 'Usuario no encontrado'], 404);
        }
    } else {
        // Verificar contraseña
        if (!$usuario->verificarContraseña($datos['password'])) {
            enviarRespuestaJson(['error' => 'Contraseña incorrecta'], 401);
        }
    }
    
    // Actualizar último login
    $usuario->actualizarUltimoLogin();
    
    enviarRespuestaJson(['usuario' => $usuario->toArray()]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

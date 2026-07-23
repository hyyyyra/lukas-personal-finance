<?php
require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../helpers/helpers.php';
require_once __DIR__ . '/../../../models/Usuario.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    $token = $datos['token'] ?? '';

    if (empty($token)) {
        enviarRespuestaJson(['error' => 'Token de Google requerido'], 400);
        exit;
    }

    // 1. Intentar validar como ID Token (tokeninfo)
    $urlTokenInfo = "https://oauth2.googleapis.com/tokeninfo?id_token=" . urlencode($token);
    $response = @file_get_contents($urlTokenInfo);

    if ($response === false) {
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $urlTokenInfo);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $response = curl_exec($ch);
        curl_close($ch);
    }

    $googleUser = json_decode($response, true);

    // 2. Si falla como ID Token, intentar validar como Access Token (userinfo)
    if (isset($googleUser['error']) || empty($googleUser['email'])) {
        $urlUserInfo = "https://www.googleapis.com/oauth2/v3/userinfo?access_token=" . urlencode($token);
        $responseUser = @file_get_contents($urlUserInfo);

        if ($responseUser === false) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $urlUserInfo);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
            $responseUser = curl_exec($ch);
            curl_close($ch);
        }

        $googleUser = json_decode($responseUser, true);
    }

    if (isset($googleUser['error']) || empty($googleUser['email'])) {
        enviarRespuestaJson(['error' => 'Token de Google inválido o expirado'], 401);
        exit;
    }

    $email = $googleUser['email'];
    $givenName = $googleUser['given_name'] ?? $googleUser['name'] ?? 'Usuario';
    $familyName = $googleUser['family_name'] ?? 'Google';

    // Buscar o registrar usuario en la base de datos
    $usuario = Usuario::buscarPorEmail($email);

    if (!$usuario) {
        $nuevoUsuario = new Usuario();
        $nuevoUsuario->setNombres($givenName);
        $nuevoUsuario->setApellidos($familyName);
        $nuevoUsuario->setEmailUsuario($email);
        // Password aleatorio seguro para usuarios OAuth
        $randomPass = bin2hex(random_bytes(16));
        $nuevoUsuario->setContraseñaUsuario($randomPass);

        $resultado = $nuevoUsuario->guardar();
        if (!$resultado['exito']) {
            enviarRespuestaJson(['error' => 'Error al crear usuario de Google: ' . ($resultado['mensaje'] ?? '')], 500);
            exit;
        }

        $usuario = new Usuario($resultado['datos'][0]);
    }

    $usuario->actualizarUltimoLogin();

    enviarRespuestaJson(['usuario' => $usuario->toArray()]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

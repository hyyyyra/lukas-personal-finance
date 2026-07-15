<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../helpers/helpers.php';

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json; charset=utf-8');

$resultado = verificarConexionSupabase();

if ($resultado['exito']) {
    enviarRespuestaJson([
        'mensaje' => 'Conexión con Supabase exitosa!',
        'detalles' => $resultado
    ]);
} else {
    enviarRespuestaJson([
        'error' => 'Error al conectar con Supabase',
        'detalles' => $resultado
    ], 500);
}

<?php
require_once __DIR__ . '/../../config/config.php';
require_once __DIR__ . '/../../helpers/helpers.php';
require_once __DIR__ . '/../../models/GastoVariable.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Obtener ID de usuario
$id_usuario = $_GET['id_usuario'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$id_usuario) {
        enviarRespuestaJson(['error' => 'Falta el ID de usuario'], 400);
    }
    
    $gastos = GastoVariable::obtenerPorIdUsuario($id_usuario);
    $gastos_array = [];
    foreach ($gastos as $gasto) {
        $gastos_array[] = $gasto->toArray();
    }
    
    enviarRespuestaJson(['gastos' => $gastos_array]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    if (!$id_usuario || !isset($datos['etiqueta']) || !isset($datos['monto']) || 
        !isset($datos['categoria']) || !isset($datos['metodo'])) {
        enviarRespuestaJson(['error' => 'Faltan datos obligatorios'], 400);
    }
    
    $gasto = new GastoVariable();
    $gasto->setIdUsuario($id_usuario);
    $gasto->setEtiqueta($datos['etiqueta']);
    $gasto->setMonto($datos['monto']);
    $gasto->setCategoria($datos['categoria']);
    $gasto->setMetodo($datos['metodo']);
    $resultado = $gasto->guardar();
    
    if (!$resultado['exito']) {
        enviarRespuestaJson(['error' => 'Error al guardar el gasto'], 500);
    }
    
    enviarRespuestaJson(['gasto' => $resultado['datos'][0]]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $id_gasto = $_GET['id'] ?? null;
    if (!$id_gasto) {
        enviarRespuestaJson(['error' => 'Falta el ID del gasto'], 400);
    }
    
    $resultado = GastoVariable::eliminar($id_gasto);
    if (!$resultado['exito']) {
        enviarRespuestaJson(['error' => 'Error al eliminar el gasto'], 500);
    }
    
    enviarRespuestaJson(['exito' => true]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

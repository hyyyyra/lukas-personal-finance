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
$idUsuario = $_GET['id_usuario'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (!$idUsuario) {
        enviarRespuestaJson(['error' => 'Falta el ID de usuario'], 400);
    }
    
    $gastos = GastoVariable::obtenerPorIdUsuario($idUsuario);
    $gastosArray = [];
    foreach ($gastos as $gasto) {
        $gastosArray[] = $gasto->toArray();
    }
    
    enviarRespuestaJson(['gastos' => $gastosArray]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $datos = json_decode(file_get_contents('php://input'), true);
    
    if (!$idUsuario || !isset($datos['title']) || !isset($datos['amount']) || 
        !isset($datos['category']) || !isset($datos['method'])) {
        enviarRespuestaJson(['error' => 'Faltan datos obligatorios'], 400);
    }
    
    $gasto = new GastoVariable();
    $gasto->setIdUsuario($idUsuario);
    $gasto->setTitulo($datos['title']);
    $gasto->setMonto($datos['amount']);
    $gasto->setCategoria($datos['category']);
    $gasto->setMetodo($datos['method']);
    $resultado = $gasto->guardar();
    
    if (!$resultado['exito']) {
        enviarRespuestaJson(['error' => 'Error al guardar el gasto'], 500);
    }
    
    enviarRespuestaJson(['gasto' => $resultado['datos'][0]]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $idGasto = $_GET['id'] ?? null;
    if (!$idGasto) {
        enviarRespuestaJson(['error' => 'Falta el ID del gasto'], 400);
    }
    
    $resultado = GastoVariable::eliminar($idGasto);
    if (!$resultado['exito']) {
        enviarRespuestaJson(['error' => 'Error al eliminar el gasto'], 500);
    }
    
    enviarRespuestaJson(['exito' => true]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

<?php
require_once __DIR__ . '/../../../config/config.php';
require_once __DIR__ . '/../../../helpers/helpers.php';
require_once __DIR__ . '/../../../models/Usuario.php';
require_once __DIR__ . '/../../../models/PerfilFinanciero.php';
require_once __DIR__ . '/../../../models/GastoIndispensable.php';

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Obtener ID de usuario (por ahora, usamos un parámetro, en producción usarías autenticación real)
$id_usuario = $_GET['id_usuario'] ?? null;

if (!$id_usuario) {
    enviarRespuestaJson(['error' => 'Falta el ID de usuario'], 400);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener datos esenciales
    $perfil = PerfilFinanciero::buscarPorIdUsuario($id_usuario);
    $gastos_indispensables = GastoIndispensable::obtenerPorIdUsuario($id_usuario);
    
    $gastos_array = [];
    foreach ($gastos_indispensables as $gasto) {
        $gastos_array[] = $gasto->toArray();
    }
    
    enviarRespuestaJson([
        'perfil' => $perfil ? $perfil->toArray() : null,
        'gastos_indispensables' => $gastos_array
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Guardar/actualizar datos esenciales
    $datos = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos
    if (!isset($datos['ingreso_mensual']) || !isset($datos['total_gastos_indispensables']) || 
        !isset($datos['ahorro_base']) || !isset($datos['periodo_presupuesto']) ||
        !isset($datos['gastos_indispensables'])) {
        enviarRespuestaJson(['error' => 'Faltan datos obligatorios'], 400);
    }
    
    // Eliminar gastos indispensables anteriores
    GastoIndispensable::eliminarPorIdUsuario($id_usuario);
    
    // Guardar nuevos gastos indispensables
    foreach ($datos['gastos_indispensables'] as $item) {
        $gasto = new GastoIndispensable();
        $gasto->setIdUsuario($id_usuario);
        $gasto->setEtiqueta($item['etiqueta']);
        $gasto->setMonto($item['monto']);
        $gasto->guardar();
    }
    
    // Guardar/actualizar perfil financiero
    $perfil = PerfilFinanciero::buscarPorIdUsuario($id_usuario);
    if (!$perfil) {
        $perfil = new PerfilFinanciero();
        $perfil->setIdUsuario($id_usuario);
    }
    $perfil->setIngresoMensual($datos['ingreso_mensual']);
    $perfil->setTotalGastosIndispensables($datos['total_gastos_indispensables']);
    $perfil->setAhorroBase($datos['ahorro_base']);
    $perfil->setPeriodoPresupuesto($datos['periodo_presupuesto']);
    $resultado = $perfil->guardar();
    
    if (!$resultado['exito']) {
        enviarRespuestaJson(['error' => 'Error al guardar los datos esenciales'], 500);
    }
    
    enviarRespuestaJson(['exito' => true, 'perfil' => $perfil->toArray()]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

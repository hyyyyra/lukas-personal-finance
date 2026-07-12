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
$idUsuario = $_GET['id_usuario'] ?? null;

if (!$idUsuario) {
    enviarRespuestaJson(['error' => 'Falta el ID de usuario'], 400);
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Obtener datos esenciales
    $perfil = PerfilFinanciero::buscarPorIdUsuario($idUsuario);
    $gastosIndispensables = GastoIndispensable::obtenerPorIdUsuario($idUsuario);
    
    $gastosArray = [];
    foreach ($gastosIndispensables as $gasto) {
        $gastosArray[] = $gasto->toArray();
    }
    
    enviarRespuestaJson([
        'perfil' => $perfil ? $perfil->toArray() : null,
        'gastos_indispensables' => $gastosArray
    ]);
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
    // Guardar/actualizar datos esenciales
    $datos = json_decode(file_get_contents('php://input'), true);
    
    // Validar datos
    if (!isset($datos['monthlyIncome']) || !isset($datos['essentialExpenses']) || 
        !isset($datos['baseSavings']) || !isset($datos['budgetPeriod']) ||
        !isset($datos['essentialItems'])) {
        enviarRespuestaJson(['error' => 'Faltan datos obligatorios'], 400);
    }
    
    // Eliminar gastos indispensables anteriores
    $gastosAnteriores = GastoIndispensable::obtenerPorIdUsuario($idUsuario);
    foreach ($gastosAnteriores as $gasto) {
        GastoIndispensable::eliminar($gasto->getId());
    }
    
    // Guardar nuevos gastos indispensables
    foreach ($datos['essentialItems'] as $item) {
        $gasto = new GastoIndispensable();
        $gasto->setIdUsuario($idUsuario);
        $gasto->setEtiqueta($item['label']);
        $gasto->setMonto($item['amount']);
        $gasto->guardar();
    }
    
    // Guardar/actualizar perfil financiero
    $perfil = PerfilFinanciero::buscarPorIdUsuario($idUsuario);
    if (!$perfil) {
        $perfil = new PerfilFinanciero();
        $perfil->setIdUsuario($idUsuario);
    }
    $perfil->setIngresoMensual($datos['monthlyIncome']);
    $perfil->setGastosIndispensablesTotal($datos['essentialExpenses']);
    $perfil->setAhorroBase($datos['baseSavings']);
    $perfil->setPeriodoPresupuesto($datos['budgetPeriod']);
    $resultado = $perfil->guardar();
    
    if (!$resultado['exito']) {
        enviarRespuestaJson(['error' => 'Error al guardar los datos esenciales'], 500);
    }
    
    enviarRespuestaJson(['exito' => true]);
} else {
    enviarRespuestaJson(['error' => 'Método no permitido'], 405);
}

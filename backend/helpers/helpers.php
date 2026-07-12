<?php
/**
 * Funciones auxiliares para el desarrollo
 */

/**
 * Función de debug para imprimir variables de forma legible
 * @param mixed $data Variable a depurar
 * @param bool $die Si es true, detiene la ejecución después de imprimir
 */
function debug($data, $die = false) {
    if (DEBUG_MODE) {
        echo '<pre>';
        print_r($data);
        echo '</pre>';
        if ($die) die();
    }
}

/**
 * Verifica la conexión con Supabase
 * @return array Estado de la conexión
 */
function verificarConexionSupabase() {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, SUPABASE_URL . '/rest/v1/');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY
    ]);
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    return [
        'exito' => $httpCode >= 200 && $httpCode < 300,
        'codigo_http' => $httpCode,
        'respuesta' => $response
    ];
}

/**
 * Realiza una solicitud a la API REST de Supabase
 * @param string $metodo Método HTTP (GET, POST, PUT, DELETE)
 * @param string $tabla Nombre de la tabla
 * @param array $datos Datos a enviar (para POST/PUT)
 * @param array $filtros Filtros para la consulta (para GET)
 * @return array Respuesta de Supabase
 */
function supabaseRequest($metodo, $tabla, $datos = [], $filtros = []) {
    $url = SUPABASE_URL . '/rest/v1/' . $tabla;
    
    // Agregar filtros a la URL si es GET
    if ($metodo === 'GET' && !empty($filtros)) {
        $queryParams = http_build_query($filtros);
        $url .= '?' . $queryParams;
    }
    
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $metodo);
    
    $headers = [
        'apikey: ' . SUPABASE_KEY,
        'Authorization: Bearer ' . SUPABASE_KEY,
        'Content-Type: application/json',
        'Prefer: return=representation'
    ];
    
    // Agregar datos si es POST o PUT
    if (in_array($metodo, ['POST', 'PUT']) && !empty($datos)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($datos));
    }
    
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    return [
        'exito' => $httpCode >= 200 && $httpCode < 300,
        'codigo_http' => $httpCode,
        'datos' => json_decode($response, true),
        'error' => $error
    ];
}

/**
 * Envía una respuesta JSON al cliente
 * @param mixed $datos Datos a enviar
 * @param int $codigoHttp Código HTTP de respuesta
 */
function enviarRespuestaJson($datos, $codigoHttp = 200) {
    http_response_code($codigoHttp);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($datos);
    exit;
}

<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class GastoVariable {
    private $id_gastosvariables;
    private $id_usuario;
    private $etiqueta;
    private $monto;
    private $categoria;
    private $metodo;
    private $created_at;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->id_gastosvariables = $datos['id_gastosvariables'] ?? $datos['ID_GASTOSVARIABLES'] ?? null;
            $this->id_usuario = $datos['id_usuario'] ?? $datos['ID_USUARIO'] ?? null;
            $this->etiqueta = $datos['etiqueta'] ?? $datos['ETIQUETA'] ?? null;
            $this->monto = $datos['monto'] ?? $datos['MONTO'] ?? null;
            $this->categoria = $datos['categoria'] ?? $datos['CATEGORIA'] ?? null;
            $this->metodo = $datos['metodo'] ?? $datos['METODO'] ?? null;
            $this->created_at = $datos['created_at'] ?? $datos['CREATED_AT'] ?? null;
        }
    }

    // Getters
    public function getIdGastosVariables() { return $this->id_gastosvariables; }
    public function getIdUsuario() { return $this->id_usuario; }
    public function getEtiqueta() { return $this->etiqueta; }
    public function getMonto() { return $this->monto; }
    public function getCategoria() { return $this->categoria; }
    public function getMetodo() { return $this->metodo; }
    public function getCreatedAt() { return $this->created_at; }

    // Setters
    public function setIdUsuario($id_usuario) { $this->id_usuario = $id_usuario; }
    public function setEtiqueta($etiqueta) { $this->etiqueta = $etiqueta; }
    public function setMonto($monto) { $this->monto = $monto; }
    public function setCategoria($categoria) { $this->categoria = $categoria; }
    public function setMetodo($metodo) { $this->metodo = $metodo; }

    /**
     * Guarda un gasto variable
     * @return array
     */
    public function guardar() {
        $datos = [
            'id_usuario' => $this->id_usuario,
            'etiqueta' => $this->etiqueta,
            'monto' => $this->monto,
            'categoria' => $this->categoria,
            'metodo' => $this->metodo
        ];
        return supabaseRequest('POST', 'gastos_variables', $datos);
    }

    /**
     * Obtiene todos los gastos variables de un usuario
     * @param int $id_usuario
     * @return GastoVariable[]
     */
    public static function obtenerPorIdUsuario($id_usuario) {
        $respuesta = supabaseRequest('GET', 'gastos_variables', [], ['id_usuario' => "eq.$id_usuario", 'order' => 'created_at.desc']);
        $gastos = [];
        if ($respuesta['exito']) {
            foreach ($respuesta['datos'] as $dato) {
                $gastos[] = new GastoVariable($dato);
            }
        }
        return $gastos;
    }

    /**
     * Elimina un gasto variable por su ID
     * @param int $id_gastosvariables
     * @return array
     */
    public static function eliminar($id_gastosvariables) {
        return supabaseRequest('DELETE', 'gastos_variables', [], ['id_gastosvariables' => "eq.$id_gastosvariables"]);
    }

    public function toArray() {
        return [
            'id_gastosvariables' => $this->id_gastosvariables,
            'id_usuario' => $this->id_usuario,
            'etiqueta' => $this->etiqueta,
            'monto' => $this->monto,
            'categoria' => $this->categoria,
            'metodo' => $this->metodo,
            'created_at' => $this->created_at
        ];
    }
}

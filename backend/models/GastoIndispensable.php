<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class GastoIndispensable {
    private $id;
    private $idUsuario;
    private $etiqueta;
    private $monto;
    private $fechaCreacion;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->id = $datos['ID'] ?? null;
            $this->idUsuario = $datos['ID_USUARIO'] ?? null;
            $this->etiqueta = $datos['ETIQUETA'] ?? null;
            $this->monto = $datos['MONTO'] ?? null;
            $this->fechaCreacion = $datos['FECHA_CREACION'] ?? null;
        }
    }

    // Getters
    public function getId() { return $this->id; }
    public function getIdUsuario() { return $this->idUsuario; }
    public function getEtiqueta() { return $this->etiqueta; }
    public function getMonto() { return $this->monto; }
    public function getFechaCreacion() { return $this->fechaCreacion; }

    // Setters
    public function setIdUsuario($idUsuario) { $this->idUsuario = $idUsuario; }
    public function setEtiqueta($etiqueta) { $this->etiqueta = $etiqueta; }
    public function setMonto($monto) { $this->monto = $monto; }

    /**
     * Guarda un gasto indispensable
     * @return array
     */
    public function guardar() {
        $datos = [
            'ID_USUARIO' => $this->idUsuario,
            'ETIQUETA' => $this->etiqueta,
            'MONTO' => $this->monto
        ];
        return supabaseRequest('POST', 'GASTOS_INDISPENSABLES', $datos);
    }

    /**
     * Obtiene todos los gastos indispensables de un usuario
     * @param int $idUsuario
     * @return GastoIndispensable[]
     */
    public static function obtenerPorIdUsuario($idUsuario) {
        $respuesta = supabaseRequest('GET', 'GASTOS_INDISPENSABLES', [], ['ID_USUARIO' => "eq.$idUsuario"]);
        $gastos = [];
        if ($respuesta['exito']) {
            foreach ($respuesta['datos'] as $dato) {
                $gastos[] = new GastoIndispensable($dato);
            }
        }
        return $gastos;
    }

    /**
     * Elimina un gasto indispensable por su ID
     * @param int $id
     * @return array
     */
    public static function eliminar($id) {
        return supabaseRequest('DELETE', 'GASTOS_INDISPENSABLES', [], ['ID' => "eq.$id"]);
    }

    public function toArray() {
        return [
            'ID' => $this->id,
            'ID_USUARIO' => $this->idUsuario,
            'ETIQUETA' => $this->etiqueta,
            'MONTO' => $this->monto,
            'FECHA_CREACION' => $this->fechaCreacion
        ];
    }
}

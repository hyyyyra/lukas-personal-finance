<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class PerfilFinanciero {
    private $id;
    private $idUsuario;
    private $ingresoMensual;
    private $gastosIndispensablesTotal;
    private $ahorroBase;
    private $periodoPresupuesto;
    private $fechaCreacion;
    private $fechaActualizacion;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->id = $datos['ID'] ?? null;
            $this->idUsuario = $datos['ID_USUARIO'] ?? null;
            $this->ingresoMensual = $datos['INGRESO_MENSUAL'] ?? null;
            $this->gastosIndispensablesTotal = $datos['GASTOS_INDISPENSABLES_TOTAL'] ?? null;
            $this->ahorroBase = $datos['AHORRO_BASE'] ?? null;
            $this->periodoPresupuesto = $datos['PERIODO_PRESUPUESTO'] ?? null;
            $this->fechaCreacion = $datos['FECHA_CREACION'] ?? null;
            $this->fechaActualizacion = $datos['FECHA_ACTUALIZACION'] ?? null;
        }
    }

    // Getters
    public function getId() { return $this->id; }
    public function getIdUsuario() { return $this->idUsuario; }
    public function getIngresoMensual() { return $this->ingresoMensual; }
    public function getGastosIndispensablesTotal() { return $this->gastosIndispensablesTotal; }
    public function getAhorroBase() { return $this->ahorroBase; }
    public function getPeriodoPresupuesto() { return $this->periodoPresupuesto; }
    public function getFechaCreacion() { return $this->fechaCreacion; }
    public function getFechaActualizacion() { return $this->fechaActualizacion; }

    // Setters
    public function setIdUsuario($idUsuario) { $this->idUsuario = $idUsuario; }
    public function setIngresoMensual($ingresoMensual) { $this->ingresoMensual = $ingresoMensual; }
    public function setGastosIndispensablesTotal($gastosIndispensablesTotal) { $this->gastosIndispensablesTotal = $gastosIndispensablesTotal; }
    public function setAhorroBase($ahorroBase) { $this->ahorroBase = $ahorroBase; }
    public function setPeriodoPresupuesto($periodoPresupuesto) { $this->periodoPresupuesto = $periodoPresupuesto; }

    /**
     * Guarda o actualiza el perfil financiero
     * @return array Resultado de la operación
     */
    public function guardar() {
        $datos = [
            'ID_USUARIO' => $this->idUsuario,
            'INGRESO_MENSUAL' => $this->ingresoMensual,
            'GASTOS_INDISPENSABLES_TOTAL' => $this->gastosIndispensablesTotal,
            'AHORRO_BASE' => $this->ahorroBase,
            'PERIODO_PRESUPUESTO' => $this->periodoPresupuesto,
            'FECHA_ACTUALIZACION' => date('Y-m-d H:i:s')
        ];

        if ($this->id) {
            return supabaseRequest('PUT', 'PERFIL_FINANCIERO', $datos, ['ID' => "eq.$this->id"]);
        } else {
            return supabaseRequest('POST', 'PERFIL_FINANCIERO', $datos);
        }
    }

    /**
     * Busca el perfil financiero de un usuario
     * @param int $idUsuario ID del usuario
     * @return PerfilFinanciero|null
     */
    public static function buscarPorIdUsuario($idUsuario) {
        $respuesta = supabaseRequest('GET', 'PERFIL_FINANCIERO', [], ['ID_USUARIO' => "eq.$idUsuario"]);
        if ($respuesta['exito'] && !empty($respuesta['datos'])) {
            return new PerfilFinanciero($respuesta['datos'][0]);
        }
        return null;
    }

    public function toArray() {
        return [
            'ID' => $this->id,
            'ID_USUARIO' => $this->idUsuario,
            'INGRESO_MENSUAL' => $this->ingresoMensual,
            'GASTOS_INDISPENSABLES_TOTAL' => $this->gastosIndispensablesTotal,
            'AHORRO_BASE' => $this->ahorroBase,
            'PERIODO_PRESUPUESTO' => $this->periodoPresupuesto,
            'FECHA_CREACION' => $this->fechaCreacion,
            'FECHA_ACTUALIZACION' => $this->fechaActualizacion
        ];
    }
}

<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class PerfilFinanciero {
    private $id_perfilfinanciero;
    private $id_usuario;
    private $ingreso_mensual;
    private $total_gastos_indispensables;
    private $ahorro_base;
    private $periodo_presupuesto;
    private $created_at;
    private $update_at;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->id_perfilfinanciero = $datos['id_perfilfinanciero'] ?? $datos['ID_PERFILFINANCIERO'] ?? null;
            $this->id_usuario = $datos['id_usuario'] ?? $datos['ID_USUARIO'] ?? null;
            $this->ingreso_mensual = $datos['ingreso_mensual'] ?? $datos['INGRESO_MENSUAL'] ?? null;
            $this->total_gastos_indispensables = $datos['total_gastos_indispensables'] ?? $datos['TOTAL_GASTOS_INDISPENSABLES'] ?? null;
            $this->ahorro_base = $datos['ahorro_base'] ?? $datos['AHORRO_BASE'] ?? null;
            $this->periodo_presupuesto = $datos['periodo_presupuesto'] ?? $datos['PERIODO_PRESUPUESTO'] ?? null;
            $this->created_at = $datos['created_at'] ?? $datos['CREATED_AT'] ?? null;
            $this->update_at = $datos['update_at'] ?? $datos['UPDATE_AT'] ?? null;
        }
    }

    // Getters
    public function getIdPerfilFinanciero() { return $this->id_perfilfinanciero; }
    public function getIdUsuario() { return $this->id_usuario; }
    public function getIngresoMensual() { return $this->ingreso_mensual; }
    public function getTotalGastosIndispensables() { return $this->total_gastos_indispensables; }
    public function getAhorroBase() { return $this->ahorro_base; }
    public function getPeriodoPresupuesto() { return $this->periodo_presupuesto; }
    public function getCreatedAt() { return $this->created_at; }
    public function getUpdateAt() { return $this->update_at; }

    // Setters
    public function setIdUsuario($id_usuario) { $this->id_usuario = $id_usuario; }
    public function setIngresoMensual($ingreso_mensual) { $this->ingreso_mensual = $ingreso_mensual; }
    public function setTotalGastosIndispensables($total_gastos_indispensables) { $this->total_gastos_indispensables = $total_gastos_indispensables; }
    public function setAhorroBase($ahorro_base) { $this->ahorro_base = $ahorro_base; }
    public function setPeriodoPresupuesto($periodo_presupuesto) { $this->periodo_presupuesto = $periodo_presupuesto; }

    /**
     * Guarda o actualiza el perfil financiero
     * @return array Resultado de la operación
     */
    public function guardar() {
        $datos = [
            'id_usuario' => $this->id_usuario,
            'ingreso_mensual' => $this->ingreso_mensual,
            'total_gastos_indispensables' => $this->total_gastos_indispensables,
            'ahorro_base' => $this->ahorro_base,
            'periodo_presupuesto' => $this->periodo_presupuesto,
            'update_at' => date('Y-m-d H:i:s')
        ];

        var_dump("=============== IMPRIMO ID_PERFILFINANCIERO =================");
        var_dump($this->id_perfilfinanciero);
        if ($this->id_perfilfinanciero) {
            return supabaseRequest(
                'PATCH',
                'perfil_financiero',
                $datos,
                ['id_perfilfinanciero' => 'eq.' . $this->id_perfilfinanciero]
            );
        } else {
            return supabaseRequest('POST', 'perfil_financiero', $datos);
        }
    }

    /**
     * Busca el perfil financiero de un usuario
     * @param int $id_usuario ID del usuario
     * @return PerfilFinanciero|null
     */
    public static function buscarPorIdUsuario($id_usuario) {
        $respuesta = supabaseRequest('GET', 'perfil_financiero', [], ['id_usuario' => "eq.$id_usuario"]);
        if ($respuesta['exito'] && !empty($respuesta['datos'])) {
            return new PerfilFinanciero($respuesta['datos'][0]);
        }
        return null;
    }

    public function toArray() {
        return [
            'id_perfilfinanciero' => $this->id_perfilfinanciero,
            'id_usuario' => $this->id_usuario,
            'ingreso_mensual' => $this->ingreso_mensual,
            'total_gastos_indispensables' => $this->total_gastos_indispensables,
            'ahorro_base' => $this->ahorro_base,
            'periodo_presupuesto' => $this->periodo_presupuesto,
            'created_at' => $this->created_at,
            'update_at' => $this->update_at
        ];
    }
}

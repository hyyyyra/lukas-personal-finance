<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class DimTiempo {
    private $fecha;
    private $anio;
    private $mes;
    private $mes_nombre;
    private $dia;
    private $dia_semana_iso;
    private $dia_nombre;
    private $semana_iso;
    private $semana_anio;
    private $quincena;
    private $quincena_anio;
    private $trimestre;
    private $semestre;
    private $es_fin_de_semana;
    private $es_feriado;
    private $nombre_feriado;
    private $fecha_inicio_mes;
    private $fecha_fin_mes;
    private $fecha_inicio_semana;
    private $fecha_fin_semana;
    private $created_at;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->fecha = $datos['fecha'] ?? null;
            $this->anio = isset($datos['anio']) ? (int)$datos['anio'] : null;
            $this->mes = isset($datos['mes']) ? (int)$datos['mes'] : null;
            $this->mes_nombre = $datos['mes_nombre'] ?? null;
            $this->dia = isset($datos['dia']) ? (int)$datos['dia'] : null;
            $this->dia_semana_iso = isset($datos['dia_semana_iso']) ? (int)$datos['dia_semana_iso'] : null;
            $this->dia_nombre = $datos['dia_nombre'] ?? null;
            $this->semana_iso = isset($datos['semana_iso']) ? (int)$datos['semana_iso'] : null;
            $this->semana_anio = $datos['semana_anio'] ?? null;
            $this->quincena = isset($datos['quincena']) ? (int)$datos['quincena'] : null;
            $this->quincena_anio = $datos['quincena_anio'] ?? null;
            $this->trimestre = isset($datos['trimestre']) ? (int)$datos['trimestre'] : null;
            $this->semestre = isset($datos['semestre']) ? (int)$datos['semestre'] : null;
            $this->es_fin_de_semana = filter_var($datos['es_fin_de_semana'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $this->es_feriado = filter_var($datos['es_feriado'] ?? false, FILTER_VALIDATE_BOOLEAN);
            $this->nombre_feriado = $datos['nombre_feriado'] ?? null;
            $this->fecha_inicio_mes = $datos['fecha_inicio_mes'] ?? null;
            $this->fecha_fin_mes = $datos['fecha_fin_mes'] ?? null;
            $this->fecha_inicio_semana = $datos['fecha_inicio_semana'] ?? null;
            $this->fecha_fin_semana = $datos['fecha_fin_semana'] ?? null;
            $this->created_at = $datos['created_at'] ?? null;
        }
    }

    // Getters
    public function getFecha() { return $this->fecha; }
    public function getAnio() { return $this->anio; }
    public function getMes() { return $this->mes; }
    public function getMesNombre() { return $this->mes_nombre; }
    public function getDia() { return $this->dia; }
    public function getDiaSemanaIso() { return $this->dia_semana_iso; }
    public function getDiaNombre() { return $this->dia_nombre; }
    public function getSemanaIso() { return $this->semana_iso; }
    public function getSemanaAnio() { return $this->semana_anio; }
    public function getQuincena() { return $this->quincena; }
    public function getQuincenaAnio() { return $this->quincena_anio; }
    public function getTrimestre() { return $this->trimestre; }
    public function getSemestre() { return $this->semestre; }
    public function getEsFinDeSemana() { return $this->es_fin_de_semana; }
    public function getEsFeriado() { return $this->es_feriado; }
    public function getNombreFeriado() { return $this->nombre_feriado; }
    public function getFechaInicioMes() { return $this->fecha_inicio_mes; }
    public function getFechaFinMes() { return $this->fecha_fin_mes; }
    public function getFechaInicioSemana() { return $this->fecha_inicio_semana; }
    public function getFechaFinSemana() { return $this->fecha_fin_semana; }
    public function getCreatedAt() { return $this->created_at; }

    // Setters
    public function setFecha($fecha) { $this->fecha = $fecha; }
    public function setAnio($anio) { $this->anio = (int)$anio; }
    public function setMes($mes) { $this->mes = (int)$mes; }
    public function setMesNombre($mes_nombre) { $this->mes_nombre = $mes_nombre; }
    public function setDia($dia) { $this->dia = (int)$dia; }
    public function setDiaSemanaIso($dia_semana_iso) { $this->dia_semana_iso = (int)$dia_semana_iso; }
    public function setDiaNombre($dia_nombre) { $this->dia_nombre = $dia_nombre; }
    public function setSemanaIso($semana_iso) { $this->semana_iso = (int)$semana_iso; }
    public function setSemanaAnio($semana_anio) { $this->semana_anio = $semana_anio; }
    public function setQuincena($quincena) { $this->quincena = (int)$quincena; }
    public function setQuincenaAnio($quincena_anio) { $this->quincena_anio = $quincena_anio; }
    public function setTrimestre($trimestre) { $this->trimestre = (int)$trimestre; }
    public function setSemestre($semestre) { $this->semestre = (int)$semestre; }
    public function setEsFinDeSemana($es_fin_de_semana) { $this->es_fin_de_semana = (bool)$es_fin_de_semana; }
    public function setEsFeriado($es_feriado) { $this->es_feriado = (bool)$es_feriado; }
    public function setNombreFeriado($nombre_feriado) { $this->nombre_feriado = $nombre_feriado; }
    public function setFechaInicioMes($fecha_inicio_mes) { $this->fecha_inicio_mes = $fecha_inicio_mes; }
    public function setFechaFinMes($fecha_fin_mes) { $this->fecha_fin_mes = $fecha_fin_mes; }
    public function setFechaInicioSemana($fecha_inicio_semana) { $this->fecha_inicio_semana = $fecha_inicio_semana; }
    public function setFechaFinSemana($fecha_fin_semana) { $this->fecha_fin_semana = $fecha_fin_semana; }

    /**
     * Buscar un registro por su fecha (YYYY-MM-DD)
     * @param string $fecha
     * @return DimTiempo|null
     */
    public static function buscarPorFecha($fecha) {
        $respuesta = supabaseRequest('GET', 'dim_tiempo', [], ['fecha' => "eq.$fecha"]);
        if ($respuesta['exito'] && !empty($respuesta['datos'])) {
            return new DimTiempo($respuesta['datos'][0]);
        }
        return null;
    }

    /**
     * Obtener registros por rango de fechas
     * @param string $fechaInicio
     * @param string $fechaFin
     * @return DimTiempo[]
     */
    public static function obtenerPorRangoFechas($fechaInicio, $fechaFin) {
        $params = [
            'fecha' => "gte.$fechaInicio",
            'and' => "(fecha.lte.$fechaFin)",
            'order' => 'fecha.asc'
        ];
        $respuesta = supabaseRequest('GET', 'dim_tiempo', [], $params);
        $resultado = [];
        if ($respuesta['exito']) {
            foreach ($respuesta['datos'] as $dato) {
                $resultado[] = new DimTiempo($dato);
            }
        }
        return $resultado;
    }

    /**
     * Obtener registros por año y mes
     * @param int $anio
     * @param int $mes
     * @return DimTiempo[]
     */
    public static function obtenerPorAnioMes($anio, $mes) {
        $respuesta = supabaseRequest('GET', 'dim_tiempo', [], [
            'anio' => "eq.$anio",
            'mes' => "eq.$mes",
            'order' => 'fecha.asc'
        ]);
        $resultado = [];
        if ($respuesta['exito']) {
            foreach ($respuesta['datos'] as $dato) {
                $resultado[] = new DimTiempo($dato);
            }
        }
        return $resultado;
    }

    /**
     * Obtener registros por semana ISO (ej: '2026-W30')
     * @param string $semanaAnio
     * @return DimTiempo[]
     */
    public static function obtenerPorSemanaAnio($semanaAnio) {
        $respuesta = supabaseRequest('GET', 'dim_tiempo', [], [
            'semana_anio' => "eq.$semanaAnio",
            'order' => 'fecha.asc'
        ]);
        $resultado = [];
        if ($respuesta['exito']) {
            foreach ($respuesta['datos'] as $dato) {
                $resultado[] = new DimTiempo($dato);
            }
        }
        return $resultado;
    }

    /**
     * Obtener registros por quincena (ej: '2026-07-Q1')
     * @param string $quincenaAnio
     * @return DimTiempo[]
     */
    public static function obtenerPorQuincenaAnio($quincenaAnio) {
        $respuesta = supabaseRequest('GET', 'dim_tiempo', [], [
            'quincena_anio' => "eq.$quincenaAnio",
            'order' => 'fecha.asc'
        ]);
        $resultado = [];
        if ($respuesta['exito']) {
            foreach ($respuesta['datos'] as $dato) {
                $resultado[] = new DimTiempo($dato);
            }
        }
        return $resultado;
    }

    /**
     * Guardar un nuevo registro de tiempo
     * @return array
     */
    public function guardar() {
        $datos = $this->toArray();
        unset($datos['created_at']);
        return supabaseRequest('POST', 'dim_tiempo', $datos);
    }

    public function toArray() {
        return [
            'fecha' => $this->fecha,
            'anio' => $this->anio,
            'mes' => $this->mes,
            'mes_nombre' => $this->mes_nombre,
            'dia' => $this->dia,
            'dia_semana_iso' => $this->dia_semana_iso,
            'dia_nombre' => $this->dia_nombre,
            'semana_iso' => $this->semana_iso,
            'semana_anio' => $this->semana_anio,
            'quincena' => $this->quincena,
            'quincena_anio' => $this->quincena_anio,
            'trimestre' => $this->trimestre,
            'semestre' => $this->semestre,
            'es_fin_de_semana' => $this->es_fin_de_semana,
            'es_feriado' => $this->es_feriado,
            'nombre_feriado' => $this->nombre_feriado,
            'fecha_inicio_mes' => $this->fecha_inicio_mes,
            'fecha_fin_mes' => $this->fecha_fin_mes,
            'fecha_inicio_semana' => $this->fecha_inicio_semana,
            'fecha_fin_semana' => $this->fecha_fin_semana,
            'created_at' => $this->created_at,
        ];
    }
}

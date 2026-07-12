<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class GastoVariable {
    private $id;
    private $idUsuario;
    private $titulo;
    private $monto;
    private $categoria;
    private $metodo;
    private $fechaCreacion;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->id = $datos['ID'] ?? null;
            $this->idUsuario = $datos['ID_USUARIO'] ?? null;
            $this->titulo = $datos['TITULO'] ?? null;
            $this->monto = $datos['MONTO'] ?? null;
            $this->categoria = $datos['CATEGORIA'] ?? null;
            $this->metodo = $datos['METODO'] ?? null;
            $this->fechaCreacion = $datos['FECHA_CREACION'] ?? null;
        }
    }

    // Getters
    public function getId() { return $this->id; }
    public function getIdUsuario() { return $this->idUsuario; }
    public function getTitulo() { return $this->titulo; }
    public function getMonto() { return $this->monto; }
    public function getCategoria() { return $this->categoria; }
    public function getMetodo() { return $this->metodo; }
    public function getFechaCreacion() { return $this->fechaCreacion; }

    // Setters
    public function setIdUsuario($idUsuario) { $this->idUsuario = $idUsuario; }
    public function setTitulo($titulo) { $this->titulo = $titulo; }
    public function setMonto($monto) { $this->monto = $monto; }
    public function setCategoria($categoria) { $this->categoria = $categoria; }
    public function setMetodo($metodo) { $this->metodo = $metodo; }

    /**
     * Guarda un gasto variable
     * @return array
     */
    public function guardar() {
        $datos = [
            'ID_USUARIO' => $this->idUsuario,
            'TITULO' => $this->titulo,
            'MONTO' => $this->monto,
            'CATEGORIA' => $this->categoria,
            'METODO' => $this->metodo
        ];
        return supabaseRequest('POST', 'GASTOS_VARIABLES', $datos);
    }

    /**
     * Obtiene todos los gastos variables de un usuario
     * @param int $idUsuario
     * @return GastoVariable[]
     */
    public static function obtenerPorIdUsuario($idUsuario) {
        $respuesta = supabaseRequest('GET', 'GASTOS_VARIABLES', [], ['ID_USUARIO' => "eq.$idUsuario", 'order' => 'FECHA_CREACION.desc']);
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
     * @param int $id
     * @return array
     */
    public static function eliminar($id) {
        return supabaseRequest('DELETE', 'GASTOS_VARIABLES', [], ['ID' => "eq.$id"]);
    }

    public function toArray() {
        return [
            'ID' => $this->id,
            'ID_USUARIO' => $this->idUsuario,
            'TITULO' => $this->titulo,
            'MONTO' => $this->monto,
            'CATEGORIA' => $this->categoria,
            'METODO' => $this->metodo,
            'FECHA_CREACION' => $this->fechaCreacion
        ];
    }
}

<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class Usuario {
    private $id;
    private $nombre;
    private $email;
    private $proveedor;
    private $fechaCreacion;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->id = $datos['ID'] ?? null;
            $this->nombre = $datos['NOMBRE'] ?? null;
            $this->email = $datos['EMAIL'] ?? null;
            $this->proveedor = $datos['PROVEEDOR'] ?? null;
            $this->fechaCreacion = $datos['FECHA_CREACION'] ?? null;
        }
    }

    // Getters
    public function getId() { return $this->id; }
    public function getNombre() { return $this->nombre; }
    public function getEmail() { return $this->email; }
    public function getProveedor() { return $this->proveedor; }
    public function getFechaCreacion() { return $this->fechaCreacion; }

    // Setters
    public function setNombre($nombre) { $this->nombre = $nombre; }
    public function setEmail($email) { $this->email = $email; }
    public function setProveedor($proveedor) { $this->proveedor = $proveedor; }

    /**
     * Guarda un nuevo usuario en la base de datos
     * @return array Resultado de la operación
     */
    public function guardar() {
        $datos = [
            'NOMBRE' => $this->nombre,
            'EMAIL' => $this->email,
            'PROVEEDOR' => $this->proveedor
        ];
        return supabaseRequest('POST', 'USUARIOS', $datos);
    }

    /**
     * Busca un usuario por su email
     * @param string $email Email del usuario
     * @return Usuario|null Objeto Usuario o null si no existe
     */
    public static function buscarPorEmail($email) {
        $respuesta = supabaseRequest('GET', 'USUARIOS', [], ['EMAIL' => "eq.$email"]);
        if ($respuesta['exito'] && !empty($respuesta['datos'])) {
            return new Usuario($respuesta['datos'][0]);
        }
        return null;
    }

    /**
     * Busca un usuario por su ID
     * @param int $id ID del usuario
     * @return Usuario|null Objeto Usuario o null si no existe
     */
    public static function buscarPorId($id) {
        $respuesta = supabaseRequest('GET', 'USUARIOS', [], ['ID' => "eq.$id"]);
        if ($respuesta['exito'] && !empty($respuesta['datos'])) {
            return new Usuario($respuesta['datos'][0]);
        }
        return null;
    }

    /**
     * Convierte el objeto a un array
     * @return array
     */
    public function toArray() {
        return [
            'ID' => $this->id,
            'NOMBRE' => $this->nombre,
            'EMAIL' => $this->email,
            'PROVEEDOR' => $this->proveedor,
            'FECHA_CREACION' => $this->fechaCreacion
        ];
    }
}

<?php
require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../helpers/helpers.php';

class Usuario {
    private $id_usuario;
    private $nombres;
    private $apellidos;
    private $email_usuario;
    private $contraseña_usuario;
    private $created_at;
    private $logged_at;

    public function __construct($datos = []) {
        if (!empty($datos)) {
            $this->id_usuario = $datos['id_usuario'] ?? $datos['ID_USUARIO'] ?? null;
            $this->nombres = $datos['nombres'] ?? $datos['NOMBRES'] ?? null;
            $this->apellidos = $datos['apellidos'] ?? $datos['APELLIDOS'] ?? null;
            $this->email_usuario = $datos['email_usuario'] ?? $datos['EMAIL_USUARIO'] ?? null;
            $this->contraseña_usuario = $datos['contraseÑa_usuario'] ?? $datos['CONTRASEÑA_USUARIO'] ?? null;
            $this->created_at = $datos['created_at'] ?? $datos['CREATED_AT'] ?? null;
            $this->logged_at = $datos['logged_at'] ?? $datos['LOGGED_AT'] ?? null;
        }
    }

    // Getters
    public function getIdUsuario() { return $this->id_usuario; }
    public function getNombres() { return $this->nombres; }
    public function getApellidos() { return $this->apellidos; }
    public function getEmailUsuario() { return $this->email_usuario; }
    public function getContraseñaUsuario() { return $this->contraseña_usuario; }
    public function getCreatedAt() { return $this->created_at; }
    public function getLoggedAt() { return $this->logged_at; }

    // Setters
    public function setNombres($nombres) { $this->nombres = $nombres; }
    public function setApellidos($apellidos) { $this->apellidos = $apellidos; }
    public function setEmailUsuario($email_usuario) { $this->email_usuario = $email_usuario; }
    public function setContraseñaUsuario($contraseña_usuario) { 
        $this->contraseña_usuario = password_hash($contraseña_usuario, PASSWORD_DEFAULT); 
    }

    // Verificar contraseña
    public function verificarContraseña($contraseña) {
        return password_verify($contraseña, $this->contraseña_usuario);
    }

    /**
     * Guarda un nuevo usuario en la base de datos
     * @return array Resultado de la operación
     */
    public function guardar() {
        $datos = [
            'nombres' => $this->nombres,
            'apellidos' => $this->apellidos,
            'email_usuario' => $this->email_usuario,
            'contraseÑa_usuario' => $this->contraseña_usuario
        ];
        return supabaseRequest('POST', 'usuarios', $datos);
    }

    /**
     * Actualiza la fecha de último login
     * @return array Resultado de la operación
     */
    public function actualizarUltimoLogin() {
        $datos = [
            'logged_at' => date('Y-m-d H:i:s')
        ];
        return supabaseRequest('PUT', 'usuarios', $datos, ['id_usuario' => "eq." . $this->id_usuario]);
    }

    /**
     * Busca un usuario por su email
     * @param string $email_usuario Email del usuario
     * @return Usuario|null Objeto Usuario o null si no existe
     */
    public static function buscarPorEmail($email_usuario) {
        $respuesta = supabaseRequest('GET', 'usuarios', [], ['email_usuario' => "eq.$email_usuario"]);
        error_log("respuesta: " . var_export($respuesta, true));
        if ($respuesta['exito'] && !empty($respuesta['datos'])) {
            return new Usuario($respuesta['datos'][0]);
        }
        return null;
    }

    /**
     * Busca un usuario por su ID
     * @param int $id_usuario ID del usuario
     * @return Usuario|null Objeto Usuario o null si no existe
     */
    public static function buscarPorId($id_usuario) {
        $respuesta = supabaseRequest('GET', 'usuarios', [], ['id_usuario' => "eq.$id_usuario"]);
        if ($respuesta['exito'] && !empty($respuesta['datos'])) {
            return new Usuario($respuesta['datos'][0]);
        }
        return null;
    }

    /**
     * Convierte el objeto a un array (sin la contraseña)
     * @return array
     */
    public function toArray() {
        return [
            'id_usuario' => $this->id_usuario,
            'nombre' => $this->nombres,
            'apellido' => $this->apellidos,
            'email' => $this->email_usuario,
            'created_at' => $this->created_at,
            'logged_at' => $this->logged_at
        ];
    }
}

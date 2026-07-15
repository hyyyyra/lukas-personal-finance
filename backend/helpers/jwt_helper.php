<?php
/**
 * Helper simple para JWT (JSON Web Tokens) sin dependencias externas
 */

class JWTHelper {
    private static $secret_key;

    public static function init($secret_key) {
        self::$secret_key = $secret_key;
    }

    /**
     * Codifica (crea) un token JWT
     * @param array $payload Datos a incluir en el token
     * @param int $expiry_minutes Tiempo de expiración en minutos (default: 1440 = 24h)
     * @return string Token JWT
     */
    public static function encode($payload, $expiry_minutes = 1440) {
        $header = [
            'alg' => 'HS256',
            'typ' => 'JWT'
        ];

        $payload['iat'] = time();
        $payload['exp'] = time() + ($expiry_minutes * 60);

        $segments = [];
        $segments[] = self::urlsafeB64Encode(json_encode($header));
        $segments[] = self::urlsafeB64Encode(json_encode($payload));
        $signing_input = implode('.', $segments);
        $signature = hash_hmac('sha256', $signing_input, self::$secret_key, true);
        $segments[] = self::urlsafeB64Encode($signature);

        return implode('.', $segments);
    }

    /**
     * Decodifica un token JWT
     * @param string $token Token JWT
     * @return array|false Payload si el token es válido, false si no
     */
    public static function decode($token) {
        $segments = explode('.', $token);
        if (count($segments) !== 3) {
            return false;
        }

        list($headb64, $bodyb64, $cryptob64) = $segments;

        $header = json_decode(self::urlsafeB64Decode($headb64), true);
        $payload = json_decode(self::urlsafeB64Decode($bodyb64), true);
        $signature = self::urlsafeB64Decode($cryptob64);

        if (!$header || !$payload) {
            return false;
        }

        // Verificar firma
        $valid_signature = hash_hmac('sha256', "$headb64.$bodyb64", self::$secret_key, true);
        if (!hash_equals($signature, $valid_signature)) {
            return false;
        }

        // Verificar expiración
        if (isset($payload['exp']) && $payload['exp'] < time()) {
            return false;
        }

        return $payload;
    }

    private static function urlsafeB64Encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }

    private static function urlsafeB64Decode($data) {
        return base64_decode(strtr($data, '-_', '+/'));
    }
}

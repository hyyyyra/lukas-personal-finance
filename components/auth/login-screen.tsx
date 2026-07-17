'use client'

import { ArrowRight, Lock, Mail, User } from 'lucide-react'
import { useState } from 'react'
import { LukasLogo } from '@/components/lukas-logo'
import { Button } from '@/components/ui/button'
import type { UserProfile } from '@/lib/finance'
import { useLukas } from '@/lib/use-lukas-store'

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06L5.84 9.9C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor" aria-hidden="true">
      <path d="M16.37 12.6c-.02-2.16 1.76-3.2 1.84-3.25-1-1.47-2.57-1.67-3.13-1.69-1.33-.13-2.6.78-3.28.78-.67 0-1.72-.76-2.83-.74-1.46.02-2.8.85-3.55 2.15-1.51 2.62-.39 6.5 1.09 8.63.72 1.04 1.58 2.21 2.71 2.17 1.09-.04 1.5-.7 2.81-.7 1.31 0 1.68.7 2.83.68 1.17-.02 1.91-1.06 2.62-2.11.83-1.21 1.17-2.38 1.19-2.44-.03-.01-2.28-.87-2.3-3.46ZM14.2 6.3c.6-.73 1-1.74.89-2.75-.86.03-1.9.57-2.52 1.3-.56.64-1.05 1.67-.92 2.65.96.08 1.94-.49 2.55-1.2Z" />
    </svg>
  )
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
      <path
        fill="#1877F2"
        d="M24 12a12 12 0 1 0-13.88 11.85v-8.38H7.08V12h3.04V9.36c0-3 1.79-4.67 4.53-4.67 1.31 0 2.68.24 2.68.24v2.95H15.8c-1.49 0-1.95.93-1.95 1.87V12h3.32l-.53 3.47h-2.79v8.38A12 12 0 0 0 24 12Z"
      />
    </svg>
  )
}

export function LoginScreen() {
  const { login } = useLukas()
  const [mode, setMode] = useState<'login' | 'register'>('register')
  const [name, setName] = useState('')
  const [apellidos, setApellidos] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isRegister = mode === 'register'

  async function handleSocial(provider: 'google' | 'apple' | 'facebook') {
    if (loading) return
    setError(null)
    setLoading(true)
    try {
      const labels: Record<string, string> = {
        google: 'Usuario Google',
        apple: 'Usuario Apple',
        facebook: 'Usuario Facebook',
      }
      const label = labels[provider] ?? 'Usuario'
      const parts = label.trim().split(/\s+/)
      const nombres = parts[0] || ''
      const apellidos = parts[0] || ''

      await login({
        id_usuario: Number(0),
        nombre,
        email: `${provider}@lukas.cl`,
        password: 'social_login_dummy_123456',
        apellido,
      })
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión con redes sociales')
    } finally {
      setLoading(false)
    }
  }

  async function registroUsuario(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !password || loading) return

    setError(null)
    setLoading(true)

    try {
      await login({
        id_usuario: Number(0),
        nombre: name,
        apellido: apellidos,
        email,
        password,
      })
    } catch (err: any) {
      setError(err.message || 'Error en el registro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-dvh flex-col items-center justify-center bg-background px-5 py-10">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <LukasLogo className="mb-6" />
          <h1 className="text-balance font-serif text-3xl leading-tight text-foreground">
            {isRegister ? 'Crea tu cuenta' : 'Bienvenido de vuelta'}
          </h1>
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            Gestiona tus finanzas personales con claridad. Todo en pesos
            chilenos, pensado para ti.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <SocialButton
            onClick={() => handleSocial('google')}
            disabled={loading}
            icon={<GoogleIcon />}
          >
            Continuar con Google
          </SocialButton>
          <SocialButton
            onClick={() => handleSocial('apple')}
            disabled={loading}
            icon={<AppleIcon />}
          >
            Continuar con Apple
          </SocialButton>
          <SocialButton
            onClick={() => handleSocial('facebook')}
            disabled={loading}
            icon={<FacebookIcon />}
          >
            Continuar con Facebook
          </SocialButton>
        </div>

        <div className="my-6 flex items-center gap-3">
          <span className="h-px flex-1 bg-border" />
          <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            o con tu correo
          </span>
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={registroUsuario} className="flex flex-col gap-4">
          {error && (
            <div className="rounded-xl bg-destructive/10 p-3.5 text-xs font-medium text-destructive">
              {error}
            </div>
          )}
          {isRegister && (
            <Field
              icon={<User className="size-4" />}
              label="Nombre"
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={setName}
              disabled={loading}
            />
          )}
          <Field
            icon={<User className="size-4" />}
            label="Apellidos"
            type="text"
            placeholder="Tu apellido"
            value={apellidos}
            onChange={setApellidos}
            required
            disabled={loading}
          />
          <Field
            icon={<Mail className="size-4" />}
            label="Correo"
            type="email"
            placeholder="tucorreo@ejemplo.cl"
            value={email}
            onChange={setEmail}
            required
            disabled={loading}
          />
          <Field
            icon={<Lock className="size-4" />}
            label="Contraseña"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={setPassword}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            size="lg"
            disabled={loading}
            className="mt-2 h-11 w-full text-sm"
          >
            {loading ? (
              <span className="animate-pulse">Procesando...</span>
            ) : (
              <>
                {isRegister ? 'Registrarme' : 'Iniciar sesión'}
                <ArrowRight className="size-4" />
              </>
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {isRegister ? '¿Ya tienes cuenta?' : '¿Aún no tienes cuenta?'}{' '}
          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setMode(isRegister ? 'login' : 'register')
              setError(null)
            }}
            className="font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
          >
            {isRegister ? 'Inicia sesión' : 'Regístrate'}
          </button>
        </p>
      </div>
    </main>
  )
}

function SocialButton({
  icon,
  children,
  onClick,
  disabled,
}: {
  icon: React.ReactNode
  children: React.ReactNode
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-xl border border-border bg-card text-sm font-medium text-card-foreground transition-colors hover:bg-muted disabled:opacity-50 disabled:pointer-events-none"
    >
      {icon}
      {children}
    </button>
  )
}

function Field({
  icon,
  label,
  type,
  placeholder,
  value,
  onChange,
  required,
  disabled,
}: {
  icon: React.ReactNode
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  disabled?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
        {label}
      </span>
      <span className="flex items-center gap-2.5 rounded-xl border border-input bg-card px-3.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20">
        <span className="text-muted-foreground">{icon}</span>
        <input
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/60 disabled:opacity-50"
        />
      </span>
    </label>
  )
}

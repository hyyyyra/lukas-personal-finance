'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import {
  DEFAULT_ESSENTIALS,
  FIXED_BUDGET_PERIOD,
  type EssentialData,
  type EssentialItem,
  type Expense,
  type LukasState,
  type SavingsGoal,
  type UserProfile,
} from '@/lib/finance'

const STORAGE_KEY = 'lukas.state.v1'

const INITIAL_STATE: LukasState = {
  user: null,
  token: null,
  onboardingComplete: false,
  essentials: DEFAULT_ESSENTIALS,
  expenses: [],
  goals: [],
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// --- Mapeos de la respuesta cruda del backend a los tipos del frontend.
// Se reutilizan tanto en la carga inicial como en cada mutación, para poder
// actualizar el estado local con la respuesta de la propia escritura en vez
// de tener que volver a pedir todo de nuevo.

function mapEssentialItem(item: any): EssentialItem {
  return {
    id: String(item.id_gastoindispensable),
    label: item.etiqueta,
    amount: Number(item.monto),
    category: item.categoria || 'otros',
    paidPeriod: item.pagado_periodo ?? null,
  }
}

function mapEssentialsPayload(data: any): {
  onboardingComplete: boolean
  essentials: EssentialData
} {
  if (!data?.perfil) {
    return { onboardingComplete: false, essentials: DEFAULT_ESSENTIALS }
  }
  return {
    onboardingComplete: true,
    essentials: {
      monthlyIncome: Number(data.perfil.ingreso_mensual),
      essentialExpenses: Number(data.perfil.total_gastos_indispensables),
      baseSavings: Number(data.perfil.ahorro_base),
      budgetPeriod: FIXED_BUDGET_PERIOD,
      essentialItems: (data.gastos_indispensables || []).map(mapEssentialItem),
    },
  }
}

function mapExpense(g: any): Expense {
  return {
    id: String(g.id_gastosvariables),
    title: g.etiqueta,
    amount: Number(g.monto),
    category: g.categoria,
    method: g.metodo,
    createdAt: g.created_at,
  }
}

function mapGoal(m: any): SavingsGoal {
  return {
    id: String(m.id_meta),
    name: m.nombre,
    target: Number(m.monto_objetivo),
    saved: Number(m.monto_actual),
    createdAt: m.created_at,
  }
}

interface LukasContextValue extends LukasState {
  hydrated: boolean
  login: (credentials: {
    id_usuario: number
    email: string
    password?: string
    nombre?: string
    apellido?: string
    nombres?: string
    apellidos?: string
    provider?: string
    created_at?: string
    logged_at?: string | null
  }) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  signin: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  completeOnboarding: (essentials: EssentialData) => Promise<void>
  updateEssentials: (essentials: EssentialData) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>
  removeExpense: (id: string) => Promise<void>
  addGoal: (name: string, target: number) => Promise<void>
  contributeToGoal: (id: string, amount: number) => Promise<void>
  removeGoal: (id: string) => Promise<void>
  reset: () => void
}

const LukasContext = createContext<LukasContextValue | null>(null)

export function LukasProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LukasState>(INITIAL_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Carga completa desde el backend. Solo se usa al iniciar sesión o al
  // rehidratar la app — las mutaciones (agregar/quitar/editar) NO la llaman,
  // actualizan el estado directamente con la respuesta de su propia escritura.
  const loadUserData = useCallback(async (id_usuario: number, token: string) => {
    const authHeaders = { Authorization: `Bearer ${token}` }
    try {
      // Las 3 lecturas son independientes entre sí: se piden en paralelo en
      // vez de una tras otra, para no sumar sus latencias.
      const [resEssentials, resExpenses, resGoals] = await Promise.all([
        fetch(`${API_BASE_URL}/usuario/esenciales.php?id_usuario=${id_usuario}`, {
          headers: authHeaders,
        }),
        fetch(`${API_BASE_URL}/gastos.php?id_usuario=${id_usuario}`, {
          headers: authHeaders,
        }),
        fetch(`${API_BASE_URL}/metas.php?id_usuario=${id_usuario}`, {
          headers: authHeaders,
        }).catch(() => null),
      ])

      const { onboardingComplete, essentials } = resEssentials.ok
        ? mapEssentialsPayload(await resEssentials.json())
        : { onboardingComplete: false, essentials: DEFAULT_ESSENTIALS }

      let expenses: Expense[] = []
      if (resExpenses.ok) {
        const data = await resExpenses.json()
        expenses = (data.gastos || []).map(mapExpense)
      }

      // Tolerante a fallos: metas vacías si el endpoint no está disponible.
      let goals: SavingsGoal[] = []
      if (resGoals?.ok) {
        const data = await resGoals.json()
        goals = (data.metas || []).map(mapGoal)
      }

      setState((prev) => ({
        ...prev,
        onboardingComplete,
        essentials,
        expenses,
        goals,
      }))
    } catch (error) {
      console.error('Error cargando datos del backend:', error)
    }
  }, [])

  // Cargar desde caché (localStorage) al montar y actualizar con el backend si hay sesión activa
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as LukasState
        setState({
          ...INITIAL_STATE,
          ...parsed,
          essentials: {
            ...DEFAULT_ESSENTIALS,
            ...parsed.essentials,
            essentialItems: parsed.essentials?.essentialItems ?? [],
            budgetPeriod: FIXED_BUDGET_PERIOD,
          },
        })

        if (parsed.user?.id_usuario && parsed.token) {
          loadUserData(parsed.user.id_usuario, parsed.token)
        }
      }
    } catch (error) {
      console.log('Error leyendo caché de Lukas:', error)
    }
    setHydrated(true)
  }, [loadUserData])

  // Persistir en caché ante cualquier cambio
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.log('Error guardando caché de Lukas:', error)
    }
  }, [state, hydrated])

  const login = useCallback(async (credentials: {
    id_usuario: number
    email: string
    password?: string
    nombre?: string
    apellido?: string
    nombres?: string
    apellidos?: string
    created_at?: string
    logged_at?: string | null
  }) => {
    const { email, password = 'social_login_dummy_123456', nombres, apellidos, nombre, apellido, created_at, logged_at } = credentials

    const body: Record<string, string> = {
      email,
      password,
      nombres: nombres ?? nombre ?? "",
      apellidos: apellidos ?? apellido ?? "",
    }

    const res = await fetch(`${API_BASE_URL}/auth/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    //FTR: Controla respuesta de inicio de sesión fallida.
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error en el inicio de sesión')
    }

    const data = await res.json()
    if (!data.usuario || !data.token) {
      throw new Error('Respuesta inválida del servidor')
    }

    const userProfile: UserProfile = {
      id_usuario: data.usuario.id_usuario,
      nombre: data.usuario.nombre,
      apellido: data.usuario.apellido,
      email: data.usuario.email,
      created_at: data.usuario.created_at ?? created_at ?? new Date().toISOString(),
      logged_at: data.usuario.logged_at ?? logged_at ?? null,
    }

    await loadUserData(userProfile.id_usuario, data.token)
    setState((prev) => ({ ...prev, user: userProfile, token: data.token }))
  }, [loadUserData])

  const loginWithGoogle = useCallback(async (credential: string) => {
    const res = await fetch(`${API_BASE_URL}/auth/google.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: credential }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error en la autenticación con Google')
    }

    const data = await res.json()
    if (!data.usuario || !data.token) {
      throw new Error('Respuesta inválida del servidor')
    }

    const userProfile: UserProfile = {
      id_usuario: data.usuario.id_usuario,
      nombre: data.usuario.nombre,
      apellido: data.usuario.apellido,
      email: data.usuario.email,
      created_at: data.usuario.created_at ?? new Date().toISOString(),
      logged_at: data.usuario.logged_at ?? null,
    }

    await loadUserData(userProfile.id_usuario, data.token)
    setState((prev) => ({ ...prev, user: userProfile, token: data.token }))
  }, [loadUserData])

  const signin = useCallback(async (credentials: { email: string; password: string }) => {
    const { email, password } = credentials

    const res = await fetch(`${API_BASE_URL}/auth/signin.php`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al iniciar sesión')
    }

    const data = await res.json()
    if (!data.usuario || !data.token) {
      throw new Error('Respuesta inválida del servidor')
    }

    const userProfile: UserProfile = {
      id_usuario: data.usuario.id_usuario,
      nombre: data.usuario.nombre,
      apellido: data.usuario.apellido,
      email: data.usuario.email,
      created_at: data.usuario.created_at ?? new Date().toISOString(),
      logged_at: data.usuario.logged_at ?? null,
    }

    await loadUserData(userProfile.id_usuario, data.token)
    setState((prev) => ({ ...prev, user: userProfile, token: data.token }))
  }, [loadUserData])

  const logout = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  // Cuerpo compartido por completeOnboarding/updateEssentials: guarda el
  // perfil + la lista de ítems, y devuelve el estado ya mapeado desde la
  // respuesta del propio POST (sin volver a pedirlo con un GET aparte).
  const saveEssentials = useCallback(async (essentials: EssentialData) => {
    if (!state.user || !state.token) return null
    const id_usuario = state.user.id_usuario
    const token = state.token

    const body = {
      ingreso_mensual: essentials.monthlyIncome,
      total_gastos_indispensables: essentials.essentialExpenses,
      ahorro_base: essentials.baseSavings,
      periodo_presupuesto: FIXED_BUDGET_PERIOD,
      gastos_indispensables: essentials.essentialItems.map((item) => ({
        etiqueta: item.label,
        monto: item.amount,
        categoria: item.category,
        pagado_periodo: item.paidPeriod ?? null,
      })),
    }

    const res = await fetch(`${API_BASE_URL}/usuario/esenciales.php?id_usuario=${id_usuario}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al guardar los datos esenciales')
    }

    return mapEssentialsPayload(await res.json())
  }, [state.user, state.token])

  const completeOnboarding = useCallback(async (essentials: EssentialData) => {
    const result = await saveEssentials(essentials)
    if (!result) return
    setState((prev) => ({ ...prev, essentials: result.essentials, onboardingComplete: true }))
  }, [saveEssentials])

  const updateEssentials = useCallback(async (essentials: EssentialData) => {
    const result = await saveEssentials(essentials)
    if (!result) return
    setState((prev) => ({ ...prev, essentials: result.essentials }))
  }, [saveEssentials])

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!state.user || !state.token) return
    const id_usuario = state.user.id_usuario
    const token = state.token

    const body = {
      etiqueta: expense.title,
      monto: expense.amount,
      categoria: expense.category,
      metodo: expense.method,
    }

    const res = await fetch(`${API_BASE_URL}/gastos.php?id_usuario=${id_usuario}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al guardar el gasto')
    }

    const data = await res.json()
    const created = mapExpense(data.gasto)
    setState((prev) => ({ ...prev, expenses: [created, ...prev.expenses] }))
  }, [state.user, state.token])

  const removeExpense = useCallback(async (id: string) => {
    if (!state.user || !state.token) return
    const id_usuario = state.user.id_usuario
    const token = state.token

    const res = await fetch(`${API_BASE_URL}/gastos.php?id_usuario=${id_usuario}&id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al eliminar el gasto')
    }

    setState((prev) => ({ ...prev, expenses: prev.expenses.filter((e) => e.id !== id) }))
  }, [state.user, state.token])

  const addGoal = useCallback(async (name: string, target: number) => {
    if (!state.user || !state.token) return
    const { id_usuario } = state.user
    const token = state.token

    const res = await fetch(`${API_BASE_URL}/metas.php?id_usuario=${id_usuario}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ nombre: name, monto_objetivo: target }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al crear la meta de ahorro')
    }

    const data = await res.json()
    const created = mapGoal(data.meta)
    setState((prev) => ({ ...prev, goals: [...prev.goals, created] }))
  }, [state.user, state.token])

  const contributeToGoal = useCallback(async (id: string, amount: number) => {
    if (!state.user || !state.token) return
    const goal = state.goals.find((g) => g.id === id)
    if (!goal) return
    const { id_usuario } = state.user
    const token = state.token

    const res = await fetch(`${API_BASE_URL}/metas.php?id_usuario=${id_usuario}&id=${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ monto_actual: goal.saved + amount }),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al abonar a la meta')
    }

    const data = await res.json()
    const updated = mapGoal(data.meta)
    setState((prev) => ({
      ...prev,
      goals: prev.goals.map((g) => (g.id === id ? updated : g)),
    }))
  }, [state.user, state.token, state.goals])

  const removeGoal = useCallback(async (id: string) => {
    if (!state.user || !state.token) return
    const { id_usuario } = state.user
    const token = state.token

    const res = await fetch(`${API_BASE_URL}/metas.php?id_usuario=${id_usuario}&id=${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al eliminar la meta')
    }

    setState((prev) => ({ ...prev, goals: prev.goals.filter((g) => g.id !== id) }))
  }, [state.user, state.token])

  const reset = useCallback(() => {
    setState(INITIAL_STATE)
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // no-op
    }
  }, [])

  const value = useMemo<LukasContextValue>(
    () => ({
      ...state,
      hydrated,
      login,
      loginWithGoogle,
      signin,
      logout,
      completeOnboarding,
      updateEssentials,
      addExpense,
      removeExpense,
      addGoal,
      contributeToGoal,
      removeGoal,
      reset,
    }),
    [
      state,
      hydrated,
      login,
      loginWithGoogle,
      signin,
      logout,
      completeOnboarding,
      updateEssentials,
      addExpense,
      removeExpense,
      addGoal,
      contributeToGoal,
      removeGoal,
      reset,
    ],
  )

  return <LukasContext.Provider value={value}>{children}</LukasContext.Provider>
}

export function useLukas() {
  const ctx = useContext(LukasContext)
  if (!ctx) {
    throw new Error('useLukas debe usarse dentro de <LukasProvider>')
  }
  return ctx
}

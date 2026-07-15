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
  type EssentialData,
  type Expense,
  type LukasState,
  type UserProfile,
} from '@/lib/finance'

const STORAGE_KEY = 'lukas.state.v1'

const INITIAL_STATE: LukasState = {
  user: null,
  onboardingComplete: false,
  essentials: DEFAULT_ESSENTIALS,
  expenses: [],
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/'

interface LukasContextValue extends LukasState {
  hydrated: boolean
  login: (credentials: {
    id_usuario: number  
    email: string
    password?: string
    nombres?: string
    apellidos?: string
    provider?: string
  }) => Promise<void>
  logout: () => void
  completeOnboarding: (essentials: EssentialData) => Promise<void>
  updateEssentials: (essentials: EssentialData) => Promise<void>
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Promise<void>
  removeExpense: (id: string) => Promise<void>
  reset: () => void
}

const LukasContext = createContext<LukasContextValue | null>(null)

export function LukasProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LukasState>(INITIAL_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Cargar datos del usuario desde la base de datos
  const loadUserData = useCallback(async (email: string) => {
    try {
      // 1. Obtener perfil y gastos indispensables
      const resEssentials = await fetch(`${API_BASE_URL}/usuario/esenciales.php?email=${email}`)
      let onboardingComplete = false
      let essentials = DEFAULT_ESSENTIALS

      if (resEssentials.ok) {
        const data = await resEssentials.json()
        if (data.perfil) {
          onboardingComplete = true
          essentials = {
            monthlyIncome: Number(data.perfil.ingreso_mensual),
            essentialExpenses: Number(data.perfil.total_gastos_indispensables),
            baseSavings: Number(data.perfil.ahorro_base),
            budgetPeriod: data.perfil.periodo_presupuesto,
            essentialItems: (data.gastos_indispensables || []).map((item: any) => ({
              id: String(item.id_gastoindispensable),
              label: item.etiqueta,
              amount: Number(item.monto),
            })),
          }
        }
      }

      // 2. Obtener gastos variables
      let expenses: Expense[] = []
      const resExpenses = await fetch(`${API_BASE_URL}/gastos.php?email=${email}`)
      if (resExpenses.ok) {
        const data = await resExpenses.json()
        if (data.gastos) {
          expenses = data.gastos.map((g: any) => ({
            id: String(g.id_gastosvariables),
            etiqueta: g.etiqueta,
            amount: Number(g.monto),
            category: g.categoria,
            method: g.metodo,
            createdAt: g.created_at,
          }))
        }
      }

      setState((prev) => ({
        ...prev,
        onboardingComplete,
        essentials,
        expenses,
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
          },
        })

        if (parsed.user?.email) {
          loadUserData(parsed.user.email)
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
    nombres?: string
    apellidos?: string
    provider?: string
  }) => {
    const { email, password = 'social_login_dummy_123456', nombres, apellidos } = credentials

    const body: Record<string, string> = {
      email,
      password,
      nombres: nombres ?? "",
      apellidos: apellidos ?? "",
    }

    console.log(`${API_BASE_URL}/auth/login.php`);
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
    if (!data.usuario) {
      throw new Error('Respuesta inválida del servidor')
    }

    const userProfile: UserProfile = {
      id_usuario: data.usuario.id_usuario,
      nombre: data.usuario.nombres,
      apellido: data.usuario.apellidos,
      email: data.usuario.email,
      provider: data.usuario.provider
    }

    setState((prev) => ({ ...prev, user: userProfile }))
    await loadUserData(String(userProfile.id_usuario))
  }, [loadUserData])

  const logout = useCallback(() => {
    setState(INITIAL_STATE)
  }, [])

  const completeOnboarding = useCallback(async (essentials: EssentialData) => {
    if (!state.user) return
    const id_usuario = state.user.id_usuario

    const body = {
      ingreso_mensual: essentials.monthlyIncome,
      total_gastos_indispensables: essentials.essentialExpenses,
      ahorro_base: essentials.baseSavings,
      periodo_presupuesto: essentials.budgetPeriod,
      gastos_indispensables: essentials.essentialItems.map((item) => ({
        etiqueta: item.label,
        monto: item.amount,
      })),
    }

    const res = await fetch(`${API_BASE_URL}/usuario/esenciales.php?id_usuario=${id_usuario}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al guardar los datos esenciales')
    }

    await loadUserData(String(id_usuario))
    setState((prev) => ({ ...prev, onboardingComplete: true }))
  }, [state.user, loadUserData])

  const updateEssentials = useCallback(async (essentials: EssentialData) => {
    if (!state.user) return
    const id_usuario = state.user.id_usuario

    const body = {
      ingreso_mensual: essentials.monthlyIncome,
      total_gastos_indispensables: essentials.essentialExpenses,
      ahorro_base: essentials.baseSavings,
      periodo_presupuesto: essentials.budgetPeriod,
      gastos_indispensables: essentials.essentialItems.map((item) => ({
        etiqueta: item.label,
        monto: item.amount,
      })),
    }

    const res = await fetch(`${API_BASE_URL}/usuario/esenciales.php?id_usuario=${id_usuario}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al actualizar los datos esenciales')
    }

    await loadUserData(String(id_usuario))
  }, [state.user, loadUserData])

  const addExpense = useCallback(async (expense: Omit<Expense, 'id' | 'createdAt'>) => {
    if (!state.user) return
    const id_usuario = state.user.id_usuario

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
      },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al guardar el gasto')
    }

    await loadUserData(String(id_usuario))
  }, [state.user, loadUserData])

  const removeExpense = useCallback(async (id: string) => {
    if (!state.user) return
    const id_usuario = state.user.id_usuario

    const res = await fetch(`${API_BASE_URL}/gastos.php?id_usuario=${id_usuario}&id=${id}`, {
      method: 'DELETE',
    })

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}))
      throw new Error(errData.error || 'Error al eliminar el gasto')
    }

    await loadUserData(String(id_usuario))
  }, [state.user, loadUserData])

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
      logout,
      completeOnboarding,
      updateEssentials,
      addExpense,
      removeExpense,
      reset,
    }),
    [
      state,
      hydrated,
      login,
      logout,
      completeOnboarding,
      updateEssentials,
      addExpense,
      removeExpense,
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

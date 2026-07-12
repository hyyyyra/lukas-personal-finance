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

interface LukasContextValue extends LukasState {
  hydrated: boolean
  login: (user: UserProfile) => void
  logout: () => void
  completeOnboarding: (essentials: EssentialData) => void
  updateEssentials: (essentials: EssentialData) => void
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
  removeExpense: (id: string) => void
  reset: () => void
}

const LukasContext = createContext<LukasContextValue | null>(null)

export function LukasProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<LukasState>(INITIAL_STATE)
  const [hydrated, setHydrated] = useState(false)

  // Cargar desde caché (localStorage) al montar
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
      }
    } catch (error) {
      console.log('[v0] Error leyendo caché de Lukas:', error)
    }
    setHydrated(true)
  }, [])

  // Persistir en caché ante cualquier cambio
  useEffect(() => {
    if (!hydrated) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.log('[v0] Error guardando caché de Lukas:', error)
    }
  }, [state, hydrated])

  const login = useCallback((user: UserProfile) => {
    setState((prev) => ({ ...prev, user }))
  }, [])

  const logout = useCallback(() => {
    setState((prev) => ({ ...prev, user: null }))
  }, [])

  const completeOnboarding = useCallback((essentials: EssentialData) => {
    setState((prev) => ({ ...prev, essentials, onboardingComplete: true }))
  }, [])

  const updateEssentials = useCallback((essentials: EssentialData) => {
    setState((prev) => ({ ...prev, essentials }))
  }, [])

  const addExpense = useCallback(
    (expense: Omit<Expense, 'id' | 'createdAt'>) => {
      setState((prev) => ({
        ...prev,
        expenses: [
          {
            ...expense,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
          },
          ...prev.expenses,
        ],
      }))
    },
    [],
  )

  const removeExpense = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      expenses: prev.expenses.filter((e) => e.id !== id),
    }))
  }, [])

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

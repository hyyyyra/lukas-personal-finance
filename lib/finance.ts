export type BudgetPeriod = 'semanal' | 'quincenal' | 'mensual'

export type ExpenseMethod = 'ocr' | 'archivo' | 'manual'

export type ExpenseCategory =
  | 'comida'
  | 'transporte'
  | 'hogar'
  | 'salud'
  | 'ocio'
  | 'compras'
  | 'servicios'
  | 'otros'

export interface Expense {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
  method: ExpenseMethod
  createdAt: string // ISO date
}

export interface UserProfile {
  id_usuario: number
  nombre: string
  apellido: string
  email: string
  password: string
  created_at: string // ISO date
  logged_at: string | null
}

export interface EssentialItem {
  id: string
  label: string
  amount: number
}

export interface EssentialData {
  monthlyIncome: number
  essentialExpenses: number
  essentialItems: EssentialItem[]
  baseSavings: number
  budgetPeriod: BudgetPeriod
}

export interface LukasState {
  user: UserProfile | null
  onboardingComplete: boolean
  essentials: EssentialData
  expenses: Expense[]
}

export const DEFAULT_ESSENTIALS: EssentialData = {
  monthlyIncome: 0,
  essentialExpenses: 0,
  essentialItems: [],
  baseSavings: 0,
  budgetPeriod: 'mensual',
}

/** Categorías sugeridas para gastos indispensables */
export const ESSENTIAL_SUGGESTIONS = [
  'Arriendo / Dividendo',
  'Cuentas (luz, agua, gas)',
  'Internet y telefonía',
  'Transporte',
  'Supermercado',
  'Créditos',
  'Educación',
  'Salud e isapre',
] as const

/** Suma el total de una lista de ítems de gasto */
export function sumEssentialItems(items: EssentialItem[]): number {
  return items.reduce((sum, item) => sum + (item.amount || 0), 0)
}

export const PERIOD_LABEL: Record<BudgetPeriod, string> = {
  semanal: 'Semanal',
  quincenal: 'Quincenal',
  mensual: 'Mensual',
}

export const PERIOD_DAYS: Record<BudgetPeriod, number> = {
  semanal: 7,
  quincenal: 15,
  mensual: 30,
}

export const CATEGORY_LABEL: Record<ExpenseCategory, string> = {
  comida: 'Comida',
  transporte: 'Transporte',
  hogar: 'Hogar',
  salud: 'Salud',
  ocio: 'Ocio',
  compras: 'Compras',
  servicios: 'Servicios',
  otros: 'Otros',
}

/** Formatea un número como peso chileno: $1.234.567 */
export function formatCLP(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0))
}

/** Formatea un número sin símbolo: 1.234.567 */
export function formatNumber(value: number): string {
  return new Intl.NumberFormat('es-CL', {
    maximumFractionDigits: 0,
  }).format(Math.round(value || 0))
}

/** Convierte texto ingresado (con puntos/comas) a número */
export function parseAmount(input: string): number {
  const clean = input.replace(/[^0-9]/g, '')
  return clean ? Number.parseInt(clean, 10) : 0
}

/** Ingreso disponible mensual = ingresos - gastos fijos - ahorro base */
export function monthlyDisposable(e: EssentialData): number {
  return Math.max(0, e.monthlyIncome - e.essentialExpenses - e.baseSavings)
}

/** Presupuesto asignado para el periodo seleccionado */
export function periodBudget(e: EssentialData): number {
  const monthly = monthlyDisposable(e)
  const perDay = monthly / 30
  return perDay * PERIOD_DAYS[e.budgetPeriod]
}

/** Gastos variables dentro de la ventana del periodo actual */
export function expensesInPeriod(
  expenses: Expense[],
  period: BudgetPeriod,
): Expense[] {
  const now = Date.now()
  const windowMs = PERIOD_DAYS[period] * 24 * 60 * 60 * 1000
  return expenses.filter((exp) => {
    const t = new Date(exp.createdAt).getTime()
    return now - t <= windowMs
  })
}

export function totalSpent(expenses: Expense[]): number {
  return expenses.reduce((sum, e) => sum + e.amount, 0)
}

'use client'

import {
  LogOut,
  PiggyBank,
  Plus,
  Receipt,
  SlidersHorizontal,
  Wallet,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { AddExpenseDialog } from '@/components/dashboard/add-expense-dialog'
import { BudgetOverview } from '@/components/dashboard/budget-overview'
import { EditEssentialsDialog } from '@/components/dashboard/edit-essentials-dialog'
import { ExpenseList } from '@/components/dashboard/expense-list'
import { LukasLogo } from '@/components/lukas-logo'
import {
  FIXED_BUDGET_PERIOD,
  expensesInPeriod,
  formatCLP,
  monthlyBudgetCap,
  totalSpent,
} from '@/lib/finance'
import { useLukas } from '@/lib/use-lukas-store'

export function HomeScreen() {
  const {
    user,
    essentials,
    expenses,
    addExpense,
    removeExpense,
    updateEssentials,
    logout,
  } = useLukas()

  const [addOpen, setAddOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)

  const periodExpenses = useMemo(
    () => expensesInPeriod(expenses, FIXED_BUDGET_PERIOD),
    [expenses],
  )
  const spent = useMemo(() => totalSpent(periodExpenses), [periodExpenses])

  const firstName = user?.name?.split(' ')[0] ?? 'usuario'

  return (
    <main className="min-h-dvh bg-background pb-28 lg:pb-12">
      <div className="mx-auto w-full max-w-md px-5 pt-8 sm:pt-10 lg:max-w-6xl lg:px-8 lg:pt-12">
        {/* Encabezado */}
        <header className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Hola, {firstName}</p>
            <LukasLogo showWordmark className="mt-0.5" />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditOpen(true)}
              aria-label="Editar datos esenciales"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-muted"
            >
              <SlidersHorizontal className="size-4" />
            </button>
            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión"
              className="flex size-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>

        {/* En desktop: dos columnas. En móvil: una sola columna apilada. */}
        <div className="mt-6 lg:mt-10 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-start lg:gap-8">
          {/* Columna izquierda: presupuesto + datos esenciales */}
          <div className="lg:sticky lg:top-12">
            <BudgetOverview
              essentials={essentials}
              spent={spent}
            />

            {/* Tarjetas de datos esenciales */}
            <div className="mt-4 grid grid-cols-3 gap-3 lg:mt-5 lg:gap-4">
              <StatCard
                icon={<Wallet className="size-4" />}
                label="Ingresos"
                value={formatCLP(essentials.monthlyIncome)}
              />
              <StatCard
                icon={<Receipt className="size-4" />}
                label="Gastos fijos"
                value={formatCLP(essentials.essentialExpenses)}
              />
              <StatCard
                icon={<PiggyBank className="size-4" />}
                label="Ahorro"
                value={formatCLP(essentials.baseSavings)}
              />
            </div>

            <p className="mt-3 text-center text-xs text-muted-foreground lg:mt-4">
              Disponible mensual:{' '}
              <span className="font-medium text-foreground">
                {formatCLP(Math.max(0, monthlyBudgetCap(essentials) - spent))}
              </span>
            </p>

            {/* Botón inline (solo desktop) */}
            <button
              type="button"
              onClick={() => setAddOpen(true)}
              className="mt-6 hidden h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-[0.99] lg:flex"
            >
              <Plus className="size-5" />
              Ingresar gasto
            </button>
          </div>

          {/* Columna derecha: movimientos */}
          <section className="mt-8 lg:mt-0">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-serif text-xl text-foreground lg:text-2xl">
                Gastos del periodo
              </h2>
              <span className="text-xs text-muted-foreground">
                {periodExpenses.length}{' '}
                {periodExpenses.length === 1 ? 'movimiento' : 'movimientos'}
              </span>
            </div>
            <ExpenseList expenses={periodExpenses} onRemove={removeExpense} />
          </section>
        </div>
      </div>

      {/* Botón flotante para ingresar gasto (solo móvil/tablet) */}
      <div className="fixed inset-x-0 bottom-0 z-30 bg-gradient-to-t from-background via-background to-transparent px-5 pb-6 pt-8 lg:hidden">
        <div className="mx-auto max-w-md">
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-primary text-base font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-transform active:scale-[0.99]"
          >
            <Plus className="size-5" />
            Ingresar gasto
          </button>
        </div>
      </div>

      <AddExpenseDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addExpense}
      />
      <EditEssentialsDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        essentials={essentials}
        onSave={updateEssentials}
      />
    </main>
  )
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-foreground">
        {value}
      </p>
    </div>
  )
}

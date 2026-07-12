'use client'

import { TrendingDown, TrendingUp } from 'lucide-react'
import {
  type BudgetPeriod,
  type EssentialData,
  formatCLP,
  PERIOD_LABEL,
  periodBudget,
} from '@/lib/finance'
import { cn } from '@/lib/utils'

const PERIODS: BudgetPeriod[] = ['semanal', 'quincenal', 'mensual']

export function BudgetOverview({
  essentials,
  spent,
  onChangePeriod,
}: {
  essentials: EssentialData
  spent: number
  onChangePeriod: (p: BudgetPeriod) => void
}) {
  const budget = periodBudget(essentials)
  const remaining = budget - spent
  const pct = budget > 0 ? Math.min(100, (spent / budget) * 100) : 0
  const overBudget = remaining < 0
  const healthy = pct < 75

  return (
    <section className="rounded-3xl bg-primary p-6 text-primary-foreground shadow-sm sm:p-7 lg:p-8">
      {/* Selector de periodo */}
      <div className="flex items-center gap-1 rounded-full bg-primary-foreground/15 p-1">
        {PERIODS.map((p) => {
          const active = essentials.budgetPeriod === p
          return (
            <button
              key={p}
              type="button"
              onClick={() => onChangePeriod(p)}
              className={cn(
                'flex-1 rounded-full py-1.5 text-xs font-medium transition-colors',
                active
                  ? 'bg-primary-foreground text-primary'
                  : 'text-primary-foreground/80 hover:text-primary-foreground',
              )}
            >
              {PERIOD_LABEL[p]}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <p className="text-sm text-primary-foreground/80">
          Presupuesto restante {PERIOD_LABEL[essentials.budgetPeriod].toLowerCase()}
        </p>
        <p className="mt-1 font-serif text-[2.75rem] leading-none tabular-nums tracking-tight sm:text-6xl">
          {formatCLP(remaining)}
        </p>
        <p className="mt-2 text-sm text-primary-foreground/80">
          de {formatCLP(budget)} disponibles
        </p>
      </div>

      {/* Barra de progreso */}
      <div className="mt-5">
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-primary-foreground/20">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500',
              healthy ? 'bg-primary-foreground' : 'bg-primary-foreground/90',
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <div className="mt-2.5 flex items-center justify-between text-xs text-primary-foreground/80">
          <span className="inline-flex items-center gap-1">
            {overBudget ? (
              <TrendingDown className="size-3.5" />
            ) : (
              <TrendingUp className="size-3.5" />
            )}
            {overBudget
              ? 'Te pasaste del presupuesto'
              : `Has usado el ${Math.round(pct)}%`}
          </span>
          <span>Gastado: {formatCLP(spent)}</span>
        </div>
      </div>
    </section>
  )
}

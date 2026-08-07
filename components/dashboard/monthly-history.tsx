'use client'

import { CalendarDays, TrendingDown, TrendingUp } from 'lucide-react'
import { useMemo } from 'react'
import {
  CATEGORY_LABEL,
  currentPeriod,
  type EssentialData,
  type Expense,
  formatCLP,
  monthlyDisposable,
  summarizeByMonth,
} from '@/lib/finance'
import { cn } from '@/lib/utils'

export function MonthlyHistory({
  expenses,
  essentials,
}: {
  expenses: Expense[]
  essentials: EssentialData
}) {
  const months = useMemo(() => summarizeByMonth(expenses), [expenses])
  const budget = monthlyDisposable(essentials)
  const nowKey = currentPeriod()

  if (months.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <CalendarDays className="size-5" />
        </span>
        <p className="mt-3 text-sm font-medium text-foreground">
          Aún no hay historial
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Cuando registres gastos variables, aquí verás tu resumen mes a mes.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {months.map((month) => {
        const isCurrent = month.key === nowKey
        const overBudget = budget > 0 && month.total > budget
        return (
          <section
            key={month.key}
            className="rounded-2xl border border-border bg-card p-4"
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground">
                  {month.label}
                </h3>
                <p className="mt-0.5 font-serif text-2xl tabular-nums text-foreground">
                  {formatCLP(month.total)}
                </p>
              </div>
              {budget > 0 && (
                <span
                  className={cn(
                    'inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-semibold',
                    isCurrent
                      ? 'bg-secondary text-secondary-foreground'
                      : overBudget
                        ? 'bg-destructive/10 text-destructive'
                        : 'bg-accent/15 text-accent',
                  )}
                >
                  {isCurrent ? (
                    'Mes en curso'
                  ) : overBudget ? (
                    <>
                      <TrendingDown className="size-3" />
                      Sobre el presupuesto
                    </>
                  ) : (
                    <>
                      <TrendingUp className="size-3" />
                      Dentro del presupuesto
                    </>
                  )}
                </span>
              )}
            </div>

            {/* Desglose por categoría con barras proporcionales */}
            <ul className="mt-3 flex flex-col gap-2">
              {month.byCategory.map((cat) => {
                const pct = month.total > 0 ? (cat.total / month.total) * 100 : 0
                return (
                  <li key={cat.category}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-foreground">
                        {CATEGORY_LABEL[cat.category] ?? cat.category}
                      </span>
                      <span className="tabular-nums text-muted-foreground">
                        {formatCLP(cat.total)} · {Math.round(pct)}%
                      </span>
                    </div>
                    <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-primary/70 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}
    </div>
  )
}

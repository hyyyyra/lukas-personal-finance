'use client'

import {
  Camera,
  Car,
  FileText,
  Film,
  Heart,
  Home,
  Keyboard,
  Package,
  ReceiptText,
  ShoppingBag,
  Trash2,
  Utensils,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  CATEGORY_LABEL,
  type Expense,
  type ExpenseCategory,
  type ExpenseMethod,
  formatCLP,
} from '@/lib/finance'

const CATEGORY_ICON: Record<ExpenseCategory, LucideIcon> = {
  comida: Utensils,
  transporte: Car,
  hogar: Home,
  salud: Heart,
  ocio: Film,
  compras: ShoppingBag,
  servicios: Zap,
  otros: Package,
}

const METHOD_ICON: Record<ExpenseMethod, LucideIcon> = {
  ocr: Camera,
  archivo: FileText,
  manual: Keyboard,
}

const METHOD_LABEL: Record<ExpenseMethod, string> = {
  ocr: 'Escaneado',
  archivo: 'Archivo',
  manual: 'Manual',
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('es-CL', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}

export function ExpenseList({
  expenses,
  onRemove,
}: {
  expenses: Expense[]
  onRemove: (id: string) => void
}) {
  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <ReceiptText className="size-5" />
        </span>
        <p className="mt-3 text-sm font-medium text-foreground">
          Aún no registras gastos
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Toca “Ingresar gasto” para sumar tu primer movimiento.
        </p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-2">
      {expenses.map((expense) => {
        const Icon = CATEGORY_ICON[expense.category]
        const MethodIcon = METHOD_ICON[expense.method]
        return (
          <li
            key={expense.id}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3"
          >
            <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-foreground">
              <Icon className="size-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {expense.title}
              </p>
              <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span>{CATEGORY_LABEL[expense.category]}</span>
                <span aria-hidden>·</span>
                <span className="inline-flex items-center gap-1">
                  <MethodIcon className="size-3" />
                  {METHOD_LABEL[expense.method]}
                </span>
                <span aria-hidden>·</span>
                <span>{formatDate(expense.createdAt)}</span>
              </p>
            </div>
            <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
              −{formatCLP(expense.amount)}
            </span>
            <button
              type="button"
              onClick={() => onRemove(expense.id)}
              aria-label={`Eliminar ${expense.title}`}
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="size-4" />
            </button>
          </li>
        )
      })}
    </ul>
  )
}

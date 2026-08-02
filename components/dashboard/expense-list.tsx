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
  Pin,
  Plus,
  ReceiptText,
  ShoppingBag,
  Trash2,
  Utensils,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import {
  CATEGORY_LABEL,
  type EssentialItem,
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
  essentialItems = [],
  onRemove,
  onRemoveFixed,
  onAddFixed,
}: {
  expenses: Expense[]
  essentialItems?: EssentialItem[]
  onRemove: (id: string) => void
  onRemoveFixed: (id: string) => void
  onAddFixed: () => void
}) {
  const [filter, setFilter] = useState<'todos' | 'variables' | 'fijos'>('todos')

  const hasVariables = expenses.length > 0
  const hasFijos = essentialItems.length > 0
  const totalCount = expenses.length + essentialItems.length

  if (totalCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <span className="flex size-11 items-center justify-center rounded-full bg-secondary text-muted-foreground">
          <ReceiptText className="size-5" />
        </span>
        <p className="mt-3 text-sm font-medium text-foreground">
          Aún no registras gastos
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Ingresa tus gastos fijos o tus compras del periodo.
        </p>
        <button
          type="button"
          onClick={onAddFixed}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-muted"
        >
          <Plus className="size-3.5" />
          Agregar gasto fijo
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Filtros por pestaña + acción rápida para gastos fijos */}
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-1.5 rounded-xl border border-border bg-card p-1 text-xs font-medium">
          <button
            type="button"
            onClick={() => setFilter('todos')}
            className={`flex-1 rounded-lg px-2.5 py-1.5 transition-colors ${
              filter === 'todos'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Todos ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('variables')}
            className={`flex-1 rounded-lg px-2.5 py-1.5 transition-colors ${
              filter === 'variables'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Variables ({expenses.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('fijos')}
            className={`flex-1 rounded-lg px-2.5 py-1.5 transition-colors ${
              filter === 'fijos'
                ? 'bg-primary text-primary-foreground font-semibold shadow-xs'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
          >
            Gastos Fijos ({essentialItems.length})
          </button>
        </div>
        <button
          type="button"
          onClick={onAddFixed}
          aria-label="Agregar gasto fijo"
          title="Agregar gasto fijo"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl border border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Plus className="size-4" />
        </button>
      </div>

      <ul className="flex flex-col gap-2">
        {/* Renderizar Gastos Fijos si (filter === 'todos' o 'fijos') */}
        {(filter === 'todos' || filter === 'fijos') &&
          essentialItems.map((item) => (
            <li
              key={`fijo-${item.id}`}
              className="group flex items-center gap-3 rounded-2xl border border-border/80 bg-card p-3 shadow-2xs"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Pin className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.label || 'Gasto fijo'}
                  </p>
                  <span className="inline-flex shrink-0 items-center rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    Gasto Fijo
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Fijo mensual
                </p>
              </div>
              <span className="shrink-0 text-sm font-semibold tabular-nums text-foreground">
                −{formatCLP(item.amount)}
              </span>
              <button
                type="button"
                onClick={() => onRemoveFixed(item.id)}
                aria-label={`Eliminar ${item.label}`}
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}

        {/* Separador visual en la vista 'todos' cuando existen ambos tipos de gastos */}
        {filter === 'todos' && hasFijos && hasVariables && (
          <li className="my-1 flex items-center gap-2 px-1">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              Gastos del periodo (Variables)
            </span>
            <span className="h-px flex-1 bg-border" />
          </li>
        )}

        {/* Renderizar Gastos Variables si (filter === 'todos' o 'variables') */}
        {(filter === 'todos' || filter === 'variables') &&
          expenses.map((expense) => {
            const Icon = CATEGORY_ICON[expense.category]
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

        {/* Estados vacíos por categoría */}
        {filter === 'fijos' && !hasFijos && (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No tienes gastos fijos configurados.{' '}
            <button
              type="button"
              onClick={onAddFixed}
              className="font-semibold text-primary underline"
            >
              Agregar gasto fijo
            </button>
          </div>
        )}

        {filter === 'variables' && !hasVariables && (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No has registrado gastos variables en este periodo.
          </div>
        )}
      </ul>
    </div>
  )
}


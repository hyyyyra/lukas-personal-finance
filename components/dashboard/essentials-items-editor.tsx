'use client'

import { Plus, Trash2 } from 'lucide-react'
import { MoneyInput } from '@/components/ui/money-input'
import {
  ESSENTIAL_SUGGESTIONS,
  type EssentialItem,
  formatCLP,
  sumEssentialItems,
} from '@/lib/finance'
import { cn } from '@/lib/utils'

function makeItem(label = ''): EssentialItem {
  return {
    id:
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : Math.random().toString(36).slice(2),
    label,
    amount: 0,
  }
}

export function EssentialsItemsEditor({
  items,
  onChange,
  className,
}: {
  items: EssentialItem[]
  onChange: (items: EssentialItem[]) => void
  className?: string
}) {
  const total = sumEssentialItems(items)

  function updateItem(id: string, patch: Partial<EssentialItem>) {
    onChange(items.map((it) => (it.id === id ? { ...it, ...patch } : it)))
  }

  function addItem(label = '') {
    onChange([...items, makeItem(label)])
  }

  function removeItem(id: string) {
    onChange(items.filter((it) => it.id !== id))
  }

  // Sugerencias que aún no están en la lista
  const usedLabels = new Set(
    items.map((it) => it.label.trim().toLowerCase()).filter(Boolean),
  )
  const remainingSuggestions = ESSENTIAL_SUGGESTIONS.filter(
    (s) => !usedLabels.has(s.toLowerCase()),
  )

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      {items.length > 0 && (
        <ul className="flex flex-col gap-2.5">
          {items.map((item) => (
            <li key={item.id} className="flex items-start gap-2">
              <div className="flex flex-1 flex-col gap-2 sm:flex-row">
                <input
                  value={item.label}
                  onChange={(e) => updateItem(item.id, { label: e.target.value })}
                  placeholder="Ej. Arriendo"
                  aria-label="Nombre del gasto"
                  className="h-12 w-full rounded-xl border border-input bg-card px-3 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground/50 focus:border-ring focus:ring-3 focus:ring-ring/20 sm:w-[45%]"
                />
                <MoneyInput
                  value={item.amount}
                  onChange={(v) => updateItem(item.id, { amount: v })}
                  placeholder="0"
                  className="flex-1"
                />
              </div>
              <button
                type="button"
                onClick={() => removeItem(item.id)}
                aria-label={`Eliminar ${item.label || 'gasto'}`}
                className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive"
              >
                <Trash2 className="size-4" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <button
        type="button"
        onClick={() => addItem()}
        className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-dashed border-border bg-card text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        <Plus className="size-4" />
        Agregar gasto
      </button>

      {remainingSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {remainingSuggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => addItem(s)}
              className="rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground transition-colors hover:bg-muted"
            >
              + {s}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between rounded-xl bg-secondary/60 px-4 py-3">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Total indispensable
        </span>
        <span className="font-serif text-xl tabular-nums text-foreground">
          {formatCLP(total)}
        </span>
      </div>
    </div>
  )
}

'use client'

import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { MoneyInput } from '@/components/ui/money-input'
import {
  ESSENTIAL_CATEGORY_LABEL,
  ESSENTIAL_SUGGESTIONS,
  type EssentialCategory,
} from '@/lib/finance'
import { cn } from '@/lib/utils'

const CATEGORIES = Object.keys(ESSENTIAL_CATEGORY_LABEL) as EssentialCategory[]

export function AddFixedExpenseDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (item: { label: string; amount: number; category: EssentialCategory }) => Promise<void>
}) {
  const [label, setLabel] = useState('')
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState<EssentialCategory>('otros')
  const [saving, setSaving] = useState(false)

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setLabel('')
        setAmount(0)
        setCategory('otros')
      }, 200)
      return () => clearTimeout(t)
    }
  }, [open])

  const valid = label.trim().length > 0 && amount > 0

  function handleLabelChange(value: string) {
    setLabel(value)
    const match = ESSENTIAL_SUGGESTIONS.find(
      (s) => s.label.toLowerCase() === value.trim().toLowerCase(),
    )
    if (match) setCategory(match.category)
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || saving) return
    setSaving(true)
    try {
      await onAdd({ label: label.trim(), amount, category })
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nuevo gasto fijo"
      description="Arriendo, cuentas, suscripciones: todo lo que pagas mes a mes."
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Nombre
          </span>
          <input
            type="text"
            value={label}
            autoFocus
            onChange={(e) => handleLabelChange(e.target.value)}
            placeholder="Ej. Arriendo"
            list="fixed-expense-suggestions"
            className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
          <datalist id="fixed-expense-suggestions">
            {ESSENTIAL_SUGGESTIONS.map((s) => (
              <option key={s.label} value={s.label} />
            ))}
          </datalist>
        </label>

        <div className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Monto mensual
          </span>
          <MoneyInput value={amount} onChange={setAmount} placeholder="0" />
        </div>

        <div className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Categoría
          </span>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  'rounded-full border px-3 py-1.5 text-xs font-medium transition-colors',
                  category === c
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted',
                )}
              >
                {ESSENTIAL_CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          className="mt-1 h-11 w-full"
          disabled={!valid || saving}
        >
          <Check className="size-4" />
          Agregar gasto fijo
        </Button>
      </form>
    </Modal>
  )
}

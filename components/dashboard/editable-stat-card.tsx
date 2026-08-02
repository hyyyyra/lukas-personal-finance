'use client'

import { Pencil } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { formatCLP, formatNumber, parseAmount } from '@/lib/finance'
import { cn } from '@/lib/utils'

/**
 * Tarjeta de estadística en el dashboard.
 * - Con `onSave`: un click activa edición inline (número) con guardado en blur/Enter.
 * - Sin `onSave` (`readOnly`): tarjeta puramente informativa, para valores derivados
 *   (ej. total de gastos fijos, que se administra ítem por ítem en el listado).
 */
export function EditableStatCard({
  icon,
  label,
  value,
  onSave,
}: {
  icon: React.ReactNode
  label: string
  value: number
  onSave?: (value: number) => Promise<void>
}) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!editing) setDraft(value)
  }, [value, editing])

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])

  async function commit() {
    if (!onSave || draft === value) {
      setEditing(false)
      setError(null)
      return
    }
    setSaving(true)
    setError(null)
    try {
      await onSave(draft)
      setEditing(false)
    } catch (err) {
      console.error('Error guardando valor:', err)
      setError('No se pudo guardar')
    } finally {
      setSaving(false)
    }
  }

  function cancel() {
    setDraft(value)
    setError(null)
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="rounded-2xl border border-ring bg-card p-3 ring-3 ring-ring/20">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
          {icon}
        </span>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <input
          ref={inputRef}
          inputMode="numeric"
          disabled={saving}
          value={draft ? formatNumber(draft) : ''}
          onChange={(e) => setDraft(parseAmount(e.target.value))}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit()
            if (e.key === 'Escape') cancel()
          }}
          onBlur={commit}
          className="mt-0.5 w-full bg-transparent text-sm font-semibold tabular-nums text-foreground outline-none disabled:opacity-50"
        />
        {error && <p className="mt-1 text-[10px] font-medium text-destructive">{error}</p>}
      </div>
    )
  }

  if (!onSave) {
    return (
      <div className="rounded-2xl border border-border bg-card p-3 text-left">
        <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
          {icon}
        </span>
        <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-foreground">
          {formatCLP(value)}
        </p>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      aria-label={`Editar ${label.toLowerCase()}`}
      className={cn(
        'group relative rounded-2xl border border-border bg-card p-3 text-left transition-colors',
        'hover:border-ring/50 hover:bg-muted/40 active:scale-[0.98]',
      )}
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-secondary text-primary">
        {icon}
      </span>
      <Pencil className="absolute right-2.5 top-2.5 size-3 text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/60" />
      <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 truncate text-sm font-semibold tabular-nums text-foreground">
        {formatCLP(value)}
      </p>
    </button>
  )
}

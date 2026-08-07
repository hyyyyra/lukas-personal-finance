'use client'

import { Check, Loader2, PiggyBank, Plus, Target, Trash2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { MoneyInput } from '@/components/ui/money-input'
import { formatCLP, type SavingsGoal } from '@/lib/finance'
import { cn } from '@/lib/utils'

export function SavingsGoals({
  goals,
  onAdd,
  onContribute,
  onRemove,
}: {
  goals: SavingsGoal[]
  onAdd: (name: string, target: number) => Promise<void>
  onContribute: (id: string, amount: number) => Promise<void>
  onRemove: (id: string) => Promise<void>
}) {
  const [newOpen, setNewOpen] = useState(false)
  const [contributeGoal, setContributeGoal] = useState<SavingsGoal | null>(null)
  const [removingId, setRemovingId] = useState<string | null>(null)

  async function handleRemove(id: string) {
    setRemovingId(id)
    try {
      await onRemove(id)
    } catch (error) {
      console.error(error)
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
          <Target className="size-4 text-primary" />
          Metas de ahorro
        </h3>
        <button
          type="button"
          onClick={() => setNewOpen(true)}
          aria-label="Crear meta de ahorro"
          className="flex size-7 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
        >
          <Plus className="size-3.5" />
        </button>
      </div>

      {goals.length === 0 ? (
        <button
          type="button"
          onClick={() => setNewOpen(true)}
          className="mt-3 w-full rounded-xl border border-dashed border-border px-4 py-4 text-center text-xs text-muted-foreground transition-colors hover:bg-muted"
        >
          Ponerle nombre a tu ahorro hace más fácil cumplirlo.{' '}
          <span className="font-semibold text-primary">Crea tu primera meta</span>
        </button>
      ) : (
        <ul className="mt-3 flex flex-col gap-3">
          {goals.map((goal) => {
            const pct = goal.target > 0 ? Math.min(100, (goal.saved / goal.target) * 100) : 0
            const remaining = Math.max(0, goal.target - goal.saved)
            const done = remaining === 0
            const isRemoving = removingId === goal.id
            return (
              <li key={goal.id} className={cn('transition-opacity', isRemoving && 'opacity-60')}>
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-sm font-medium text-foreground">
                    {goal.name}
                  </p>
                  <div className="flex shrink-0 items-center gap-1">
                    {!done && (
                      <button
                        type="button"
                        onClick={() => setContributeGoal(goal)}
                        disabled={isRemoving}
                        className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground transition-colors hover:bg-muted disabled:cursor-wait"
                      >
                        + Abonar
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemove(goal.id)}
                      disabled={isRemoving}
                      aria-label={`Eliminar meta ${goal.name}`}
                      className="flex size-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:cursor-wait"
                    >
                      {isRemoving ? (
                        <Loader2 className="size-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="size-3.5" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      done ? 'bg-accent' : 'bg-primary',
                    )}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  {formatCLP(goal.saved)} de {formatCLP(goal.target)} ·{' '}
                  {done ? (
                    <span className="inline-flex items-center gap-1 font-semibold text-accent">
                      <Check className="size-3" />
                      ¡Meta cumplida!
                    </span>
                  ) : (
                    <span>
                      Te faltan{' '}
                      <span className="font-medium text-foreground">
                        {formatCLP(remaining)}
                      </span>
                    </span>
                  )}
                </p>
              </li>
            )
          })}
        </ul>
      )}

      <NewGoalDialog
        open={newOpen}
        onClose={() => setNewOpen(false)}
        onAdd={onAdd}
      />
      <ContributeDialog
        goal={contributeGoal}
        onClose={() => setContributeGoal(null)}
        onContribute={onContribute}
      />
    </section>
  )
}

function NewGoalDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (name: string, target: number) => Promise<void>
}) {
  const [name, setName] = useState('')
  const [target, setTarget] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setName('')
        setTarget(0)
        setError(null)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [open])

  const valid = name.trim().length > 0 && target > 0

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid || saving) return
    setSaving(true)
    setError(null)
    try {
      await onAdd(name.trim(), target)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear la meta')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Nueva meta de ahorro"
      description="Un viaje, un fondo de emergencia, el pie de algo grande: dale un nombre y un monto."
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Nombre de la meta
          </span>
          <input
            type="text"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Vacaciones 2027"
            className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground/60 focus:border-ring focus:ring-3 focus:ring-ring/20"
          />
        </label>

        <div className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Monto objetivo
          </span>
          <MoneyInput value={target} onChange={setTarget} placeholder="500.000" />
        </div>

        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}

        <Button type="submit" size="lg" className="mt-1 h-11 w-full" disabled={!valid || saving}>
          <Check className="size-4" />
          Crear meta
        </Button>
      </form>
    </Modal>
  )
}

function ContributeDialog({
  goal,
  onClose,
  onContribute,
}: {
  goal: SavingsGoal | null
  onClose: () => void
  onContribute: (id: string, amount: number) => Promise<void>
}) {
  const [amount, setAmount] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!goal) {
      const t = setTimeout(() => {
        setAmount(0)
        setError(null)
      }, 200)
      return () => clearTimeout(t)
    }
  }, [goal])

  const remaining = goal ? Math.max(0, goal.target - goal.saved) : 0
  const valid = amount > 0

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!goal || !valid || saving) return
    setSaving(true)
    setError(null)
    try {
      await onContribute(goal.id, amount)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo registrar el abono')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Modal
      open={Boolean(goal)}
      onClose={onClose}
      title={goal ? `Abonar a “${goal.name}”` : 'Abonar'}
      description={
        goal
          ? `Llevas ${formatCLP(goal.saved)} y te faltan ${formatCLP(remaining)} para llegar.`
          : undefined
      }
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="block">
          <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
            Monto a abonar
          </span>
          <MoneyInput value={amount} onChange={setAmount} placeholder="50.000" autoFocus />
        </div>

        {error && (
          <p className="text-xs font-medium text-destructive">{error}</p>
        )}

        <Button type="submit" size="lg" className="mt-1 h-11 w-full" disabled={!valid || saving}>
          <PiggyBank className="size-4" />
          Registrar abono
        </Button>
      </form>
    </Modal>
  )
}

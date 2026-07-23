'use client'

import { Check, PiggyBank, Receipt, Wallet } from 'lucide-react'
import { useEffect, useState } from 'react'
import { EssentialsItemsEditor } from '@/components/dashboard/essentials-items-editor'
import { Button } from '@/components/ui/button'
import { Modal } from '@/components/ui/modal'
import { MoneyInput } from '@/components/ui/money-input'
import {
  type EssentialData,
  type EssentialItem,
  FIXED_BUDGET_PERIOD,
  formatCLP,
  monthlyDisposable,
  sumEssentialItems,
} from '@/lib/finance'

export function EditEssentialsDialog({
  open,
  onClose,
  essentials,
  onSave,
}: {
  open: boolean
  onClose: () => void
  essentials: EssentialData
  onSave: (data: EssentialData) => void
}) {
  const [data, setData] = useState<EssentialData>(essentials)

  // Sincroniza el formulario cada vez que se abre el modal
  useEffect(() => {
    if (open) setData({ ...essentials, budgetPeriod: FIXED_BUDGET_PERIOD })
  }, [open, essentials])

  const set = (patch: Partial<EssentialData>) =>
    setData((prev) => ({ ...prev, ...patch }))

  const setEssentialItems = (items: EssentialItem[]) =>
    setData((prev) => ({
      ...prev,
      essentialItems: items,
      essentialExpenses: sumEssentialItems(items),
    }))

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSave({ ...data, budgetPeriod: FIXED_BUDGET_PERIOD })
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar datos esenciales"
      description="Ajusta tus ingresos, gastos fijos y ahorro. Tu presupuesto se recalcula al instante."
    >
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Wallet className="size-3.5" />
            Ingresos mensuales
          </label>
          <MoneyInput
            value={data.monthlyIncome}
            onChange={(v) => set({ monthlyIncome: v })}
            placeholder="850.000"
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Receipt className="size-3.5" />
            Gastos indispensables
          </label>
          <EssentialsItemsEditor
            items={data.essentialItems}
            onChange={setEssentialItems}
          />
        </div>

        <div>
          <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <PiggyBank className="size-3.5" />
            Ahorro base mensual
          </label>
          <MoneyInput
            value={data.baseSavings}
            onChange={(v) => set({ baseSavings: v })}
            placeholder="100.000"
          />
        </div>

        <div className="rounded-2xl border border-border bg-secondary/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Periodo del presupuesto
          </p>
          <p className="mt-1 font-medium text-foreground">
            Vista mensual fija
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Este valor ya no se puede cambiar desde la app.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-secondary/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Disponible mensual estimado
          </p>
          <p className="mt-1 font-serif text-2xl text-foreground">
            {formatCLP(monthlyDisposable(data))}
          </p>
        </div>

        <Button type="submit" size="lg" className="mt-1 h-11 w-full">
          <Check className="size-4" />
          Guardar cambios
        </Button>
      </form>
    </Modal>
  )
}

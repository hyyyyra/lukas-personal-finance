'use client'

import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  Check,
  LogOut,
  PiggyBank,
  Receipt,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { EssentialsItemsEditor } from '@/components/dashboard/essentials-items-editor'
import { LukasLogo } from '@/components/lukas-logo'
import { Button } from '@/components/ui/button'
import { MoneyInput } from '@/components/ui/money-input'
import {
  DEFAULT_ESSENTIALS,
  type EssentialData,
  type EssentialItem,
  FIXED_BUDGET_PERIOD,
  formatCLP,
  monthlyDisposable,
  sumEssentialItems,
} from '@/lib/finance'
import { useLukas } from '@/lib/use-lukas-store'

export function OnboardingCarousel() {
  const { user, completeOnboarding, logout } = useLukas()
  const [step, setStep] = useState(0)
  const [data, setData] = useState<EssentialData>(DEFAULT_ESSENTIALS)

  const set = (patch: Partial<EssentialData>) =>
    setData((prev) => ({ ...prev, ...patch }))

  const setEssentialItems = (items: EssentialItem[]) =>
    setData((prev) => ({
      ...prev,
      essentialItems: items,
      essentialExpenses: sumEssentialItems(items),
    }))

  const steps = [
    {
      icon: <Wallet className="size-5" />,
      title: 'Cuanto ingresas al mes?',
      subtitle:
        'Suma tu sueldo y cualquier ingreso fijo que recibas mensualmente.',
      field: (
        <MoneyInput
          autoFocus
          value={data.monthlyIncome}
          onChange={(v) => set({ monthlyIncome: v })}
          placeholder="850.000"
        />
      ),
    },
    {
      icon: <Receipt className="size-5" />,
      title: 'Gastos indispensables',
      subtitle:
        'Detalla cada gasto que pagas si o si (arriendo, cuentas, transporte). Se sumaran en tu total.',
      field: (
        <EssentialsItemsEditor
          items={data.essentialItems}
          onChange={setEssentialItems}
        />
      ),
    },
    {
      icon: <PiggyBank className="size-5" />,
      title: 'Ahorro base mensual',
      subtitle:
        'Lo que quieres apartar cada mes antes de gastar. Puede ser $0.',
      field: (
        <MoneyInput
          autoFocus
          value={data.baseSavings}
          onChange={(v) => set({ baseSavings: v })}
          placeholder="100.000"
        />
      ),
    },
    {
      icon: <CalendarClock className="size-5" />,
      title: 'Vista mensual fija',
      subtitle:
        'Tu presupuesto se mostrara solo en formato mensual para mantenerlo simple.',
      field: (
        <div className="rounded-2xl border border-border bg-secondary/60 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Periodo del presupuesto
          </p>
          <p className="mt-1 text-sm font-medium text-foreground">Mensual</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Esta vista es fija y no se puede cambiar.
          </p>
        </div>
      ),
    },
  ]

  const isLast = step === steps.length - 1
  const current = steps[step]
  const disposable = monthlyDisposable(data)

  const userFirstName =
    user &&
    'name' in user &&
    typeof (user as Record<string, unknown>).name === 'string'
      ? (user as { name: string }).name.split(' ')[0]
      : undefined

  function next() {
    if (isLast) {
      completeOnboarding({ ...data, budgetPeriod: FIXED_BUDGET_PERIOD })
      return
    }
    setStep((s) => Math.min(s + 1, steps.length - 1))
  }

  function back() {
    setStep((s) => Math.max(s - 1, 0))
  }

  return (
    <main className="flex min-h-dvh flex-col bg-background px-5 py-8">
      <div className="mx-auto flex w-full max-w-md flex-1 flex-col">
        <header className="flex items-center justify-between">
          <LukasLogo showWordmark={false} />
          <span className="text-sm text-muted-foreground">
            Paso {step + 1} de {steps.length}
          </span>
        </header>

        <div className="mt-5 flex gap-1.5">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <div className="mt-10 flex flex-1 flex-col">
          <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-primary">
            {current.icon}
          </span>
          <h1 className="mt-5 text-balance font-serif text-3xl leading-tight text-foreground">
            {step === 0 && userFirstName
              ? `Hola, ${userFirstName}`
              : current.title}
          </h1>
          {step === 0 && userFirstName && (
            <p className="mt-1 font-serif text-xl text-muted-foreground">
              {current.title}
            </p>
          )}
          <p className="mt-2 text-pretty text-sm leading-relaxed text-muted-foreground">
            {current.subtitle}
          </p>

          <div className="mt-7">{current.field}</div>

          {isLast && (
            <div className="mt-6 rounded-2xl border border-border bg-secondary/60 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Presupuesto disponible estimado
              </p>
              <p className="mt-1 font-serif text-2xl text-foreground">
                {formatCLP(disposable)}
                <span className="ml-1 text-sm font-sans text-muted-foreground">
                  / mes
                </span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Ingresos menos gastos fijos y ahorro base.
              </p>
            </div>
          )}
        </div>

        <div className="mt-8 flex items-center gap-3">
          {step === 0 ? (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11"
              onClick={logout}
            >
              <LogOut className="size-4" />
              Salir
            </Button>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="h-11"
              onClick={back}
            >
              <ArrowLeft className="size-4" />
              Atras
            </Button>
          )}
          <Button
            type="button"
            size="lg"
            className="h-11 flex-1 text-sm"
            onClick={next}
          >
            {isLast ? 'Empezar a usar Lukas' : 'Continuar'}
            {isLast ? <Check className="size-4" /> : <ArrowRight className="size-4" />}
          </Button>
        </div>
      </div>
    </main>
  )
}

'use client'

import { formatNumber, parseAmount } from '@/lib/finance'
import { cn } from '@/lib/utils'

export function MoneyInput({
  value,
  onChange,
  placeholder = '0',
  autoFocus,
  className,
  id,
}: {
  value: number
  onChange: (v: number) => void
  placeholder?: string
  autoFocus?: boolean
  className?: string
  id?: string
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-1 rounded-xl border border-input bg-card px-4 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/20',
        className,
      )}
    >
      <span className="font-serif text-lg text-muted-foreground">$</span>
      <input
        id={id}
        inputMode="numeric"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={value ? formatNumber(value) : ''}
        onChange={(e) => onChange(parseAmount(e.target.value))}
        className="h-12 w-full bg-transparent text-lg font-medium tabular-nums text-foreground outline-none placeholder:text-muted-foreground/50"
      />
      <span className="text-sm font-medium text-muted-foreground">CLP</span>
    </div>
  )
}

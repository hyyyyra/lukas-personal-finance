'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { cn } from '@/lib/utils'

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
      />
      <div
        className={cn(
          'relative z-10 w-full max-w-md rounded-t-3xl bg-card p-6 shadow-xl ring-1 ring-border animate-in slide-in-from-bottom-4 sm:rounded-3xl',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            {title && (
              <h2 className="font-serif text-xl text-card-foreground">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-sm text-muted-foreground leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

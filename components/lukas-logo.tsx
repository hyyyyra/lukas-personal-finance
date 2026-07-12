import { cn } from '@/lib/utils'

export function LukasLogo({
  className,
  showWordmark = true,
}: {
  className?: string
  showWordmark?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2.5', className)}>
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
        <svg
          viewBox="0 0 24 24"
          className="size-5"
          fill="none"
          stroke="currentColor"
          strokeWidth={2.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 3v18" />
          <path d="M16.5 6.5c-1-1-2.6-1.5-4.5-1.5-2.8 0-5 1.2-5 3.2 0 2.2 2.4 2.9 5 3.4s5 1.2 5 3.4c0 2-2.2 3.2-5 3.2-1.9 0-3.5-.5-4.5-1.5" />
        </svg>
      </span>
      {showWordmark && (
        <span className="font-serif text-2xl leading-none tracking-tight text-foreground">
          Lukas
        </span>
      )}
    </div>
  )
}

'use client'

import {
  ArrowLeft,
  Camera,
  Check,
  ChevronRight,
  FileText,
  Keyboard,
  Loader2,
  ScanLine,
  Upload,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { MoneyInput } from '@/components/ui/money-input'
import {
  CATEGORY_LABEL,
  type Expense,
  type ExpenseCategory,
  type ExpenseMethod,
} from '@/lib/finance'
import { cn } from '@/lib/utils'

type View = 'select' | 'ocr' | 'archivo' | 'manual'

const CATEGORIES = Object.keys(CATEGORY_LABEL) as ExpenseCategory[]

// Datos simulados para el reconocimiento (solo capa visual)
const SAMPLE_SCANS = [
  { title: 'Supermercado Líder', amount: 34990, category: 'comida' as const },
  { title: 'Farmacia Ahumada', amount: 12450, category: 'salud' as const },
  { title: 'Copec bencina', amount: 25000, category: 'transporte' as const },
  { title: 'Café con amigos', amount: 8900, category: 'ocio' as const },
]

export function AddExpenseDialog({
  open,
  onClose,
  onAdd,
}: {
  open: boolean
  onClose: () => void
  onAdd: (expense: Omit<Expense, 'id' | 'createdAt'>) => void
}) {
  const [view, setView] = useState<View>('manual')

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setView('manual'), 200)
      return () => clearTimeout(t)
    }
  }, [open])

  function handleAdd(expense: Omit<Expense, 'id' | 'createdAt'>) {
    onAdd(expense)
    onClose()
  }

  const titles: Record<View, string> = {
    select: 'Registrar gasto',
    ocr: 'Escanear con cámara',
    archivo: 'Subir archivo',
    manual: 'Registrar nuevo gasto',
  }

  const descriptions: Record<View, string> = {
    select: 'Ingresa los detalles de tu movimiento.',
    ocr: 'Apunta la cámara a tu boleta o recibo.',
    archivo: 'Sube una imagen o PDF de tu comprobante.',
    manual: 'Detalla la información de tu movimiento para mantener al día tus finanzas.',
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={titles[view]}
      description={descriptions[view]}
    >
      {view === 'select' && <MethodSelect onSelect={setView} />}
      {view === 'ocr' && <OcrView onConfirm={handleAdd} />}
      {view === 'archivo' && <FileView onConfirm={handleAdd} />}
      {view === 'manual' && <ManualView onConfirm={handleAdd} method="manual" />}
    </Modal>
  )
}

function MethodSelect({ onSelect }: { onSelect: (v: View) => void }) {
  return (
    <div className="flex flex-col gap-3">
      {/* Método principal: OCR */}
      <button
        type="button"
        onClick={() => onSelect('ocr')}
        className="flex items-center gap-4 rounded-2xl border border-primary bg-primary p-4 text-left text-primary-foreground transition-transform active:scale-[0.99]"
      >
        <span className="flex size-11 items-center justify-center rounded-xl bg-primary-foreground/15">
          <Camera className="size-5" />
        </span>
        <span className="flex-1">
          <span className="block text-sm font-semibold">Escanear boleta</span>
          <span className="block text-xs text-primary-foreground/80">
            Reconocimiento por cámara (OCR)
          </span>
        </span>
        <ChevronRight className="size-5 text-primary-foreground/80" />
      </button>

      <SecondaryMethod
        icon={<Upload className="size-5" />}
        title="Subir archivo"
        subtitle="Imagen o PDF de tu comprobante"
        onClick={() => onSelect('archivo')}
      />
      <SecondaryMethod
        icon={<Keyboard className="size-5" />}
        title="Ingresar manualmente"
        subtitle="Escribe título y monto"
        onClick={() => onSelect('manual')}
      />
    </div>
  )
}

function SecondaryMethod({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode
  title: string
  subtitle: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4 text-left transition-colors hover:bg-muted"
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-secondary text-foreground">
        {icon}
      </span>
      <span className="flex-1">
        <span className="block text-sm font-semibold text-foreground">
          {title}
        </span>
        <span className="block text-xs text-muted-foreground">{subtitle}</span>
      </span>
      <ChevronRight className="size-5 text-muted-foreground" />
    </button>
  )
}

function OcrView({
  onConfirm,
}: {
  onConfirm: (e: Omit<Expense, 'id' | 'createdAt'>) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [cameraError, setCameraError] = useState(false)
  const [detected, setDetected] =
    useState<(typeof SAMPLE_SCANS)[number] | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch {
        setCameraError(true)
      }
    }
    start()
    return () => {
      stream?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  function capture() {
    setStatus('scanning')
    // Simulación del procesamiento OCR (solo capa visual)
    setTimeout(() => {
      const sample =
        SAMPLE_SCANS[Math.floor(Math.random() * SAMPLE_SCANS.length)]
      setDetected(sample)
      setStatus('done')
    }, 1600)
  }

  if (status === 'done' && detected) {
    return (
      <ManualView
        method="ocr"
        initial={detected}
        onConfirm={onConfirm}
        confirmLabel="Confirmar gasto"
        banner="Datos detectados automáticamente. Puedes ajustarlos."
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-foreground/90">
        {!cameraError ? (
          <video
            ref={videoRef}
            playsInline
            muted
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-2 px-6 text-center text-primary-foreground">
            <Camera className="size-8 opacity-80" />
            <p className="text-sm opacity-90">
              No pudimos acceder a la cámara. Puedes simular un escaneo igual.
            </p>
          </div>
        )}

        {/* Marco guía */}
        <div className="pointer-events-none absolute inset-6 rounded-xl border-2 border-primary-foreground/70" />
        {status === 'scanning' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-foreground/50 text-primary-foreground">
            <Loader2 className="size-7 animate-spin" />
            <p className="text-sm">Reconociendo boleta…</p>
          </div>
        )}
      </div>

      <Button
        type="button"
        size="lg"
        className="h-11 w-full"
        onClick={capture}
        disabled={status === 'scanning'}
      >
        <ScanLine className="size-4" />
        {status === 'scanning' ? 'Procesando…' : 'Capturar y escanear'}
      </Button>
    </div>
  )
}

function FileView({
  onConfirm,
}: {
  onConfirm: (e: Omit<Expense, 'id' | 'createdAt'>) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [status, setStatus] = useState<'idle' | 'scanning' | 'done'>('idle')
  const [fileName, setFileName] = useState('')
  const [detected, setDetected] =
    useState<(typeof SAMPLE_SCANS)[number] | null>(null)

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    setStatus('scanning')
    setTimeout(() => {
      const sample =
        SAMPLE_SCANS[Math.floor(Math.random() * SAMPLE_SCANS.length)]
      setDetected(sample)
      setStatus('done')
    }, 1600)
  }

  if (status === 'done' && detected) {
    return (
      <ManualView
        method="archivo"
        initial={detected}
        onConfirm={onConfirm}
        confirmLabel="Confirmar gasto"
        banner={`Extraído de “${fileName}”. Puedes ajustarlo.`}
      />
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={status === 'scanning'}
        className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-6 text-center transition-colors hover:bg-secondary disabled:opacity-70"
      >
        {status === 'scanning' ? (
          <>
            <Loader2 className="size-7 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">Analizando archivo…</p>
          </>
        ) : (
          <>
            <span className="flex size-12 items-center justify-center rounded-full bg-card text-primary">
              <FileText className="size-6" />
            </span>
            <p className="text-sm font-medium text-foreground">
              Toca para elegir un archivo
            </p>
            <p className="text-xs text-muted-foreground">
              Imágenes (JPG, PNG) o documentos PDF
            </p>
          </>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*,application/pdf"
        onChange={onFile}
        className="hidden"
      />
    </div>
  )
}

function ManualView({
  onConfirm,
  method,
  initial,
  confirmLabel = 'Agregar gasto',
  banner,
}: {
  onConfirm: (e: Omit<Expense, 'id' | 'createdAt'>) => void
  method: ExpenseMethod
  initial?: { title: string; amount: number; category: ExpenseCategory }
  confirmLabel?: string
  banner?: string
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [amount, setAmount] = useState(initial?.amount ?? 0)
  const [category, setCategory] = useState<ExpenseCategory>(
    initial?.category ?? 'otros',
  )

  const valid = title.trim().length > 0 && amount > 0

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!valid) return
    onConfirm({ title: title.trim(), amount, category, method })
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      {banner && (
        <div className="flex items-start gap-2 rounded-xl bg-accent/12 px-3 py-2.5 text-xs text-foreground">
          <Check className="mt-0.5 size-3.5 shrink-0 text-accent" />
          <span>{banner}</span>
        </div>
      )}

      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Título
        </span>
        <input
          type="text"
          value={title}
          autoFocus={!initial}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ej: Almuerzo, Supermercado…"
          className="h-12 w-full rounded-xl border border-input bg-card px-4 text-sm text-foreground outline-none focus:border-ring focus:ring-3 focus:ring-ring/20 placeholder:text-muted-foreground/60"
        />
      </label>

      <div className="block">
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Monto
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
              {CATEGORY_LABEL[c]}
            </button>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        size="lg"
        className="mt-1 h-11 w-full"
        disabled={!valid}
      >
        <Check className="size-4" />
        {confirmLabel}
      </Button>
    </form>
  )
}

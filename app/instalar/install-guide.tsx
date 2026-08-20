'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Copy,
  Download,
  EllipsisVertical,
  Info,
  Layers,
  Maximize,
  Search,
  Share,
  Smartphone,
  SquarePlus,
  Trash2,
  Zap,
} from 'lucide-react'
import { LukasLogo } from '@/components/lukas-logo'
import { cn } from '@/lib/utils'

type Platform = 'ios' | 'android'

// Paso numerado del instructivo
function Step({
  n,
  title,
  children,
}: {
  n: number
  title: React.ReactNode
  children?: React.ReactNode
}) {
  return (
    <li className="flex gap-3.5 rounded-2xl border border-border bg-card p-4 shadow-sm">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-semibold tabular-nums text-primary-foreground">
        {n}
      </span>
      <div className="min-w-0 pt-0.5">
        <h3 className="font-semibold leading-snug text-foreground">{title}</h3>
        {children}
      </div>
    </li>
  )
}

// Recuadro que reproduce el elemento real de la interfaz que hay que tocar
function Cue({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mt-3 rounded-xl border border-border bg-secondary p-3">
      <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      {children}
    </div>
  )
}

export function InstallGuide() {
  const [platform, setPlatform] = useState<Platform>('ios')

  return (
    <main className="min-h-dvh bg-background px-5 pb-16 pt-8 text-foreground">
      <div className="mx-auto max-w-xl">
        {/* Encabezado */}
        <header className="mb-8 flex items-center justify-between gap-3">
          <LukasLogo />
          <span className="text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground">
            Guía de instalación
          </span>
        </header>

        <h1 className="mb-3 text-balance font-serif text-4xl leading-[1.08] tracking-tight">
          Deja Lukas <span className="text-primary">en tu pantalla de inicio</span>
        </h1>
        <p className="mb-8 max-w-prose text-muted-foreground">
          Instálala en dos toques y ábrela como cualquier app: a pantalla
          completa, sin la barra del navegador y con su propio ícono. No pasa
          por la tienda de apps.
        </p>

        {/* Selector de plataforma */}
        <div
          role="tablist"
          aria-label="Elige tu teléfono"
          className="mb-6 flex gap-1.5 rounded-2xl border border-border bg-secondary p-1.5"
        >
          {(
            [
              ['ios', 'iPhone · Safari'],
              ['android', 'Android · Chrome'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              role="tab"
              aria-selected={platform === value}
              onClick={() => setPlatform(value)}
              className={cn(
                'flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors',
                platform === value
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              <Smartphone className="size-4" aria-hidden="true" />
              {label}
            </button>
          ))}
        </div>

        {/* Aviso clave por plataforma */}
        <div className="mb-6 flex items-start gap-2.5 rounded-xl border border-border bg-card p-3.5 text-sm text-muted-foreground">
          <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
          {platform === 'ios' ? (
            <p>
              En iPhone{' '}
              <strong className="text-foreground">tiene que ser Safari</strong>.
              Desde Chrome u otras apps la opción no aparece.
            </p>
          ) : (
            <p>
              Usa <strong className="text-foreground">Chrome</strong>. A veces
              aparece solo un aviso para instalar; si no, sigue los pasos.
            </p>
          )}
        </div>

        {/* Pasos */}
        {platform === 'ios' ? (
          <ol className="flex flex-col gap-3.5">
            <Step n={1} title="Abre Lukas en Safari">
              <p className="mt-1 text-sm text-muted-foreground">
                Escribe{' '}
                <strong className="text-foreground">
                  lukas-personal-finance.vercel.app
                </strong>{' '}
                en la barra de Safari y entra al sitio.
              </p>
            </Step>

            <Step n={2} title={<>Toca el botón «Compartir»</>}>
              <p className="mt-1 text-sm text-muted-foreground">
                Es el cuadrado con una flecha hacia arriba, en la barra de
                abajo (o arriba a la derecha).
              </p>
              <Cue label="Barra de Safari">
                <div className="flex items-center justify-between gap-1 rounded-lg border border-border bg-card px-3 py-2">
                  <ChevronLeft className="size-5 text-muted-foreground" aria-hidden="true" />
                  <ChevronRight className="size-5 text-muted-foreground" aria-hidden="true" />
                  <span className="rounded-lg bg-primary/10 p-1.5 ring-2 ring-primary">
                    <Share className="size-5 text-primary" aria-hidden="true" />
                  </span>
                  <Bookmark className="size-5 text-muted-foreground" aria-hidden="true" />
                  <Copy className="size-5 text-muted-foreground" aria-hidden="true" />
                </div>
              </Cue>
            </Step>

            <Step n={3} title={<>Elige «Agregar a inicio»</>}>
              <p className="mt-1 text-sm text-muted-foreground">
                Desliza el menú hacia abajo hasta encontrar la opción con el
                ícono de cuadrado y signo +.
              </p>
              <Cue label="Menú compartir">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 ring-2 ring-primary">
                  <SquarePlus className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    Agregar a inicio
                    <span className="block text-xs font-normal text-muted-foreground">
                      Add to Home Screen
                    </span>
                  </span>
                </div>
              </Cue>
            </Step>

            <Step n={4} title={<>Confirma con «Agregar»</>}>
              <p className="mt-1 text-sm text-muted-foreground">
                Verás el nombre <strong className="text-foreground">Lukas</strong>{' '}
                y su ícono. Toca{' '}
                <strong className="text-foreground">Agregar</strong> arriba a la
                derecha.
              </p>
            </Step>

            <Step n={5} title="¡Listo!">
              <p className="mt-1 text-sm text-muted-foreground">
                El ícono de Lukas queda en tu pantalla de inicio. Ábrelo desde
                ahí para usarlo a pantalla completa.
              </p>
            </Step>
          </ol>
        ) : (
          <ol className="flex flex-col gap-3.5">
            <Step n={1} title="Abre Lukas en Chrome">
              <p className="mt-1 text-sm text-muted-foreground">
                Entra a{' '}
                <strong className="text-foreground">
                  lukas-personal-finance.vercel.app
                </strong>{' '}
                desde el navegador Chrome.
              </p>
            </Step>

            <Step n={2} title={<>¿Aparece «Instalar app»? Tócalo</>}>
              <p className="mt-1 text-sm text-muted-foreground">
                Chrome suele mostrar un aviso abajo o arriba. Si lo ves, tócalo
                y salta al paso 4.
              </p>
              <Cue label="Aviso de Chrome">
                <div className="flex items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-2.5 ring-2 ring-primary">
                  <Download className="size-5 shrink-0 text-primary" aria-hidden="true" />
                  <span className="text-sm font-semibold">
                    Instalar app
                    <span className="block text-xs font-normal text-muted-foreground">
                      Agregar Lukas a tu teléfono
                    </span>
                  </span>
                  <ChevronRight
                    className="ml-auto size-4 shrink-0 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
              </Cue>
            </Step>

            <Step n={3} title={<>Si no aparece, abre el menú ⋮</>}>
              <p className="mt-1 text-sm text-muted-foreground">
                Toca los tres puntos arriba a la derecha y elige{' '}
                <strong className="text-foreground">Instalar aplicación</strong>{' '}
                o{' '}
                <strong className="text-foreground">
                  Agregar a pantalla principal
                </strong>
                .
              </p>
              <Cue label="Barra superior de Chrome">
                <div className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2">
                  <Search className="size-5 text-muted-foreground" aria-hidden="true" />
                  <span className="rounded-lg bg-primary/10 p-1.5 ring-2 ring-primary">
                    <EllipsisVertical className="size-5 text-primary" aria-hidden="true" />
                  </span>
                </div>
              </Cue>
            </Step>

            <Step n={4} title={<>Confirma «Instalar»</>}>
              <p className="mt-1 text-sm text-muted-foreground">
                Aparece una ventanita con el ícono de Lukas. Toca{' '}
                <strong className="text-foreground">Instalar</strong>.
              </p>
            </Step>

            <Step n={5} title="¡Listo!">
              <p className="mt-1 text-sm text-muted-foreground">
                El ícono de Lukas queda en tu pantalla de inicio (y en tu
                cajón de apps). Ábrelo desde ahí.
              </p>
            </Step>
          </ol>
        )}

        {/* Por qué instalarla */}
        <h2 className="mb-3.5 mt-10 text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground">
          Por qué instalarla
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {(
            [
              [Maximize, 'Pantalla completa', 'Sin la barra del navegador. Más espacio para tus lucas.'],
              [Zap, 'Un solo toque', 'Se abre directo desde tu inicio, como cualquier app.'],
              [Layers, 'Casi no ocupa', 'No es una descarga pesada ni pasa por la tienda de apps.'],
              [Trash2, 'Fácil de quitar', 'Si te arrepientes, la borras como cualquier otra app.'],
            ] as const
          ).map(([Icon, title, body]) => (
            <div key={title} className="rounded-2xl border border-border bg-card p-4">
              <Icon className="mb-2 size-5 text-primary" aria-hidden="true" />
              <p className="text-sm font-semibold">{title}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        {/* Dudas frecuentes */}
        <h2 className="mb-3.5 mt-10 text-[0.68rem] font-semibold uppercase tracking-widest text-muted-foreground">
          ¿Algo no calza?
        </h2>
        <div className="divide-y divide-border rounded-2xl border border-border bg-card px-4">
          {(
            [
              [
                'No veo «Agregar a inicio» en iPhone',
                'Asegúrate de estar en Safari (no Chrome). Dentro del menú Compartir, desliza hacia abajo: la opción está más abajo, junto a «Agregar a marcadores».',
              ],
              [
                'En Android no aparece «Instalar»',
                'Abre el menú ⋮ (tres puntos) arriba a la derecha y busca «Instalar aplicación» o «Agregar a pantalla principal». Si usas otro navegador, ábrela en Chrome.',
              ],
              [
                '¿Ocupa mucho espacio o gasta datos?',
                'No. Es la misma web, solo que con acceso directo. Pesa muy poco y una vez abierta carga rápido, incluso con señal débil.',
              ],
            ] as const
          ).map(([q, a]) => (
            <details key={q} className="group py-3.5">
              <summary className="flex cursor-pointer list-none items-center gap-2.5 text-sm font-semibold [&::-webkit-details-marker]:hidden">
                <CircleHelp className="size-4.5 shrink-0 text-primary" aria-hidden="true" />
                {q}
                <ChevronRight
                  className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-90"
                  aria-hidden="true"
                />
              </summary>
              <p className="mt-2 pl-7 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="mt-10 flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-3.5 font-semibold text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
        >
          Abrir Lukas
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>

        <footer className="mt-10 flex items-center gap-2.5 border-t border-border pt-6 text-sm text-muted-foreground">
          <Check className="size-4 text-primary" aria-hidden="true" />
          Lukas — Ordena tus lucas. Presupuesto mensual en pesos chilenos.
        </footer>
      </div>
    </main>
  )
}

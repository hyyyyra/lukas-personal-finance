import { ImageResponse } from 'next/og'

// Renderiza el icono PNG de la marca Lukas (signo peso sobre teal petroleo)
// para el manifest de la PWA. Reutiliza el mismo vector de app/icon.svg.
//
// - variante "any": tile con esquinas redondeadas, glifo grande.
// - variante "maskable": fondo teal a sangre completa y glifo dentro de la
//   zona segura (~60%) para que ningun recorte de Android lo corte.
//
// Carpeta con prefijo "_" => Next NO la trata como ruta.

const TEAL = '#1E6F7D'
const CREAM = '#F7F2E9'

function Mark({ dimension }: { dimension: number }) {
  return (
    <svg
      width={dimension}
      height={dimension}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g
        stroke={CREAM}
        strokeWidth="5.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M32 9v46" />
        <path d="M43.5 18.5c-2.6-2.6-6.7-3.9-11.5-3.9-7.2 0-12.8 3.1-12.8 8.2 0 5.6 6.1 7.4 12.8 8.7s12.8 3.1 12.8 8.7c0 5.1-5.6 8.2-12.8 8.2-4.8 0-8.9-1.3-11.5-3.9" />
      </g>
    </svg>
  )
}

export function renderIcon(size: number, maskable: boolean) {
  // maskable: glifo mas chico (zona segura). any: glifo grande + tile redondeado.
  const glyph = Math.round(size * (maskable ? 0.6 : 0.72))
  const radius = maskable ? 0 : Math.round(size * 0.22)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: TEAL,
          borderRadius: radius,
        }}
      >
        <Mark dimension={glyph} />
      </div>
    ),
    { width: size, height: size },
  )
}

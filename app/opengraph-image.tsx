import { ImageResponse } from 'next/og'

export const alt = 'Lukas — Ordena tus lucas. Presupuesto mensual claro, en pesos chilenos.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// Banner para compartir (WhatsApp, redes, Slack): marca + tagline + mockup
// de la barra de presupuesto. Muestra el producto en vez de describirlo.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#F7F2E9',
          padding: 72,
          fontFamily: 'sans-serif',
        }}
      >
        {/* Marca */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <div
            style={{
              width: 96,
              height: 96,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1E6F7D',
              borderRadius: 26,
            }}
          >
            <svg width="58" height="58" viewBox="0 0 64 64" fill="none">
              <g
                stroke="#F7F2E9"
                strokeWidth="5.4"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
              >
                <path d="M32 9v46" />
                <path d="M43.5 18.5c-2.6-2.6-6.7-3.9-11.5-3.9-7.2 0-12.8 3.1-12.8 8.2 0 5.6 6.1 7.4 12.8 8.7s12.8 3.1 12.8 8.7c0 5.1-5.6 8.2-12.8 8.2-4.8 0-8.9-1.3-11.5-3.9" />
              </g>
            </svg>
          </div>
          <div style={{ display: 'flex', fontSize: 72, fontWeight: 700, color: '#3A332B' }}>
            Lukas
          </div>
        </div>

        {/* Tagline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div
            style={{
              display: 'flex',
              fontSize: 92,
              fontWeight: 800,
              color: '#1E6F7D',
              letterSpacing: -3,
            }}
          >
            Ordena tus lucas
          </div>
          <div style={{ display: 'flex', fontSize: 38, color: '#6B6156' }}>
            Presupuesto mensual claro, en pesos chilenos. Sin conectar tu banco.
          </div>
        </div>

        {/* Mockup: barra de presupuesto (mostrar el producto) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 18,
            backgroundColor: '#FDFBF5',
            borderRadius: 28,
            border: '2px solid #E5DFD2',
            padding: '36px 44px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div style={{ display: 'flex', fontSize: 30, color: '#6B6156' }}>
              Presupuesto restante del mes
            </div>
            <div
              style={{
                display: 'flex',
                fontSize: 48,
                fontWeight: 800,
                color: '#3A332B',
              }}
            >
              $650.000
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              width: '100%',
              height: 22,
              backgroundColor: '#EAE4D6',
              borderRadius: 999,
            }}
          >
            <div
              style={{
                display: 'flex',
                width: '35%',
                height: 22,
                backgroundColor: '#1E6F7D',
                borderRadius: 999,
              }}
            />
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: 26,
              color: '#4CAE8F',
              fontWeight: 700,
            }}
          >
            <div style={{ display: 'flex' }}>Vas muy bien: solo has usado el 35%</div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                color: '#6B6156',
                fontWeight: 400,
              }}
            >
              Fijos pagados: 3 de 3
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="11" fill="#4CAE8F" />
                <path
                  d="M7 12.5l3.2 3.2L17 9"
                  stroke="#FDFBF5"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  )
}

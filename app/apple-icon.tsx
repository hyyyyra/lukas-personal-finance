import { ImageResponse } from 'next/og'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

// Ícono para iOS / accesos directos: la marca Lukas (signo peso sobre teal).
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1E6F7D',
          borderRadius: 40,
        }}
      >
        <svg
          width="110"
          height="110"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
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
    ),
    { ...size },
  )
}

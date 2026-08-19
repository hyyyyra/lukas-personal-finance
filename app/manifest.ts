import type { MetadataRoute } from 'next'

// Web App Manifest (App Router). Next enlaza automaticamente
// <link rel="manifest" href="/manifest.webmanifest"> a partir de este archivo.
// Colores e identidad tomados de la marca Lukas (teal petroleo + crema),
// consistentes con viewport.themeColor del layout y con --background del CSS.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Lukas — Ordena tus lucas',
    short_name: 'Lukas',
    description:
      'Presupuesto mensual en pesos chilenos: registra tus gastos, marca tus cuentas pagadas y avanza tus metas de ahorro.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    lang: 'es-CL',
    dir: 'ltr',
    background_color: '#f2ede3',
    theme_color: '#f2ede3',
    icons: [
      {
        src: '/icon-192',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-512',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icon-192-maskable',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icon-512-maskable',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

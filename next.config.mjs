import withPWAInit, { runtimeCaching } from '@ducanh2912/next-pwa'

const isDev = process.env.NODE_ENV === 'development'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

// @ducanh2912/next-pwa genera el service worker mediante un plugin de webpack
// (workbox). Next 16 usa Turbopack por defecto e ignora la config de webpack,
// por eso el build de produccion se corre con `next build --webpack`
// (ver package.json). En dev exportamos la config sin envolver: el SW queda
// deshabilitado y `next dev` sigue usando Turbopack sin advertencias.
const withPWA = withPWAInit({
  dest: 'public',
  disable: isDev,
  register: true,
  reloadOnOnline: true,
  cacheOnFrontEndNav: true,
  aggressiveFrontEndNavCaching: true,
  workboxOptions: {
    // Estrategias por defecto del fork: fuentes de Google, estaticos de
    // _next, imagenes, JS/CSS, datos de Next y navegaciones. Razonables para
    // una app de presupuesto que debe abrir rapido y funcionar offline-ish.
    runtimeCaching,
    disableDevLogs: true,
  },
})

export default isDev ? nextConfig : withPWA(nextConfig)

import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Fraunces, Inter } from 'next/font/google'
import { LukasProvider } from '@/lib/use-lukas-store'
import { GoogleAuthProvider } from '@/components/auth/google-auth-provider'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
})

const SITE_URL = 'https://lukas-personal-finance.vercel.app'
const TITLE = 'Lukas'
const DESCRIPTION =
  'Presupuesto mensual en pesos chilenos: registra tus gastos, marca tus cuentas pagadas y avanza tus metas de ahorro. Claro, rápido y sin conectar tu banco.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: '%s · Lukas',
  },
  description: DESCRIPTION,
  applicationName: 'Lukas',
  keywords: [
    'finanzas personales Chile',
    'presupuesto en pesos chilenos',
    'app de ahorro Chile',
    'control de gastos',
    'ordenar las lucas',
  ],
  openGraph: {
    type: 'website',
    locale: 'es_CL',
    url: SITE_URL,
    siteName: 'Lukas',
    title: TITLE,
    description:
      'Tu plata, clara: presupuesto mensual, gastos fijos al día y metas de ahorro. 100% en pesos chilenos.',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description:
      'Tu plata, clara: presupuesto mensual, gastos fijos al día y metas de ahorro. 100% en pesos chilenos.',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#f2ede3',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="es"
      className={`light bg-background ${inter.variable} ${fraunces.variable}`}
    >
      <body className="bg-background font-sans antialiased">
        <GoogleAuthProvider>
          <LukasProvider>{children}</LukasProvider>
        </GoogleAuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

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

export const metadata: Metadata = {
  title: 'Lukas · Finanzas personales',
  description:
    'Lukas te ayuda a gestionar tus finanzas personales de forma inteligente, en pesos chilenos.',
  generator: 'v0.app',
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

'use client'

import { LoginScreen } from '@/components/auth/login-screen'
import { HomeScreen } from '@/components/dashboard/home-screen'
import { LukasLogo } from '@/components/lukas-logo'
import { OnboardingCarousel } from '@/components/onboarding/onboarding-carousel'
import { useLukas } from '@/lib/use-lukas-store'

export default function Page() {
  const { hydrated, user, onboardingComplete } = useLukas()

  // Evita parpadeo mientras se lee la caché
  if (!hydrated) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background">
        <LukasLogo showWordmark={false} className="animate-pulse" />
        <span className="sr-only">Cargando Lukas…</span>
      </main>
    )
  }

  if (!user) return <LoginScreen />
  if (!onboardingComplete) return <OnboardingCarousel />
  return <HomeScreen />
}

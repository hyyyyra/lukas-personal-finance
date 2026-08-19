import { renderIcon } from '@/app/_pwa/render-icon'

// Icono 192x192 (purpose "any") referenciado por app/manifest.ts
export function GET() {
  return renderIcon(192, false)
}

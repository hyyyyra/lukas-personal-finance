import { renderIcon } from '@/app/_pwa/render-icon'

// Icono 512x512 (purpose "maskable") referenciado por app/manifest.ts
export function GET() {
  return renderIcon(512, true)
}

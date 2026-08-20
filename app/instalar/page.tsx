import type { Metadata } from 'next'
import { InstallGuide } from './install-guide'

// Pagina publica (sin login): manual para agregar Lukas a la pantalla
// de inicio en iPhone (Safari) y Android (Chrome). Pensada para
// compartirse por WhatsApp / Instagram.
export const metadata: Metadata = {
  title: 'Instala la app',
  description:
    'Agrega Lukas a la pantalla de inicio de tu celular en dos toques: paso a paso para iPhone (Safari) y Android (Chrome).',
}

export default function InstalarPage() {
  return <InstallGuide />
}

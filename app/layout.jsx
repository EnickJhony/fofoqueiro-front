import './globals.css'
import { Analytics } from "@vercel/analytics/next"

export const metadata = {
  title: 'Fofoqueiro Amazonas',
  description: 'App frontend básico em Next.js com Tailwind',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
      <Analytics />
    </html>
  )
}

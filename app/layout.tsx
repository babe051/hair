import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Le Village Numérique Résistant',
  description: 'Educational site about resisting Big Tech dependence in schools',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}


import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Plus_Jakarta_Sans, Bricolage_Grotesque } from 'next/font/google'
import { StoreProvider } from '@/lib/store'
import { CartProvider } from '@/lib/cart'
import './globals.css'

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Djassa — Ta boutique en ligne en 2 minutes',
  description:
    "Djassa transforme ton statut WhatsApp et ta bio Instagram en vraie boutique. Prix affichés, commandes claires, paiement Mobile Money (Wave, Orange, MTN, Moov). Fini le « prix en inbox ».",
  generator: 'Djassa CI',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#0f9d6b',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="fr"
      className={`light bg-background ${jakarta.variable} ${bricolage.variable}`}
    >
      <body className="font-sans antialiased">
        <StoreProvider>
          <CartProvider>{children}</CartProvider>
        </StoreProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}

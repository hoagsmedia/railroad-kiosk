import type { Metadata } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  weight: ['400', '600', '700'],
})

export const metadata: Metadata = {
  title: 'The Iron Road · HISTORY 109 Digital Kiosk',
  description:
    'Chronological digital kiosk: vision, decision, labor, engineering, Utah contract labor (1868), Promontory, and consequences of the first transcontinental railroad.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}>
      <body className="min-h-0 h-dvh max-h-dvh overflow-hidden flex items-center justify-center bg-[#0f0c0a] text-[#ede4d9] antialiased">
        {children}
      </body>
    </html>
  )
}

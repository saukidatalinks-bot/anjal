import { DM_Sans, Playfair_Display, DM_Mono } from 'next/font/google'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
})

export const metadata = {
  title: 'Anjal Ventures — Building Africa\'s Digital Infrastructure',
  description: 'Nigeria\'s premier technology solutions company delivering world-class web development, mobile apps, AI, SaaS and digital transformation services. Starting from $100.',
  keywords: 'web development Nigeria, mobile app development, AI solutions Africa, SaaS platform, Damaturu technology company',
  openGraph: {
    title: 'Anjal Ventures — Building Africa\'s Digital Infrastructure',
    description: 'Premium digital solutions for Nigerian SMEs, enterprises and institutions. CAC Registered.',
    type: 'website',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}>
      <body className="font-sans bg-white text-navy antialiased">
        {children}
      </body>
    </html>
  )
}

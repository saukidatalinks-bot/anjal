import { DM_Sans, Playfair_Display, DM_Mono } from 'next/font/google'
import '../globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-dm-sans' })
const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400','600','700','900'], style: ['normal','italic'], variable: '--font-playfair' })
const dmMono = DM_Mono({ subsets: ['latin'], weight: ['400','500'], variable: '--font-dm-mono' })

export const metadata = {
  title: 'Admin Panel — Anjal Ventures',
  robots: 'noindex, nofollow',
}

export default function AdminLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}>
      <body className="font-sans bg-slate-50 text-navy antialiased">
        {children}
      </body>
    </html>
  )
}

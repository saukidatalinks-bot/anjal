import { DM_Sans, Playfair_Display, DM_Mono } from 'next/font/google'
import Script from 'next/script'
import GoogleAnalytics from '@/components/GoogleAnalytics'
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
  keywords: 'web development Nigeria, mobile app development, AI solutions Africa, SaaS platform, Damaturu technology company, digital transformation, custom software',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Anjal Ventures',
  },
  formatDetection: {
    telephone: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1628' },
  ],
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  canonical: 'https://anjalventures.com',
  alternates: {
    canonical: 'https://anjalventures.com',
  },
  openGraph: {
    title: 'Anjal Ventures — Building Africa\'s Digital Infrastructure',
    description: 'Premium digital solutions for Nigerian SMEs, enterprises and institutions. CAC Registered. Web development, mobile apps, AI solutions.',
    type: 'website',
    url: 'https://anjalventures.com',
    siteName: 'Anjal Ventures',
    locale: 'en_NG',
    images: [
      {
        url: 'https://anjalventures.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anjal Ventures - Digital Infrastructure',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anjal Ventures — Building Africa\'s Digital Infrastructure',
    description: 'Premium digital solutions company. Web development, mobile apps, AI, SaaS. CAC Registered in Nigeria.',
    creator: '@anjalventures',
    images: ['https://anjalventures.com/og-image.png'],
  },
}

export default function RootLayout({ children }) {
  // Structured Data (JSON-LD)
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Anjal Ventures',
    url: 'https://anjalventures.com',
    logo: 'https://anjalventures.com/logo.png',
    description: 'Nigeria\'s premier technology solutions company delivering world-class web development, mobile apps, AI, SaaS and digital transformation services.',
    sameAs: [
      'https://facebook.com/anjalventures',
      'https://twitter.com/anjalventures',
      'https://linkedin.com/company/anjal-ventures',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressRegion: 'Yobe',
      addressLocality: 'Damaturu',
      streetAddress: 'Damaturu',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+234-8140011111',
      contactType: 'Customer Service',
      email: 'anjalventures@gmail.com',
    },
  }

  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}>
      <head>
        {/* Google Analytics */}
        <GoogleAnalytics />

        {/* Structured Data (JSON-LD) */}
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          strategy="afterInteractive"
        />

        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />

        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      </head>
      <body className="font-sans bg-white text-navy antialiased">
        {children}
      </body>
    </html>
  )
}

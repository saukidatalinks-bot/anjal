import { DM_Mono, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-dm-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-dm-mono',
})

export const metadata = {
  title: 'Anjal Solutions LTD - Enterprise Software and Digital Products',
  description: 'Anjal Solutions LTD (formerly Anjal Ventures) builds websites, mobile apps, SaaS platforms, and enterprise digital systems. Incorporated in Nigeria under CAMA 2020 (RC 9854225).',
  keywords: 'Anjal Solutions LTD, Anjal Ventures, web development Nigeria, mobile app development, Damaturu technology company, custom software, CAC 9854225, RC 9854225',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon.ico',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Anjal Solutions',
  },
  formatDetection: {
    telephone: false,
  },
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: {
    canonical: 'https://anjalsolutionsltd.com',
  },
  openGraph: {
    title: 'Anjal Solutions LTD - Enterprise Software and Digital Products',
    description: 'Custom software platforms, native mobile apps, SaaS architectures, and enterprise web solutions.',
    type: 'website',
    url: 'https://anjalsolutionsltd.com',
    siteName: 'Anjal Solutions LTD',
    locale: 'en_NG',
    images: [
      {
        url: 'https://anjalventures.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anjal Solutions LTD - Digital Product Studio',
        type: 'image/png',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anjal Solutions LTD - Enterprise Software and Digital Products',
    description: 'Custom software platforms, native mobile apps, SaaS architectures, and enterprise web solutions.',
    creator: '@anjalventures',
    images: ['https://anjalventures.com/og-image.png'],
  },
}

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0A1628' },
  ],
}

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Anjal Solutions LTD',
    alternateName: 'Anjal Ventures',
    url: 'https://anjalsolutionsltd.com',
    logo: 'https://anjalsolutionsltd.com/logo.png',
    description: 'Software development and digital solutions company building enterprise web platforms, mobile apps, and business systems.',
    sameAs: [
      'https://anjalventures.com',
      'https://facebook.com/anjalventures',
      'https://twitter.com/anjalventures',
      'https://linkedin.com/company/anjal-ventures',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressRegion: 'Yobe State',
      addressLocality: 'Damaturu',
      streetAddress: 'No. 4, Kolomi Ali Street, Njiwaji Layout Sabon Fegi',
    },
    identifier: [
      {
        '@type': 'PropertyValue',
        propertyID: 'CAC Registration',
        value: '9854225',
      },
      {
        '@type': 'PropertyValue',
        propertyID: 'Tax Identification Number',
        value: '2623598796685',
      },
    ],
    contactPoint: [
      {
        '@type': 'ContactPoint',
        contactType: 'General Inquiries and Client Relations',
        email: 'contact@anjalventures.com',
      },
      {
        '@type': 'ContactPoint',
        contactType: 'Corporate Office and Operations',
        email: 'office@anjalsolutionsltd.com',
      },
    ],
  }

  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <head>
        <GoogleAnalytics />
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          strategy="afterInteractive"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.google-analytics.com" />
      </head>
      <body className="bg-white font-sans text-slate-950 antialiased">
        {children}
      </body>
    </html>
  )
}

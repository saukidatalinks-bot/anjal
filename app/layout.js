import { DM_Mono, DM_Sans } from 'next/font/google'
import Script from 'next/script'
import GoogleAnalytics from '@/components/GoogleAnalytics'
import {
  officialEmails,
  officialPhone,
  registeredCacNumber,
  registeredDunsNumber,
  registeredOfficeAddress,
  registeredTinNumber,
} from '@/lib/company'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-dm-sans',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-dm-mono',
})

export const metadata = {
  metadataBase: new URL('https://www.anjalsolutionsltd.com'),
  title: 'Anjal Solutions LTD — Enterprise Software, Mobile Apps & Digital Infrastructure',
  description:
    'ANJAL SOLUTIONS LTD (RC 9854225, TIN 2623598796685, D-U-N-S 352297161) engineers custom web platforms, iOS & Android apps, restaurant & delivery systems, and cloud infrastructure.',
  keywords:
    'Anjal Solutions LTD, Anjal Developers, Sauki Go, Sauki Mart, Sauki Delivery, Anjal Academy, RC 9854225, D-U-N-S 352297161, Damaturu software engineering, Nigeria fintech mobile apps',
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
    statusBarStyle: 'default',
    title: 'Anjal Solutions LTD',
  },
  formatDetection: {
    telephone: false,
  },
  robots: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  alternates: {
    canonical: 'https://www.anjalsolutionsltd.com',
  },
  openGraph: {
    title: 'Anjal Solutions LTD — Enterprise Software & Digital Products',
    description:
      'Production web platforms, iOS & Android apps, restaurant & delivery systems, and cloud infrastructure built in Nigeria.',
    type: 'website',
    url: 'https://www.anjalsolutionsltd.com',
    siteName: 'Anjal Solutions LTD',
    locale: 'en_NG',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Anjal Solutions LTD — Enterprise Software & Digital Products',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anjal Solutions LTD — Enterprise Software & Digital Products',
    description:
      'Custom software engineering, mobile platforms, restaurant & delivery suites, and cloud systems.',
    images: ['/og-image.png'],
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
}

export default function RootLayout({ children }) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'ANJAL SOLUTIONS LTD',
    alternateName: ['Anjal Ventures', 'Sauki Data Links'],
    url: 'https://www.anjalsolutionsltd.com',
    logo: 'https://www.anjalsolutionsltd.com/logo.png',
    telephone: officialPhone,
    description:
      'Private Company Limited by Shares building enterprise web platforms, mobile apps, and operational software systems.',
    sameAs: ['https://www.anjalventures.com'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'NG',
      addressRegion: 'Yobe State',
      addressLocality: 'Damaturu',
      streetAddress: registeredOfficeAddress,
    },
    identifier: [
      { '@type': 'PropertyValue', propertyID: 'CAC Registration', value: `RC ${registeredCacNumber}` },
      { '@type': 'PropertyValue', propertyID: 'Tax Identification Number', value: registeredTinNumber },
      { '@type': 'PropertyValue', propertyID: 'D-U-N-S Number', value: registeredDunsNumber },
    ],
    contactPoint: [
      { '@type': 'ContactPoint', contactType: 'General Inquiries', email: officialEmails.general },
      { '@type': 'ContactPoint', contactType: 'Client Relations', email: officialEmails.secondary },
      { '@type': 'ContactPoint', contactType: 'Developer & Technical Support', email: officialEmails.developer },
    ],
  }

  return (
    <html lang="en" className={`${dmSans.variable} ${dmMono.variable}`}>
      <body className="min-h-screen bg-white font-sans text-slate-950 antialiased">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        {children}
        <GoogleAnalytics />
        <Script
          id="structured-data"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </body>
    </html>
  )
}

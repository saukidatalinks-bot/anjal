'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Mail, MapPin, Menu, MessageCircle, X } from 'lucide-react'
import { useState } from 'react'
import { normalizeCompanyAddress, normalizeCacNumber } from '@/lib/company'

const nav = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/app-studio', label: 'App Studio' },
  { href: '/quote', label: 'Quote' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader({ settings = {} }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-lg border border-slate-200 bg-white">
            <Image src="/logo.png" alt="Anjal Solutions LTD" fill className="object-contain p-1.5" />
          </span>
          <span className="min-w-0">
            <span className="flex items-center gap-2 flex-wrap">
              <span className="block text-sm font-bold tracking-normal text-slate-950">{settings.company_name || 'Anjal Solutions LTD'}</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600 border border-slate-200">
                (formerly Anjal Ventures)
              </span>
            </span>
            <span className="hidden text-xs text-slate-500 sm:block">Digital products and software engineering</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link href="/quote" className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 transition hover:border-slate-950">
            Start quote
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <button
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-800 lg:hidden"
          onClick={() => setOpen(v => !v)}
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden">
          <div className="grid gap-2">
            {nav.map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}

export function SiteFooter({ settings = {} }) {
  const whatsappNumber = settings.company_whatsapp || settings.company_phone || '2348164135836'
  const whatsappUrl = `https://wa.me/${String(whatsappNumber).replace(/[^0-9]/g, '')}`
  const address = normalizeCompanyAddress(settings.company_address)
  const cac = normalizeCacNumber(settings.company_cac)
  const tin = settings.company_tin || '2623598796685'

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 md:grid-cols-[1.05fr_.75fr_1fr] lg:px-8">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <span className="relative h-10 w-10 overflow-hidden rounded-lg bg-white">
              <Image src="/logo.png" alt="Anjal Solutions LTD" fill className="object-contain p-1.5" />
            </span>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-bold">{settings.company_name || 'Anjal Solutions LTD'}</p>
                <span className="text-[11px] text-white/50">(formerly Anjal Ventures)</span>
              </div>
              <p className="text-xs text-white/45">RC: {cac} · TIN: {tin}</p>
            </div>
          </div>
          <p className="max-w-md text-sm leading-6 text-white/60">
            {settings.footer_tagline || 'Dependable digital products from Damaturu to the world.'}
          </p>
          <div className="mt-4">
            <a
              href="/docs/certificate-anjal-solutions-ltd.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition"
            >
              <span>Verified Certificate of Incorporation (RC: {cac})</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Explore</p>
          <div className="grid gap-2 text-sm text-white/65">
            {nav.map(item => <Link key={item.href} href={item.href} className="hover:text-white">{item.label}</Link>)}
          </div>
        </div>

        <div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Official Communications</p>
          <div className="space-y-2.5 text-sm text-white/65">
            <a href={`mailto:${settings.company_email || 'contact@anjalventures.com'}`} className="flex items-center gap-2 rounded-lg transition hover:text-white">
              <Mail className="h-4 w-4 text-emerald-400" />
              <span>{settings.company_email || 'contact@anjalventures.com'}</span>
            </a>
            <a href={`mailto:${settings.company_email2 || 'office@anjalsolutionsltd.com'}`} className="flex items-center gap-2 rounded-lg transition hover:text-white">
              <Mail className="h-4 w-4 text-blue-400" />
              <span>{settings.company_email2 || 'office@anjalsolutionsltd.com'}</span>
            </a>
            <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
              <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/35">
                <MapPin className="h-4 w-4 text-emerald-300" />
                Registered office
              </div>
              <p className="text-sm leading-6 text-white/70">{address}</p>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-3 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              <MessageCircle className="h-4 w-4" />
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function PlatformShell({ settings, children }) {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <SiteHeader settings={settings} />
      {children}
      <SiteFooter settings={settings} />
    </div>
  )
}

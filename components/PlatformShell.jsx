'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowRight, FileCheck2, Mail, MapPin, Menu, MessageCircle, Phone, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import {
  certificateUrl,
  companyPreviousNameNotice,
  legalEntityType,
  managementSignoff,
  normalizeCacNumber,
  normalizeCompanyAddress,
  normalizeDunsNumber,
  normalizeTinNumber,
  officialEmails,
  officialPhone,
  officialWhatsapp,
} from '@/lib/company'

const NAV_LINKS = [
  { href: '/services', label: 'Services' },
  { href: '/work', label: 'Work' },
  { href: '/quote', label: 'Pricing & Quote' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export function SiteHeader({ settings = {} }) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [mobileOpen])

  const cac = normalizeCacNumber(settings.company_cac)
  const duns = normalizeDunsNumber(settings.company_duns)

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-5 py-3 lg:px-8">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-white shadow-2xs">
            <Image
              src="/logo-sm.webp"
              alt="Anjal Solutions LTD"
              width={40}
              height={40}
              priority
              className="h-9 w-9 object-contain"
            />
          </span>
          <span className="min-w-0">
            <span className="flex flex-wrap items-center gap-2">
              <span className="truncate text-sm font-bold tracking-tight text-slate-950">
                ANJAL SOLUTIONS LTD
              </span>
              <span className="hidden rounded-full border border-slate-200 bg-slate-50 px-2 py-0.5 font-mono text-[10px] font-medium text-slate-600 sm:inline-block">
                RC {cac} · D-U-N-S {duns}
              </span>
            </span>
            <span className="hidden text-xs text-slate-500 md:block">
              Enterprise software, mobile platforms & digital infrastructure
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== '/' && pathname?.startsWith(`${item.href}/`))
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition ${
                  active
                    ? 'bg-slate-950 text-white'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="hidden items-center gap-2.5 lg:flex">
          <Link
            href="/quote"
            className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            Request Quote
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-800 hover:bg-slate-100 lg:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-site-menu"
          aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-site-menu"
          aria-label="Mobile"
          className="border-t border-slate-200 bg-white px-5 py-4 lg:hidden"
        >
          <ul className="grid gap-1.5">
            {NAV_LINKS.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/' && pathname?.startsWith(`${item.href}/`))
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    onClick={() => setMobileOpen(false)}
                    className={`flex min-h-[44px] items-center rounded-xl px-4 py-2.5 text-sm font-semibold transition ${
                      active
                        ? 'bg-slate-950 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      )}
    </header>
  )
}

export function SiteFooter({ settings = {} }) {
  const whatsappNumber = settings.company_whatsapp || officialWhatsapp
  const whatsappUrl = `https://wa.me/${String(whatsappNumber).replace(/[^0-9]/g, '')}`
  const phone = settings.company_phone || officialPhone
  const address = normalizeCompanyAddress(settings.company_address)
  const cac = normalizeCacNumber(settings.company_cac)
  const tin = normalizeTinNumber(settings.company_tin)
  const duns = normalizeDunsNumber(settings.company_duns)
  const emailGeneral = settings.company_email || officialEmails.general
  const emailSecondary = settings.company_email2 || officialEmails.secondary
  const emailDev = settings.company_email3 || officialEmails.developer

  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.65fr_1fr]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">
                <Image
                  src="/logo-sm.webp"
                  alt="Anjal Solutions LTD"
                  width={40}
                  height={40}
                  loading="lazy"
                  className="h-9 w-9 object-contain"
                />
              </span>
              <div>
                <p className="text-base font-bold tracking-tight">ANJAL SOLUTIONS LTD</p>
                <p className="font-mono text-[11px] text-white/55">
                  RC {cac} | TIN {tin} | D-U-N-S {duns}
                </p>
              </div>
            </div>

            <p className="mt-4 max-w-lg text-sm leading-6 text-white/70">
              {legalEntityType}. {companyPreviousNameNotice}.
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center gap-2 rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-3.5 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-500/20"
              >
                <FileCheck2 className="h-4 w-4" aria-hidden="true" />
                Certificate of Incorporation (RC {cac})
              </a>
              <a
                href="https://www.anjalsolutionsltd.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                anjalsolutionsltd.com
              </a>
              <a
                href="https://www.anjalventures.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[40px] items-center rounded-lg border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-white/80 transition hover:bg-white/10"
              >
                anjalventures.com
              </a>
            </div>
          </div>

          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Navigation</p>
            <ul className="grid gap-2.5 text-sm text-white/70">
              {NAV_LINKS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="transition hover:text-white">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-sm text-white/75">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/40">
              Corporate Office & Direct Channels
            </p>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <p className="flex items-start gap-2.5 text-xs leading-5 text-white/75">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" aria-hidden="true" />
                <span>{address}</span>
              </p>
            </div>

            <div className="grid gap-2 text-xs">
              <a href={`mailto:${emailGeneral}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-sky-400" aria-hidden="true" />
                <span>General: {emailGeneral}</span>
              </a>
              <a href={`mailto:${emailSecondary}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-sky-400" aria-hidden="true" />
                <span>Partnerships: {emailSecondary}</span>
              </a>
              <a href={`mailto:${emailDev}`} className="flex items-center gap-2 hover:text-white">
                <Mail className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>Developer Support: {emailDev}</span>
              </a>
              <a href={`tel:${phone.replace(/\s+/g, '')}`} className="flex items-center gap-2 hover:text-white">
                <Phone className="h-4 w-4 text-emerald-400" aria-hidden="true" />
                <span>{phone}</span>
              </a>
            </div>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-emerald-300"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/50 md:flex-row md:items-center">
          <p>
            ANJAL SOLUTIONS LTD (RC {cac} | TIN {tin} | D-U-N-S {duns}) · © 2026 Anjal Solutions Ltd. All Rights Reserved.
          </p>
          <p className="font-mono text-white/60">{managementSignoff}</p>
        </div>
      </div>
    </footer>
  )
}

export default function PlatformShell({ settings, children }) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <SiteHeader settings={settings} />
      <main id="main-content" tabIndex={-1} className="flex-1 focus:outline-none">
        {children}
      </main>
      <SiteFooter settings={settings} />
    </div>
  )
}

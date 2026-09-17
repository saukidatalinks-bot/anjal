'use client'
import Image from 'next/image'
import { normalizeCompanyAddress } from '@/lib/company'

export function Footer({ settings = {} }) {
  const companyName = settings.company_name || 'Anjal Solutions LTD'
  const email1 = settings.company_email || 'contact@anjalventures.com'
  const email2 = settings.company_email2 || 'office@anjalsolutionsltd.com'
  const cac = (settings.company_cac || '9854225').replace(/^(BN|RC)\s*[:\-\s]?\s*/i, '')
  const tin = settings.company_tin || '2623598796685'
  const address = normalizeCompanyAddress(settings.company_address)
  const tagline = settings.footer_tagline || 'Dependable digital products from Damaturu to the world.'
  const whatsappNumber = settings.company_whatsapp || settings.company_phone || '2348164135836'
  const whatsappUrl = `https://wa.me/${String(whatsappNumber).replace(/[^0-9]/g, '')}`

  return (
    <footer className="bg-apple-dark border-t border-apple-light-secondary pt-16 pb-8">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 relative flex-shrink-0">
                <picture>
                  <source srcSet="/logo-dark.webp" type="image/webp" />
                  <Image src="/logo-dark.png" alt="Anjal Solutions LTD Logo" fill className="object-contain" onError={() => {}} />
                </picture>
              </div>
              <div>
                <span className="font-display font-bold text-xl text-white">
                  Anjal <span className="text-apple-blue">Solutions LTD</span>
                </span>
                <p className="text-[11px] text-white/50">(formerly Anjal Ventures)</p>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-6 max-w-sm">{tagline}</p>
            <div className="bg-apple-blue/10 border border-apple-blue/20 rounded-xl p-4">
              <p className="text-xs text-white/50 leading-relaxed">
                <span className="text-apple-blue font-semibold">CAC RC:</span> {cac} |{' '}
                <span className="text-apple-blue font-semibold">TIN:</span> {tin}<br />
                <span className="text-apple-blue font-semibold">Registered office:</span> {address}<br />
                Status: <span className="text-apple-blue font-semibold">ACTIVE (CAMA 2020)</span>
              </p>
              <div className="mt-3 pt-3 border-t border-apple-blue/20">
                <a
                  href="/docs/certificate-anjal-solutions-ltd.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-emerald-400 hover:text-emerald-300 underline font-medium inline-flex items-center gap-1"
                >
                  View CAC Certificate of Incorporation (PDF) →
                </a>
              </div>
            </div>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center justify-center rounded-lg bg-[#25D366] px-4 py-3 text-sm font-bold text-slate-950 transition-all hover:brightness-110"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div>
            <div className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Services</div>
            <ul className="space-y-3">
              {[
                ['Web Platforms & Cloud', '/services'],
                ['Native Mobile Apps', '/services'],
                ['Enterprise SaaS', '/services'],
                ['AI & Automations', '/services'],
                ['Interactive App Studio', '/app-studio'],
                ['Custom Scope Estimator', '/quote'],
              ].map(([label, href]) => (
                <li key={label}><a href={href} className="text-sm text-white/50 hover:text-apple-blue transition-colors">{label}</a></li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-xs font-bold text-white/35 uppercase tracking-widest mb-5">Company</div>
            <ul className="space-y-3">
              <li><a href="/about" className="text-sm text-white/50 hover:text-apple-blue transition-colors">About Us</a></li>
              <li><a href="/work" className="text-sm text-white/50 hover:text-apple-blue transition-colors">Portfolio & Case Studies</a></li>
              <li><a href="/quote" className="text-sm text-white/50 hover:text-apple-blue transition-colors">Quote Builder</a></li>
              <li><a href="/contact" className="text-sm text-white/50 hover:text-apple-blue transition-colors">Contact</a></li>
              <li><a href={`mailto:${email1}`} className="text-sm text-white/50 hover:text-apple-blue transition-colors">{email1}</a></li>
              <li><a href={`mailto:${email2}`} className="text-sm text-white/50 hover:text-apple-blue transition-colors">{email2}</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/35">Copyright 2026 Anjal Solutions LTD (formerly Anjal Ventures). All rights reserved. RC {cac}.</p>
          <div className="flex gap-6">
            <span className="text-xs text-white/25 cursor-pointer hover:text-apple-blue transition-colors">Terms & Conditions</span>
            <span className="text-xs text-white/25 cursor-pointer hover:text-apple-blue transition-colors">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export function WhatsAppButton({ settings = {} }) {
  const wa = settings.company_whatsapp || settings.company_phone || '2348164135836'
  const waUrl = `https://wa.me/${String(wa).replace(/[^0-9]/g, '')}`

  return (
    <a href={waUrl} target="_blank" rel="noopener noreferrer"
      className="fixed bottom-7 right-7 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all hover:scale-110 group"
      style={{ background: '#25D366', boxShadow: '0 4px 20px rgba(37,211,102,0.4)' }}
      title="Chat on WhatsApp">
      <div className="absolute right-16 bg-[#25D366] text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        Chat on WhatsApp
      </div>
      <svg viewBox="0 0 24 24" className="w-7 h-7 fill-white">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    </a>
  )
}

import Link from 'next/link'
import { ArrowRight, Building2, Check, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react'
import PlatformShell from '@/components/PlatformShell'
import { CtaBand } from '@/components/PlatformSections'
import {
  companyDisplayName,
  companyPreviousNameNotice,
  legacyVenturesRcNumber,
  legalEntityType,
  managementSignoff,
  officialEmails,
  officialPhone,
  officialWebsites,
  registeredCacNumber,
  registeredDunsNumber,
  registeredOfficeAddress,
  registeredTinNumber,
  smedanIdNumber,
} from '@/lib/company'
import { ECOSYSTEM_DIVISIONS, getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'About & Corporate Governance | Anjal Solutions LTD',
  description:
    'Official corporate profile of Anjal Solutions LTD (RC: 9854225 · TIN: 2623598796685 · D-U-N-S: 352297161), headquarters in Damaturu, Yobe State, Nigeria.',
}

export default async function AboutPage() {
  const { settings } = await getPlatformData()

  const cac = settings.company_cac || registeredCacNumber
  const tin = settings.company_tin || registeredTinNumber
  const duns = settings.company_duns || registeredDunsNumber
  const address = settings.company_address || registeredOfficeAddress

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{legalEntityType} · CAMA 2020</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Institutional software engineering built from Damaturu to the world.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-slate-300 sm:text-lg">
            {companyDisplayName} is a registered Nigerian software engineering and technology solutions company building mobile utilities, civic tools, enterprise web systems, and developer infrastructure.
          </p>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white py-14 lg:py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
          <div className="space-y-8">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">Corporate Heritage</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
                Corporate transition and unified operations.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                {companyDisplayName} operates as the incorporated successor consolidating the engineering, digital services, and product portfolio formerly operated under <strong className="font-semibold text-slate-900">Anjal Ventures</strong> (<span className="font-mono text-sm">{legacyVenturesRcNumber}</span>) and <strong className="font-semibold text-slate-900">Sauki Data Links</strong> (<span className="font-mono text-sm">SMEDAN ID: {smedanIdNumber}</span>).
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {companyPreviousNameNotice}. Every software platform, API gateway, and client contract is held under a unified corporate entity focused on speed, accountability, and long-term support.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-lg font-semibold text-slate-950">Ecosystem Portfolio</h3>
              <ul className="mt-4 space-y-3">
                {ECOSYSTEM_DIVISIONS.map(div => (
                  <li key={div.key} className="flex items-start justify-between gap-4 border-b border-slate-200/70 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{div.name}</p>
                      <p className="text-xs text-slate-600">{div.category}</p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                        div.status === 'COMING SOON'
                          ? 'border border-amber-300 bg-amber-50 text-amber-800'
                          : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {div.status}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-6">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-white sm:p-8">
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-400" aria-hidden="true" />
                <h2 className="text-lg font-semibold">Official Corporate Identifiers</h2>
              </div>

              <dl className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-400">Registered Name</dt>
                  <dd className="mt-1 font-semibold text-white">{companyDisplayName}</dd>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-slate-400">CAC Registration</dt>
                    <dd className="mt-1 font-mono text-white">RC: {cac}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-slate-400">Tax ID (TIN)</dt>
                    <dd className="mt-1 font-mono text-white">{tin}</dd>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-slate-400">D-U-N-S Number</dt>
                    <dd className="mt-1 font-mono text-emerald-300">{duns}</dd>
                  </div>
                  <div>
                    <dt className="text-xs uppercase tracking-wider text-slate-400">Legacy SMEDAN ID</dt>
                    <dd className="mt-1 font-mono text-xs text-slate-200">{smedanIdNumber}</dd>
                  </div>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400">
                    <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                    Registered Office Address
                  </dt>
                  <dd className="mt-1 text-slate-200">{address}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400">
                    <Phone className="h-3.5 w-3.5" aria-hidden="true" />
                    Telephone & WhatsApp
                  </dt>
                  <dd className="mt-1 font-mono text-white">{settings.company_phone || officialPhone}</dd>
                </div>
                <div>
                  <dt className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-slate-400">
                    <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                    Corporate Email Desks
                  </dt>
                  <dd className="mt-1 space-y-1 text-slate-200">
                    <div>{settings.company_email || officialEmails.general}</div>
                    <div>{settings.company_email2 || officialEmails.secondary}</div>
                    <div>{settings.company_email3 || officialEmails.developer}</div>
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-wider text-slate-400">Official Web Domains</dt>
                  <dd className="mt-1 space-y-1 font-mono text-xs text-blue-300">
                    {officialWebsites.map(url => (
                      <div key={url}>{url}</div>
                    ))}
                  </dd>
                </div>
              </dl>

              <p className="mt-6 border-t border-white/10 pt-4 font-mono text-xs text-slate-300">
                {managementSignoff}
              </p>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-900">Operating Guarantees</h3>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>Verified Nigerian corporate & D-U-N-S identity</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>Full code ownership handed cleanly upon completion</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>Transparent Naira commercials and direct engineer access</span>
                </li>
              </ul>
              <Link
                href="/contact"
                className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-slate-950"
              >
                Reach corporate office
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <CtaBand />
    </PlatformShell>
  )
}

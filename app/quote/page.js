import { ShieldCheck } from 'lucide-react'
import PlatformShell from '@/components/PlatformShell'
import QuoteBuilder from '@/components/QuoteBuilder'
import { registeredCacNumber, registeredDunsNumber, registeredTinNumber } from '@/lib/company'
import { getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'Instant Naira Quote & Proposal Builder | Anjal Solutions LTD',
  description:
    'Configure software platforms, turnkey Restaurant, Delivery, or E-Commerce suites in Nigerian Naira (₦) and download an official Anjal Solutions LTD PDF proposal.',
}

export default async function QuotePage({ searchParams }) {
  const { settings, calculator } = await getPlatformData()
  const initialPackage = typeof searchParams?.package === 'string' ? searchParams.package : ''

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-14 text-white lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 font-mono text-[11px] font-semibold uppercase tracking-wider text-emerald-300">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Nigerian Naira (₦) Commercial Estimator</span>
          </div>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Configure your platform & download a branded PDF quotation.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Every package is denominated directly in Nigerian Naira (₦), backed by {settings.company_name || 'Anjal Solutions LTD'} (RC: {settings.company_cac || registeredCacNumber} · TIN: {settings.company_tin || registeredTinNumber} · D-U-N-S: {settings.company_duns || registeredDunsNumber}).
          </p>
        </div>
      </section>

      <div className="bg-slate-50">
        <QuoteBuilder calculator={calculator} settings={settings} initialPackage={initialPackage} />
      </div>
    </PlatformShell>
  )
}

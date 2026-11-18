import PlatformShell from '@/components/PlatformShell'
import Contact from '@/components/Contact'
import { registeredCacNumber, registeredDunsNumber, registeredTinNumber } from '@/lib/company'
import { getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'Contact & Corporate Office | Anjal Solutions LTD',
  description:
    'Reach Anjal Solutions LTD in Damaturu, Yobe State via office@anjalsolutionsltd.com, WhatsApp +234 816 413 5836, or direct engineering inquiry.',
}

export default async function ContactPage() {
  const { settings, services } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-14 text-white lg:px-8 lg:py-16">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
            RC: {settings.company_cac || registeredCacNumber} · TIN: {settings.company_tin || registeredTinNumber} · D-U-N-S: {settings.company_duns || registeredDunsNumber}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Speak directly with our engineering & management desk.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300">
            Discuss custom software development, Restaurant & Delivery suites, mobile Store releases, or ICT training inquiries.
          </p>
        </div>
      </section>

      <div className="bg-slate-50">
        <Contact settings={settings} services={services} />
      </div>
    </PlatformShell>
  )
}

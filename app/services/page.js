import Link from 'next/link'
import { ArrowRight, Check, Code2, Cpu, Database, Lock, Server, Smartphone } from 'lucide-react'
import PlatformShell from '@/components/PlatformShell'
import { CtaBand, PricingBand, ProcessBand, ServicesGrid } from '@/components/PlatformSections'
import { getPlatformData } from '@/lib/platform-data'

export const revalidate = 300

export const metadata = {
  title: 'Services & Capabilities | Anjal Solutions LTD',
  description:
    'Anjal Developers custom software engineering, iOS & Android mobile apps, Restaurant & Delivery suites, ICT consulting, and structured API systems.',
}

const CAPABILITY_PILLARS = [
  {
    icon: Code2,
    title: 'Full-Stack Web Platforms',
    detail: 'Next.js App Router, React, Node.js, PostgreSQL (Neon), strict input validation, and sub-second CDN delivery.',
  },
  {
    icon: Smartphone,
    title: 'iOS & Android Mobile Apps',
    detail: 'Flutter production builds published on Apple App Store & Google Play with biometric auth and offline draft safety.',
  },
  {
    icon: Server,
    title: 'Turnkey Operations Suites',
    detail: 'Complete Restaurant Ordering, Delivery & Rider Logistics, and Multi-Vendor Commerce stacks in Nigerian Naira.',
  },
  {
    icon: Database,
    title: 'Structured Data & APIs',
    detail: 'Python FastAPI, SQLite FTS5 search engines, Draft 2020-12 JSON Schema validation, and automated HMAC webhooks.',
  },
  {
    icon: Cpu,
    title: 'Practical AI & Automation',
    detail: 'Cost-bounded intent parsing, Cloud Tasks delivery recovery, and deterministic human-in-the-loop tooling.',
  },
  {
    icon: Lock,
    title: 'Security & ICT Advisory',
    detail: 'JWT session governance, API rate protection, RBAC admin workflows, and upcoming Anjal Academy training.',
  },
]

export default async function ServicesPage() {
  const { settings, services, pricingPlans } = await getPlatformData()

  return (
    <PlatformShell settings={settings}>
      <section className="border-b border-slate-800 bg-slate-950 px-5 py-16 text-white lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-400">
            Anjal Developers · Engineering & Advisory
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Enterprise software engineering, turnkey suites, and reliable APIs.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
            We build production systems with clean documentation, full source-code ownership, and transparent Naira pricing for businesses, institutions, and high-growth operators.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
            >
              Configure a Naira Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white transition hover:border-white"
            >
              View Live Deployments
            </Link>
          </div>
        </div>
      </section>

      <ServicesGrid services={services} />

      <section className="cv-auto border-b border-slate-200 bg-slate-50 py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">Technical Depth</p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Core engineering pillars across every project.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {CAPABILITY_PILLARS.map(pillar => {
              const Icon = pillar.icon
              return (
                <article key={pillar.title} className="rounded-xl border border-slate-200 bg-white p-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{pillar.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{pillar.detail}</p>
                </article>
              )
            })}
          </div>

          <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 sm:p-8">
            <h3 className="text-lg font-semibold text-slate-950">Included in every commercial engagement</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[
                'Full Git source repository transfer',
                'Database schema & API docs',
                'Production cloud deployment',
                'Nigerian Naira commercial terms',
              ].map(item => (
                <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <Check className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <ProcessBand />
      <PricingBand pricingPlans={pricingPlans} />
      <CtaBand />
    </PlatformShell>
  )
}

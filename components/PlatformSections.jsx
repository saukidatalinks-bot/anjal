import Link from 'next/link'
import {
  ArrowRight,
  Briefcase,
  Check,
  Code2,
  Globe,
  GraduationCap,
  Landmark,
  Layers,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Store,
  Truck,
} from 'lucide-react'
import {
  companyDisplayName,
  registeredCacNumber,
  registeredDunsNumber,
  registeredOfficeAddress,
  registeredTinNumber,
} from '@/lib/company'
import { formatNaira } from '@/lib/format'
import { ECOSYSTEM_DIVISIONS } from '@/lib/platform-data'
import SaukiGoMark from '@/components/SaukiGoMark'
import ProjectStoreBadges from '@/components/StoreBadges'

const SERVICE_ICONS = {
  globe: Globe,
  smartphone: Smartphone,
  layers: Layers,
  briefcase: Briefcase,
  sparkles: Sparkles,
  'graduation-cap': GraduationCap,
}

const DIVISION_ICONS = {
  mynelfund: Landmark,
  'anjal-developers': Code2,
  'sauki-mart': Store,
  'sauki-delivery': Truck,
  'anjal-academy': GraduationCap,
}

export function SectionIntro({ eyebrow, title, description, align = 'left', dark = false }) {
  return (
    <div className={align === 'center' ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      {eyebrow && (
        <p className={`mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.22em] ${dark ? 'text-blue-400' : 'text-blue-700'}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`text-3xl font-semibold tracking-tight sm:text-4xl ${dark ? 'text-white' : 'text-slate-950'}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-3 text-base leading-relaxed ${dark ? 'text-slate-300' : 'text-slate-600'}`}>
          {description}
        </p>
      )}
    </div>
  )
}

export function Hero({ settings = {}, projects = [] }) {
  const cac = settings.company_cac || registeredCacNumber
  const tin = settings.company_tin || registeredTinNumber
  const duns = settings.company_duns || registeredDunsNumber

  return (
    <section className="relative overflow-hidden border-b border-slate-200 bg-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:48px_48px] opacity-35 [mask-image:radial-gradient(ellipse_75%_65%_at_50%_0%,#000_55%,transparent_100%)]"
      />
      <div className="relative mx-auto grid max-w-7xl gap-10 px-5 py-14 lg:grid-cols-[1.15fr_.85fr] lg:items-center lg:px-8 lg:py-20">
        <div>
          <div className="inline-flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3.5 py-1.5 font-mono text-[11px] font-medium text-slate-700">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
            <span>RC: {cac}</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span>TIN: {tin}</span>
            <span className="text-slate-300" aria-hidden="true">·</span>
            <span>D-U-N-S: {duns}</span>
          </div>

          <h1 className="mt-6 text-4xl font-semibold leading-[1.06] tracking-tight text-slate-950 sm:text-5xl lg:text-[3.5rem]">
            {settings.hero_title || 'Dependable software platforms built for real operations.'}
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            {settings.hero_description ||
              'Anjal Solutions LTD engineers production web systems, native iOS & Android applications, fintech infrastructure, and practical AI automation for growing enterprises.'}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Build a Naira Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950 hover:bg-slate-50"
            >
              Explore Shipped Products
            </Link>
          </div>

          <dl className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-200 pt-6">
            <div>
              <dt className="text-xs font-medium text-slate-500">Live Store Apps</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-slate-950 sm:text-2xl">iOS & Android</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Showcase Systems</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-slate-950 sm:text-2xl">{Math.max(projects.length, 6)} Platforms</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-slate-500">Handover Standard</dt>
              <dd className="mt-1 font-mono text-xl font-semibold text-slate-950 sm:text-2xl">100% Ownership</dd>
            </div>
          </dl>
        </div>

        {/* Corporate & Product Ledger */}
        <aside className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-white shadow-xl sm:p-7">
          <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-blue-400">Corporate Registry</p>
              <p className="mt-1 text-lg font-semibold tracking-tight text-white">{companyDisplayName}</p>
              <p className="mt-1 text-xs leading-relaxed text-slate-400">{settings.company_address || registeredOfficeAddress}</p>
            </div>
            <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 font-mono text-[10px] font-semibold uppercase tracking-wider text-emerald-300">
              Verified
            </span>
          </div>

          <div className="mt-5 space-y-3">
            <Link
              href="/work/sauki-go"
              className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-blue-500/50 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <SaukiGoMark className="h-9 w-9 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-white">Sauki Go</p>
                  <p className="text-xs text-slate-400">Mobile Data, Airtime & Electricity Utility</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                LIVE
              </span>
            </Link>

            <Link
              href="/work/mynelfund"
              className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-blue-500/50 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600/20 text-blue-300">
                  <Landmark className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">My NELFund</p>
                  <p className="text-xs text-slate-400">Play Store & App Store · TVC Featured</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                LIVE
              </span>
            </Link>

            <Link
              href="/work/anjal-islamic-library"
              className="group flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-blue-500/50 hover:bg-white/[0.06]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-200">
                  <Code2 className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Anjal Islamic Library API</p>
                  <p className="text-xs text-slate-400">Structured Quran, Hadith & Prayer Times API</p>
                </div>
              </div>
              <span className="shrink-0 rounded-full bg-emerald-500/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold text-emerald-300">
                LIVE
              </span>
            </Link>

            <div className="flex items-center justify-between gap-3 rounded-lg border border-dashed border-amber-400/30 bg-amber-500/[0.06] px-3.5 py-3">
              <div>
                <p className="text-xs font-semibold text-amber-200">Upcoming Ecosystem Rollout</p>
                <p className="text-[11px] text-amber-100/75">Sauki Mart · Sauki Delivery · Anjal Academy</p>
              </div>
              <span className="shrink-0 rounded-full bg-amber-400/20 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-amber-200">
                Coming Soon
              </span>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}

export function EcosystemBand({ divisions = ECOSYSTEM_DIVISIONS }) {
  return (
    <section className="cv-auto border-b border-slate-200 bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro
            eyebrow="Ecosystem & Divisions"
            title="Live digital products and upcoming operational platforms."
            description="Every system under Anjal Solutions LTD is categorized transparently—distinguishing live store products from platforms currently in pre-launch rollout."
          />
          <Link
            href="/about"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 underline-offset-4 hover:text-blue-700 hover:underline"
          >
            Corporate governance & history
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {divisions.map(item => {
            const isComingSoon = item.status === 'COMING SOON'
            const Icon = DIVISION_ICONS[item.key] || Layers

            return (
              <article
                key={item.key}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 transition hover:border-slate-300 hover:shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    {item.brandRule === 'saukigo-g-mark' ? (
                      <SaukiGoMark className="h-10 w-10" />
                    ) : (
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                          isComingSoon
                            ? 'border-amber-200 bg-amber-50 text-amber-700'
                            : 'border-slate-200 bg-slate-950 text-white'
                        }`}
                      >
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </div>
                    )}

                    <span
                      className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${
                        isComingSoon
                          ? 'border border-amber-300 bg-amber-50 text-amber-800'
                          : 'border border-emerald-200 bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <p className="mt-4 font-mono text-[11px] uppercase tracking-wider text-slate-500">{item.category}</p>
                  <h3 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{item.name}</h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-slate-600">{item.description}</p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4">
                  <p className="text-xs font-medium text-slate-500">{item.platforms}</p>
                  {(item.playStoreUrl || item.appStoreUrl) && (
                    <ProjectStoreBadges
                      playStoreUrl={item.playStoreUrl}
                      appStoreUrl={item.appStoreUrl}
                      compact
                      className="mt-3"
                    />
                  )}
                  <Link
                    href={item.href || '/work'}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-slate-950"
                  >
                    {isComingSoon ? 'Preview roadmap' : 'View details'}
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ServicesGrid({ services = [] }) {
  return (
    <section className="cv-auto border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro
            eyebrow="Capabilities · Anjal Developers"
            title="Software, suites, and technical advisory engineered for reliability."
            description="From custom enterprise portals and turnkey Naira business suites to structured JSON APIs and institutional training."
          />
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-950"
          >
            All engineering services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {services.map(service => {
            const Icon = SERVICE_ICONS[service.icon] || Globe
            const tags = Array.isArray(service.tags) ? service.tags : []

            return (
              <article
                key={service.id || service.name}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition hover:border-slate-300 hover:bg-white"
              >
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-950">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold tracking-tight text-slate-950">{service.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{service.description}</p>
                </div>

                {tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-1.5 border-t border-slate-200/70 pt-4">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="rounded-md border border-slate-200 bg-white px-2.5 py-0.5 font-mono text-[11px] font-medium text-slate-600"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function ProjectCard({ project }) {
  const media = Array.isArray(project.media) ? project.media : []
  const cover = media.find(m => m.is_primary) || media[0]
  const isComingSoon = String(project.status || '').toUpperCase().includes('COMING')
  const outcomes = Array.isArray(project.outcomes) ? project.outcomes : []
  const tags = Array.isArray(project.tags) ? project.tags : []
  const isSaukiGo = project.slug === 'sauki-go'

  return (
    <article className="flex flex-col justify-between overflow-hidden rounded-xl border border-slate-200 bg-white transition hover:border-slate-300 hover:shadow-md">
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-slate-200 bg-slate-950">
          {cover?.url ? (
            <img
              src={cover.url}
              alt={cover.alt || project.title}
              width={640}
              height={400}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover object-top"
            />
          ) : (
            <div className="flex h-full w-full flex-col justify-between bg-[linear-gradient(135deg,#091224_0%,#111e38_100%)] p-6 text-white">
              <span className="w-fit rounded-full border border-white/15 bg-white/10 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-200">
                {project.status || 'UPCOMING'}
              </span>
              <div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-blue-300">{project.industry}</p>
                <p className="mt-1 text-xl font-semibold tracking-tight">{project.title}</p>
              </div>
            </div>
          )}

          <div className="absolute left-3 top-3 flex items-center gap-2">
            <span
              className={`rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider shadow-sm ${
                isComingSoon
                  ? 'bg-amber-400 text-slate-950'
                  : 'bg-emerald-500 text-slate-950'
              }`}
            >
              {project.status || 'LIVE'}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-center gap-3">
            {isSaukiGo && <SaukiGoMark className="h-8 w-8 shrink-0" />}
            <div>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500">
                {project.industry || project.project_type}
              </p>
              <h3 className="text-xl font-semibold tracking-tight text-slate-950">{project.title}</h3>
            </div>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-slate-600">{project.summary || project.description}</p>

          {outcomes.length > 0 && (
            <ul className="mt-4 space-y-1.5 border-t border-slate-100 pt-4 text-xs text-slate-600">
              {outcomes.slice(0, 3).map(out => (
                <li key={out} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-600" aria-hidden="true" />
                  <span>{out}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 bg-slate-50/70 px-6 py-4">
        {(project.play_store_url || project.app_store_url) && (
          <ProjectStoreBadges
            playStoreUrl={project.play_store_url}
            appStoreUrl={project.app_store_url}
            compact
            className="mb-3"
          />
        )}

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="rounded border border-slate-200 bg-white px-2 py-0.5 font-mono text-[10px] text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
          <Link
            href={`/work/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-950 hover:text-blue-700"
          >
            Case study
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function ProjectGrid({
  projects = [],
  title = 'Selected systems and digital platforms',
  intro = 'Production applications, developer APIs, and upcoming rollouts built by Anjal Solutions LTD.',
  filter = 'all',
}) {
  const filtered = projects.filter(p => {
    if (filter === 'apps') return p.project_type === 'mobile-app'
    if (filter === 'websites') return p.project_type !== 'mobile-app'
    return true
  })

  return (
    <section className="cv-auto border-b border-slate-200 bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro eyebrow="Portfolio Ledger" title={title} description={intro} />
          <div className="flex flex-wrap gap-2">
            <Link
              href="/work"
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                filter === 'all' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              All ({projects.length})
            </Link>
            <Link
              href="/work/apps"
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                filter === 'apps' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              Mobile Apps
            </Link>
            <Link
              href="/work/websites"
              className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                filter === 'websites' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-400'
              }`}
            >
              Web & APIs
            </Link>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map(project => (
            <ProjectCard key={project.id || project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProcessBand() {
  const steps = [
    {
      num: '01',
      title: 'Architecture & Commercial Scope',
      body: 'Fixed Naira quotation, database schema design, API boundary mapping, and milestone delivery schedule before code begins.',
    },
    {
      num: '02',
      title: 'Production Engineering Sprints',
      body: 'Clean Next.js, Flutter, or FastAPI implementation with structured error recovery, offline tolerance, and weekly build checkpoints.',
    },
    {
      num: '03',
      title: 'Security, QA & Store Governance',
      body: 'Accessibility checks, Web Vitals optimization, payment webhook verification, and Apple App Store / Google Play compliance reviews.',
    },
    {
      num: '04',
      title: '100% Ownership & Continuity',
      body: 'Full transfer of source repositories, production cloud environments, documentation, and optional operational maintenance SLAs.',
    },
  ]

  return (
    <section className="cv-auto border-b border-slate-800 bg-slate-950 py-16 text-white lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionIntro
          dark
          eyebrow="Delivery Discipline"
          title="Built cleanly from architecture note to live production."
          description="Every client system follows verifiable milestones, documented code ownership, and predictable Naira commercials."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(step => (
            <div key={step.num} className="rounded-xl border border-white/10 bg-white/[0.03] p-6">
              <p className="font-mono text-xs font-semibold text-blue-400">{step.num}</p>
              <h3 className="mt-3 text-base font-semibold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function PricingBand({ pricingPlans = [] }) {
  return (
    <section className="cv-auto border-b border-slate-200 bg-slate-50 py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionIntro
            eyebrow="Transparent Naira Commercials"
            title="Clear starting packages and ready-to-launch suites in ₦."
            description="Choose a custom engagement tier or deploy a complete operational suite across web, mobile, and dispatch."
          />
          <Link
            href="/quote"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-slate-950"
          >
            Open interactive Naira calculator
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {pricingPlans.map(plan => {
            const features = Array.isArray(plan.features) ? plan.features : []
            const isFeatured = Boolean(plan.is_featured)
            const displayPrice = formatNaira(plan.price)

            return (
              <article
                key={plan.id || plan.name}
                className={`flex flex-col justify-between rounded-xl border p-6 transition ${
                  isFeatured
                    ? 'border-slate-950 bg-slate-950 text-white shadow-xl'
                    : 'border-slate-200 bg-white text-slate-950 hover:border-slate-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-lg font-semibold tracking-tight">{plan.name}</h3>
                    {isFeatured && (
                      <span className="rounded-full bg-blue-600 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-white">
                        Popular
                      </span>
                    )}
                  </div>

                  <p className={`mt-4 font-mono text-3xl font-bold tracking-tight ${isFeatured ? 'text-white' : 'text-slate-950'}`}>
                    {displayPrice}
                  </p>
                  {plan.price_note && (
                    <p className={`mt-2 text-xs leading-relaxed ${isFeatured ? 'text-slate-300' : 'text-slate-600'}`}>
                      {plan.price_note}
                    </p>
                  )}

                  <ul className={`mt-6 space-y-2.5 border-t pt-5 text-sm ${isFeatured ? 'border-white/10 text-slate-200' : 'border-slate-100 text-slate-700'}`}>
                    {features.map(feat => (
                      <li key={feat} className="flex items-start gap-2.5">
                        <Check
                          className={`mt-0.5 h-4 w-4 shrink-0 ${isFeatured ? 'text-emerald-400' : 'text-emerald-600'}`}
                          aria-hidden="true"
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={`/quote?package=${encodeURIComponent(plan.name)}`}
                  className={`mt-8 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-semibold transition ${
                    isFeatured
                      ? 'bg-white text-slate-950 hover:bg-blue-50'
                      : 'bg-slate-950 text-white hover:bg-blue-700'
                  }`}
                >
                  {plan.cta_text || `Request ${plan.name}`}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export function CtaBand() {
  return (
    <section className="cv-auto bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-8 rounded-2xl border border-slate-200 bg-slate-50 p-8 lg:grid-cols-[1fr_auto] lg:items-center lg:p-10">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
              Start a Verified Engagement
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Generate a formal Naira proposal or speak directly with engineering.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600 sm:text-base">
              Configure your system scope for an instant branded PDF estimate from {companyDisplayName}, or contact our Damaturu team for turnkey Restaurant, Delivery, E-Commerce, or custom builds.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Build Naira Quote
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition hover:border-slate-950"
            >
              Contact Office
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EstimateSummary({ total, totalNaira, label = 'Estimated Investment' }) {
  const nairaAmount = Number(totalNaira ?? total ?? 0)
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-slate-950">{formatNaira(nairaAmount)}</p>
      <p className="mt-1 text-xs text-slate-500">All figures denominated in Nigerian Naira (₦)</p>
    </div>
  )
}

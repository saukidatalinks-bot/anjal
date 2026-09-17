import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Code2,
  FileCheck,
  Globe2,
  Lock,
  Mail,
  MapPin,
  Scale,
  Server,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Zap,
} from 'lucide-react'
import PlatformShell from '@/components/PlatformShell'
import { CtaBand } from '@/components/PlatformSections'
import { getPlatformData } from '@/lib/platform-data'
import { normalizeCompanyAddress, normalizeCacNumber } from '@/lib/company'

export const metadata = {
  title: 'About Us & Corporate Governance - Anjal Solutions LTD',
  description:
    'About Anjal Solutions LTD (formerly Anjal Ventures). Incorporated Nigerian technology company (RC: 9854225, TIN: 2623598796685). Software engineering, web platforms, and mobile apps.',
}

const MANIFESTO_PILLARS = [
  {
    number: '01',
    title: 'Solid Engineering Over Shortcuts',
    tagline: 'We build systems meant to process real workloads day after day.',
    description:
      'Too many digital products look great on launch day but fall apart when actual customers start using them. At Anjal Solutions LTD, we write clean, tested, and maintainable code. We focus on database integrity, speed, and real-world stability so your business never gets held back by technical debt.',
  },
  {
    number: '02',
    title: 'Complete Client Ownership',
    tagline: 'You own your code, database, and designs. Zero vendor lock-in.',
    description:
      'When you commission a system with us, it belongs to you. We hand over your source code repositories, design files, database structures, and deployment guides. Your team can run it, audit it, or hand it to other engineers whenever you choose.',
  },
  {
    number: '03',
    title: 'Grounded Roots, Global Standards',
    tagline: 'Building dependable software from Damaturu, Yobe State.',
    description:
      'Operating from Damaturu in Northern Nigeria, we combine hands-on knowledge of regional business realities with international engineering benchmarks. We build digital infrastructure that works reliably across diverse network conditions in Nigeria, Africa, and international markets.',
  },
  {
    number: '04',
    title: 'Long-Term Reliability',
    tagline: 'Software built to run smoothly as your business grows.',
    description:
      'Good software is an operational backbone, not a one-off marketing exercise. We build with reliable database backups, clear logging, strong security practices, and sensible architectures that keep running month after month.',
  },
]

const OPERATING_PRINCIPLES = [
  {
    icon: Code2,
    title: 'Code Ownership',
    description: 'Clients receive full source code, database access, and documentation. You own the software you pay for.',
  },
  {
    icon: ShieldCheck,
    title: 'System Stability',
    description: 'Sensible data models, automated backups, and clear error recovery built in from day one.',
  },
  {
    icon: Sparkles,
    title: 'Clean, Practical Design',
    description: 'Clear layouts and straightforward user flows that help people complete tasks without confusion.',
  },
  {
    icon: Zap,
    title: 'Disciplined Delivery',
    description: 'Milestone-based progress, clear sprint goals, and continuous testing throughout the build.',
  },
  {
    icon: Lock,
    title: 'Built-in Security',
    description: 'Encrypted connections, protected credentials, isolated environments, and strict role permissions.',
  },
  {
    icon: Scale,
    title: 'Straightforward Communication',
    description: 'Transparent milestone pricing, clear timelines, honest technical advice, and no surprise charges.',
  },
]

const TECH_BENCHMARKS = [
  {
    category: 'Web Platforms & Interfaces',
    icon: Globe2,
    specs: [
      'Modern Next.js and React architecture with fast server rendering',
      'Fast page load times optimized for desktop and mobile devices',
      'Accessible typography, clear contrast, and intuitive navigation',
      'Clean component library built for effortless maintenance',
      'Proper search engine optimization (SEO) and social sharing previews',
    ],
  },
  {
    category: 'Backend & Data Storage',
    icon: Server,
    specs: [
      'Relational PostgreSQL databases with indexed queries and relationships',
      'Fast caching layers for frequent requests and queries',
      'Secure payment webhooks with cryptographic verification',
      'Audit logs for financial transactions and sensitive operations',
      'Automated database backups and failover protection',
    ],
  },
  {
    category: 'Mobile Applications',
    icon: Smartphone,
    specs: [
      'Cross-platform iOS and Android releases built with Flutter or React Native',
      'Full alignment with Apple App Store and Google Play guidelines',
      'Biometric login support (Face ID, Fingerprint)',
      'Offline-first data handling for low-connectivity environments',
      'Push notifications and release management pipelines',
    ],
  },
  {
    category: 'Security & Cloud Operations',
    icon: Shield,
    specs: [
      'Encrypted SSL/TLS communication on every endpoint',
      'Strict input sanitization, rate limiting, and CORS security policies',
      'Automated continuous integration and deployment (CI/CD) pipelines',
      'Edge content delivery network (CDN) caching for fast local delivery',
      'Real-time error monitoring and uptime alerting',
    ],
  },
]

export default async function AboutPage() {
  const { settings } = await getPlatformData()
  const cac = normalizeCacNumber(settings.company_cac)
  const tin = settings.company_tin || '2623598796685'
  const address = normalizeCompanyAddress(settings.company_address)
  const emailContact = settings.company_email || 'contact@anjalventures.com'
  const emailDev = settings.company_email2 || 'office@anjalsolutionsltd.com'

  return (
    <PlatformShell settings={settings}>
      {/* 1. Hero */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-slate-950 px-5 py-24 text-white lg:px-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-950/40 via-slate-950 to-slate-950" />
        <div className="relative mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wider text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Corporate Profile & Governance
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
              RC: {cac} · TIN: {tin}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              Damaturu HQ · Nigeria & Global
            </span>
          </div>

          <h1 className="mt-8 max-w-5xl text-4xl font-semibold leading-[1.08] tracking-tight md:text-6xl">
            Software engineering and digital solutions built for real operations.
          </h1>

          <p className="mt-8 max-w-3xl text-lg leading-relaxed text-white/80 md:text-xl">
            Anjal Solutions LTD (formerly Anjal Ventures) is an incorporated Nigerian technology company. We build dependable web platforms, mobile applications, and business systems for companies, public institutions, and growing teams across Africa and internationally.
          </p>

          {/* Institutional Credentials Ribbon */}
          <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { label: 'Corporate Registration', value: `RC #${cac}`, sub: 'Corporate Affairs Commission (CAMA 2020)' },
              { label: 'Company Structure', value: 'Private Ltd', sub: 'Limited by Shares' },
              { label: 'Tax Identification', value: `TIN #${tin}`, sub: 'Federal Inland Revenue Service' },
              { label: 'Registered Office', value: 'Damaturu, Yobe', sub: 'No. 4, Kolomi Ali Street' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-white/10 bg-white/[0.03] p-5 backdrop-blur transition hover:border-white/20 hover:bg-white/[0.06]"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-blue-400">{item.label}</div>
                <div className="mt-1.5 font-mono text-base font-bold text-white sm:text-lg">{item.value}</div>
                <div className="mt-1 text-xs text-white/50">{item.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Key Operational Metrics Strip */}
      <section className="border-b border-slate-200 bg-slate-50 px-5 py-8 lg:px-8">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 md:grid-cols-4">
          {[
            { metric: '40+', label: 'Delivered Projects', desc: 'Web applications, mobile apps, and business systems.' },
            { metric: '100%', label: 'Client Code Ownership', desc: 'Complete source code and database assets transferred.' },
            { metric: '99.9%', label: 'Target Uptime', desc: 'Built for continuous, reliable business use.' },
            { metric: '24h', label: 'Support Response', desc: 'Direct technical communication with engineering.' },
          ].map((item) => (
            <div key={item.label} className="border-l-2 border-slate-300 pl-4">
              <div className="text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">{item.metric}</div>
              <div className="mt-1 text-xs font-bold uppercase tracking-wider text-slate-900">{item.label}</div>
              <div className="mt-1 text-xs text-slate-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. The Studio Philosophy */}
      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Our Approach</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Software engineered to last, not quick prototypes.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              Businesses rely on software to handle payments, manage stock, coordinate teams, and serve customers. We design every system with the knowledge that downtime costs money, bad user experience loses customers, and messy code creates headaches down the line.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {MANIFESTO_PILLARS.map((pillar) => (
              <div
                key={pillar.number}
                className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50/50 p-8 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <span className="font-mono text-sm font-bold text-blue-700">{pillar.number}</span>
                    <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Pillar</span>
                  </div>
                  <h3 className="mt-5 text-2xl font-semibold tracking-tight text-slate-950">{pillar.title}</h3>
                  <p className="mt-2 text-sm font-semibold text-blue-900">{pillar.tagline}</p>
                  <p className="mt-4 text-sm leading-relaxed text-slate-600">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Institutional Governance & Verification Audit */}
      <section className="border-t border-slate-200 bg-slate-900 px-5 py-24 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-emerald-400">Corporate Governance</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-white md:text-5xl">
              Verified legal standing and corporate registration.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-white/70">
              When organizations, institutional clients, and international partners work with Anjal Solutions LTD, they engage with an incorporated and legally compliant Nigerian entity.
            </p>
          </div>

          <div className="mt-12 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/10 bg-white/[0.04] px-6 py-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-emerald-400" />
                  <span className="text-sm font-bold uppercase tracking-wider text-white">Public Corporate Record</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-mono text-emerald-300">Active and Verified</span>
                </div>
              </div>
            </div>

            <div className="divide-y divide-white/10">
              {[
                { label: 'Corporate Entity Name', value: 'Anjal Solutions LTD', detail: 'Formerly Anjal Ventures. Private Company Limited by Shares' },
                {
                  label: 'CAC Registration Number',
                  value: `RC ${cac}`,
                  detail: 'Corporate Affairs Commission, Federal Republic of Nigeria (CAMA 2020)',
                },
                {
                  label: 'Date of Incorporation',
                  value: 'September 13, 2026',
                  detail: 'Incorporated under the Companies and Allied Matters Act 2020',
                },
                {
                  label: 'Tax Identification Number (TIN)',
                  value: tin,
                  detail: 'Federal Inland Revenue Service (FIRS) active corporate tax ID',
                },
                {
                  label: 'Registered Corporate Office',
                  value: address,
                  detail: 'Official registered address in Damaturu, Yobe State, Nigeria',
                },
                {
                  label: 'General Inquiries',
                  value: emailContact,
                  detail: 'Client onboarding, project quotes, and corporate communications',
                },
                {
                  label: 'Engineering Inquiries',
                  value: emailDev,
                  detail: 'Technical scoping, API integrations, and developer relations',
                },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-1 gap-2 p-6 transition hover:bg-white/[0.02] md:grid-cols-3 md:items-center">
                  <div className="text-xs font-semibold uppercase tracking-wider text-white/50">{row.label}</div>
                  <div className="font-mono text-base font-bold text-white md:col-span-1">{row.value}</div>
                  <div className="text-xs text-white/60 md:text-right">{row.detail}</div>
                </div>
              ))}
            </div>

            {/* Document Verification Box */}
            <div className="border-t border-white/10 bg-white/[0.04] p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-6 w-6 text-emerald-400 shrink-0" />
                  <div>
                    <p className="text-sm font-bold text-white">Certificate of Incorporation</p>
                    <p className="text-xs text-white/50">Official Certificate issued by the Corporate Affairs Commission (RC 9854225)</p>
                  </div>
                </div>
                <a
                  href="/docs/certificate-anjal-solutions-ltd.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-4 py-2.5 text-xs font-bold text-slate-950 transition hover:bg-emerald-300"
                >
                  View Official Certificate (PDF)
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Engineering Standards & Technology Benchmarks */}
      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Engineering Standards</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Consistent technical quality on every build.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600">
              Whether building an enterprise web portal or a mobile application, we hold every deliverable to strict production standards.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {TECH_BENCHMARKS.map((benchmark) => (
              <div
                key={benchmark.category}
                className="rounded-2xl border border-slate-200 bg-slate-50/40 p-8 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <div className="flex items-center gap-3 border-b border-slate-200 pb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                    <benchmark.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-950">{benchmark.category}</h3>
                </div>

                <ul className="mt-6 space-y-3">
                  {benchmark.specs.map((spec, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Studio Operating Principles */}
      <section className="border-t border-slate-200 bg-slate-50 px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">How We Work</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 md:text-5xl">
              Six principles guiding our engineering and client relationships.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600">
              These principles guide how we structure code, communicate with clients, and deliver finished projects.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {OPERATING_PRINCIPLES.map((principle) => (
              <div
                key={principle.title}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
              >
                <div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
                    <principle.icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 text-lg font-semibold text-slate-950">{principle.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-slate-600 sm:text-sm">{principle.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Regional Presence */}
      <section className="bg-white px-5 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-blue-700">
                <MapPin className="h-3.5 w-3.5" />
                Damaturu Headquarters
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl md:text-5xl">
                Delivering high-quality digital solutions from Yobe State.
              </h2>
              <p className="mt-6 text-base leading-relaxed text-slate-600">
                Many growing businesses across Northern Nigeria still manage records and operations manually. We founded this studio to provide local businesses and institutions with direct access to modern, high-grade software engineering, while simultaneously delivering custom software to clients nationwide and abroad.
              </p>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                By maintaining lean, focused operations in Damaturu, we give our clients direct attention from experienced engineers and reliable long-term support.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-white transition hover:bg-slate-800"
                >
                  Explore Delivered Work
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-xs font-semibold uppercase tracking-wider text-slate-900 transition hover:bg-slate-50"
                >
                  Start a Project Quote
                </Link>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 lg:p-10">
              <h3 className="text-xs font-bold uppercase tracking-[0.22em] text-slate-500">Core Areas of Work</h3>
              <div className="mt-6 space-y-6">
                {[
                  {
                    title: 'Business Digitization & Web Platforms',
                    desc: 'Helping commercial, logistics, and retail businesses move from paper to automated web platforms.',
                  },
                  {
                    title: 'Institutional & Public Sector Portals',
                    desc: 'Building clear, secure registries and internal management tools for educational and institutional teams.',
                  },
                  {
                    title: 'Mobile Applications for Real Network Realities',
                    desc: 'Creating low-data, offline-resilient mobile applications that perform reliably on Android and iOS.',
                  },
                  {
                    title: 'Custom SaaS & Cloud Systems',
                    desc: 'Engineering multi-user web software with subscription billing, role permissions, and reporting.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="border-l-2 border-blue-600 pl-4">
                    <h4 className="text-sm font-bold text-slate-900">{item.title}</h4>
                    <p className="mt-1 text-xs leading-relaxed text-slate-600">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Call to Action Band */}
      <CtaBand settings={settings} />
    </PlatformShell>
  )
}

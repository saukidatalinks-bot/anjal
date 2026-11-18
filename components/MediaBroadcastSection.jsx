import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import ProjectStoreBadges from '@/components/StoreBadges'

export default function MediaBroadcastSection() {
  return (
    <section className="border-b border-slate-200 bg-slate-50 px-5 py-12 text-slate-950 lg:px-8 lg:py-14">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <img
              src="/images/tvc-news-logo.webp"
              alt="TVC News"
              width={104}
              height={30}
              loading="lazy"
              decoding="async"
              className="h-7 w-auto rounded bg-slate-950 px-2.5 py-1 object-contain"
            />
            <span className="font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">
              National Television Feature · My NELFund
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-semibold leading-snug tracking-tight text-slate-950 sm:text-3xl">
            Proven engineering recognized on national television and trusted by thousands of users.
          </h2>

          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-600 sm:text-base">
            During a live national broadcast on TVC News Breakfast, Anjal Solutions LTD presented My NELFund—our independent iOS and Android companion application built to simplify student loan eligibility verification and statutory repayment calculations across Nigeria. The same production standards power every commercial web, mobile, and payment platform we deliver for clients.
          </p>
        </div>

        <div className="flex flex-col items-start justify-between gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xs">
          <div className="flex items-center gap-3">
            <img
              src="/logos/nelfund-logo.webp"
              alt="NELFUND Student Loan Companion"
              width={140}
              height={42}
              loading="lazy"
              decoding="async"
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="w-full space-y-3 border-t border-slate-100 pt-4">
            <ProjectStoreBadges
              playStoreUrl="https://play.google.com/store/apps/details?id=com.mynelfund.app"
              appStoreUrl="https://apps.apple.com/ng/app/my-nelfund/id6809634284"
              compact
            />

            <Link
              href="/work/mynelfund"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-slate-950"
            >
              Read My NELFund case study
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

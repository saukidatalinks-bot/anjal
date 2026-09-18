import Link from 'next/link'
import { ArrowRight, ExternalLink, ShieldCheck, Sparkles, UserCheck } from 'lucide-react'

export default function MediaBroadcastSection() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 px-5 py-20 text-white lg:px-8">
      {/* Subtle ambient lighting */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/30 via-slate-950 to-slate-950 pointer-events-none" />

      <div className="relative mx-auto max-w-6xl">
        {/* Header Block */}
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2.5 text-xs font-semibold uppercase tracking-widest text-rose-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
            </span>
            <span>TVC News Broadcast · National Media Feature</span>
          </div>

          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
            NELFund Beneficiary Develops Student Loan Companion App
          </h2>

          <p className="mt-5 text-base leading-relaxed text-white/75 sm:text-lg">
            In a live national broadcast on TVC News Breakfast, Abdullahi Adam Usman (student at Ahmadu Bello University, Zaria and Co-Founder of Anjal Solutions LTD) discusses the motivation and engineering behind My NELFund. Built as an independent companion tool by an actual student beneficiary, the application helps Nigerian students understand the federal loan initiative, check their eligibility, and outline structured repayment plans.
          </p>
        </div>

        {/* Cinema Video Canvas */}
        <div className="mt-10 overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl shadow-blue-950/30 md:rounded-3xl">
          <div className="relative aspect-video w-full">
            <iframe
              className="absolute inset-0 h-full w-full"
              src="https://www.youtube-nocookie.com/embed/_WaaxLj82_A?si=Y9uXoW0cTRMtY_ZB"
              title="TVC News Breakfast: NELFund Beneficiary Develops App for Students"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
        </div>

        {/* Quiet Editorial Context Pillars */}
        <div className="mt-10 grid gap-6 border-t border-white/10 pt-10 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <UserCheck className="h-4 w-4 text-emerald-400" />
              <span>Lived Beneficiary Insight</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Developed by an active NELFund beneficiary to address real student questions, clarify documentation hurdles, and share practical knowledge across campuses.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <ShieldCheck className="h-4 w-4 text-blue-400" />
              <span>Independent Student Guidance</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              An independent informational companion providing eligibility checkers, institutional guidelines, and transparent repayment simulations without friction.
            </p>
          </div>

          <div>
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <Sparkles className="h-4 w-4 text-amber-400" />
              <span>Engineered for Production</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-white/60">
              Architected and engineered by Anjal Solutions LTD with modern mobile standards, clean performance, and an intuitive student-first interface.
            </p>
          </div>
        </div>

        {/* Restrained Action Row */}
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/work/mynelfund"
            className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-blue-50"
          >
            <span>Explore My NELFund Case Study</span>
            <ArrowRight className="h-4 w-4" />
          </Link>

          <a
            href="https://www.youtube.com/watch?v=_WaaxLj82_A"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
          >
            <span>Watch Full Segment on TVC News</span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}

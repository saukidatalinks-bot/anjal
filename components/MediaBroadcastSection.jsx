'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, ExternalLink, Play, X } from 'lucide-react'

export default function MediaBroadcastSection() {
  const [isOpen, setIsOpen] = useState(false)

  // Close modal on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIsOpen(false)
    }

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  return (
    <>
      <section className="relative overflow-hidden border-b border-white/10 bg-slate-950 px-5 py-12 text-white lg:px-8">
        {/* Subtle ambient lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-950/25 via-slate-950 to-slate-950 pointer-events-none" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:gap-12">
            {/* Left Content Column */}
            <div>
              {/* TVC News Logo replacing red dot badge */}
              <div className="flex items-center gap-3 mb-4">
                <div className="relative h-8 w-28 sm:h-9 sm:w-32 flex-shrink-0">
                  <Image
                    src="/images/tvc-news-logo.png"
                    alt="TVC News"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-white/50 border-l border-white/15 pl-3">
                  Broadcast Feature
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold leading-tight tracking-tight text-white">
                NELFund Beneficiary Develops Student Loan Companion App
              </h2>

              <p className="mt-3.5 text-sm sm:text-base text-white/70 leading-relaxed max-w-xl">
                In a live national broadcast on TVC News Breakfast, Abdullahi Adam Usman (student at Ahmadu Bello University, Zaria and Co-Founder of Anjal Solutions LTD) details My NELFund, an independent student loan companion app created to check eligibility and outline transparent repayment plans.
              </p>

              {/* Action Buttons */}
              <div className="mt-7 flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(true)}
                  className="inline-flex items-center gap-2.5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-blue-50 focus:outline-hidden"
                >
                  <Play className="h-4 w-4 fill-slate-950 text-slate-950" />
                  <span>Watch TVC News Interview</span>
                </button>

                <Link
                  href="/work/mynelfund"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
                >
                  <span>Explore Case Study</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Right Interactive Preview Card */}
            <div>
              <div
                role="button"
                tabIndex={0}
                onClick={() => setIsOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setIsOpen(true)
                  }
                }}
                className="group relative aspect-video w-full cursor-pointer overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-xl transition hover:border-white/30 hover:shadow-2xl"
              >
                <Image
                  src="/images/tvc-nelfund-broadcast.png"
                  alt="TVC News Breakfast: NELFund Beneficiary Develops App for Students"
                  fill
                  className="object-cover transition duration-300 group-hover:scale-105 opacity-85 group-hover:opacity-95"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

                {/* Centered Frosted Play Button */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white shadow-2xl backdrop-blur-md transition group-hover:scale-110 group-hover:bg-white group-hover:text-slate-950">
                    <Play className="ml-1 h-5 w-5 fill-current" />
                  </div>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/80">
                  <span className="font-semibold truncate">TVC News Breakfast Segment</span>
                  <span className="rounded-md bg-black/60 px-2 py-0.5 font-mono text-[11px] text-white/70">
                    Play Video
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Center Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/85 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-2xl border border-white/20 bg-slate-900 shadow-2xl md:rounded-3xl">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between border-b border-white/10 bg-slate-950 px-5 py-3.5 sm:px-6">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative h-6 w-20 flex-shrink-0">
                  <Image
                    src="/images/tvc-news-logo.png"
                    alt="TVC News"
                    fill
                    className="object-contain object-left"
                  />
                </div>
                <span className="text-xs font-medium text-white/70 truncate hidden sm:inline">
                  NELFund Beneficiary Develops Student Loan Companion App
                </span>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white focus:outline-hidden"
                aria-label="Close modal"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* 16:9 Video Canvas */}
            <div className="relative aspect-video w-full bg-black">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube-nocookie.com/embed/_WaaxLj82_A?autoplay=1&si=Y9uXoW0cTRMtY_ZB"
                title="TVC News Breakfast: NELFund Beneficiary Develops App for Students"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-t border-white/10 bg-slate-950 px-5 py-3 text-xs text-white/60 sm:px-6">
              <span className="truncate max-w-md">
                Abdullahi Adam Usman · Ahmadu Bello University, Zaria · Co-Founder, Anjal Solutions LTD
              </span>
              <a
                href="https://www.youtube.com/watch?v=_WaaxLj82_A"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-white/75 hover:text-white transition"
              >
                <span>Open on YouTube</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

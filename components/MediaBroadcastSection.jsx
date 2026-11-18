'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Play, RotateCcw } from 'lucide-react'

export default function MediaBroadcastSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="cv-auto relative overflow-hidden border-b border-slate-800 bg-slate-950 px-5 py-14 text-white lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-950/35 via-slate-950 to-slate-950" />

      <div className="relative mx-auto max-w-7xl">
        <div className="grid items-center gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="relative h-8 w-28 shrink-0 sm:h-9 sm:w-32">
                <Image
                  src="/images/tvc-news-logo.webp"
                  alt="TVC News"
                  width={128}
                  height={36}
                  loading="lazy"
                  className="h-full w-full object-contain object-left"
                />
              </div>
              <span className="border-l border-white/15 pl-3 font-mono text-xs uppercase tracking-wider text-white/60">
                National Broadcast Feature
              </span>
            </div>

            <h2 className="text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
              My NELFund Featured on TVC News Breakfast
            </h2>

            <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">
              In a live national broadcast on TVC News Breakfast, the team behind Anjal Solutions LTD presents My NELFund—an independent student loan companion app on Google Play and the Apple App Store built to clarify eligibility and statutory repayment timelines.
            </p>

            <div className="mt-7 flex flex-wrap items-center gap-3">
              {!isPlaying ? (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  className="inline-flex min-h-[44px] items-center gap-2.5 rounded-xl bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-sky-50"
                >
                  <Play className="h-4 w-4 fill-slate-950 text-slate-950" aria-hidden="true" />
                  <span>Play Broadcast Interview</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(false)}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Reset Player</span>
                </button>
              )}

              <Link
                href="/work/mynelfund"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/10"
              >
                <span>Explore Case Study</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <div>
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-white/15 bg-slate-900 shadow-2xl">
              {isPlaying ? (
                <iframe
                  className="absolute inset-0 h-full w-full"
                  src="https://www.youtube-nocookie.com/embed/_WaaxLj82_A?autoplay=1&si=Y9uXoW0cTRMtY_ZB"
                  title="TVC News Breakfast: My NELFund Student Loan App Feature"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setIsPlaying(true)}
                  aria-label="Play TVC News Breakfast interview about My NELFund"
                  className="group relative h-full w-full cursor-pointer text-left"
                >
                  <Image
                    src="/images/tvc-nelfund-broadcast.webp"
                    alt="TVC News Breakfast segment covering My NELFund"
                    width={960}
                    height={540}
                    loading="lazy"
                    className="h-full w-full object-cover opacity-85 transition duration-300 group-hover:scale-105 group-hover:opacity-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/25 to-transparent" />

                  <span className="absolute inset-0 flex items-center justify-center">
                    <span className="flex h-14 w-14 items-center justify-center rounded-full border border-white/30 bg-black/45 text-white shadow-2xl backdrop-blur-md transition group-hover:scale-110 group-hover:bg-white group-hover:text-slate-950">
                      <Play className="ml-0.5 h-5 w-5 fill-current" aria-hidden="true" />
                    </span>
                  </span>

                  <span className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs text-white/85">
                    <span className="truncate font-semibold">TVC News Breakfast Segment</span>
                    <span className="rounded-md bg-black/65 px-2.5 py-1 font-mono text-[11px] text-white/80">
                      Click to Play
                    </span>
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

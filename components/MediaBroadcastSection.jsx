'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'

export default function MediaBroadcastSection() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <section className="cv-auto border-b border-slate-200 bg-white px-5 py-14 text-slate-950 lg:px-8 lg:py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <img
              src="/images/tvc-news-logo.webp"
              alt="TVC News"
              width={112}
              height={32}
              loading="lazy"
              decoding="async"
              className="h-7 w-auto rounded bg-slate-950 px-2.5 py-1 object-contain"
            />
            <span className="font-mono text-xs uppercase tracking-wider text-slate-500">
              National Television Feature
            </span>
          </div>

          <h2 className="mt-4 text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
            My NELFund on TVC News Breakfast
          </h2>

          <p className="mt-3.5 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base">
            Watch the live TVC News Breakfast broadcast presenting My NELFund—our iOS and Android companion app helping Nigerian tertiary students check eligibility and simulate statutory repayment timelines.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            {!isPlaying && (
              <button
                type="button"
                onClick={() => setIsPlaying(true)}
                className="inline-flex min-h-[42px] items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                <Play className="h-4 w-4 fill-current" aria-hidden="true" />
                <span>Play Interview</span>
              </button>
            )}

            <Link
              href="/work/mynelfund"
              className="inline-flex min-h-[42px] items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 transition hover:border-slate-950"
            >
              <span>My NELFund Case Study</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-lg">
          {isPlaying ? (
            <iframe
              className="absolute inset-0 h-full w-full border-0"
              src="https://www.youtube-nocookie.com/embed/_WaaxLj82_A?autoplay=1&rel=0"
              title="TVC News Breakfast Interview: My NELFund"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsPlaying(true)}
              aria-label="Play TVC News Breakfast interview video"
              className="group relative block h-full w-full cursor-pointer border-0 p-0"
            >
              <img
                src="/images/tvc-nelfund-broadcast.webp"
                alt="TVC News Breakfast interview frame"
                width={960}
                height={540}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
              />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-xl transition group-hover:scale-110 group-hover:bg-blue-700 group-hover:text-white">
                  <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
                </span>
              </span>
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

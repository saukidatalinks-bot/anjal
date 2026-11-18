'use client'

import { useState } from 'react'
import { Play } from 'lucide-react'

export default function HeroInterviewPlayer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <div id="broadcast-interview" className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-100 shadow-xl">
      {isPlaying ? (
        <iframe
          className="absolute inset-0 h-full w-full border-0"
          src="https://www.youtube-nocookie.com/embed/_WaaxLj82_A?autoplay=1&rel=0"
          title="TVC News Breakfast Interview: My NELFund by Anjal Solutions LTD"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsPlaying(true)}
          aria-label="Play TVC News Breakfast interview about My NELFund"
          className="group relative block h-full w-full cursor-pointer border-0 p-0"
        >
          <img
            src="/images/tvc-nelfund-broadcast.webp"
            alt="TVC News Breakfast live broadcast featuring My NELFund"
            width={960}
            height={540}
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/95 text-slate-950 shadow-2xl transition group-hover:scale-110 group-hover:bg-blue-700 group-hover:text-white">
              <Play className="ml-0.5 h-6 w-6 fill-current" aria-hidden="true" />
            </span>
          </span>
        </button>
      )}
    </div>
  )
}

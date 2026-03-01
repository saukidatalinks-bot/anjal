'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-navy via-blue-900 to-slate-900 pt-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-brand-gold/10 rounded-full mix-blend-screen filter blur-3xl animate-blob" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-brand-green/10 rounded-full mix-blend-screen filter blur-3xl animate-blob-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-500/10 rounded-full mix-blend-screen filter blur-3xl animate-blob-delay-4000" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6 h-screen flex flex-col justify-center">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Trust badge */}
          <div className="inline-flex items-center gap-2 bg-brand-green/10 border border-brand-green/50 rounded-full px-4 py-2 mb-8 w-fit">
            <span className="w-2 h-2 bg-brand-green rounded-full animate-pulse" />
            <span className="text-brand-green text-sm font-semibold uppercase tracking-wider">Trusted by 42+ African Companies</span>
          </div>

          {/* Main heading with animated gradient */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 text-white">
            We Build
            <span className="block h-32 md:h-40 lg:h-48 overflow-hidden">
              <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-brand-gold via-brand-green to-brand-gold mb-2 animate-pulse">
                Digital Excellence
              </span>
            </span>
            <span className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white/60">
              From Damaturu to the World
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed mb-12 font-light">
            Transform your vision into reality with cutting-edge web development, mobile apps, AI solutions, and enterprise digital infrastructure.
          </p>

          {/* CTA Buttons with hover effects */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <a href="#quotation" className="group relative inline-flex items-center justify-center px-8 py-4 font-semibold text-lg rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-brand-green to-brand-gold group-hover:scale-105 transition-transform duration-300 rounded-xl" />
              <div className="absolute inset-0.5 bg-navy rounded-xl group-hover:bg-opacity-0 transition-all duration-300" />
              <span className="relative text-brand-green group-hover:text-white transition-colors">
                Get Your Quotation
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </span>
            </a>

            <a href="#portfolio" className="group inline-flex items-center justify-center px-8 py-4 font-semibold text-lg rounded-xl border-2 border-brand-gold/50 text-white hover:border-brand-gold hover:bg-brand-gold/10 transition-all duration-300">
              View Our Work
              <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>

          {/* Social proof metrics */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
            {[
              { number: '42+', label: 'Companies Built' },
              { number: '100%', label: 'Code Ownership' },
              { number: '24/7', label: 'Support Ready' },
            ].map((stat, i) => (
              <div key={i} className="group">
                <div className="text-2xl md:text-3xl font-bold text-brand-gold group-hover:text-brand-green transition-colors">
                  {stat.number}
                </div>
                <div className="text-sm text-white/50 group-hover:text-white/70 transition-colors">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="flex flex-col items-center gap-3 text-white/40 text-xs font-semibold uppercase tracking-widest">
          Scroll to explore
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden pt-32 pb-20 flex items-center">
      {/* Subtle background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-50 pointer-events-none" />
      
      {/* Refined accent elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-gradient-to-br from-gray-100/40 to-transparent rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-gray-50/60 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-5xl relative z-10">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Premium badge */}
          <div className="inline-block mb-8">
            <div className="px-4 py-2 border border-gray-300/80 rounded-full text-xs font-semibold text-gray-700 bg-white/50 backdrop-blur-sm hover:border-gray-400 transition-all">
              → Crafting Digital Excellence Since 2023
            </div>
          </div>

          {/* Main heading with premium typography */}
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-semibold text-black mb-8 leading-tight tracking-tight">
            Building Digital 
            Solutions That 
            <span className="relative block">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-black via-gray-800 to-black">Elevate Your Business</span>
            </span>
          </h1>

          {/* Premium subheading */}
          <p className="text-lg md:text-xl text-gray-700 mb-12 max-w-3xl leading-relaxed font-light">
            From concept to production. We craft elegant, scalable digital products for companies that demand excellence. Based in Damaturu, Nigeria. Serving Africa and beyond.
          </p>

          {/* Premium CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <a href="#quotation" className="group px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-900 hover:shadow-2xl transition-all duration-300 text-center border border-black/10">
              Get a Quote
              <span className="ml-2 group-hover:translate-x-1 inline-block transition-transform">→</span>
            </a>
            <a href="#contact" className="px-8 py-4 border-2 border-gray-300 text-black rounded-xl font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 text-center">
              Schedule Consultation
            </a>
          </div>

          {/* Trust metrics with subtle dividers */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-12 pt-16 border-t border-gray-200">
            <div className="group hover:opacity-80 transition-opacity">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">40+</div>
              <div className="text-sm text-gray-600 font-medium">Projects Delivered</div>
            </div>
            <div className="group hover:opacity-80 transition-opacity">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">100%</div>
              <div className="text-sm text-gray-600 font-medium">Code Ownership</div>
            </div>
            <div className="group hover:opacity-80 transition-opacity">
              <div className="text-3xl md:text-4xl font-bold text-black mb-2 bg-gradient-to-r from-black to-gray-700 bg-clip-text text-transparent">24/7</div>
              <div className="text-sm text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}

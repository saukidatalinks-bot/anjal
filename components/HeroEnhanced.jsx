'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const heroRef = useRef(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section ref={heroRef} className="relative min-h-screen w-full bg-white pt-32 pb-20 flex items-center">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {/* Badge */}
          <div className="inline-block mb-8">
            <div className="px-3 py-1 border border-gray-300 rounded-full text-sm font-medium text-gray-600">
              Crafting Digital Excellence Since 2023
            </div>
          </div>

          {/* Main heading */}
          <h1 className="text-6xl md:text-7xl font-semibold text-black mb-8 leading-tight">
            Building Digital 
            Solutions That Elevate 
            Your Business
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-12 max-w-2xl leading-relaxed">
            From concept to production. We craft elegant, scalable digital products for companies that demand excellence. Based in Nigeria. Serving Africa and beyond.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 mb-16">
            <a href="#quotation" className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-center">
              Get a Quote
            </a>
            <a href="#contact" className="px-8 py-4 border border-black text-black rounded-lg font-semibold hover:bg-gray-50 transition-colors text-center">
              Schedule Consultation
            </a>
          </div>

          {/* Trust metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 pt-12 border-t border-gray-200">
            <div>
              <div className="text-base font-semibold text-black mb-1">40+</div>
              <div className="text-sm text-gray-600">Projects Delivered</div>
            </div>
            <div>
              <div className="text-base font-semibold text-black mb-1">100%</div>
              <div className="text-sm text-gray-600">Code Ownership</div>
            </div>
            <div>
              <div className="text-base font-semibold text-black mb-1">24/7</div>
              <div className="text-sm text-gray-600">Support Available</div>
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

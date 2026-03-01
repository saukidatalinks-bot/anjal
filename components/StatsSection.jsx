'use client'

import { useEffect, useRef, useState } from 'react'

const AnimatedCounter = ({ end, label }) => {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !isVisible) {
        setIsVisible(true)
      }
    }, { threshold: 0.1 })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / 2000, 1)

      setCount(Math.floor(progress * end))

      if (progress === 1) {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [isVisible, end])

  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl md:text-5xl font-semibold text-black mb-2">
        {count}
        {label === 'Success Rate' ? '%' : '+'}
      </div>
      <p className="text-gray-600 text-sm font-medium">{label}</p>
    </div>
  )
}

export default function StatsSection() {
  const stats = [
    { end: 40, label: 'Projects Delivered' },
    { end: 87, label: 'Success Rate' },
    { end: 15, label: 'Years Experience' },
    { end: 100, label: 'Code Ownership' }
  ]

  return (
    <section className="py-24 bg-gradient-to-b from-apple-light via-white to-apple-light border-t border-apple-light-secondary">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 border border-blue-100">
            → Our Impact
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-6">
            Proven Track Record
          </h2>
          <p className="text-lg text-apple-space-gray font-light">Delivering exceptional results consistently</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20 px-4">
          {stats.map((stat, index) => (
            <AnimatedCounter key={index} end={stat.end} label={stat.label} />
          ))}
        </div>

        {/* Three value propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-20 border-t border-apple-light-secondary">
          <div>
            <h3 className="text-lg font-semibold text-black mb-3">Delivered On Time</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              We respect your timeline. Agile methodology ensures predictable delivery with regular updates and transparent communication.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-3">Enterprise Grade</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              Bank-level security, GDPR compliance, and scalable architecture built to handle millions of users without compromise.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-black mb-3">Complete Ownership</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              100% code ownership. Full documentation, no vendor lock-in, and seamless handoff to your team when you're ready.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

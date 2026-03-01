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
    <section className="py-20 bg-white border-t border-gray-200">
      <div className="container mx-auto px-6 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-semibold text-black mb-4">
            Proven Track Record
          </h2>
          <div className="w-12 h-1 bg-black mx-auto" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
          {stats.map((stat, index) => (
            <AnimatedCounter key={index} end={stat.end} label={stat.label} />
          ))}
        </div>

        {/* Three value propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-16 border-t border-gray-200">
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

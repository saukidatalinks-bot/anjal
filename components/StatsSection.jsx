'use client'

import { useEffect, useRef, useState } from 'react'

const AnimatedCounter = ({ end, duration = 2000, label }) => {
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
      const progress = Math.min(elapsed / duration, 1)

      if (label.includes('%')) {
        setCount(Math.floor(progress * end))
      } else if (label === 'Companies') {
        setCount(Math.floor(progress * end))
      } else {
        setCount(Math.floor(progress * end))
      }

      if (progress === 1) {
        clearInterval(timer)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [isVisible, end, duration, label])

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green mb-3">
        {count}
        {label === 'Companies' ? '+' : label === 'Client Success' ? '%' : ''}
      </div>
      <p className="text-white/70 text-lg font-semibold">{label}</p>
    </div>
  )
}

export default function StatsSection() {
  const stats = [
    { end: 42, label: 'Companies' },
    { end: 87, label: 'Client Success' },
    { end: 15, label: 'Years Combined Experience' },
    { end: 100, label: 'Code Ownership %' }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-navy via-slate-900 to-navy relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-br from-brand-gold to-transparent rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-brand-green to-transparent rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green">Track Record</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Numbers that speak volumes about our commitment to excellence
          </p>
        </div>

        {/* Stats grid with glass effect */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group relative p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-brand-gold/50 transition-all duration-300 hover:bg-white/10 hover:shadow-2xl"
            >
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-brand-gold/0 via-transparent to-brand-green/0 group-hover:from-brand-gold/10 group-hover:to-brand-green/10 rounded-2xl transition-all duration-300 pointer-events-none" />

              {/* Content */}
              <div className="relative">
                <AnimatedCounter end={stat.end} label={stat.label} />
              </div>

              {/* Decorative element */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-brand-gold/5 rounded-full group-hover:bg-brand-gold/10 transition-all duration-300 -mr-10 -mt-10 group-hover:scale-150 blur-2xl" />
            </div>
          ))}
        </div>

        {/* Value propositions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '⚡',
              title: 'Lightning Fast Delivery',
              description: 'Agile methodologies mean your project launches when you need it, not months later.'
            },
            {
              icon: '🛡️',
              title: 'Enterprise Security',
              description: 'Bank-level encryption and compliance with international data protection standards.'
            },
            {
              icon: '🚀',
              title: 'Scalable Architecture',
              description: 'From MVP to millions of users—your infrastructure grows with your business.'
            }
          ].map((prop, i) => (
            <div key={i} className="group p-8 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-brand-gold/50 transition-all hover:bg-white/10">
              <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{prop.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{prop.title}</h3>
              <p className="text-white/60 group-hover:text-white/80 transition-colors">{prop.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

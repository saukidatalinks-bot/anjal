'use client'

import { useEffect, useRef, useState } from 'react'

export default function ProcessTimeline() {
  const [visibleSteps, setVisibleSteps] = useState([])
  const ref = useRef(null)

  const steps = [
    {
      title: 'Discovery & Planning',
      description: 'We dive deep into your business goals, challenges, and target audience',
      icon: '🔍',
      duration: '1-2 weeks',
      deliverables: ['Project scope', 'Technical requirements', 'Timeline & budget']
    },
    {
      title: 'UI/UX Design',
      description: 'Creating beautiful, user-centric designs that convert',
      icon: '🎨',
      duration: '2-3 weeks',
      deliverables: ['Wireframes', 'High-fidelity mockups', 'Design system']
    },
    {
      title: 'Development',
      description: 'Building your solution with cutting-edge technologies',
      icon: '💻',
      duration: '4-8 weeks',
      deliverables: ['Frontend code', 'Backend APIs', 'Database setup']
    },
    {
      title: 'Testing & QA',
      description: 'Rigorous testing to ensure quality and reliability',
      icon: '✅',
      duration: '1-2 weeks',
      deliverables: ['Bug fixes', 'Performance optimization', 'Security audit']
    },
    {
      title: 'Deployment',
      description: 'Launching your solution to the world',
      icon: '🚀',
      duration: '2-3 days',
      deliverables: ['Production setup', 'Domain configuration', 'Go-live']
    },
    {
      title: 'Support & Optimization',
      description: 'Ongoing support and continuous improvements',
      icon: '🛡️',
      duration: 'Ongoing',
      deliverables: ['24/7 Support', 'Database backups', 'Feature updates']
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, index) => {
            setTimeout(() => {
              setVisibleSteps(prev => [...new Set([...prev, index])])
            }, index * 200)
          })
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-slate-900 via-navy to-slate-900 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-brand-gold rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-brand-green rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green">Development Process</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            From concept to launch—a structured, transparent approach to building excellence
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-brand-gold via-brand-green to-brand-gold opacity-30" />

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-10'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className={`relative ${index % 2 === 0 ? 'lg:pr-[calc(50%+2rem)]' : 'lg:pl-[calc(50%+2rem)]'}`}>
                  {/* Timeline dot */}
                  <div className="hidden lg:flex absolute left-1/2 top-8 transform -translate-x-1/2 items-center justify-center">
                    <div className={`w-6 h-6 rounded-full border-4 border-navy bg-gradient-to-br from-brand-gold to-brand-green`} />
                  </div>

                  {/* Card */}
                  <div className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-brand-gold/50 rounded-2xl p-8 transition-all duration-300 hover:bg-white/10 h-full">
                    {/* Step number and icon */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-4xl group-hover:scale-110 transition-transform">{step.icon}</div>
                      <span className="text-brand-gold font-bold text-lg">0{index + 1}</span>
                    </div>

                    {/* Title and duration */}
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-brand-green font-semibold text-sm mb-3">⏱️ {step.duration}</p>

                    {/* Description */}
                    <p className="text-white/70 mb-6">{step.description}</p>

                    {/* Deliverables */}
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-white/50 uppercase tracking-widest">Deliverables</p>
                      <ul className="space-y-2">
                        {step.deliverables.map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-white/60 text-sm">
                            <svg className="w-4 h-4 text-brand-gold flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <div className="inline-flex items-center gap-3 bg-brand-gold/10 border border-brand-gold/50 rounded-full px-6 py-3 mb-8">
            <span className="w-2 h-2 bg-brand-gold rounded-full animate-pulse" />
            <span className="text-brand-gold font-semibold">Average project: 10-14 weeks</span>
          </div>
          <p className="text-white/70 max-w-2xl mx-auto">
            Timeline varies based on project complexity. We'll provide a detailed timeline during your discovery phase.
          </p>
        </div>
      </div>
    </section>
  )
}

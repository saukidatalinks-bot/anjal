'use client'

import { useEffect, useRef, useState } from 'react'

export default function ProcessTimeline() {
  const [visibleSteps, setVisibleSteps] = useState([])
  const ref = useRef(null)

  const steps = [
    {
      title: 'Discovery & Planning',
      description: 'We understand your business, goals, and requirements',
      duration: '1-2 weeks'
    },
    {
      title: 'Design',
      description: 'Creating user-centric designs and visual direction',
      duration: '2-3 weeks'
    },
    {
      title: 'Development',
      description: 'Building robust code using modern technologies',
      duration: '4-8 weeks'
    },
    {
      title: 'Testing & QA',
      description: 'Comprehensive testing for quality and performance',
      duration: '1-2 weeks'
    },
    {
      title: 'Deployment',
      description: 'Launching your solution to production',
      duration: '2-3 days'
    },
    {
      title: 'Support & Maintenance',
      description: 'Ongoing support, updates, and optimizations',
      duration: 'Ongoing'
    }
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          steps.forEach((_, index) => {
            setTimeout(() => {
              setVisibleSteps(prev => [...new Set([...prev, index])])
            }, index * 150)
          })
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section ref={ref} className="py-24 bg-gradient-to-br from-white via-apple-light to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 border border-blue-100">
            → Our Process
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-6">
            Our Process
          </h2>
          <p className="text-lg text-apple-space-gray font-light">
            A structured, transparent approach from concept to launch. Your project progresses through clearly defined phases with regular milestones and updates.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line - only on desktop */}
          <div className="hidden lg:block absolute left-8 top-0 bottom-0 w-px bg-apple-light-secondary" />

          {/* Steps vertical list */}
          <div className="space-y-8 lg:space-y-12">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`transition-all duration-700 ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`
                }}
              >
                <div className="flex gap-6 lg:gap-8">
                  {/* Timeline dot */}
                  <div className="flex flex-col items-center">
                    <div className="w-4 h-4 rounded-full border-2 border-apple-blue bg-blue-50 mt-2 lg:mt-0" />
                    {index < steps.length - 1 && (
                      <div className="w-px h-12 lg:h-24 bg-apple-light-secondary mt-6" />
                    )}
                  </div>

                  {/* Step content */}
                  <div className="pb-4">
                    {/* Step number */}
                    <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                      Step {index + 1}
                    </div>

                    {/* Title and duration */}
                    <h3 className="text-xl font-semibold text-black mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 font-medium mb-3">
                      ~{step.duration}
                    </p>

                    {/* Description */}
                    <p className="text-gray-600 text-base leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom info */}
        <div className="mt-20 max-w-2xl mx-auto p-12 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <p className="text-gray-600 leading-relaxed">
            Total project timeline typically ranges from <span className="font-semibold text-black">10-14 weeks</span>, depending on scope and complexity. We'll provide a detailed timeline and milestone roadmap during your initial consultation.
          </p>
        </div>
      </div>
    </section>
  )
}

'use client'

import { useState } from 'react'
import Image from 'next/image'

export default function CaseStudiesSection() {
  const [activeCase, setActiveCase] = useState(0)

  const caseStudies = [
    {
      id: 1,
      title: 'E-Commerce Platform Transformation',
      company: 'FastTrack Nigeria',
      industry: 'E-Commerce',
      imageColor: 'from-blue-600 to-blue-400',
      challenge: 'Legacy system causing 40% cart abandonment, slow checkout (8+ seconds)',
      solution: 'Built Next.js platform with Stripe integration, optimized performance, real-time inventory',
      results: [
        { metric: '300%', label: 'Conversion Increase' },
        { metric: '5s', label: 'Faster Checkout' },
        { metric: '₦42M', label: 'First Year Revenue' }
      ],
      technologies: ['Next.js', 'Stripe API', 'PostgreSQL', 'Redis'],
      testimonial: '"Anjal transformed our business. We went from struggling to scaling."',
      testimonialAuthor: '— Chioma Okeke, CEO'
    },
    {
      id: 2,
      title: 'FinTech Mobile App Launch',
      company: 'PayFlow Digital',
      industry: 'Financial Technology',
      imageColor: 'from-green-600 to-green-400',
      challenge: 'No mobile presence, customers using competitors',
      solution: 'React Native cross-platform app with biometric auth, transaction history, bill payments',
      results: [
        { metric: '50K+', label: 'Users in 3 Months' },
        { metric: '4.8★', label: 'App Store Rating' },
        { metric: '₦150M+', label: 'Transactions Processed' }
      ],
      technologies: ['React Native', 'Firebase', 'Node.js', 'JWT Auth'],
      testimonial: '"They delivered a world-class app that our customers love."',
      testimonialAuthor: '— Ibrahim Hassan, Founder'
    },
    {
      id: 3,
      title: 'Enterprise AI Analytics Dashboard',
      company: 'LogiTech Solutions',
      industry: 'Logistics',
      imageColor: 'from-purple-600 to-purple-400',
      challenge: 'Manual reporting taking 3 days, need real-time insights',
      solution: 'Custom analytics dashboard with ML predictions, automated reporting, KPI tracking',
      results: [
        { metric: '72h→2h', label: 'Report Time Saved' },
        { metric: '40%', label: 'Cost Reduction' },
        { metric: '95%', label: 'Forecast Accuracy' }
      ],
      technologies: ['Python', 'TensorFlow', 'React', 'PostgreSQL'],
      testimonial: '"Data-driven decisions are now instant. This is a game-changer."',
      testimonialAuthor: '— Musa Abdullahi, Operations Manager'
    },
    {
      id: 4,
      title: 'SaaS Platform for HR Management',
      company: 'HRConnect Africa',
      industry: 'Human Resources',
      imageColor: 'from-pink-600 to-pink-400',
      challenge: 'Building product from scratch, need multi-tenant architecture',
      solution: 'Scalable SaaS with attendance tracking, payroll, leave management, performance reviews',
      results: [
        { metric: '8', label: 'Enterprise Clients' },
        { metric: '5K+', label: 'Active Users' },
        { metric: '99.9%', label: 'Uptime' }
      ],
      technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
      testimonial: '"They understood HR needs and built the perfect solution."',
      testimonialAuthor: '— Dr. Amina Ahmed, CEO'
    }
  ]

  const study = caseStudies[activeCase]

  return (
    <section className="py-24 bg-gradient-to-br from-navy via-slate-900 to-navy relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-gold rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-1/2 left-0 w-96 h-96 bg-brand-green rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Real <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green">Success Stories</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            See how we've transformed businesses across industries
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Case studies list */}
          <div className="space-y-4">
            {caseStudies.map((caseStudy, index) => (
              <button
                key={caseStudy.id}
                onClick={() => setActiveCase(index)}
                className={`w-full text-left p-6 rounded-2xl transition-all duration-300 ${
                  activeCase === index
                    ? 'bg-white/10 border border-brand-gold shadow-lg scale-105'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10 hover:border-brand-gold/50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-white mb-2">{caseStudy.title}</h3>
                    <p className="text-sm text-white/60">{caseStudy.company}</p>
                  </div>
                  <span className={`text-2xl font-bold ${activeCase === index ? 'text-brand-gold' : 'text-white/30'}`}>
                    0{index + 1}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Main case study detail */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-12 min-h-96">
              {/* Image placeholder */}
              <div className={`h-48 bg-gradient-to-br ${study.imageColor} rounded-2xl mb-8 flex items-center justify-center`}>
                <div className="text-6xl">📊</div>
              </div>

              {/* Challenge */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-brand-gold uppercase tracking-wider mb-2">Challenge</h3>
                <p className="text-white text-lg">{study.challenge}</p>
              </div>

              {/* Solution */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-brand-green uppercase tracking-wider mb-2">Solution</h3>
                <p className="text-white text-lg">{study.solution}</p>
              </div>

              {/* Results */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Results</h3>
                <div className="grid grid-cols-3 gap-4">
                  {study.results.map((result, i) => (
                    <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/10">
                      <div className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green">
                        {result.metric}
                      </div>
                      <div className="text-xs text-white/60 mt-1">{result.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech stack */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {study.technologies.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-brand-gold/20 text-brand-gold rounded-full text-xs font-semibold">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Testimonial */}
              <div className="bg-gradient-to-r from-brand-gold/10 to-brand-green/10 border border-white/10 rounded-2xl p-6">
                <p className="text-white italic mb-3">"{study.testimonial.replace(/^"|"$/g, '')}"</p>
                <p className="text-white/60 text-sm">{study.testimonialAuthor}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

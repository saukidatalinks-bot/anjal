'use client'

import { useState } from 'react'

export default function EnhancedCTA() {
  const [activeFilter, setActiveFilter] = useState('all')

  const ctas = [
    {
      id: 1,
      title: 'Get a Free Quotation',
      description: 'Get a detailed, no-obligation quotation for your project in 24 hours',
      icon: '📋',
      color: 'from-brand-gold to-orange-500',
      link: '#quotation',
      action: 'Get Quote',
      type: 'primary'
    },
    {
      id: 2,
      title: 'Schedule a Consultation',
      description: 'Talk to our technical team about your specific requirements and challenges',
      icon: '🗓️',
      color: 'from-brand-green to-emerald-500',
      link: '#contact',
      action: 'Book Call',
      type: 'consultation'
    },
    {
      id: 3,
      title: 'View Case Studies',
      description: 'See how we\'ve helped companies like yours achieve their digital goals',
      icon: '📊',
      color: 'from-blue-400 to-cyan-500',
      link: '#portfolio',
      action: 'Explore Cases',
      type: 'case'
    },
    {
      id: 4,
      title: 'Download Service Guide',
      description: 'Comprehensive guide covering our services, pricing, and process',
      icon: '📚',
      color: 'from-purple-400 to-pink-500',
      link: '/service-guide.pdf',
      action: 'Download PDF',
      type: 'guide'
    },
    {
      id: 5,
      title: 'Chat with Us',
      description: 'Connect with our team via WhatsApp for immediate assistance',
      icon: '💬',
      color: 'from-green-400 to-green-600',
      link: 'https://wa.me/2348164135836',
      action: 'Start Chat',
      type: 'support'
    },
    {
      id: 6,
      title: 'Join Our Newsletter',
      description: 'Monthly insights on tech trends, digital innovation, and industry best practices',
      icon: '📧',
      color: 'from-indigo-400 to-indigo-600',
      link: '#newsletter',
      action: 'Subscribe',
      type: 'newsletter'
    }
  ]

  const filteredCtas = activeFilter === 'all' ? ctas : ctas.filter(cta => cta.type === activeFilter)

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 via-navy to-slate-900 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl">
          <div className="absolute top-0 left-0 w-96 h-96 bg-brand-gold rounded-full mix-blend-screen filter blur-3xl animate-blob" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-green rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-2000" />
          <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-blob animation-delay-4000" />
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-black text-white mb-4">
            Ready to Transform <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green">Your Business?</span>
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Multiple ways to get started—choose what works best for you
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'all', label: 'All Options' },
            { id: 'primary', label: 'Get Quote' },
            { id: 'consultation', label: 'Book Consultation' },
            { id: 'support', label: 'Quick Support' }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                activeFilter === filter.id
                  ? 'bg-brand-gold text-navy shadow-lg scale-105'
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* CTA Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {filteredCtas.map((cta, index) => (
            <a
              key={cta.id}
              href={cta.link}
              target={cta.link.startsWith('http') ? '_blank' : undefined}
              rel={cta.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className={`group relative overflow-hidden rounded-2xl p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-in fade-in-up`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {/* Gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cta.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />

              {/* Border gradient */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${cta.color} opacity-0 group-hover:opacity-30 transition-opacity -z-10 blur-xl group-hover:blur-2xl`} />

              {/* Card content */}
              <div className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/20 group-hover:border-white/40 rounded-2xl p-8 h-full flex flex-col transition-all duration-300">
                {/* Icon */}
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  {cta.icon}
                </div>

                {/* Title */}
                <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r from-brand-gold to-brand-green transition-all">
                  {cta.title}
                </h3>

                {/* Description */}
                <p className="text-white/60 mb-6 flex-grow group-hover:text-white/80 transition-colors">
                  {cta.description}
                </p>

                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 text-brand-gold font-semibold group-hover:text-white transition-colors">
                  {cta.action}
                  <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Secondary CTA */}
        <div className="relative mt-20 p-12 rounded-3xl bg-gradient-to-r from-brand-gold/20 via-brand-green/20 to-blue-500/20 border border-white/20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-4">Still not sure?</h3>
              <p className="text-white/70 mb-6">
                Let's start with a conversation. Our team can help you understand what's possible and create a tailored roadmap for your digital transformation.
              </p>
              <button className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-navy font-bold rounded-xl hover:shadow-lg transition-all hover:scale-105">
                Schedule Your Free Consultation
                <svg className="w-5 h-5 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-brand-gold to-brand-green rounded-2xl blur-2xl opacity-30" />
                <div className="relative bg-white/10 rounded-2xl p-8 backdrop-blur-xl border border-white/20">
                  <p className="text-white font-bold text-lg">💡 Pro Tip:</p>
                  <p className="text-white/70 mt-2">Most clients get their first draft proposal within 48 hours of consultation.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

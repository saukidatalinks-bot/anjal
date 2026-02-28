'use client'
import { useEffect, useRef } from 'react'

export default function Hero({ settings = {} }) {
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count)
            let current = 0
            const step = Math.ceil(target / 50)
            const timer = setInterval(() => {
              current = Math.min(current + step, target)
              el.textContent = current
              if (current >= target) clearInterval(timer)
            }, 35)
          })
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.5 })
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  const companyName = settings.company_name || 'Anjal Ventures'
  const badge = settings.hero_badge || 'CAC Registered · BN 9258709 · Active'
  const startingPrice = settings.stats_starting_price || '100'
  const statsServices = settings.stats_services || '6'
  const statsProjects = settings.stats_smes || '42'

  return (
    <section id="hero" className="min-h-screen bg-navy flex items-center relative overflow-hidden pt-[72px]">
      {/* Background */}
      <div className="absolute inset-0 hero-grid-pattern" />
      <div className="absolute -top-40 -right-20 w-[600px] h-[600px] rounded-full bg-brand-green/10 blur-[100px] animate-float" />
      <div className="absolute -bottom-20 left-[10%] w-96 h-96 rounded-full bg-brand-gold/8 blur-[80px] animate-float-delay" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center py-20">
          {/* Left Content */}
          <div className="fade-in-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2.5 bg-brand-green/15 border border-brand-green/30 text-brand-green-light px-5 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-7">
              <span className="w-2 h-2 bg-brand-green-light rounded-full animate-pulse-dot" />
              {badge}
            </div>

            <h1 className="font-display text-5xl lg:text-7xl text-white leading-[1.05] mb-6">
              Building<br />
              Africa's <span className="text-brand-green-light">Digital</span><br />
              <em className="text-brand-gold">Infrastructure</em>
            </h1>

            <p className="text-lg text-white/60 leading-relaxed mb-9 max-w-xl">
              Premium web platforms, mobile apps, AI solutions and enterprise SaaS — delivered by Nigeria's first-mover technology partner in North-East Nigeria.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <a href="#services" className="btn btn-green">Explore Services →</a>
              <a href="#portfolio" className="btn btn-outline-white">View Portfolio</a>
              <a href="#pricing" className="btn btn-outline-white">Get a Quote</a>
            </div>

            {/* Stats */}
            <div ref={statsRef} className="grid grid-cols-3 rounded-2xl overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.04)', outline: '1px solid rgba(255,255,255,0.08)' }}>
              {[
                { val: statsServices, suffix: '+', label: 'Service Verticals' },
                { val: startingPrice, prefix: '$', label: 'Starting From' },
                { val: '2', suffix: '+', label: 'Live Products' },
              ].map((s, i) => (
                <div key={i} className="p-5 text-center" style={{ borderRight: i < 2 ? '1px solid rgba(255,255,255,0.06)' : 'none' }}>
                  <div className="font-display text-3xl font-bold text-white">
                    {s.prefix}<span data-count={s.val}>0</span>{s.suffix}
                  </div>
                  <div className="text-xs text-white/40 mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Panel */}
          <div className="hidden lg:block fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="rounded-3xl p-8 rotate-[-1.5deg]" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex flex-col gap-3 mb-6">
                {[
                  { icon: '🌐', title: 'Web Development', sub: 'Custom platforms & enterprise portals' },
                  { icon: '📱', title: 'Mobile Applications', sub: 'Native Android apps with real-time sync' },
                  { icon: '🤖', title: 'AI & Automation', sub: 'Intelligent tools & workflow automation' },
                  { icon: '☁️', title: 'Enterprise SaaS', sub: 'Multi-tenant subscription platforms' },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 p-3.5 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <span className="text-2xl">{s.icon}</span>
                    <div>
                      <div className="text-sm font-semibold text-white">{s.title}</div>
                      <div className="text-xs text-white/45">{s.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
              {/* CAC Badge */}
              <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
                <span className="text-lg">🏛️</span>
                <span className="text-xs text-brand-gold">
                  CAC Registered · BN 9258709 · TIN 2623553716975 · Damaturu, Yobe State, Nigeria
                </span>
              </div>
            </div>

            {/* Floating cards */}
            <div className="absolute -right-6 bottom-20 bg-white rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-float">
              <div className="w-10 h-10 bg-brand-green-pale rounded-xl flex items-center justify-center">🟢</div>
              <div>
                <div className="text-sm font-bold text-navy">Live & Global</div>
                <div className="text-xs text-slate-500">2 active deployments</div>
              </div>
            </div>
            <div className="absolute -left-6 top-10 bg-white rounded-xl p-4 shadow-2xl flex items-center gap-3 animate-float-delay">
              <div className="w-10 h-10 bg-navy rounded-xl flex items-center justify-center">⚡</div>
              <div>
                <div className="text-sm font-bold text-navy">From ${startingPrice}</div>
                <div className="text-xs text-slate-500">Professional websites</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

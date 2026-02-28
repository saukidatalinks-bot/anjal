'use client'

export default function About({ settings = {} }) {
  const aboutText = settings.about_text || 'Anjal Ventures is a registered Nigerian technology enterprise delivering world-class digital solutions to businesses, institutions, and organisations across Nigeria and the African continent.'
  const cac = settings.company_cac || 'BN 9258709'
  const tin = settings.company_tin || '2623553716975'
  const address = settings.company_address || 'Damaturu, Yobe State, Nigeria'

  return (
    <section id="about" className="section bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          {/* Visual */}
          <div className="relative">
            <div className="bg-navy rounded-3xl overflow-hidden aspect-[4/5] flex items-center justify-center relative">
              <div className="absolute inset-0 hero-grid-pattern" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(22,163,74,0.15) 0%, transparent 60%)' }} />
              <div className="relative z-10 text-center p-10">
                <div className="font-display text-[100px] font-black text-white/5 leading-none mb-0">ADT</div>
                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  {['🌍 Pan-African', '⚡ Full-Stack', '🏆 First-Mover', '🔒 No Lock-In', '💎 Premium QA', '🤖 AI-Powered'].map(t => (
                    <span key={t} className="bg-white/8 border border-white/12 text-white text-xs font-semibold px-3.5 py-2 rounded-lg">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Registration card */}
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl shadow-2xl p-5 min-w-[200px] border border-slate-100">
              <div className="text-xs font-bold text-navy uppercase tracking-widest mb-3">Company Registration</div>
              {[['CAC BN', cac], ['TIN', tin], ['Established', 'Jan 30, 2026'], ['Status', '● ACTIVE']].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 py-1.5 border-b border-slate-100 last:border-0">
                  <span className="text-[11px] text-slate-400">{k}</span>
                  <span className={`text-[11px] font-semibold font-mono ${v.includes('ACTIVE') ? 'text-brand-green' : 'text-navy'}`}>{v}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div>
            <div className="section-tag">About Anjal Ventures</div>
            <h2 className="section-title">Nigeria's Premier Digital Technology Partner</h2>
            <p className="text-slate-500 leading-relaxed mb-4">{aboutText}</p>
            <p className="text-slate-500 leading-relaxed mb-8 text-sm">
              Operating under the technical brand <strong className="text-navy">Anjal Developers Team</strong>, we are headquartered in {address} — strategically positioned as a first-mover technology provider in one of Nigeria's most digitally underserved regions. Our work is not theoretical; we have already built and launched live, publicly accessible digital products serving users across multiple countries.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: '🎯', title: 'Mission', desc: 'Delivering cutting-edge, affordable digital solutions that transform ideas into scalable, impactful technology — accessible to every business across Africa.' },
                { icon: '👁️', title: 'Vision', desc: 'To become the foremost technology solutions provider in North-East Nigeria and a trusted pan-African digital partner for businesses and institutions.' },
                { icon: '💎', title: 'Excellence', desc: 'World-class engineering standards applied to every project — no compromises on quality, security or performance.' },
                { icon: '🔒', title: 'Client Ownership', desc: 'Full source code, domain and hosting ownership transferred to every client. Zero vendor lock-in. Always.' },
              ].map(v => (
                <div key={v.title} className="p-5 rounded-xl bg-slate-50 border border-slate-200 hover:border-brand-green hover:bg-brand-green-pale transition-all group cursor-default">
                  <div className="text-2xl mb-2">{v.icon}</div>
                  <div className="font-bold text-navy text-sm mb-1.5">{v.title}</div>
                  <p className="text-xs text-slate-500 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Stats band */}
      <div className="mt-24 bg-navy">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {[
              { num: settings.stats_smes || '42', suffix: 'M+', label: 'Nigerian SMEs Underserved' },
              { num: settings.stats_undigitised || '70', suffix: '%+', label: 'North-East Undigitised' },
              { num: settings.stats_starting_price || '100', prefix: '$', suffix: '+', label: 'Websites Starting From' },
              { num: settings.stats_services || '6', suffix: '+', label: 'Service Verticals' },
            ].map((s, i) => (
              <div key={i} className="py-8 px-6 text-center border-r border-white/8 last:border-r-0 first:border-l-0">
                <div className="font-display text-5xl font-bold text-white mb-2">
                  {s.prefix}{s.num}{s.suffix}
                </div>
                <div className="text-sm text-white/40">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

'use client'

export default function About({ settings = {} }) {
  const aboutText = settings.about_text || 'Anjal Ventures is a registered Nigerian technology enterprise delivering world-class digital solutions to businesses, institutions, and organisations across Nigeria and the African continent.'
  const cac = settings.company_cac || 'BN 9258709'
  const tin = settings.company_tin || '2623553716975'
  const address = settings.company_address || 'Damaturu, Yobe State, Nigeria'

  return (
    <section id="about" className="section bg-white">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left side - Content */}
          <div>
            <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">About Us</div>
            <h2 className="text-5xl md:text-6xl font-semibold text-black mb-8">
              Technology Partner for African Businesses
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed mb-6">
              {aboutText}
            </p>
            <p className="text-base text-gray-600 leading-relaxed mb-12">
              Headquartered in {address}, we are a first-mover technology provider focused on delivering world-class digital solutions that are accessible to every business across Africa.
            </p>

            {/* Core values grid */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Mission', desc: 'Delivering affordable, cutting-edge digital solutions that transform ideas into scalable technology.' },
                { title: 'Vision', desc: 'Become a trusted pan-African technology partner for businesses and institutions.' },
                { title: 'Quality', desc: 'World-class engineering standards applied to every project — no compromises.' },
                { title: 'Ownership', desc: 'Full code ownership transferred to clients. Zero vendor lock-in.' },
              ].map(v => (
                <div key={v.title} className="p-6 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="font-semibold text-black text-sm mb-2">{v.title}</div>
                  <p className="text-xs text-gray-600 leading-relaxed">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Info card */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-12">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-8">Company Information</h3>
            
            <div className="space-y-8">
              {/* Registration details */}
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Registration Details</div>
                <div className="space-y-3">
                  {[['CAC BN', cac], ['TIN', tin], ['Status', 'Active']].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center pb-3 border-b border-gray-200 last:pb-0 last:border-0">
                      <span className="text-sm text-gray-600">{k}</span>
                      <span className="text-sm font-semibold text-black font-mono">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Key stats */}
              <div className="pt-8 border-t border-gray-200">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">Key Metrics</div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { num: '40+', label: 'Projects' },
                    { num: '70%', label: 'North Africa' },
                  ].map(s => (
                    <div key={s.label}>
                      <div className="text-2xl font-semibold text-black">{s.num}</div>
                      <div className="text-xs text-gray-600 mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats section */}
      <div className="mt-24 bg-gray-50 border-y border-gray-200">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              { num: settings.stats_smes || '42', suffix: 'M+', label: 'African SMEs' },
              { num: settings.stats_undigitised || '70', suffix: '%', label: 'Digitization Gap' },
              { num: settings.stats_starting_price || '100', prefix: '$', suffix: '+', label: 'Website Pricing' },
              { num: settings.stats_services || '6', suffix: '+', label: 'Service Lines' },
            ].map((s, i) => (
              <div key={i} className="py-4 text-center">
                <div className="text-4xl font-semibold text-black mb-2">
                  {s.prefix}{s.num}{s.suffix}
                </div>
                <div className="text-sm text-gray-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

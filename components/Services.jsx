'use client'

export default function Services({ services = [] }) {
  return (
    <section id="services" className="section bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-tag">What We Build</div>
          <h2 className="section-title mx-auto">Full-Stack Digital Solutions</h2>
          <p className="section-subtitle mx-auto text-center">
            From frontend UI to cloud backend, AI integration, mobile apps and API development — our team handles every layer of the stack with zero outsourcing.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 text-slate-400">No services configured yet. Add services in the Admin panel.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, i) => (
              <div key={service.id}
                className="card card-hover p-9 group cursor-default relative overflow-hidden"
                style={{ animationDelay: `${i * 0.1}s` }}>
                {/* Top accent line */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-brand-green to-navy scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />

                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-3xl mb-5 group-hover:bg-navy transition-colors duration-300">
                  {service.icon}
                </div>
                <h3 className="font-display text-xl text-navy mb-3">{service.name}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {(service.tags || []).map(tag => (
                    <span key={tag} className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-medium border border-slate-200">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

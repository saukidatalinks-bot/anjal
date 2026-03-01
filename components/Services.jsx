'use client'

export default function Services({ services = [] }) {
  return (
    <section id="services" className="section bg-gradient-to-br from-white via-apple-light to-white py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 border border-blue-100">
            → Our Services
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-6">
            Full-Stack Digital Solutions
          </h2>
          <p className="text-lg text-apple-space-gray font-light">
            From frontend to cloud backend, AI integration, mobile apps, and APIs — we handle every layer with world-class craftsmanship.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 text-apple-space-gray">No services configured yet. Add services in the Admin panel.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id}
                className="border border-apple-light-secondary rounded-2xl p-8 bg-white hover:bg-apple-light hover:border-apple-space-gray transition-all duration-300 group cursor-default shadow-sm hover:shadow-md">
                
                <div className="w-14 h-14 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl flex items-center justify-center text-3xl mb-6 group-hover:from-blue-100 group-hover:to-indigo-100 transition-all">
                  {service.icon}
                </div>

                <h3 className="text-xl font-semibold text-apple-dark mb-3">
                  {service.name}
                </h3>

                <p className="text-base text-apple-space-gray leading-relaxed mb-6 font-light">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {(service.tags || []).map(tag => (
                    <span key={tag} className="bg-apple-light text-apple-dark px-3 py-1 rounded-full text-xs font-medium border border-apple-light-secondary">
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

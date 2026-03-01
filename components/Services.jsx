'use client'

export default function Services({ services = [] }) {
  return (
    <section id="services" className="section bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Our Services</div>
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-6">
            Full-Stack Digital Solutions
          </h2>
          <p className="text-lg text-gray-600">
            From frontend to cloud backend, AI integration, mobile apps, and APIs — we handle every layer of your digital product with world-class craftsmanship.
          </p>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No services configured yet. Add services in the Admin panel.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id}
                className="border border-gray-200 rounded-lg p-8 hover:bg-gray-50 transition-colors duration-200 group cursor-default">
                
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-2xl mb-6 group-hover:bg-gray-200 transition-colors">
                  {service.icon}
                </div>

                <h3 className="text-xl font-semibold text-black mb-3">
                  {service.name}
                </h3>

                <p className="text-base text-gray-600 leading-relaxed mb-6">
                  {service.description}
                </p>

                <div className="flex flex-wrap gap-2">
                  {(service.tags || []).map(tag => (
                    <span key={tag} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium border border-gray-200">
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

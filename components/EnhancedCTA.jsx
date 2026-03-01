'use client'

export default function EnhancedCTA() {
  const ctas = [
    {
      id: 1,
      title: 'Get a Free Quotation',
      description: 'Receive a detailed, no-obligation project quote within 24 hours. We\'ll outline scope, timeline, and investment required.',
      link: '#quotation',
      action: 'Get Quote'
    },
    {
      id: 2,
      title: 'Schedule a Consultation',
      description: 'Speak directly with our technical team about your requirements, challenges, and vision for your digital product.',
      link: '#contact',
      action: 'Book Call'
    },
    {
      id: 3,
      title: 'Start with WhatsApp',
      description: 'Quick questions? Chat with us directly on WhatsApp for immediate assistance and guidance.',
      link: 'https://wa.me/2348164135836',
      action: 'Open Chat'
    }
  ]

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-gray-600">
            Choose the approach that works best for you. We're here to help at every step of your digital transformation journey.
          </p>
        </div>

        {/* CTA Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {ctas.map((cta) => (
            <a
              key={cta.id}
              href={cta.link}
              target={cta.link.startsWith('http') ? '_blank' : undefined}
              rel={cta.link.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="group border border-gray-200 bg-white hover:bg-gray-50 rounded-lg p-8 transition-all duration-200"
            >
              {/* Card content */}
              <div className="flex flex-col h-full">
                {/* Title */}
                <h3 className="text-xl font-semibold text-black mb-4">
                  {cta.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-8 flex-grow leading-relaxed">
                  {cta.description}
                </p>

                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 text-black font-semibold group-hover:text-gray-700 transition-colors">
                  {cta.action}
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Bottom section */}
        <div className="max-w-2xl mx-auto p-12 bg-gray-50 border border-gray-200 rounded-lg text-center">
          <h3 className="text-2xl font-semibold text-black mb-4">Not sure which option is right for you?</h3>
          <p className="text-gray-600 mb-8">
            Let's have a brief conversation to understand your needs and find the best path forward for your project.
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
            Talk to Our Team
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  )
}

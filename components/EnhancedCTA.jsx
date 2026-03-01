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
    <section className="py-24 bg-gradient-to-br from-apple-light via-white to-apple-light">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 border border-blue-100">
            → Get Started Today
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-6">
            Ready to get started?
          </h2>
          <p className="text-lg text-apple-space-gray font-light">
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
              className="group border border-apple-light-secondary bg-white hover:bg-apple-light hover:border-apple-space-gray rounded-2xl p-8 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              {/* Card content */}
              <div className="flex flex-col h-full">
                {/* Title */}
                <h3 className="text-xl font-semibold text-apple-dark mb-4">
                  {cta.title}
                </h3>

                {/* Description */}
                <p className="text-apple-space-gray text-sm mb-8 flex-grow leading-relaxed font-light">
                  {cta.description}
                </p>

                {/* CTA Button */}
                <div className="inline-flex items-center gap-2 text-apple-blue font-semibold group-hover:text-apple-blue-hover transition-colors">
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
        <div className="max-w-2xl mx-auto p-12 bg-white border border-apple-light-secondary rounded-2xl text-center shadow-sm">
          <h3 className="text-2xl font-semibold text-apple-dark mb-4">Not sure which option is right for you?</h3>
          <p className="text-apple-space-gray mb-8 font-light">
            Let's have a brief conversation to understand your needs and find the best path forward for your project.
          </p>
          <a href="#contact" className="inline-flex items-center gap-2 px-8 py-3 bg-apple-dark text-white font-semibold rounded-lg hover:bg-apple-dark-secondary transition-colors">
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

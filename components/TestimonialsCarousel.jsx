'use client'

import { useState } from 'react'

export default function TestimonialsCarousel({ testimonials = [] }) {
  const [current, setCurrent] = useState(0)

  // If no testimonials, show empty state
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-24 bg-gradient-to-br from-apple-light via-white to-apple-light">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-block mb-4 px-4 py-2 border border-blue-200 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 backdrop-blur-sm">
              → Client Testimonials
            </div>
            <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-8">
              What Our Clients Say
            </h2>
            <p className="text-lg text-apple-space-gray mb-8 font-light">
              Be the first to share your story working with Anjal Ventures. Submit your testimonial below.
            </p>
            <a href="#testimonial-form" className="inline-block px-6 py-3 bg-apple-dark text-white font-semibold rounded-lg hover:bg-apple-dark-secondary transition-colors">
              Submit Your Testimonial ↓
            </a>
          </div>
        </div>
      </section>
    )
  }

  const goToSlide = (index) => setCurrent(index)
  const nextSlide = () => setCurrent((prev) => (prev + 1) % testimonials.length)
  const prevSlide = () => setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)

  const testimonial = testimonials[current]

  return (
    <section className="py-24 bg-gradient-to-br from-apple-light via-white to-apple-light">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <div className="inline-block mb-4 px-4 py-2 border border-blue-200 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 backdrop-blur-sm">
            → Trusted by Industry Leaders
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-6">
            What Our Clients Say
          </h2>
        </div>

        {/* Testimonial card - Premium design */}
        <div className="max-w-3xl mx-auto mb-16">
          <div className="bg-white/80 backdrop-blur-sm border border-apple-light-secondary rounded-2xl p-12 lg:p-16 shadow-lg shadow-blue-50/50">
            {/* Quote mark */}
            <div className="text-5xl text-gray-300 mb-4">"</div>

            {/* Quote */}
            <blockquote className="text-xl lg:text-2xl text-apple-dark leading-relaxed mb-10 font-light">
              {testimonial.message}
            </blockquote>

            {/* Rating */}
            {testimonial.rating && (
              <div className="flex gap-1 mb-8">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}>
                    ★
                  </span>
                ))}
              </div>
            )}

            {/* Author info - Premium styling */}
            <div className="border-t border-apple-light-secondary pt-8 space-y-1">
              <p className="font-semibold text-lg text-apple-dark">{testimonial.name}</p>
              {testimonial.role && <p className="text-sm font-medium text-apple-space-gray">{testimonial.role}</p>}
              {testimonial.company && <p className="text-sm text-gray-500">{testimonial.company}</p>}
            </div>
          </div>
        </div>

        {/* Navigation - Refined */}
        <div className="flex justify-center items-center gap-8">
          <button
            onClick={prevSlide}
            className="group w-12 h-12 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all flex items-center justify-center text-lg font-light"
            aria-label="Previous testimonial"
          >
            ←
          </button>

          <div className="flex gap-3">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all ${
                  index === current
                    ? 'w-8 h-2 bg-black'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="group w-12 h-12 rounded-full border border-gray-300 hover:border-black hover:bg-black hover:text-white transition-all flex items-center justify-center text-lg font-light"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 mt-20" />
      </div>
    </section>
  )
}

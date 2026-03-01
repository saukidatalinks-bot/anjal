'use client'

import { useState } from 'react'

export default function TestimonialsCarousel({ testimonials = [] }) {
  const [current, setCurrent] = useState(0)

  // If no testimonials, show empty state
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-4xl font-semibold text-black mb-6">
              Client Testimonials
            </h2>
            <div className="h-1 w-12 bg-black mx-auto mb-8" />
            <p className="text-lg text-gray-600 mb-8">
              Share your experience with us. Testimonials from satisfied clients will appear here.
            </p>
            <a href="/admin" className="text-sm font-semibold text-black hover:text-gray-600 transition-colors">
              Manage testimonials in admin →
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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-20 max-w-2xl mx-auto">
          <h2 className="text-4xl font-semibold text-black mb-6">
            Client Testimonials
          </h2>
          <div className="h-1 w-12 bg-black mx-auto" />
        </div>

        {/* Testimonial card */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-gray-50 rounded-lg p-12 min-h-72">
            {/* Quote */}
            <blockquote className="text-xl text-black leading-relaxed mb-8 font-light">
              "{testimonial.quote}"
            </blockquote>

            {/* Author info */}
            <div className="border-t border-gray-200 pt-6 space-y-1">
              <p className="font-semibold text-black">{testimonial.author}</p>
              <p className="text-sm text-gray-600">{testimonial.role}</p>
              <p className="text-sm text-gray-500">{testimonial.company}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-center items-center gap-8">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full border border-black hover:bg-black hover:text-white transition-all flex items-center justify-center"
            aria-label="Previous testimonial"
          >
            ←
          </button>

          <div className="flex gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`rounded-full transition-all ${
                  index === current
                    ? 'w-6 h-2 bg-black'
                    : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full border border-black hover:bg-black hover:text-white transition-all flex items-center justify-center"
            aria-label="Next testimonial"
          >
            →
          </button>
        </div>
      </div>
    </section>
  )
}

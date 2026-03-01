'use client'

import { useEffect, useState } from 'react'

export default function TestimonialsCarousel() {
  const [current, setCurrent] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  const testimonials = [
    {
      id: 1,
      quote: "Anjal Ventures transformed our business with a scalable web application. Their team's expertise and dedication were exceptional.",
      author: "Musa Hassan",
      role: "CEO, TechHub Nigeria",
      company: "TechHub Nigeria",
      rating: 5,
      avatar: "MH"
    },
    {
      id: 2,
      quote: "The mobile app they built for us increased our customer engagement by 300%. Professional, timely, and results-driven.",
      author: "Aisha Mohammed",
      role: "Founder, E-Commerce Plus",
      company: "E-Commerce Plus",
      rating: 5,
      avatar: "AM"
    },
    {
      id: 3,
      quote: "Outstanding service! They delivered our AI chatbot on time and within budget. Highly recommend.",
      author: "Ibrahim Yakubu",
      role: "Operations Director, FinTech Solutions",
      company: "FinTech Solutions",
      rating: 5,
      avatar: "IY"
    },
    {
      id: 4,
      quote: "Enterprise-level infrastructure built by a local team that actually understands African market challenges. Impressive!",
      author: "Fatima Bello",
      role: "CTO, Logistics Networks Ltd",
      company: "Logistics Networks Ltd",
      rating: 5,
      avatar: "FB"
    },
  ]

  useEffect(() => {
    if (!isAutoplay) return

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoplay, testimonials.length])

  const goToSlide = (index) => {
    setCurrent(index)
    setIsAutoplay(false)
  }

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length)
    setIsAutoplay(false)
  }

  const prevSlide = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setIsAutoplay(false)
  }

  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 via-navy to-slate-900 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 right-20 w-96 h-96 bg-brand-gold rounded-full mix-blend-screen filter blur-3xl" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-brand-green rounded-full mix-blend-screen filter blur-3xl" />
      </div>

      <div className="relative z-10 container mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-gold to-brand-green">Industry Leaders</span>
          </h2>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            See what our clients say about working with Anjal Ventures
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Main testimonial card */}
          <div className="mb-12">
            {testimonials.map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`absolute inset-0 transition-all duration-1000 ${
                  index === current
                    ? 'opacity-100 translate-x-0'
                    : index < current
                    ? 'opacity-0 -translate-x-full'
                    : 'opacity-0 translate-x-full'
                }`}
              >
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 min-h-96">
                  {/* Stars */}
                  <div className="flex gap-1 mb-6">
                    {Array(testimonial.rating)
                      .fill(0)
                      .map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 fill-brand-gold"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                  </div>

                  {/* Quote */}
                  <p className="text-2xl text-white/90 mb-8 font-light italic">
                    "{testimonial.quote}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-brand-gold to-brand-green flex items-center justify-center font-bold text-navy text-lg">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{testimonial.author}</div>
                      <div className="text-sm text-white/60">{testimonial.role}</div>
                      <div className="text-xs text-brand-gold font-semibold">{testimonial.company}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <div className="h-96" /> {/* Spacer */}
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevSlide}
              className="group w-12 h-12 rounded-full border border-brand-gold/50 flex items-center justify-center hover:bg-brand-gold/10 transition-all hover:border-brand-gold"
            >
              <svg className="w-6 h-6 text-brand-gold group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all ${
                    index === current
                      ? 'bg-brand-gold w-8'
                      : 'bg-white/30 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={nextSlide}
              className="group w-12 h-12 rounded-full border border-brand-gold/50 flex items-center justify-center hover:bg-brand-gold/10 transition-all hover:border-brand-gold"
            >
              <svg className="w-6 h-6 text-brand-gold group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Client logos row */}
          <div className="mt-16 pt-12 border-t border-white/10">
            <p className="text-center text-white/60 text-sm font-semibold uppercase tracking-wider mb-8">Trusted by leading companies</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 opacity-60">
              {['TechHub Nigeria', 'E-Commerce Plus', 'FinTech Solutions', 'Logistics Networks'].map((company, i) => (
                <div key={i} className="flex items-center justify-center py-4 border border-white/10 rounded-lg hover:border-brand-gold/50 transition-colors">
                  <span className="text-white/50 font-semibold text-sm text-center">{company}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

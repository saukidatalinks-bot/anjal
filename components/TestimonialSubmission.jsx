'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function TestimonialSubmission() {
  const [form, setForm] = useState({
    name: '',
    company: '',
    role: '',
    message: '',
    email: '',
    rating: 5
  })
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in all required fields')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/testimonials/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      if (!response.ok) throw new Error('Failed to submit')

      setSubmitted(true)
      toast.success('Thank you! Your testimonial is awaiting approval.')
      setForm({ name: '', company: '', role: '', message: '', email: '', rating: 5 })
      
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      toast.error('Failed to submit testimonial. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-16">
          <div className="inline-block mb-4 px-4 py-2 border border-gray-300/80 rounded-full text-xs font-semibold text-gray-700 bg-white/50 backdrop-blur-sm">
            → Share Your Experience
          </div>
          <h2 className="text-4xl md:text-5xl font-semibold text-black mb-4">
            Let Others Know Your Story
          </h2>
          <p className="text-gray-600">
            Your feedback helps other businesses discover us. Share your experience working with Anjal Ventures.
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-8 lg:p-12 shadow-lg shadow-gray-100/50">
          {submitted ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">✓</div>
              <h3 className="text-2xl font-semibold text-black mb-2">Thank You!</h3>
              <p className="text-gray-600">
                Your testimonial has been received and will be reviewed by our team before appearing on our website.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name and Email */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="John Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="john@company.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Company and Role */}
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Company/Organization
                  </label>
                  <input
                    type="text"
                    placeholder="Your Company"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">
                    Your Role/Title
                  </label>
                  <input
                    type="text"
                    placeholder="CEO, Founder, etc."
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all bg-white"
                  />
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Rating
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setForm({ ...form, rating: star })}
                      className={`text-3xl transition-all ${
                        star <= form.rating ? 'text-yellow-400' : 'text-gray-300'
                      } hover:scale-110`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold text-black mb-3">
                  Your Testimonial *
                </label>
                <textarea
                  required
                  rows={6}
                  placeholder="Share your experience working with us. What made the project successful? What would you recommend to others?"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black/10 transition-all bg-white resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-4 bg-black text-white font-semibold rounded-lg hover:bg-gray-900 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting...' : 'Submit Testimonial'}
              </button>

              <p className="text-xs text-gray-500 text-center">
                Your testimonial will be reviewed and approved by our team before appearing on the website.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

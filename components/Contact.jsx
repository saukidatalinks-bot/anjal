'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function Contact({ settings = {}, services = [] }) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in your name, email and message')
      return
    }
    setLoading(true)
    try {
      // Save to database
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      // Send via EmailJS if configured
      const pubKey = settings?.emailjs_public_key
      const serviceId = settings?.emailjs_service_id
      const templateId = settings?.emailjs_template_id

      if (pubKey && serviceId && templateId && typeof window !== 'undefined') {
        try {
          if (!window._ejsInit) {
            const emailjs = (await import('@emailjs/browser')).default
            emailjs.init(pubKey)
            window._ejsInit = emailjs
          }
          const result = await window._ejsInit.send(serviceId, templateId, {
            from_name: form.name,
            from_email: form.email,
            phone: form.phone || 'Not provided',
            service: form.service || 'Not specified',
            budget: form.budget || 'Not specified',
            message: form.message,
            to_email: settings?.company_email || 'contact@anjal.com',
          })
          console.log('✓ EmailJS sent successfully:', result)
        } catch (e) {
          console.error('✗ EmailJS send failed:', e.message, e)
          toast.error('Message saved but email notification failed. We will still receive it through our system.')
        }
      } else if (!pubKey || !serviceId || !templateId) {
        console.warn('⚠ EmailJS not configured. Message saved to database only.')
      }

      setSent(true)
      toast.success("Message sent! We'll respond within 24 hours.")
      setForm({ name: '', email: '', phone: '', service: '', budget: '', message: '' })
    } catch (err) {
      toast.error('Failed to send message. Please try again.')
    }
    setLoading(false)
  }

  const email1 = settings.company_email || 'anjalventures@gmail.com'
  const email2 = settings.company_email2 || 'contact@anjal.com'
  const wa = settings.company_whatsapp || '2348164135836'
  const address = settings.company_address || 'Damaturu, Yobe State, Nigeria'
  const phone = settings.company_phone || '+234 000 000 0000'

  return (
    <section id="contact" className="section bg-gradient-to-br from-apple-light via-white to-apple-light py-24">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Left Info */}
          <div className="lg:col-span-2">
            <div className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 border border-blue-100">
              → Contact Us
            </div>
            <h2 className="text-4xl font-semibold text-apple-dark mb-6 leading-tight">
              Ready to start your project?
            </h2>
            <p className="text-apple-space-gray leading-relaxed mb-10 text-base font-light">
              From a simple business website to an enterprise platform — we're ready to help. Contact us for a free consultation.
            </p>

            {[
              { label: 'Email', value: email1, href: `mailto:${email1}` },
              { label: 'Alternative Email', value: email2, href: `mailto:${email2}` },
              { label: 'Phone', value: phone, href: `tel:${phone}` },
              { label: 'WhatsApp', value: 'Chat on WhatsApp', href: `https://wa.me/${wa.replace(/[^0-9]/g,'')}` },
              { label: 'Location', value: address, href: null },
            ].map(({ label, value, href }) => (
              <div key={label} className="mb-6">
                <div className="text-xs font-semibold text-apple-blue uppercase tracking-wider mb-2">{label}</div>
                {href
                  ? <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener"
                      className="text-apple-dark font-medium hover:text-apple-blue transition-colors">{value}</a>
                  : <span className="text-apple-dark font-medium">{value}</span>
                }
              </div>
            ))}
          </div>

          {/* Right Form */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-apple-light-secondary rounded-2xl p-10 shadow-sm">
              <h3 className="text-2xl font-semibold text-apple-dark mb-8">Send us a message</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Full Name *</label>
                  <input className="w-full px-4 py-3 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-colors" 
                    placeholder="Your full name" 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Email *</label>
                  <input type="email" className="w-full px-4 py-3 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-colors" 
                    placeholder="your@email.com" 
                    value={form.email} 
                    onChange={e => setForm({ ...form, email: e.target.value })} 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Phone / WhatsApp</label>
                  <input className="w-full px-4 py-3 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-colors" 
                    placeholder="+234 000 000 0000" 
                    value={form.phone} 
                    onChange={e => setForm({ ...form, phone: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-apple-dark mb-2">Service Interested In</label>
                  <select className="w-full px-4 py-3 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-colors focus:ring-0" 
                    value={form.service} 
                    onChange={e => setForm({ ...form, service: e.target.value })}>
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    <option value="Other">Other / Consultation</option>
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-apple-dark mb-2">Budget Range</label>
                <select className="w-full px-4 py-3 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-colors focus:ring-0" 
                  value={form.budget} 
                  onChange={e => setForm({ ...form, budget: e.target.value })}>
                  <option value="">Select a budget range...</option>
                  <option>$100 – $300 (Starter)</option>
                  <option>$300 – $700 (Business)</option>
                  <option>$700 – $2,000 (Professional)</option>
                  <option>$2,000+ (Enterprise)</option>
                  <option>Let's discuss</option>
                </select>
              </div>

              <div className="mb-8">
                <label className="block text-sm font-medium text-apple-dark mb-2">Your Message *</label>
                <textarea className="w-full px-4 py-3 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-colors" 
                  rows={5} 
                  placeholder="Tell us about your project, goals and requirements..." 
                  value={form.message} 
                  onChange={e => setForm({ ...form, message: e.target.value })} 
                />
              </div>

              {sent ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center text-apple-blue font-semibold text-sm mb-4">
                  ✓ Message sent! We'll respond within 24 hours.
                </div>
              ) : null}

              <button onClick={handleSubmit} disabled={loading}
                className="w-full px-6 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 text-base">
                {loading ? 'Sending...' : 'Send Message →'}
              </button>

              <p className="text-xs text-gray-500 text-center mt-4">
                By submitting, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

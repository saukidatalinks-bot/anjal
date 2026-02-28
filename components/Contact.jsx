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
  const wa = settings.company_whatsapp || '2348000000000'
  const address = settings.company_address || 'Damaturu, Yobe State, Nigeria'
  const phone = settings.company_phone || '+234 000 000 0000'

  return (
    <section id="contact" className="section bg-navy">
      <div className="container mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-16 items-start">
          {/* Left Info */}
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 bg-brand-green/15 border border-brand-green/30 text-brand-green-light px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5">
              <span className="w-1.5 h-1.5 bg-brand-green-light rounded-full" />
              Get In Touch
            </div>
            <h2 className="font-display text-4xl text-white mb-5 leading-tight">
              Ready to Build Your Digital Future?
            </h2>
            <p className="text-white/55 leading-relaxed mb-8 text-sm">
              From a simple business website to an enterprise SaaS platform — we're ready to deliver. Contact us today for a free consultation and let's discuss your project.
            </p>

            {[
              { icon: '📧', label: 'Primary Email', value: email1, href: `mailto:${email1}` },
              { icon: '📩', label: 'Business Email', value: email2, href: `mailto:${email2}` },
              { icon: '📞', label: 'Phone', value: phone, href: `tel:${phone}` },
              { icon: '💬', label: 'WhatsApp', value: 'Chat on WhatsApp →', href: `https://wa.me/${wa.replace(/[^0-9]/g,'')}` },
              { icon: '📍', label: 'Headquarters', value: address, href: null },
              { icon: '🏛️', label: 'Registration', value: `CAC ${settings.company_cac || 'BN 9258709'}`, href: null },
            ].map(({ icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 mb-5">
                <div className="w-11 h-11 bg-white/8 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                  {icon}
                </div>
                <div>
                  <div className="text-xs text-white/40 uppercase tracking-widest font-semibold mb-1">{label}</div>
                  {href
                    ? <a href={href} target={href.startsWith('http') ? '_blank' : '_self'} rel="noopener"
                        className="text-white text-sm font-medium hover:text-brand-green-light transition-colors">{value}</a>
                    : <span className="text-white text-sm font-medium">{value}</span>
                  }
                </div>
              </div>
            ))}
          </div>

          {/* Right Form */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl p-8 lg:p-10">
              <h3 className="font-display text-2xl text-navy mb-7">Send Us a Message</h3>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Full Name *</label>
                  <input className="input-field" placeholder="Your full name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label className="label">Email *</label>
                  <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="label">Phone / WhatsApp</label>
                  <input className="input-field" placeholder="+234 000 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div>
                  <label className="label">Service Interested In</label>
                  <select className="input-field" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                    <option value="">Select a service...</option>
                    {services.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                    <option value="Other / Consultation">Other / Consultation</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="label">Budget Range</label>
                <select className="input-field" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                  <option value="">Select a budget range...</option>
                  <option>$100 – $300 (Starter)</option>
                  <option>$300 – $700 (Business)</option>
                  <option>$700 – $2,000 (Professional)</option>
                  <option>$2,000+ (Enterprise)</option>
                  <option>Let's discuss</option>
                </select>
              </div>
              <div className="mb-6">
                <label className="label">Your Message *</label>
                <textarea className="input-field" rows={5} placeholder="Tell us about your project, goals and any specific requirements..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>

              {sent ? (
                <div className="bg-brand-green-pale border border-brand-green rounded-xl p-5 text-center text-brand-green font-semibold">
                  ✅ Message sent! We'll respond within 24 hours.
                </div>
              ) : (
                <button onClick={handleSubmit} disabled={loading}
                  className="btn btn-green w-full justify-center py-4 text-base">
                  {loading ? 'Sending...' : 'Send Message →'}
                </button>
              )}

              <p className="text-xs text-slate-400 text-center mt-4">
                By submitting, you agree to our Terms & Conditions and Privacy Policy.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

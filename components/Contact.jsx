'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, MapPin, Send, Terminal, Building2, CheckCircle2, FileCheck, ArrowRight } from 'lucide-react'
import { normalizeCompanyAddress, normalizeCacNumber } from '@/lib/company'

export default function Contact({ settings = {}, services = [] }) {
  const [form, setForm] = useState({ name: '', email: '', service: '', budget: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const email1 = settings.company_email || 'contact@anjalventures.com'
  const email2 = settings.company_email2 || 'office@anjalsolutionsltd.com'
  const address = normalizeCompanyAddress(settings.company_address)
  const cac = normalizeCacNumber(settings.company_cac)

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Name, email, and message are required')
      return
    }
    setLoading(true)
    try {
      await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

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
          await window._ejsInit.send(serviceId, templateId, {
            from_name: form.name,
            from_email: form.email,
            phone: 'N/A',
            service: form.service || 'Not specified',
            budget: form.budget || 'Not specified',
            message: form.message,
            to_email: email1,
          })
        } catch {
          toast.error('Message saved, but email notification failed.')
        }
      }

      setSent(true)
      toast.success("Message sent. We'll respond swiftly.")
      setForm({ name: '', email: '', service: '', budget: '', message: '' })
    } catch {
      toast.error('Failed to send message. Please try again.')
    }
    setLoading(false)
  }

  return (
    <section id="contact" className="bg-slate-50 px-5 py-20 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.85fr_1.15fr]">
        <aside>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Official Communications</p>
          <h2 className="text-4xl font-semibold tracking-normal text-slate-950">Direct studio access. No runaround.</h2>
          <p className="mt-5 text-base leading-7 text-slate-600">
            Connect directly with our leadership and engineering teams. We respond promptly with structured technical and commercial next steps.
          </p>

          <div className="mt-10 space-y-4">
            <ContactLink
              icon={Mail}
              label="Corporate & Partnerships"
              value={email1}
              href={`mailto:${email1}`}
              description="New business inquiries, corporate engagements & client onboarding."
            />
            <ContactLink
              icon={Terminal}
              label="Corporate Office & Operations"
              value={email2}
              href={`mailto:${email2}`}
              description="Official correspondence, operations & corporate inquiries."
            />
            <ContactLink
              icon={MapPin}
              label="Registered Headquarters"
              value={address}
              description={`Damaturu, Yobe State, Nigeria · RC: ${cac}`}
            />
            <div className="pt-1">
              <a
                href="/docs/certificate-anjal-solutions-ltd.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-700 hover:text-blue-900 transition"
              >
                <FileCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>View Official CAC Certificate (RC {cac})</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">Guaranteed Response SLA</span>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              All inquiries received via official emails receive a written technical response within 24 business hours.
            </p>
          </div>
        </aside>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-10">
          <h3 className="text-xl font-semibold text-slate-950">Initiate a Project Brief</h3>
          <p className="mt-1 text-sm text-slate-500">Provide high-level context and we will prepare a dedicated project evaluation.</p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <Input label="Your Name" value={form.name} onChange={v => setForm({ ...form, name: v })} placeholder="e.g. Alex Morgan" required />
            <Input label="Work Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} placeholder="alex@company.com" required />
            
            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Project Type</span>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white" value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                <option value="">Select scope</option>
                {services.map(s => <option key={s.id || s.name} value={s.name}>{s.name}</option>)}
                <option value="Mobile App (iOS & Android)">Mobile App (iOS & Android)</option>
                <option value="Web Platform & Cloud System">Web Platform & Cloud System</option>
                <option value="SaaS Architecture">SaaS Architecture</option>
                <option value="AI & Process Automation">AI & Process Automation</option>
                <option value="Strategic Architecture Consultation">Strategic Architecture Consultation</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Estimated Budget</span>
              <select className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
                <option value="">Select target budget</option>
                <option>$1,000 - $3,000 (Sprint Launch)</option>
                <option>$3,000 - $7,000 (Production System)</option>
                <option>$7,000 - $15,000 (Enterprise Product)</option>
                <option>$15,000+ (Custom Infrastructure)</option>
                <option>To be evaluated with team</option>
              </select>
            </label>

            <label className="md:col-span-2 block">
              <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">Project Scope & Objectives *</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
                placeholder="Describe what you are building, target timeline, and any specific technical requirements..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-900 outline-none transition focus:border-slate-950 focus:bg-white"
                required
              />
            </label>
          </div>

          {sent && (
            <div className="mt-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">
              <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
              <span>Your message has been transmitted directly to our studio team. An engineer will follow up shortly.</span>
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-600 disabled:opacity-60"
          >
            {loading ? 'Transmitting Brief...' : 'Send Message'}
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function ContactLink({ icon: Icon, label, value, href, description }) {
  const content = (
    <div className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="flex items-start gap-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-slate-900 transition group-hover:bg-slate-950 group-hover:text-white">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
          <span className="mt-1 block font-mono text-sm font-semibold text-slate-950 break-all">{value}</span>
          {description && (
            <span className="mt-1.5 block text-xs leading-relaxed text-slate-500">{description}</span>
          )}
        </div>
      </div>
    </div>
  )
  if (!href) return content
  return <a href={href} className="block transition hover:-translate-y-0.5">{content}</a>
}

function Input({ label, value, onChange, placeholder = '', type = 'text', required }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-700">
        {label}{required ? ' *' : ''}
      </span>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-950 outline-none transition focus:border-slate-950 focus:bg-white"
      />
    </label>
  )
}

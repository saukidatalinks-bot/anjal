'use client'

import { useId, useState } from 'react'
import { CheckCircle2, Mail, MapPin, MessageCircle, Phone, Send, ShieldCheck } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import {
  companyDisplayName,
  officialEmails,
  officialPhone,
  officialWhatsapp,
  registeredCacNumber,
  registeredDunsNumber,
  registeredOfficeAddress,
  registeredTinNumber,
} from '@/lib/company'
import { sendEmailJsNotification } from '@/lib/emailjs'

const BUDGET_RANGES = [
  '₦150,000 – ₦449,999 (Launch / Delivery System)',
  '₦500,000 – ₦649,999 (Growth / E-Commerce Suite)',
  '₦849,999+ (Restaurant Suite / Custom App)',
  'Enterprise Custom SLA',
]

export default function Contact({ settings = {}, services = [] }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: services[0]?.name || 'Custom Software & Web Engineering',
    budget: BUDGET_RANGES[0],
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [statusNote, setStatusNote] = useState('')

  const nameId = useId()
  const emailId = useId()
  const phoneId = useId()
  const serviceId = useId()
  const budgetId = useId()
  const messageId = useId()

  const whatsappDigits = (settings.company_whatsapp || officialWhatsapp).replace(/[^0-9]/g, '')
  const primaryEmail = settings.company_email || officialEmails.general
  const secondaryEmail = settings.company_email2 || officialEmails.secondary
  const devEmail = settings.company_email3 || officialEmails.developer
  const phoneDisplay = settings.company_phone || officialPhone
  const officeAddress = settings.company_address || registeredOfficeAddress

  const handleSubmit = async event => {
    event.preventDefault()
    if (submitting) return
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setStatusNote('Please complete your name, email address, and project message.')
      toast.error('Please fill all required fields.')
      return
    }

    setSubmitting(true)
    setStatusNote('Sending inquiry to Anjal Solutions LTD...')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Could not send message')
      }

      await sendEmailJsNotification(settings, {
        from_name: form.name,
        from_email: form.email,
        phone: form.phone || 'Not provided',
        service: form.service,
        budget: form.budget,
        message: form.message,
      })

      setSubmitted(true)
      setStatusNote('Inquiry received. Our engineering desk will respond shortly.')
      toast.success('Inquiry delivered to Anjal Solutions LTD')
    } catch (error) {
      console.error('Contact submission error:', error)
      setStatusNote(error.message || 'Submission failed. Please try again or reach us via WhatsApp.')
      toast.error(error.message || 'Failed to submit inquiry')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <Toaster position="top-right" />
      <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div className="space-y-6">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-6 text-white sm:p-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{companyDisplayName}</span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold tracking-tight text-white">Direct Corporate Channels</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              Reach management, client delivery, or our developer desk directly by email, phone, or WhatsApp.
            </p>

            <dl className="mt-6 space-y-4 border-t border-white/10 pt-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Headquarters</dt>
                  <dd className="mt-1 text-slate-200">{officeAddress}</dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Telephone & WhatsApp</dt>
                  <dd className="mt-1 flex flex-wrap gap-3">
                    <a href={`tel:${phoneDisplay.replace(/\s+/g, '')}`} className="font-mono text-white hover:text-blue-300">
                      {phoneDisplay}
                    </a>
                    <a
                      href={`https://wa.me/${whatsappDigits}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/30"
                    >
                      <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
                      WhatsApp Chat
                    </a>
                  </dd>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" aria-hidden="true" />
                <div>
                  <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Official Email Desks</dt>
                  <dd className="mt-1 space-y-1">
                    <a href={`mailto:${primaryEmail}`} className="block text-slate-200 hover:text-white">
                      {primaryEmail} <span className="text-xs text-slate-400">(Corporate Office)</span>
                    </a>
                    <a href={`mailto:${secondaryEmail}`} className="block text-slate-200 hover:text-white">
                      {secondaryEmail} <span className="text-xs text-slate-400">(Client Desk)</span>
                    </a>
                    <a href={`mailto:${devEmail}`} className="block text-slate-200 hover:text-white">
                      {devEmail} <span className="text-xs text-slate-400">(Engineering & APIs)</span>
                    </a>
                  </dd>
                </div>
              </div>
            </dl>

            <div className="mt-6 rounded-lg border border-white/10 bg-white/[0.04] p-3.5 font-mono text-xs text-slate-300">
              RC: {settings.company_cac || registeredCacNumber} · TIN: {settings.company_tin || registeredTinNumber} · D-U-N-S: {settings.company_duns || registeredDunsNumber}
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">Project & Advisory Form</p>
          <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Send a Brief to Engineering</h2>
          <p className="mt-1 text-sm text-slate-600">Share your objectives, preferred tier, or partnership inquiry below.</p>

          {submitted ? (
            <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-900">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
              <h3 className="mt-3 text-lg font-semibold">Message Received</h3>
              <p className="mt-2 text-sm leading-relaxed text-emerald-800">
                Thank you for contacting {companyDisplayName}. Our team will follow up via email or {phoneDisplay}.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false)
                  setStatusNote('')
                  setForm(prev => ({ ...prev, message: '' }))
                }}
                className="mt-4 rounded-lg bg-slate-950 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={nameId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Full Name *
                  </label>
                  <input
                    id={nameId}
                    type="text"
                    required
                    autoComplete="name"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    placeholder="Your name"
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor={emailId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Email Address *
                  </label>
                  <input
                    id={emailId}
                    type="email"
                    required
                    autoComplete="email"
                    inputMode="email"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@company.com"
                    className="input-field"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor={phoneId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Phone / WhatsApp
                  </label>
                  <input
                    id={phoneId}
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234..."
                    className="input-field"
                  />
                </div>
                <div>
                  <label htmlFor={serviceId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                    Service Area
                  </label>
                  <select
                    id={serviceId}
                    value={form.service}
                    onChange={e => setForm({ ...form, service: e.target.value })}
                    className="input-field"
                  >
                    {services.map(s => (
                      <option key={s.id || s.name} value={s.name}>
                        {s.name}
                      </option>
                    ))}
                    <option value="Restaurant & Ordering Suite">Restaurant & Ordering Suite</option>
                    <option value="Delivery & Rider Logistics System">Delivery & Rider Logistics System</option>
                    <option value="ICT Consulting & Training">ICT Consulting & Training</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor={budgetId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Estimated Budget (₦)
                </label>
                <select
                  id={budgetId}
                  value={form.budget}
                  onChange={e => setForm({ ...form, budget: e.target.value })}
                  className="input-field"
                >
                  {BUDGET_RANGES.map(range => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor={messageId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                  Project Scope or Inquiry *
                </label>
                <textarea
                  id={messageId}
                  rows={4}
                  required
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  placeholder="Tell us about your operational requirements, timeline, or desired suite..."
                  className="input-field"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send className="h-4 w-4" aria-hidden="true" />
                {submitting ? 'Sending Message...' : 'Send Inquiry to Anjal Solutions'}
              </button>

              <p role="status" aria-live="polite" className="min-h-[1.25rem] text-xs text-slate-600">
                {statusNote}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}

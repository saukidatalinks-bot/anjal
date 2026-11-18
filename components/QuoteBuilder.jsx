'use client'

import { useEffect, useId, useMemo, useState } from 'react'
import { Check, Download, FileCheck2, Send, ShieldCheck } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import { companyDisplayName, managementSignoff } from '@/lib/company'
import { sendEmailJsNotification } from '@/lib/emailjs'
import { formatNaira } from '@/lib/format'
import { fallbackCalculator } from '@/lib/platform-data'
import { generateProposalPdf } from '@/lib/proposal-pdf'

function itemPrice(item) {
  return Number(item?.base_price || 0)
}

function isMaintenanceSuite(items = []) {
  return items.some(item => {
    const label = String(item?.name || '').toLowerCase()
    return label.includes('restaurant') || label.includes('delivery') || label.includes('commerce') || label.includes('vendor')
  })
}

export default function QuoteBuilder({ calculator = {}, settings = {}, initialPackage = '' }) {
  const platforms = useMemo(
    () => (calculator.platform?.length ? calculator.platform : calculator.type?.length ? calculator.type : fallbackCalculator.platform),
    [calculator.platform, calculator.type]
  )
  const scopes = useMemo(
    () => (calculator.scope?.length ? calculator.scope : calculator.scale?.length ? calculator.scale : fallbackCalculator.scope),
    [calculator.scope, calculator.scale]
  )
  const designs = useMemo(
    () => (calculator.design?.length ? calculator.design : fallbackCalculator.design),
    [calculator.design]
  )
  const timelines = useMemo(
    () => (calculator.timeline?.length ? calculator.timeline : fallbackCalculator.timeline),
    [calculator.timeline]
  )
  const supports = useMemo(
    () => (calculator.support?.length ? calculator.support : fallbackCalculator.support),
    [calculator.support]
  )
  const addonItems = useMemo(
    () => (calculator.addon?.length ? calculator.addon : fallbackCalculator.addon),
    [calculator.addon]
  )

  const [platform, setPlatform] = useState(() => platforms[0] || null)
  const [scope, setScope] = useState(() => scopes[0] || null)
  const [design, setDesign] = useState(() => designs[0] || null)
  const [timeline, setTimeline] = useState(() => timelines[0] || null)
  const [support, setSupport] = useState(() => supports[0] || null)
  const [addons, setAddons] = useState([])

  useEffect(() => {
    setPlatform(prev => prev || platforms[0] || null)
  }, [platforms])

  useEffect(() => {
    setScope(prev => prev || scopes[0] || null)
  }, [scopes])

  useEffect(() => {
    setDesign(prev => prev || designs[0] || null)
  }, [designs])

  useEffect(() => {
    setTimeline(prev => prev || timelines[0] || null)
  }, [timelines])

  useEffect(() => {
    setSupport(prev => prev || supports[0] || null)
  }, [supports])

  useEffect(() => {
    if (!initialPackage || platforms.length === 0) return
    const query = initialPackage.toLowerCase()
    const matched = platforms.find(
      item =>
        item.name.toLowerCase().includes(query) ||
        query.includes(item.name.toLowerCase()) ||
        (query.includes('launch') && item.name.toLowerCase().includes('launch')) ||
        (query.includes('growth') && item.name.toLowerCase().includes('growth'))
    )
    if (matched) setPlatform(matched)
  }, [initialPackage, platforms])

  const [form, setForm] = useState({
    client_name: '',
    entity_name: '',
    email: '',
    phone: '',
    project_title: '',
    address: '',
    goals: '',
    notes: '',
  })

  const [submitting, setSubmitting] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [lastResult, setLastResult] = useState(null)

  const selectedItems = useMemo(() => {
    return [platform, scope, design, timeline, support, ...addons].filter(Boolean)
  }, [platform, scope, design, timeline, support, addons])

  const baseSum = useMemo(() => {
    return [platform, scope, design, ...addons].filter(Boolean).reduce((sum, item) => sum + itemPrice(item), 0)
  }, [platform, scope, design, addons])

  const timelineMultiplier = Number(timeline?.multiplier || 1)
  const supportFee = itemPrice(support)
  const totalNaira = Math.round(baseSum * timelineMultiplier + supportFee)
  const requiresMaintenance = isMaintenanceSuite(selectedItems)

  const toggleAddon = addon => {
    setAddons(prev =>
      prev.some(item => item.id === addon.id) ? prev.filter(item => item.id !== addon.id) : [...prev, addon]
    )
  }

  const handleSubmit = async event => {
    event.preventDefault()
    if (submitting) return
    if (!form.client_name.trim() || !form.email.trim()) {
      setStatusMessage('Please provide your full name and work email.')
      toast.error('Please enter your full name and email address.')
      return
    }

    setSubmitting(true)
    setStatusMessage('Submitting quotation request and preparing proposal PDF...')

    const itemizedPayload = selectedItems.map(item => ({
      name: item.name,
      category: item.category,
      description: item.description || '',
      price: itemPrice(item),
      calculated_price: itemPrice(item),
      multiplier: Number(item.multiplier || 1),
    }))

    try {
      const response = await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          total_amount: totalNaira,
          total_naira: totalNaira,
          selected_items: itemizedPayload,
          client_payload: { ...form, package: platform?.name },
          proposal_payload: {
            selected_items: itemizedPayload,
            total_naira: totalNaira,
            requires_maintenance: requiresMaintenance,
            signoff: managementSignoff,
          },
          quote_type: 'project',
          source: 'quote-builder',
        }),
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Unable to submit quotation request')
      }

      const reference = data.reference || `AS-${Date.now().toString().slice(-6)}`
      const emailResult = await sendEmailJsNotification(settings, {
        from_name: form.client_name,
        from_email: form.email,
        phone: form.phone || 'Not provided',
        service: platform?.name || 'Custom Quotation',
        budget: formatNaira(totalNaira),
        message: [
          `Quotation Reference: ${reference}`,
          `Company: ${form.entity_name || 'N/A'}`,
          `Project Title: ${form.project_title || platform?.name || 'Custom Build'}`,
          `Selected Components: ${selectedItems.map(i => i.name).join(', ')}`,
          `Estimated Total: ${formatNaira(totalNaira)}`,
          requiresMaintenance ? 'Note: Maintenance fees apply.' : '',
          form.goals ? `Goals: ${form.goals}` : '',
          form.notes ? `Notes: ${form.notes}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      })

      const pdfDoc = await generateProposalPdf({
        reference,
        settings,
        form,
        selectedItems: itemizedPayload,
        totalNaira,
        requiresMaintenance,
      })
      pdfDoc.save(`Anjal-Solutions-Proposal-${reference}.pdf`)

      setLastResult({
        reference,
        totalNaira,
        emailSent: emailResult.sent,
      })
      setStatusMessage(`Proposal ${reference} generated and downloaded cleanly.`)
      toast.success(`Quotation ${reference} saved & PDF downloaded`)
    } catch (error) {
      console.error('Quotation error:', error)
      setStatusMessage(error.message || 'Quotation submission failed. Please try again.')
      toast.error(error.message || 'Could not generate proposal')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 lg:px-8 lg:py-16">
      <Toaster position="top-right" />
      <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.35fr_.85fr] lg:items-start">
        <div className="space-y-6">
          <StepCard
            step="01"
            title="Select System Category or Turnkey Suite"
            description="Choose a turnkey software suite or custom build foundation priced in Nigerian Naira (₦)."
          >
            <div className="grid gap-3 sm:grid-cols-2">
              {platforms.map(item => {
                const selected = platform?.id === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPlatform(item)}
                    aria-pressed={selected}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? 'border-slate-950 bg-slate-950 text-white shadow-sm'
                        : 'border-slate-200 bg-white text-slate-900 hover:border-slate-400'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <span className="text-sm font-semibold">{item.name}</span>
                      <span className={`shrink-0 font-mono text-xs font-bold ${selected ? 'text-emerald-300' : 'text-blue-700'}`}>
                        {formatNaira(itemPrice(item))}
                      </span>
                    </div>
                    {item.description && (
                      <p className={`mt-2 text-xs leading-relaxed ${selected ? 'text-slate-300' : 'text-slate-600'}`}>
                        {item.description}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
          </StepCard>

          <StepCard
            step="02"
            title="Architecture Depth, UI Polish, Timeline & Support"
            description="Select architecture scope, visual identity depth, sprint speed, and post-launch maintenance SLA."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <OptionSelect
                label="Architecture Scope"
                items={scopes}
                value={scope?.id}
                onChange={id => setScope(scopes.find(item => String(item.id) === id) || null)}
              />
              <OptionSelect
                label="Design System Tier"
                items={designs}
                value={design?.id}
                onChange={id => setDesign(designs.find(item => String(item.id) === id) || null)}
              />
              <OptionSelect
                label="Delivery Timeline"
                items={timelines}
                value={timeline?.id}
                onChange={id => setTimeline(timelines.find(item => String(item.id) === id) || null)}
                isMultiplier
              />
              <OptionSelect
                label="Support & Maintenance Plan"
                items={supports}
                value={support?.id}
                onChange={id => setSupport(supports.find(item => String(item.id) === id) || null)}
              />
            </div>
          </StepCard>

          <StepCard
            step="03"
            title="Technical Integrations & Modules"
            description="Optional production capabilities billed cleanly in Nigerian Naira."
          >
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {addonItems.map(addon => {
                const selected = addons.some(item => item.id === addon.id)
                return (
                  <button
                    key={addon.id}
                    type="button"
                    onClick={() => toggleAddon(addon)}
                    aria-pressed={selected}
                    className={`rounded-xl border p-4 text-left transition ${
                      selected
                        ? 'border-slate-950 bg-slate-50 ring-1 ring-slate-950'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded border ${
                          selected ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-300 bg-white'
                        }`}
                      >
                        {selected && <Check className="h-3 w-3" aria-hidden="true" />}
                      </span>
                      <span className="font-mono text-xs font-bold text-blue-700">+{formatNaira(itemPrice(addon))}</span>
                    </div>
                    <p className="mt-3 text-xs font-semibold text-slate-950">{addon.name}</p>
                    {addon.description && <p className="mt-1 text-[11px] leading-relaxed text-slate-500">{addon.description}</p>}
                  </button>
                )
              })}
            </div>
          </StepCard>

          <StepCard
            step="04"
            title="Client & Project Particulars"
            description="Your details populate the formal downloadable Anjal Solutions LTD PDF proposal."
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <FormInput
                label="Full Name *"
                required
                autoComplete="name"
                value={form.client_name}
                onChange={v => setForm({ ...form, client_name: v })}
                placeholder="e.g. Ibrahim Musa"
              />
              <FormInput
                label="Work Email *"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={v => setForm({ ...form, email: v })}
                placeholder="name@organization.com"
              />
              <FormInput
                label="Phone / WhatsApp"
                type="tel"
                autoComplete="tel"
                inputMode="tel"
                value={form.phone}
                onChange={v => setForm({ ...form, phone: v })}
                placeholder="+234 800 000 0000"
              />
              <FormInput
                label="Company / Organization"
                autoComplete="organization"
                value={form.entity_name}
                onChange={v => setForm({ ...form, entity_name: v })}
                placeholder="Organization Name Ltd"
              />
              <FormInput
                label="Project Designation"
                value={form.project_title}
                onChange={v => setForm({ ...form, project_title: v })}
                placeholder="e.g. Restaurant Ordering & Dispatch Suite"
              />
              <FormInput
                label="City / State Address"
                autoComplete="street-address"
                value={form.address}
                onChange={v => setForm({ ...form, address: v })}
                placeholder="e.g. Damaturu, Yobe State"
              />
              <FormTextarea
                label="Core Operational Objectives"
                value={form.goals}
                onChange={v => setForm({ ...form, goals: v })}
                placeholder="What business processes or revenue channels should this platform automate?"
              />
              <FormTextarea
                label="Technical & Integration Notes"
                value={form.notes}
                onChange={v => setForm({ ...form, notes: v })}
                placeholder="Payment gateways (Paystack/Flutterwave), App Store accounts, SMS/WhatsApp providers, or custom APIs..."
              />
            </div>
          </StepCard>
        </div>

        <aside className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">Live Summary</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-950">Formal Naira Estimate</h2>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-600" aria-hidden="true" />
          </div>

          <div className="mt-5 space-y-2.5 text-sm">
            {selectedItems.map(item => (
              <div key={`${item.category}-${item.id}`} className="flex items-start justify-between gap-3">
                <span className="text-slate-600">{item.name}</span>
                <span className="shrink-0 font-mono text-xs font-semibold text-slate-900">
                  {Number(item.multiplier || 1) !== 1 && itemPrice(item) === 0
                    ? `×${Number(item.multiplier).toFixed(2)}`
                    : itemPrice(item) === 0
                      ? 'Included'
                      : formatNaira(itemPrice(item))}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-xl border border-slate-800 bg-slate-950 p-5 text-white">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-400">Estimated Total Investment</p>
            <p className="mt-2 font-mono text-3xl font-bold tracking-tight text-white">{formatNaira(totalNaira)}</p>
            <p className="mt-2 text-xs text-slate-300">
              Prepared under {companyDisplayName} commercial standard.
            </p>
            {requiresMaintenance && (
              <p className="mt-2 rounded-md border border-amber-400/30 bg-amber-500/10 px-2.5 py-1.5 text-[11px] text-amber-200">
                Note: Operational maintenance fees apply to turnkey suite deployments.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? (
              <>Generating Proposal...</>
            ) : (
              <>
                <Download className="h-4 w-4" aria-hidden="true" />
                Save Quote & Download Official PDF
              </>
            )}
          </button>

          <p className="mt-3 text-center text-[11px] text-slate-500">
            Instant branded PDF download + direct submission to our engineering team.
          </p>

          <div role="status" aria-live="polite" className="mt-4">
            {statusMessage && (
              <div
                className={`rounded-lg border p-3 text-xs ${
                  lastResult
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-slate-200 bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-start gap-2">
                  {lastResult ? (
                    <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />
                  ) : (
                    <Send className="mt-0.5 h-4 w-4 shrink-0 text-blue-600" aria-hidden="true" />
                  )}
                  <div>
                    <p className="font-semibold">{statusMessage}</p>
                    {lastResult && (
                      <p className="mt-1 font-mono text-[11px]">
                        Ref: {lastResult.reference} · Total: {formatNaira(lastResult.totalNaira)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </aside>
      </form>
    </div>
  )
}

function StepCard({ step, title, description, children }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6">
      <div className="mb-5 border-b border-slate-100 pb-4">
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-700">Step {step}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-950">{title}</h2>
        {description && <p className="mt-1 text-sm text-slate-600">{description}</p>}
      </div>
      {children}
    </section>
  )
}

function OptionSelect({ label, items = [], value, onChange, isMultiplier = false }) {
  const selectId = useId()
  return (
    <div>
      <label htmlFor={selectId} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </label>
      <select
        id={selectId}
        value={value ? String(value) : ''}
        onChange={e => onChange(e.target.value)}
        className="input-field"
      >
        {items.map(item => (
          <option key={item.id} value={String(item.id)}>
            {item.name}
            {isMultiplier
              ? ` (×${Number(item.multiplier || 1).toFixed(2)})`
              : itemPrice(item) > 0
                ? ` (${formatNaira(itemPrice(item))})`
                : ' (Included)'}
          </option>
        ))}
      </select>
    </div>
  )
}

function FormInput({ label, value, onChange, type = 'text', required = false, placeholder = '', autoComplete, inputMode }) {
  const id = useId()
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint="next"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  )
}

function FormTextarea({ label, value, onChange, placeholder = '' }) {
  const id = useId()
  return (
    <div className="sm:col-span-2">
      <label htmlFor={id} className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="input-field"
      />
    </div>
  )
}

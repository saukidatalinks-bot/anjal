'use client'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

export default function EstimatorAndQuotation({ settings = {}, calculator = {} }) {
  // ─── State for Estimator Section ───
  const types = calculator.type || []
  const scales = calculator.scale || []
  const timelines = calculator.timeline || []
  const supports = calculator.support || []
  const addons = calculator.addon || []

  const [selectedType, setSelectedType] = useState(null)
  const [selectedScale, setSelectedScale] = useState(null)
  const [selectedTimeline, setSelectedTimeline] = useState(null)
  const [selectedSupport, setSelectedSupport] = useState(null)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [estimate, setEstimate] = useState(0)

  // ─── State for Quotation Form ───
  const [form, setForm] = useState({
    client_name: '', entity_name: '', email: '', phone: '', address: '', notes: ''
  })
  const [loading, setLoading] = useState(false)

  const NAIRA_TO_DOLLAR = parseInt(settings?.exchange_rate || 1400)

  // ─── Initialize calculator ───
  useEffect(() => {
    if (types.length) setSelectedType(types[0])
    if (scales.length) setSelectedScale(scales[0])
    if (timelines.length) setSelectedTimeline(timelines[0])
    if (supports.length) setSelectedSupport(supports[0])
  }, [calculator])

  // ─── Calculate estimate ───
  useEffect(() => {
    let base = parseFloat(selectedType?.base_price || 0)
    base += parseFloat(selectedScale?.base_price || 0)
    const timelineMult = parseFloat(selectedTimeline?.multiplier || 1)
    base = base * timelineMult
    base += parseFloat(selectedSupport?.base_price || 0)
    selectedAddons.forEach(a => { base += parseFloat(a.base_price || 0) })
    setEstimate(Math.round(base))
  }, [selectedType, selectedScale, selectedTimeline, selectedSupport, selectedAddons])

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  // ─── Collect selected items for quotation ───
  const selectedItems = []
  if (selectedType) selectedItems.push({ ...selectedType, cat: 'Project Type' })
  if (selectedScale && selectedScale.base_price > 0) selectedItems.push({ ...selectedScale, cat: 'Scale' })
  if (selectedTimeline && selectedTimeline.multiplier > 1) selectedItems.push({ ...selectedTimeline, cat: 'Timeline', base_price: selectedType?.base_price * (selectedTimeline.multiplier - 1) })
  if (selectedSupport && selectedSupport.base_price > 0) selectedItems.push({ ...selectedSupport, cat: 'Support' })
  selectedAddons.forEach(a => selectedItems.push({ ...a, cat: 'Add-on' }))

  const total = selectedItems.reduce((acc, item) => acc + parseFloat(item.base_price || 0), 0)
  const totalNaira = Math.round(total * NAIRA_TO_DOLLAR)

  // ─── PDF Generation ───
  const generatePDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const pageW = 210
    const margin = 18
    const contentW = pageW - margin * 2
    const now = new Date()
    const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-4)}`
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    // Header
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 0, pageW, 55, 'F')
    doc.setFillColor(22, 163, 74)
    doc.rect(0, 55, pageW, 4, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(24)
    doc.setTextColor(255, 255, 255)
    doc.text(settings.company_name || 'Anjal Ventures', margin, 20)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(200, 210, 220)
    doc.text(settings.company_tagline || "Building Africa's Digital Infrastructure", margin, 29)
    doc.text(`CAC: ${settings.company_cac || 'BN 9258709'} · TIN: ${settings.company_tin || '2623553716975'}`, margin, 36)
    doc.text(`${settings.company_email || 'anjalventures@gmail.com'} · ${settings.company_address || 'Damaturu, Yobe State, Nigeria'}`, margin, 43)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(22, 163, 74)
    doc.text('PROJECT ESTIMATE & QUOTATION', pageW - margin, 20, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(200, 210, 220)
    doc.text(quoteNum, pageW - margin, 28, { align: 'right' })
    doc.text(dateStr, pageW - margin, 36, { align: 'right' })

    // Client Info
    let y = 72
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, y - 6, contentW, 40, 3, 3, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(10, 22, 40)
    doc.text('PREPARED FOR', margin + 6, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    doc.text(form.client_name || '—', margin + 6, y + 10)
    if (form.entity_name) {
      doc.setFontSize(9)
      doc.setTextColor(100, 116, 139)
      doc.text(form.entity_name, margin + 6, y + 17)
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(10, 22, 40)
    doc.text('CONTACT', pageW / 2 + 8, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    if (form.email) doc.text(form.email, pageW / 2 + 8, y + 10)
    if (form.phone) doc.text(form.phone, pageW / 2 + 8, y + 17)
    if (form.address) doc.text(form.address, pageW / 2 + 8, y + 24)

    // Estimate Table
    y += 50
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(10, 22, 40)
    doc.text('PROJECT BREAKDOWN', margin, y)
    y += 9

    doc.setFillColor(10, 22, 40)
    doc.roundedRect(margin, y, contentW, 10, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.text('#', margin + 4, y + 6.5)
    doc.text('Item / Service', margin + 12, y + 6.5)
    doc.text('Category', pageW - margin - 55, y + 6.5)
    doc.text('Price (USD)', pageW - margin - 28, y + 6.5)
    doc.text('Price (NGN)', pageW - margin - 6, y + 6.5, { align: 'right' })
    y += 10

    selectedItems.forEach((item, idx) => {
      const rowH = 11
      const itemNaira = Math.round(parseFloat(item.base_price || 0) * NAIRA_TO_DOLLAR)

      doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252)
      doc.rect(margin, y, contentW, rowH, 'F')

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(10, 22, 40)
      doc.text(String(idx + 1), margin + 4, y + 6.5)

      const nameLines = doc.splitTextToSize(item.name, 50)
      if (nameLines.length > 1) {
        doc.text(nameLines[0], margin + 12, y + 6.5)
        nameLines.slice(1).forEach((line, li) => {
          doc.text(line, margin + 12, y + 6.5 + (li + 1) * 5)
        })
      } else {
        doc.text(item.name, margin + 12, y + 6.5)
      }

      doc.setTextColor(100, 116, 139)
      doc.text(item.cat || '—', pageW - margin - 55, y + 6.5)

      doc.setTextColor(22, 163, 74)
      doc.setFont('helvetica', 'bold')
      doc.text(`$${parseFloat(item.base_price).toFixed(2)}`, pageW - margin - 28, y + 6.5)
      doc.text(`₦${itemNaira.toLocaleString()}`, pageW - margin - 6, y + 6.5, { align: 'right' })

      doc.setTextColor(226, 232, 240)
      doc.line(margin, y + rowH, margin + contentW, y + rowH)
      y += rowH
    })

    // Total
    y += 6
    doc.setFillColor(10, 22, 40)
    doc.roundedRect(margin, y, contentW, 14, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text('TOTAL ESTIMATE', margin + 6, y + 9)

    doc.setTextColor(22, 163, 74)
    doc.text(`$${total.toFixed(2)} USD`, pageW - margin - 28, y + 9)
    doc.text(`₦${totalNaira.toLocaleString()}`, pageW - margin - 6, y + 9, { align: 'right' })

    // Notes
    if (form.notes) {
      y += 24
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(10, 22, 40)
      doc.text('ADDITIONAL NOTES', margin, y)
      y += 7
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      const noteLines = doc.splitTextToSize(form.notes, contentW)
      doc.text(noteLines, margin, y)
      y += noteLines.length * 5
    }

    // Terms
    y += 14
    doc.setFontSize(7)
    doc.setTextColor(120, 130, 140)
    const termsText = `Terms: 50% deposit required to commence. Full payment on delivery. This quotation is valid for 30 days. Exchange rate: ₦${NAIRA_TO_DOLLAR.toLocaleString()} per USD (current rate).`
    const termsLines = doc.splitTextToSize(termsText, contentW)
    doc.text(termsLines, margin, y)
    y += termsLines.length * 4 + 3

    doc.text('All deliverables include full source code ownership. Anjal Ventures offers ongoing technical support and maintenance options.', margin, y, { maxWidth: contentW })
    y += 5
    doc.text(`${settings.company_email || 'anjalventures@gmail.com'} · ${settings.company_phone || '+234 (0) 8 1400 11111'} · ${settings.company_address || 'Damaturu, Yobe State, Nigeria'}`, margin, y)

    // Footer
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 285, pageW, 12, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(100, 120, 140)
    doc.text(settings.footer_tagline || 'We Build Digital Excellence — From Damaturu to the World.', pageW / 2, 292, { align: 'center' })

    return doc
  }

  // ─── Handle Download & Send ───
  const handleDownloadAndSend = async () => {
    if (!form.client_name || selectedItems.length === 0) {
      toast.error('Please fill in your name and ensure you have selected services')
      return
    }
    setLoading(true)
    try {
      // 1. Save to database
      await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, selected_items: selectedItems, total_amount: total }),
      })

      // 2. Generate and download PDF
      const doc = await generatePDF()
      const now = new Date()
      const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-4)}`
      doc.save(`Anjal-Ventures-Estimate-${quoteNum}.pdf`)

      // 3. Try to send email via EmailJS
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
            from_name: form.client_name,
            from_email: form.email,
            from_entity: form.entity_name || 'Not provided',
            phone: form.phone || 'Not provided',
            from_address: form.address || 'Not provided',
            total_usd: `$${total.toFixed(2)} USD`,
            total_ngn: `₦${totalNaira.toLocaleString()}`,
            items_count: selectedItems.length,
            message: form.notes || 'No additional notes',
            to_email: settings?.company_email || 'contact@anjal.com',
          })
          console.log('✓ Estimate email sent successfully')
        } catch (e) {
          console.warn('⚠ EmailJS send failed:', e.message)
          toast.warning('Estimate saved & downloaded, but email notification failed. We still received your request.')
        }
      }

      toast.success('✅ Estimate downloaded! Our team will contact you soon.')
      setForm({ client_name: '', entity_name: '', email: '', phone: '', address: '', notes: '' })
    } catch (err) {
      console.error('Error:', err)
      toast.error('Failed to process estimate. Please try again.')
    }
    setLoading(false)
  }

  return (
    <section id="estimator-quotation" className="section bg-gradient-to-br from-apple-light via-white to-apple-light py-24">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="text-center mb-20">
          <div className="inline-block mb-4 px-4 py-2 rounded-full text-xs font-semibold text-apple-blue bg-blue-50 border border-blue-100">
            → Estimate Calculator
          </div>
          <h2 className="text-5xl md:text-6xl font-semibold text-apple-dark mb-6">Design Your Project & Get Instant Estimate</h2>
          <p className="text-lg text-apple-space-gray max-w-2xl mx-auto font-light">
            Step 1: Configure your project requirements · Step 2: Fill your details · Step 3: Download your professional quotation
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* LEFT SIDE: ESTIMATOR */}
          <div className="lg:col-span-2 space-y-8">
            {/* Project Type */}
            {types.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-apple-light-secondary">
                <label className="text-lg font-bold text-apple-dark mb-4 block">🎯 Project Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {types.map(t => (
                    <button key={t.id} onClick={() => setSelectedType(t)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedType?.id === t.id
                          ? 'border-apple-blue bg-blue-50 text-apple-dark'
                          : 'border-apple-light-secondary hover:border-apple-space-gray text-apple-space-gray'
                      }`}>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-apple-blue font-bold mt-1">from ${parseFloat(t.base_price).toFixed(0)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scale, Timeline, Support */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-apple-light-secondary">
              <label className="text-lg font-bold text-apple-dark mb-4 block">⚙️ Customize Your Setup</label>
              <div className="grid md:grid-cols-3 gap-4">
                {scales.length > 0 && (
                  <div>
                    <label className="label text-apple-dark">Project Scale</label>
                    <select className="input-field text-sm border-apple-light-secondary text-apple-dark" value={selectedScale?.id || ''} onChange={e => setSelectedScale(scales.find(s => s.id === parseInt(e.target.value)))}>
                      {scales.map(s => <option key={s.id} value={s.id}>{s.name} {s.base_price > 0 ? `(+$${parseFloat(s.base_price).toFixed(0)})` : ''}</option>)}
                    </select>
                  </div>
                )}
                {timelines.length > 0 && (
                  <div>
                    <label className="label">Timeline Preference</label>
                    <select className="input-field text-sm" value={selectedTimeline?.id || ''} onChange={e => setSelectedTimeline(timelines.find(t => t.id === parseInt(e.target.value)))}>
                      {timelines.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                )}
                {supports.length > 0 && (
                  <div>
                    <label className="label">Support Plan</label>
                    <select className="input-field text-sm" value={selectedSupport?.id || ''} onChange={e => setSelectedSupport(supports.find(s => s.id === parseInt(e.target.value)))}>
                      {supports.map(s => <option key={s.id} value={s.id}>{s.name} {s.base_price > 0 ? `(+$${parseFloat(s.base_price).toFixed(0)})` : ''}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>

            {/* Add-ons */}
            {addons.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-apple-light-secondary">
                <label className="text-lg font-bold text-apple-dark mb-4 block">✨ Add-On Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {addons.map(addon => (
                    <label key={addon.id} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddons.find(a => a.id === addon.id)
                        ? 'border-apple-blue bg-blue-50'
                        : 'border-apple-light-secondary hover:border-apple-space-gray'
                    }`}>
                      <input type="checkbox" className="accent-apple-blue w-4 h-4"
                        checked={!!selectedAddons.find(a => a.id === addon.id)}
                        onChange={() => toggleAddon(addon)} />
                      <div>
                        <div className="text-sm font-semibold text-apple-dark">{addon.name}</div>
                        <div className="text-xs text-apple-blue font-bold">+${parseFloat(addon.base_price).toFixed(0)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Client Information Form */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-apple-light-secondary">
              <label className="text-lg font-bold text-apple-dark mb-4 block">👤 Your Information</label>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Full Name *</label>
                  <input className="w-full px-4 py-2 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-all bg-white text-apple-dark" placeholder="John Doe" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Company / Entity</label>
                  <input className="w-full px-4 py-2 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-all bg-white text-apple-dark" placeholder="Your Company Ltd" value={form.entity_name} onChange={e => setForm({ ...form, entity_name: e.target.value })} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Email Address</label>
                  <input type="email" className="w-full px-4 py-2 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-all bg-white text-apple-dark" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-apple-dark mb-2">Phone / WhatsApp</label>
                  <input className="w-full px-4 py-2 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-all bg-white text-apple-dark" placeholder="+234 000 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-semibold text-apple-dark mb-2">Address</label>
                <input className="w-full px-4 py-2 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-all bg-white text-apple-dark" placeholder="City, Country" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-apple-dark mb-2">Additional Notes</label>
                <textarea className="w-full px-4 py-2 border border-apple-light-secondary rounded-lg text-sm focus:outline-none focus:border-apple-blue focus:ring-1 focus:ring-blue-100 transition-all bg-white text-apple-dark" rows={3} placeholder="Any specific requirements..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: SUMMARY & ACTION */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {/* Estimate Summary */}
            <div className="bg-gradient-to-br from-apple-dark to-apple-dark-secondary rounded-2xl p-8 text-center shadow-lg sticky top-8">
              <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Your Estimate</div>
              <div className="font-display text-5xl font-bold text-white mb-2">
                <span className="text-2xl text-apple-blue">$</span>{estimate.toLocaleString()}
              </div>
              <div className="text-sm text-white/60 mb-1">USD</div>
              <div className="bg-white/10 rounded-lg p-3 mb-6">
                <div className="text-xs text-white/40 mb-1">Naira Equivalent (at ₦{NAIRA_TO_DOLLAR}/USD)</div>
                <div className="text-xl font-bold text-blue-300">₦{Math.round(estimate * NAIRA_TO_DOLLAR).toLocaleString()}</div>
              </div>
              <div className="text-xs text-white/40 mb-8">Indicative estimate · Final quote after consultation</div>

              {/* Selected Items Summary */}
              {selectedItems.length > 0 && (
                <div className="bg-white/5 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                  <div className="text-xs text-white/40 uppercase tracking-wide mb-3">Selected Items</div>
                  {selectedItems.map((item, i) => (
                    <div key={i} className="text-xs text-white/70 flex justify-between py-1.5 line-clamp-1">
                      <span className="truncate">{item.name}</span>
                      <span className="ml-2 font-semibold flex-shrink-0">${parseFloat(item.base_price).toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              )}

              <button onClick={handleDownloadAndSend} disabled={loading}
                className="w-full bg-apple-blue hover:bg-apple-blue-hover text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 mb-3">
                {loading ? '⏳ Generating...' : '⬇ Download & Send Estimate'}
              </button>
              <p className="text-xs text-white/40">PDF downloads instantly & emailed to our team</p>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 rounded-xl p-4 border border-apple-light-secondary">
              <div className="text-xs font-bold text-apple-dark mb-2">💡 How it works:</div>
              <div className="text-xs text-apple-space-gray space-y-1">
                <p>1️⃣ Configure your project</p>
                <p>2️⃣ See instant estimate</p>
                <p>3️⃣ Fill your details</p>
                <p>4️⃣ Get branded PDF quote</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

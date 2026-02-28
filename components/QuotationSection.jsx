'use client'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function QuotationSection({ settings = {}, calculator = {} }) {
  const [form, setForm] = useState({
    client_name: '', entity_name: '', email: '', phone: '', address: '', notes: ''
  })
  const [selectedItems, setSelectedItems] = useState([])
  const [customItem, setCustomItem] = useState({ name: '', price: '' })
  const [loading, setLoading] = useState(false)

  const NAIRA_TO_DOLLAR = parseInt(settings?.exchange_rate || 1400)

  const allItems = [
    ...(calculator.type || []).map(i => ({ ...i, cat: 'Project Type' })),
    ...(calculator.addon || []).map(i => ({ ...i, cat: 'Add-On' })),
    ...(calculator.support || []).map(i => ({ ...i, cat: 'Support' })),
  ]

  const total = selectedItems.reduce((acc, item) => acc + parseFloat(item.base_price || 0), 0)
  const totalNaira = Math.round(total * NAIRA_TO_DOLLAR)

  const toggleItem = (item) => {
    setSelectedItems(prev =>
      prev.find(i => i.id === item.id && i.cat === item.cat)
        ? prev.filter(i => !(i.id === item.id && i.cat === item.cat))
        : [...prev, item]
    )
  }

  const addCustomItem = () => {
    if (!customItem.name || !customItem.price) return
    setSelectedItems(prev => [...prev, { id: `custom-${Date.now()}`, name: customItem.name, base_price: parseFloat(customItem.price), cat: 'Custom' }])
    setCustomItem({ name: '', price: '' })
  }

  const generatePDF = async () => {
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    // ─── Constants ───────────────────────────────────────────────
    const pageW   = 210
    const pageH   = 297
    const margin  = 18
    const cW      = pageW - margin * 2   // 174mm content width

    // ─── Column layout (must sum to cW = 174) ───────────────────
    // #(8) | Description(78) | Category(32) | USD(28) | NGN(28)
    const col = {
      num:  { x: margin,      w: 8  },
      desc: { x: margin + 8,  w: 78 },
      cat:  { x: margin + 86, w: 32 },
      usd:  { x: margin + 118,w: 28 },
      ngn:  { x: margin + 146,w: 28 },  // ends at 192 = pageW - margin ✓
    }

    const now      = new Date()
    const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-4)}`
    const dateStr  = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const validStr = new Date(now.getTime() + 30 * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    // ─── Helper: safe right-aligned text inside a column ────────
    const rText = (text, colDef, yPos) => {
      doc.text(String(text), colDef.x + colDef.w, yPos, { align: 'right' })
    }

    // ─── Load logo ───────────────────────────────────────────────
    let logoData = null
    try {
      const res = await fetch('/logo.png')
      if (res.ok) {
        const blob = await res.blob()
        logoData = await new Promise(resolve => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      }
    } catch (_) {}

    // ═══════════════════════════════════════════════════════════════
    // HEADER — navy band
    // ═══════════════════════════════════════════════════════════════
    const headerH = 58
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 0, pageW, headerH, 'F')

    // Green accent bar
    doc.setFillColor(22, 163, 74)
    doc.rect(0, headerH, pageW, 3, 'F')

    // Logo (left side)
    const logoH = 22
    const logoW = 38
    const logoY = (headerH - logoH) / 2
    if (logoData) {
      doc.addImage(logoData, 'PNG', margin, logoY, logoW, logoH)
    }

    // Company text (right of logo if present, otherwise from margin)
    const textX = logoData ? margin + logoW + 6 : margin
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(20)
    doc.setTextColor(255, 255, 255)
    doc.text(settings.company_name || 'Anjal Ventures', textX, 20)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(settings.company_tagline || "Building Africa's Digital Infrastructure", textX, 28)
    doc.text(`CAC: ${settings.company_cac || 'BN 9258709'}  |  TIN: ${settings.company_tin || '2623553716975'}`, textX, 35)
    doc.text(settings.company_email || 'anjalventures@gmail.com', textX, 42)
    doc.text(settings.company_address || 'Damaturu, Yobe State, Nigeria', textX, 49)

    // Quote reference block (right side of header)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(18)
    doc.setTextColor(22, 163, 74)
    doc.text('QUOTATION', pageW - margin, 20, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(148, 163, 184)
    doc.text(`Ref: ${quoteNum}`, pageW - margin, 29, { align: 'right' })
    doc.text(`Date: ${dateStr}`, pageW - margin, 36, { align: 'right' })
    doc.text(`Valid Until: ${validStr}`, pageW - margin, 43, { align: 'right' })
    doc.text(`Page 1 of 1`, pageW - margin, 50, { align: 'right' })

    // ═══════════════════════════════════════════════════════════════
    // CLIENT BLOCK
    // ═══════════════════════════════════════════════════════════════
    let y = headerH + 10

    const clientBoxH = 38
    // Left card — Bill To
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, y, 82, clientBoxH, 2, 2, 'F')
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.roundedRect(margin, y, 82, clientBoxH, 2, 2, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(22, 163, 74)
    doc.text('PREPARED FOR', margin + 5, y + 7)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(10, 22, 40)
    const clientName = doc.splitTextToSize(form.client_name || '—', 72)
    doc.text(clientName[0], margin + 5, y + 15)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)
    if (form.entity_name) doc.text(doc.splitTextToSize(form.entity_name, 72)[0], margin + 5, y + 22)
    if (form.address)     doc.text(doc.splitTextToSize(form.address, 72)[0],     margin + 5, y + 29)

    // Right card — Contact Details
    const rightX = margin + 92
    const rightW = cW - 92
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(rightX, y, rightW, clientBoxH, 2, 2, 'F')
    doc.roundedRect(rightX, y, rightW, clientBoxH, 2, 2, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(22, 163, 74)
    doc.text('CONTACT DETAILS', rightX + 5, y + 7)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(71, 85, 105)
    const contactLines = [
      form.email   ? `Email:  ${form.email}`   : null,
      form.phone   ? `Phone:  ${form.phone}`   : null,
    ].filter(Boolean)
    contactLines.forEach((line, i) => {
      doc.text(doc.splitTextToSize(line, rightW - 10)[0], rightX + 5, y + 15 + i * 8)
    })

    // ═══════════════════════════════════════════════════════════════
    // SECTION TITLE
    // ═══════════════════════════════════════════════════════════════
    y += clientBoxH + 10

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(10, 22, 40)
    doc.text('SERVICE ESTIMATE', margin, y)

    // Green underline
    doc.setDrawColor(22, 163, 74)
    doc.setLineWidth(0.6)
    doc.line(margin, y + 2, margin + 36, y + 2)

    y += 7

    // ═══════════════════════════════════════════════════════════════
    // TABLE HEADER ROW
    // ═══════════════════════════════════════════════════════════════
    const tHeaderH = 9
    doc.setFillColor(10, 22, 40)
    doc.rect(margin, y, cW, tHeaderH, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(255, 255, 255)
    doc.text('#',            col.num.x + 3,             y + 6)
    doc.text('DESCRIPTION',  col.desc.x,                y + 6)
    doc.text('CATEGORY',     col.cat.x,                 y + 6)
    doc.text('PRICE (USD)',  col.usd.x + col.usd.w,    y + 6, { align: 'right' })
    doc.text('PRICE (NGN)',  col.ngn.x + col.ngn.w,    y + 6, { align: 'right' })
    y += tHeaderH

    // ═══════════════════════════════════════════════════════════════
    // TABLE ROWS — dynamic height, no overlap
    // ═══════════════════════════════════════════════════════════════
    selectedItems.forEach((item, idx) => {
      const price    = parseFloat(item.base_price || 0)
      const nairaAmt = Math.round(price * NAIRA_TO_DOLLAR)

      // Measure how tall this row needs to be
      const nameLines = doc.splitTextToSize(item.name || '', col.desc.w - 2)
      const rowH      = Math.max(10, nameLines.length * 5 + 5)
      const midY      = y + rowH / 2 + 2.5

      // Alternating row background
      if (idx % 2 === 0) {
        doc.setFillColor(255, 255, 255)
      } else {
        doc.setFillColor(248, 250, 252)
      }
      doc.rect(margin, y, cW, rowH, 'F')

      // Row number
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(148, 163, 184)
      doc.text(String(idx + 1), col.num.x + 3, midY)

      // Description — multi-line safe
      doc.setTextColor(10, 22, 40)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      nameLines.forEach((line, li) => {
        doc.text(line, col.desc.x, y + 6.5 + li * 5)
      })

      // Category badge — subtle
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      doc.setTextColor(100, 116, 139)
      const catText = doc.splitTextToSize(item.cat || '—', col.cat.w - 2)
      doc.text(catText[0], col.cat.x, midY)

      // Prices — right-aligned, green, bold
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8.5)
      doc.setTextColor(22, 163, 74)
      rText(`$${price.toFixed(2)}`,              col.usd, midY)
      rText(`NGN ${nairaAmt.toLocaleString()}`,   col.ngn, midY)

      // Bottom border
      doc.setDrawColor(226, 232, 240)
      doc.setLineWidth(0.2)
      doc.line(margin, y + rowH, margin + cW, y + rowH)

      y += rowH
    })

    // ═══════════════════════════════════════════════════════════════
    // SUBTOTAL + TOTAL ROWS
    // ═══════════════════════════════════════════════════════════════
    y += 2

    // Subtotal line
    doc.setFillColor(241, 245, 249)
    doc.rect(margin, y, cW, 9, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(71, 85, 105)
    doc.text(`${selectedItems.length} item${selectedItems.length !== 1 ? 's' : ''}`, col.desc.x, y + 6)
    doc.text('SUBTOTAL', col.cat.x, y + 6)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(10, 22, 40)
    rText(`$${total.toFixed(2)}`,              col.usd, y + 6)
    rText(`NGN ${totalNaira.toLocaleString()}`, col.ngn, y + 6)
    y += 9

    // Grand total row
    doc.setFillColor(10, 22, 40)
    doc.rect(margin, y, cW, 13, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.text('TOTAL ESTIMATE', col.desc.x, y + 8.5)
    doc.setTextColor(22, 163, 74)
    doc.setFontSize(10)
    rText(`$${total.toFixed(2)} USD`,           col.usd, y + 8.5)
    rText(`NGN ${totalNaira.toLocaleString()}`,  col.ngn, y + 8.5)
    y += 13

    // ═══════════════════════════════════════════════════════════════
    // NOTES (if any)
    // ═══════════════════════════════════════════════════════════════
    if (form.notes) {
      y += 10
      doc.setFillColor(240, 253, 244)
      const noteLines  = doc.splitTextToSize(form.notes, cW - 16)
      const noteBoxH   = noteLines.length * 5 + 12
      doc.roundedRect(margin, y, cW, noteBoxH, 2, 2, 'F')
      doc.setDrawColor(22, 163, 74)
      doc.setLineWidth(0.3)
      doc.roundedRect(margin, y, cW, noteBoxH, 2, 2, 'S')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(22, 163, 74)
      doc.text('ADDITIONAL NOTES', margin + 6, y + 7)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(71, 85, 105)
      doc.text(noteLines, margin + 6, y + 13)
      y += noteBoxH
    }

    // ═══════════════════════════════════════════════════════════════
    // TERMS & CONDITIONS
    // ═══════════════════════════════════════════════════════════════
    y += 10
    doc.setDrawColor(226, 232, 240)
    doc.setLineWidth(0.3)
    doc.line(margin, y, margin + cW, y)
    y += 5

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(71, 85, 105)
    doc.text('TERMS & CONDITIONS', margin, y)
    y += 5

    const terms = [
      `1.  A 50% deposit is required to commence work. Full balance is due on delivery.`,
      `2.  This quotation is valid for 30 days from the date of issue (${dateStr}).`,
      `3.  NGN amounts are calculated at the rate of NGN ${NAIRA_TO_DOLLAR.toLocaleString()} per USD and may vary at invoice.`,
      `4.  All deliverables include full source code ownership transferred to the client.`,
      `5.  Ongoing support and maintenance packages are available on request.`,
    ]
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(100, 116, 139)
    terms.forEach(line => {
      const wrapped = doc.splitTextToSize(line, cW)
      doc.text(wrapped, margin, y)
      y += wrapped.length * 4 + 1
    })

    // ═══════════════════════════════════════════════════════════════
    // FOOTER BAND
    // ═══════════════════════════════════════════════════════════════
    const footerY = pageH - 14
    doc.setFillColor(10, 22, 40)
    doc.rect(0, footerY, pageW, 14, 'F')
    doc.setFillColor(22, 163, 74)
    doc.rect(0, footerY, pageW, 1.5, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(100, 120, 140)
    doc.text(
      settings.footer_tagline || 'We Build Digital Excellence — From Damaturu to the World.',
      pageW / 2, footerY + 8,
      { align: 'center' }
    )
    doc.setFontSize(6.5)
    doc.text(
      `${settings.company_email || 'anjalventures@gmail.com'}  |  ${settings.company_phone || '+234 814 001 1111'}  |  ${settings.company_address || 'Damaturu, Yobe State, Nigeria'}`,
      pageW / 2, footerY + 12,
      { align: 'center' }
    )

    return doc
  }

  const handleDownloadAndSend = async () => {
    if (!form.client_name || selectedItems.length === 0) {
      toast.error('Please fill in your name and select at least one service')
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
      doc.save(`Anjal-Ventures-Quotation-${quoteNum}.pdf`)

      // 3. Try to send email via EmailJS (same logic as Contact.jsx)
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
          console.log('✓ Quotation email sent successfully')
        } catch (e) {
          console.warn('⚠ EmailJS send failed:', e.message)
          toast.warning('Quotation saved & downloaded, but email notification failed. We still received your request.')
        }
      } else if (!pubKey || !serviceId || !templateId) {
        console.warn('⚠ EmailJS not configured. Quotation saved to database only.')
      }

      toast.success('✅ Quotation downloaded! Our team will contact you soon.')
      setForm({ client_name: '', entity_name: '', email: '', phone: '', address: '', notes: '' })
      setSelectedItems([])
    } catch (err) {
      console.error('Error:', err)
      toast.error('Failed to process quotation. Please try again.')
    }
    setLoading(false)
  }

  return (
    <section id="quotation" className="section bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="section-tag">Request a Quotation</div>
          <h2 className="section-title">Download Your Branded Quote</h2>
          <p className="section-subtitle mx-auto text-center">
            Select the services you need, fill in your details, and instantly download a professional, branded quotation PDF. Prices shown in USD and NGN (at ₦{NAIRA_TO_DOLLAR}/USD).
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Left: Form */}
          <div className="lg:col-span-3 bg-white rounded-2xl p-8 shadow-sm border border-slate-200">
            <h3 className="font-display text-xl text-navy mb-6">Your Details</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Full Name *</label>
                <input className="input-field" placeholder="John Doe" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
              </div>
              <div>
                <label className="label">Company / Entity</label>
                <input className="input-field" placeholder="Your Company Ltd" value={form.entity_name} onChange={e => setForm({ ...form, entity_name: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="label">Email Address</label>
                <input type="email" className="input-field" placeholder="you@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="label">Phone / WhatsApp</label>
                <input className="input-field" placeholder="+234 000 000 0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>
            <div className="mb-4">
              <label className="label">Address</label>
              <input className="input-field" placeholder="City, Country" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} />
            </div>
            <div className="mb-6">
              <label className="label">Additional Notes</label>
              <textarea className="input-field" rows={3} placeholder="Any specific requirements or notes for this quotation..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            </div>

            {/* Add custom item */}
            <div className="border-t border-slate-100 pt-5 mt-2">
              <label className="label">Add Custom Item</label>
              <div className="flex gap-2">
                <input className="input-field flex-1" placeholder="Service name" value={customItem.name} onChange={e => setCustomItem({ ...customItem, name: e.target.value })} />
                <input className="input-field w-28" placeholder="$Price" type="number" value={customItem.price} onChange={e => setCustomItem({ ...customItem, price: e.target.value })} />
                <button onClick={addCustomItem} className="btn btn-primary px-4 whitespace-nowrap">+ Add</button>
              </div>
            </div>
          </div>

          {/* Right: Item selector + summary */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex-1">
              <h3 className="font-display text-lg text-navy mb-4">Select Services</h3>
              <div className="max-h-64 overflow-y-auto flex flex-col gap-2 pr-1">
                {allItems.map(item => (
                  <label key={`${item.id}-${item.cat}`} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                    selectedItems.find(i => i.id === item.id && i.cat === item.cat)
                      ? 'border-brand-green bg-brand-green-pale'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}>
                    <input type="checkbox" className="accent-brand-green"
                      checked={!!selectedItems.find(i => i.id === item.id && i.cat === item.cat)}
                      onChange={() => toggleItem(item)} />
                    <div className="flex-1">
                      <div className="font-medium text-navy">{item.name}</div>
                      <div className="text-xs text-slate-400">{item.cat}</div>
                    </div>
                    <div className="flex flex-col items-end text-xs font-bold text-brand-green">
                      <div>${parseFloat(item.base_price).toFixed(0)}</div>
                      <div className="text-slate-400 text-[10px]">₦{Math.round(parseFloat(item.base_price) * NAIRA_TO_DOLLAR).toLocaleString()}</div>
                    </div>
                  </label>
                ))}
              </div>

              {/* Selected summary */}
              {selectedItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Selected ({selectedItems.length})</div>
                  {selectedItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1.5 text-slate-600">
                      <span>{item.name}</span>
                      <div className="flex flex-col items-end text-xs">
                        <div className="font-semibold text-navy">${parseFloat(item.base_price).toFixed(0)}</div>
                        <div className="text-slate-400">₦{Math.round(parseFloat(item.base_price) * NAIRA_TO_DOLLAR).toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-navy pt-2 border-t border-slate-200 mt-2 py-2">
                    <span>Total</span>
                    <div className="flex flex-col items-end text-sm">
                      <div className="text-brand-green">${total.toFixed(2)}</div>
                      <div className="text-slate-500 text-xs">₦{totalNaira.toLocaleString()}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button onClick={handleDownloadAndSend} disabled={loading}
              className="btn btn-green w-full justify-center py-4 text-base disabled:opacity-50">
              {loading ? '⏳ Generating & Sending...' : '⬇ Download & Send Quotation'}
            </button>
            <p className="text-center text-xs text-slate-400">
              PDF will download instantly & email sent to <strong>our team</strong> with your details. We'll contact you soon!
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

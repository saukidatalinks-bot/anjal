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

    const pageWidth = 210
    const pageHeight = 297
    const margin = 15
    const contentWidth = pageWidth - margin * 2

    // ─── Generate quote number and dates ───
    const now = new Date()
    const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-4)}`
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    const validUntil = new Date(now.getTime() + 30 * 864e5).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    // ─── Load logo ───
    let logoDataURL = null
    try {
      const res = await fetch('/logo.png')
      if (res.ok) {
        const blob = await res.blob()
        logoDataURL = await new Promise((resolve) => {
          const reader = new FileReader()
          reader.onloadend = () => resolve(reader.result)
          reader.readAsDataURL(blob)
        })
      }
    } catch (_) {}

    let currentY = margin

    // ═══════════════════════════════════════════════════════════════
    // HEADER WITH LOGO
    // ═══════════════════════════════════════════════════════════════
    
    // Top background bar
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 0, pageWidth, 50, 'F')
    
    // Green accent line
    doc.setFillColor(22, 163, 74)
    doc.rect(0, 50, pageWidth, 2, 'F')

    // Logo and company info
    const logoSize = 18
    const logoX = margin
    const logoY = margin + 3
    
    if (logoDataURL) {
      doc.addImage(logoDataURL, 'PNG', logoX, logoY, logoSize, logoSize)
    }

    // Company details next to logo
    const textStartX = logoX + logoSize + 8
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(16)
    doc.setTextColor(255, 255, 255)
    doc.text(settings.company_name || 'Anjal Ventures', textStartX, margin + 8)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(148, 163, 184)
    doc.text(settings.company_tagline || "Building Africa's Digital Infrastructure", textStartX, margin + 14)
    doc.text(`CAC: ${settings.company_cac || 'BN 9258709'} | TIN: ${settings.company_tin || '2623553716975'}`, textStartX, margin + 19)
    doc.text(settings.company_email || 'anjalventures@gmail.com', textStartX, margin + 24)

    // Quotation number and details on right side
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(14)
    doc.setTextColor(22, 163, 74)
    doc.text('QUOTATION', pageWidth - margin, margin + 8, { align: 'right' })

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(148, 163, 184)
    doc.text(`Reference #: ${quoteNum}`, pageWidth - margin, margin + 14, { align: 'right' })
    doc.text(`Date: ${dateStr}`, pageWidth - margin, margin + 19, { align: 'right' })
    doc.text(`Valid Until: ${validUntil}`, pageWidth - margin, margin + 24, { align: 'right' })

    currentY = 52 + margin

    // ═══════════════════════════════════════════════════════════════
    // CLIENT INFORMATION
    // ═══════════════════════════════════════════════════════════════
    
    // Two columns for client info
    const colWidth = (contentWidth - 4) / 2
    
    // Left: Bill To
    doc.setFillColor(240, 245, 250)
    doc.roundedRect(margin, currentY, colWidth, 28, 2, 2, 'F')
    doc.setDrawColor(200, 210, 220)
    doc.setLineWidth(0.2)
    doc.roundedRect(margin, currentY, colWidth, 28, 2, 2, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(22, 163, 74)
    doc.text('BILL TO', margin + 4, currentY + 5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(10, 22, 40)
    doc.text(form.client_name || 'Client Name', margin + 4, currentY + 12)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(71, 85, 105)
    if (form.entity_name) doc.text(form.entity_name, margin + 4, currentY + 17)
    if (form.address) doc.text(form.address, margin + 4, currentY + 22)

    // Right: Contact Details
    const rightColX = margin + colWidth + 4
    doc.setFillColor(240, 245, 250)
    doc.roundedRect(rightColX, currentY, colWidth, 28, 2, 2, 'F')
    doc.setDrawColor(200, 210, 220)
    doc.roundedRect(rightColX, currentY, colWidth, 28, 2, 2, 'S')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(22, 163, 74)
    doc.text('CONTACT DETAILS', rightColX + 4, currentY + 5)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7.5)
    doc.setTextColor(71, 85, 105)
    let contactY = currentY + 12
    if (form.email) {
      doc.text(`Email: ${form.email}`, rightColX + 4, contactY)
      contactY += 5
    }
    if (form.phone) {
      doc.text(`Phone: ${form.phone}`, rightColX + 4, contactY)
      contactY += 5
    }

    currentY += 32

    // ═══════════════════════════════════════════════════════════════
    // ITEMS TABLE
    // ═══════════════════════════════════════════════════════════════

    // Section title
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(10, 22, 40)
    doc.text('SERVICE ITEMS', margin, currentY)
    currentY += 6

    // Table header
    const headerHeight = 7
    doc.setFillColor(10, 22, 40)
    doc.rect(margin, currentY, contentWidth, headerHeight, 'F')

    const tableColWidths = {
      no: 10,
      desc: 85,
      cat: 25,
      usd: 25,
      ngn: 25,
    }
    const tableColX = {
      no: margin,
      desc: margin + tableColWidths.no + 2,
      cat: margin + tableColWidths.no + tableColWidths.desc + 4,
      usd: margin + tableColWidths.no + tableColWidths.desc + tableColWidths.cat + 6,
      ngn: margin + tableColWidths.no + tableColWidths.desc + tableColWidths.cat + tableColWidths.usd + 8,
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7)
    doc.setTextColor(255, 255, 255)
    doc.text('#', tableColX.no + 2, currentY + 4.5)
    doc.text('DESCRIPTION', tableColX.desc, currentY + 4.5)
    doc.text('TYPE', tableColX.cat, currentY + 4.5)
    doc.text('USD', tableColX.usd + tableColWidths.usd - 2, currentY + 4.5, { align: 'right' })
    doc.text('NGN', tableColX.ngn + tableColWidths.ngn - 2, currentY + 4.5, { align: 'right' })

    currentY += headerHeight

    // Table rows
    selectedItems.forEach((item, idx) => {
      const itemPrice = parseFloat(item.base_price || 0)
      const itemNgn = Math.round(itemPrice * NAIRA_TO_DOLLAR)

      // Alternate background
      if (idx % 2 === 0) {
        doc.setFillColor(255, 255, 255)
      } else {
        doc.setFillColor(248, 250, 252)
      }
      doc.rect(margin, currentY, contentWidth, 8, 'F')

      // Borders
      doc.setDrawColor(220, 225, 235)
      doc.setLineWidth(0.2)
      doc.line(margin, currentY + 8, margin + contentWidth, currentY + 8)

      // Number
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(100, 116, 139)
      doc.text(String(idx + 1), tableColX.no + 2, currentY + 5)

      // Description
      doc.setTextColor(10, 22, 40)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7.5)
      const descLines = doc.splitTextToSize(item.name || '', tableColWidths.desc - 2)
      doc.text(descLines[0] || item.name, tableColX.desc, currentY + 5)

      // Category
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(100, 116, 139)
      doc.text(item.cat || '—', tableColX.cat, currentY + 5)

      // USD price
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(22, 163, 74)
      doc.text(`$${itemPrice.toFixed(2)}`, tableColX.usd + tableColWidths.usd - 2, currentY + 5, { align: 'right' })

      // NGN price
      doc.text(`₦${itemNgn.toLocaleString()}`, tableColX.ngn + tableColWidths.ngn - 2, currentY + 5, { align: 'right' })

      currentY += 8
    })

    currentY += 3

    // ═══════════════════════════════════════════════════════════════
    // TOTALS
    // ═══════════════════════════════════════════════════════════════

    // Subtotal
    doc.setFillColor(248, 250, 252)
    doc.rect(margin, currentY, contentWidth, 6, 'F')

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(71, 85, 105)
    doc.text(`Subtotal (${selectedItems.length} items)`, tableColX.cat, currentY + 3.5)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(7.5)
    doc.setTextColor(22, 163, 74)
    doc.text(`$${total.toFixed(2)}`, tableColX.usd + tableColWidths.usd - 2, currentY + 3.5, { align: 'right' })
    doc.text(`₦${totalNaira.toLocaleString()}`, tableColX.ngn + tableColWidths.ngn - 2, currentY + 3.5, { align: 'right' })

    currentY += 6

    // Total (large)
    doc.setFillColor(10, 22, 40)
    doc.rect(margin, currentY, contentWidth, 10, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(255, 255, 255)
    doc.text('TOTAL ESTIMATE', tableColX.cat, currentY + 6)

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(22, 163, 74)
    doc.text(`$${total.toFixed(2)}`, tableColX.usd + tableColWidths.usd - 2, currentY + 6, { align: 'right' })
    doc.text(`₦${totalNaira.toLocaleString()}`, tableColX.ngn + tableColWidths.ngn - 2, currentY + 6, { align: 'right' })

    currentY += 12

    // ═══════════════════════════════════════════════════════════════
    // NOTES
    // ═══════════════════════════════════════════════════════════════

    if (form.notes && currentY < pageHeight - 60) {
      doc.setFillColor(240, 253, 244)
      const noteLines = doc.splitTextToSize(form.notes, contentWidth - 6)
      const noteHeight = Math.min(noteLines.length * 4.5 + 10, pageHeight - currentY - 50)
      
      doc.roundedRect(margin, currentY, contentWidth, noteHeight, 2, 2, 'F')
      doc.setDrawColor(22, 163, 74)
      doc.setLineWidth(0.3)
      doc.roundedRect(margin, currentY, contentWidth, noteHeight, 2, 2, 'S')

      doc.setFont('helvetica', 'bold')
      doc.setFontSize(7.5)
      doc.setTextColor(22, 163, 74)
      doc.text('ADDITIONAL NOTES', margin + 4, currentY + 6)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(71, 85, 105)
      doc.text(noteLines, margin + 4, currentY + 11)

      currentY += noteHeight + 5
    }

    // ═══════════════════════════════════════════════════════════════
    // FOOTER
    // ═══════════════════════════════════════════════════════════════

    const footerY = pageHeight - 18
    
    // Footer background
    doc.setFillColor(10, 22, 40)
    doc.rect(0, footerY - 2, pageWidth, pageHeight - (footerY - 2), 'F')

    // Green accent
    doc.setFillColor(22, 163, 74)
    doc.rect(0, footerY - 2, pageWidth, 1.5, 'F')

    // Footer text
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(6.5)
    doc.setTextColor(100, 120, 140)
    doc.text(
      settings.footer_tagline || 'We Build Digital Excellence — From Damaturu to the World.',
      pageWidth / 2,
      footerY + 4,
      { align: 'center' }
    )
    
    doc.setFontSize(6)
    doc.text(
      `${settings.company_email || 'anjalventures@gmail.com'} • ${settings.company_phone || '+234 814 001 1111'} • ${settings.company_address || 'Damaturu, Nigeria'}`,
      pageWidth / 2,
      footerY + 10,
      { align: 'center' }
    )


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

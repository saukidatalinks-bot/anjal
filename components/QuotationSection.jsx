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
  const [saved, setSaved] = useState(false)

  const allItems = [
    ...(calculator.type || []).map(i => ({ ...i, cat: 'Project Type' })),
    ...(calculator.addon || []).map(i => ({ ...i, cat: 'Add-On' })),
    ...(calculator.support || []).map(i => ({ ...i, cat: 'Support' })),
  ]

  const total = selectedItems.reduce((acc, item) => acc + parseFloat(item.base_price || 0), 0)

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

  const handleSave = async () => {
    if (!form.client_name || selectedItems.length === 0) {
      toast.error('Please fill in your name and select at least one service')
      return
    }
    setLoading(true)
    try {
      await fetch('/api/quotation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, selected_items: selectedItems, total_amount: total }),
      })
      setSaved(true)
    } catch {}
    setLoading(false)
  }

  const downloadPDF = async () => {
    if (!form.client_name || selectedItems.length === 0) {
      toast.error('Please enter your name and select services before downloading')
      return
    }
    await handleSave()

    // Dynamically import jsPDF for client-side PDF generation
    const { default: jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'mm', format: 'a4' })

    const pageW = 210
    const margin = 18
    const contentW = pageW - margin * 2
    const now = new Date()
    const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(Date.now()).slice(-4)}`
    const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

    // ─── Header / Navy Band ───
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 0, pageW, 52, 'F')

    // Decorative green bar
    doc.setFillColor(22, 163, 74)
    doc.rect(0, 52, pageW, 3, 'F')

    // Company Name
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(22)
    doc.setTextColor(255, 255, 255)
    doc.text(settings.company_name || 'Anjal Ventures', margin, 22)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(180, 200, 220)
    doc.text(settings.company_tagline || "Building Africa's Digital Infrastructure", margin, 30)
    doc.text(`CAC: ${settings.company_cac || 'BN 9258709'} · TIN: ${settings.company_tin || '2623553716975'}`, margin, 37)
    doc.text(`${settings.company_email || 'anjalventures@gmail.com'} · ${settings.company_address || 'Damaturu, Yobe State, Nigeria'}`, margin, 44)

    // Quote label top right
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(22, 163, 74)
    doc.text('QUOTATION', pageW - margin, 22, { align: 'right' })
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(180, 200, 220)
    doc.text(quoteNum, pageW - margin, 29, { align: 'right' })
    doc.text(dateStr, pageW - margin, 36, { align: 'right' })

    // ─── Client Info ───
    let y = 68
    doc.setFillColor(248, 250, 252)
    doc.roundedRect(margin, y - 6, contentW, 36, 3, 3, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(10, 22, 40)
    doc.text('PREPARED FOR', margin + 6, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.text(form.client_name || '—', margin + 6, y + 10)
    if (form.entity_name) { doc.setFontSize(9); doc.setTextColor(100, 116, 139); doc.text(form.entity_name, margin + 6, y + 18) }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(9)
    doc.setTextColor(10, 22, 40)
    doc.text('CONTACT', pageW / 2, y + 2)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(100, 116, 139)
    if (form.email) doc.text(form.email, pageW / 2, y + 10)
    if (form.phone) doc.text(form.phone, pageW / 2, y + 17)
    if (form.address) doc.text(form.address, pageW / 2, y + 24)

    // ─── Services Table ───
    y += 46
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(10, 22, 40)
    doc.text('SERVICES & DELIVERABLES', margin, y)
    y += 7

    // Table header
    doc.setFillColor(10, 22, 40)
    doc.roundedRect(margin, y, contentW, 9, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(8)
    doc.setTextColor(255, 255, 255)
    doc.text('#', margin + 4, y + 6)
    doc.text('Service / Item', margin + 12, y + 6)
    doc.text('Category', pageW - margin - 50, y + 6)
    doc.text('Price (USD)', pageW - margin - 6, y + 6, { align: 'right' })
    y += 9

    selectedItems.forEach((item, idx) => {
      const rowH = 9
      doc.setFillColor(idx % 2 === 0 ? 255 : 249, idx % 2 === 0 ? 255 : 250, idx % 2 === 0 ? 255 : 252)
      doc.rect(margin, y, contentW, rowH, 'F')
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(10, 22, 40)
      doc.text(String(idx + 1), margin + 4, y + 6)
      doc.text(item.name, margin + 12, y + 6)
      doc.setTextColor(100, 116, 139)
      doc.text(item.cat || '—', pageW - margin - 50, y + 6)
      doc.setTextColor(22, 163, 74)
      doc.setFont('helvetica', 'bold')
      doc.text(`$${parseFloat(item.base_price).toFixed(2)}`, pageW - margin - 6, y + 6, { align: 'right' })
      doc.setTextColor(226, 232, 240)
      doc.line(margin, y + rowH, margin + contentW, y + rowH)
      y += rowH
    })

    // Total row
    y += 4
    doc.setFillColor(10, 22, 40)
    doc.roundedRect(margin, y, contentW, 12, 2, 2, 'F')
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(255, 255, 255)
    doc.text('TOTAL ESTIMATE', margin + 6, y + 8)
    doc.setTextColor(22, 163, 74)
    doc.text(`$${total.toFixed(2)} USD`, pageW - margin - 6, y + 8, { align: 'right' })

    // ─── Notes ───
    if (form.notes) {
      y += 22
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      doc.setTextColor(10, 22, 40)
      doc.text('NOTES', margin, y)
      y += 6
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(100, 116, 139)
      const noteLines = doc.splitTextToSize(form.notes, contentW)
      doc.text(noteLines, margin, y)
      y += noteLines.length * 5
    }

    // ─── Terms ───
    y += 14
    doc.setFontSize(7)
    doc.setTextColor(180, 190, 200)
    doc.text('Terms: 50% deposit required to commence. Full payment on delivery. This quotation is valid for 30 days. Prices in USD.', margin, y, { maxWidth: contentW })
    y += 8
    doc.text('All deliverables include full source code ownership. Anjal Ventures · CAC BN 9258709 · anjalventures@gmail.com', margin, y, { maxWidth: contentW })

    // ─── Footer ───
    doc.setFillColor(10, 22, 40)
    doc.rect(0, 285, pageW, 12, 'F')
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(7)
    doc.setTextColor(100, 120, 140)
    doc.text(settings.footer_tagline || 'We Build Digital Excellence — From Damaturu to the World.', pageW / 2, 292, { align: 'center' })

    // Save
    doc.save(`Anjal-Ventures-Quotation-${quoteNum}.pdf`)
    toast.success('Quotation PDF downloaded!')
  }

  return (
    <section id="quotation-section" className="section bg-slate-50">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-12">
          <div className="section-tag">Request a Quotation</div>
          <h2 className="section-title">Download Your Branded Quote</h2>
          <p className="section-subtitle mx-auto text-center">
            Select the services you need, fill in your details, and instantly download a professional, branded quotation PDF.
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
                    <div className="font-bold text-brand-green text-xs">${parseFloat(item.base_price).toFixed(0)}</div>
                  </label>
                ))}
              </div>

              {/* Selected summary */}
              {selectedItems.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-xs text-slate-400 mb-2 font-semibold uppercase tracking-wider">Selected ({selectedItems.length})</div>
                  {selectedItems.map((item, i) => (
                    <div key={i} className="flex justify-between text-sm py-1">
                      <span className="text-slate-600">{item.name}</span>
                      <span className="font-semibold text-navy">${parseFloat(item.base_price).toFixed(0)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between font-bold text-navy pt-2 border-t border-slate-200 mt-2">
                    <span>Total Estimate</span>
                    <span className="text-brand-green">${total.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </div>

            <button onClick={downloadPDF} disabled={loading}
              className="btn btn-green w-full justify-center py-4 text-base">
              {loading ? 'Generating...' : '⬇ Download Quotation PDF'}
            </button>
            <p className="text-center text-xs text-slate-400">
              A branded PDF quotation will be generated instantly with your details and selected services.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

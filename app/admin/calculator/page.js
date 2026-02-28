'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'

const CATEGORIES = [
  { key: 'type', label: 'Project Type', desc: 'Base project categories with their starting prices' },
  { key: 'scale', label: 'Project Scale', desc: 'Scale modifiers added to base price' },
  { key: 'timeline', label: 'Timeline', desc: 'Timeline modifiers (use multiplier for % changes)' },
  { key: 'support', label: 'Support Plan', desc: 'Ongoing support options with fixed prices' },
  { key: 'addon', label: 'Add-On Features', desc: 'Optional add-ons with fixed prices' },
]

const BLANK = { category:'type', name:'', base_price:0, multiplier:1.0, display_order:0, is_active:true }

export default function AdminCalculator() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('type')

  const load = async () => {
    const res = await fetch('/api/admin/calculator')
    setItems(await res.json())
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.name) { toast.error('Item name is required'); return }
    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/admin/calculator/${editing}` : '/api/admin/calculator', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, base_price: parseFloat(form.base_price) || 0, multiplier: parseFloat(form.multiplier) || 1.0 }),
      })
      if (res.ok) { toast.success(editing ? 'Updated!' : 'Created!'); setForm({ ...BLANK, category: activeTab }); setEditing(null); load() }
      else { const d = await res.json(); toast.error(d.error || 'Save failed') }
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  const handleEdit = (item) => {
    setEditing(item.id); setForm({ ...item }); setActiveTab(item.category)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this calculator item?')) return
    await fetch(`/api/admin/calculator/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  const filtered = items.filter(i => i.category === activeTab)

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-navy mb-1">Project Cost Calculator</h1>
          <p className="text-slate-500 text-sm">Control every service type, scale, timeline, support and add-on item in the calculator. Changes reflect live on the site.</p>
        </div>

        {/* FORM */}
        <div className="admin-card mb-8">
          <h2 className="font-bold text-navy mb-5 flex items-center gap-2">
            {editing ? '✏️ Edit Item' : '➕ Add New Item'}
            {editing && <button onClick={() => { setEditing(null); setForm({ ...BLANK, category: activeTab }) }} className="text-xs text-slate-400 hover:text-red-500 ml-2">Cancel</button>}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Category *</label>
              <select className="input-field" value={form.category} onChange={e => { setForm({ ...form, category: e.target.value }); setActiveTab(e.target.value) }}>
                {CATEGORIES.map(c => <option key={c.key} value={c.key}>{c.label}</option>)}
              </select>
            </div>
            <div>
              <label className="label">Item Name *</label>
              <input className="input-field" placeholder="e.g. E-Commerce Store" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Base Price (USD) — added to estimate</label>
              <input type="number" step="0.01" className="input-field" placeholder="0.00" value={form.base_price} onChange={e => setForm({ ...form, base_price: e.target.value })} />
            </div>
            <div>
              <label className="label">Multiplier (1.0 = no change, 1.3 = +30%)</label>
              <input type="number" step="0.01" className="input-field" placeholder="1.00" value={form.multiplier} onChange={e => setForm({ ...form, multiplier: e.target.value })} />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" className="input-field" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer pb-3">
                <input type="checkbox" className="accent-brand-green" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                Active (shown in calculator)
              </label>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4 text-xs text-blue-600">
            <strong>Price Calculation Logic:</strong> Estimate = (Project Type base_price + Scale base_price) × Timeline multiplier + Support base_price + Sum of Add-on base_prices
          </div>

          <button onClick={handleSave} disabled={saving} className="btn btn-green">
            {saving ? 'Saving...' : editing ? '✓ Update Item' : '+ Add Item'}
          </button>
        </div>

        {/* TABS + LIST */}
        <div className="admin-card">
          <div className="flex gap-2 mb-6 flex-wrap">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setActiveTab(c.key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === c.key ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                {c.label} ({items.filter(i => i.category === c.key).length})
              </button>
            ))}
          </div>

          <p className="text-xs text-slate-400 mb-4">
            {CATEGORIES.find(c => c.key === activeTab)?.desc}
          </p>

          {filtered.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No {activeTab} items. Add one above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map(item => (
                <div key={item.id} className="table-row">
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-xs text-slate-400 font-mono">${parseFloat(item.base_price).toFixed(2)}</div>
                      {parseFloat(item.multiplier) !== 1.0 && <div className="text-xs text-amber-500 font-mono">×{parseFloat(item.multiplier).toFixed(2)}</div>}
                    </div>
                    <div>
                      <div className="font-semibold text-navy text-sm">{item.name}</div>
                      <span className={`status-badge ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'} text-[10px]`}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(item)} className="btn btn-primary py-2 px-4 text-xs">✏️ Edit</button>
                    <button onClick={() => handleDelete(item.id)} className="btn py-2 px-4 text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white">🗑</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

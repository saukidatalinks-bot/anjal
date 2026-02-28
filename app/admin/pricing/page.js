'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'

const BLANK = { name: '', price: '', price_note: '', is_featured: false, cta_text: 'Get Started', display_order: 0, is_active: true, features: [] }

export default function AdminPricing() {
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)
  const [newFeature, setNewFeature] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/pricing')
    setPlans(await res.json())
  }

  useEffect(() => { load() }, [])

  const addFeature = () => {
    if (!newFeature.trim()) return
    setForm(f => ({ ...f, features: [...f.features, newFeature.trim()] }))
    setNewFeature('')
  }

  const removeFeature = (i) => {
    setForm(f => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }))
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/admin/pricing/${editing}` : '/api/admin/pricing', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) { toast.success(editing ? 'Updated!' : 'Created!'); setForm(BLANK); setEditing(null); load() }
      else { const d = await res.json(); toast.error(d.error || 'Save failed') }
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setForm({ ...p, features: p.features || [] })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this pricing plan?')) return
    await fetch(`/api/admin/pricing/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-navy mb-1">Pricing Plans</h1>
          <p className="text-slate-500 text-sm">Manage all pricing plans, features and CTAs shown on your pricing section.</p>
        </div>

        {/* FORM */}
        <div className="admin-card mb-8">
          <h2 className="font-bold text-navy mb-5 flex items-center gap-2">
            {editing ? '✏️ Edit Plan' : '➕ Add New Plan'}
            {editing && <button onClick={() => { setEditing(null); setForm(BLANK) }} className="text-xs text-slate-400 hover:text-red-500 ml-2">Cancel</button>}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className="label">Plan Name *</label>
              <input className="input-field" placeholder="e.g. Business, Starter, Enterprise" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <label className="label">Price Display *</label>
              <input className="input-field" placeholder='e.g. $350 or "Custom"' value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
            </div>
            <div>
              <label className="label">Price Note / Subtitle</label>
              <input className="input-field" placeholder="One-time · Full business platform" value={form.price_note} onChange={e => setForm({ ...form, price_note: e.target.value })} />
            </div>
            <div>
              <label className="label">CTA Button Text</label>
              <input className="input-field" placeholder="Get Started" value={form.cta_text} onChange={e => setForm({ ...form, cta_text: e.target.value })} />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" className="input-field" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex flex-col justify-end gap-3">
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="accent-brand-green" checked={form.is_featured} onChange={e => setForm({ ...form, is_featured: e.target.checked })} />
                Featured / Most Popular (dark styling)
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                <input type="checkbox" className="accent-brand-green" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                Active (visible on site)
              </label>
            </div>
          </div>

          {/* Features */}
          <div className="mb-5">
            <label className="label">Plan Features</label>
            <div className="flex flex-col gap-2 mb-3">
              {form.features.map((f, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 rounded-lg px-4 py-2">
                  <span className="text-brand-green font-bold">✓</span>
                  <span className="text-sm text-slate-700 flex-1">{f}</span>
                  <button onClick={() => removeFeature(i)} className="text-red-400 hover:text-red-600 text-xs">Remove</button>
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <input className="input-field flex-1" placeholder="Add a feature..." value={newFeature} onChange={e => setNewFeature(e.target.value)} onKeyDown={e => e.key === 'Enter' && addFeature()} />
              <button onClick={addFeature} className="btn btn-primary px-5">+ Add</button>
            </div>
          </div>

          <button onClick={handleSave} disabled={saving} className="btn btn-green">
            {saving ? 'Saving...' : editing ? '✓ Update Plan' : '+ Add Plan'}
          </button>
        </div>

        {/* PREVIEW + LIST */}
        <div className="admin-card">
          <h2 className="font-bold text-navy mb-5">All Pricing Plans ({plans.length})</h2>
          {plans.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No pricing plans yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {plans.map(p => (
                <div key={p.id} className="table-row">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold ${p.is_featured ? 'bg-navy text-white' : 'bg-slate-100 text-slate-600'}`}>
                      {p.price}
                    </div>
                    <div>
                      <div className="font-semibold text-navy text-sm flex items-center gap-2">
                        {p.name}
                        {p.is_featured && <span className="status-badge bg-brand-green text-white text-[10px]">Featured</span>}
                        {!p.is_active && <span className="status-badge bg-slate-100 text-slate-500 text-[10px]">Hidden</span>}
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{p.price_note} · {(p.features || []).length} features</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)} className="btn btn-primary py-2 px-4 text-xs">✏️ Edit</button>
                    <button onClick={() => handleDelete(p.id)} className="btn py-2 px-4 text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white">🗑</button>
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

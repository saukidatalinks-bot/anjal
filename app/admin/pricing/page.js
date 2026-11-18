'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/AdminSidebar'
import { formatNaira } from '@/lib/format'

const BLANK = {
  name: '',
  price: '',
  price_note: '',
  is_featured: false,
  cta_text: 'Request Quote',
  display_order: 0,
  features: [],
}

export default function AdminPricing() {
  const [plans, setPlans] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)
  const [newFeature, setNewFeature] = useState('')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/pricing')
    const data = await res.json()
    setPlans(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    load()
  }, [])

  const addFeature = () => {
    if (!newFeature.trim()) return
    setForm(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
    setNewFeature('')
  }

  const handleSave = async () => {
    if (!form.name || !form.price) {
      toast.error('Plan name and Naira price are required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/admin/pricing/${editing}` : '/api/admin/pricing', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Save failed')
      }
      toast.success(editing ? 'Pricing plan updated' : 'Pricing plan created')
      setForm(BLANK)
      setEditing(null)
      load()
    } catch (error) {
      toast.error(error.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = plan => {
    setEditing(plan.id)
    setForm({
      ...plan,
      features: (plan.features || []).map(f => (typeof f === 'string' ? f : f.feature)),
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async id => {
    if (!confirm('Delete this pricing plan?')) return
    await fetch(`/api/admin/pricing/${id}`, { method: 'DELETE' })
    toast.success('Pricing plan deleted')
    load()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mb-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">Commercials (₦)</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Naira Pricing Plans</h1>
          <p className="mt-1 text-sm text-slate-600">Manage all packages displayed on the home, services, and pricing bands.</p>
        </div>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">{editing ? 'Edit Pricing Plan' : 'Add Pricing Plan'}</h2>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setForm(BLANK)
                }}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Plan Name *</label>
              <input
                className="input-field"
                placeholder="e.g. Restaurant & Ordering Suite"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                Price (₦ or Custom) *
              </label>
              <input
                className="input-field"
                placeholder="e.g. ₦849,999"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Price Subtitle</label>
              <input
                className="input-field"
                placeholder="e.g. One-time deployment · Maintenance fees apply"
                value={form.price_note || ''}
                onChange={e => setForm({ ...form, price_note: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">CTA Label</label>
              <input
                className="input-field"
                placeholder="e.g. Deploy Restaurant Suite"
                value={form.cta_text || ''}
                onChange={e => setForm({ ...form, cta_text: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Display Order</label>
              <input
                type="number"
                className="input-field"
                value={form.display_order || 0}
                onChange={e => setForm({ ...form, display_order: parseInt(e.target.value, 10) || 0 })}
              />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                <input
                  type="checkbox"
                  checked={Boolean(form.is_featured)}
                  onChange={e => setForm({ ...form, is_featured: e.target.checked })}
                />
                Mark as Featured / Popular tier
              </label>
            </div>
          </div>

          <div className="mt-5">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Included Deliverables</label>
            <div className="mb-3 flex flex-wrap gap-2">
              {form.features.map((feat, idx) => (
                <span
                  key={`${feat}-${idx}`}
                  className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {feat}
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== idx) }))}
                    className="font-bold text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                className="input-field flex-1"
                placeholder="Add deliverable bullet..."
                value={newFeature}
                onChange={e => setNewFeature(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addFeature()
                  }
                }}
              />
              <button type="button" onClick={addFeature} className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white">
                + Add
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-5 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
          >
            {saving ? 'Saving...' : editing ? 'Update Plan' : 'Create Plan'}
          </button>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-slate-950">All Plans ({plans.length})</h2>
          <div className="space-y-3">
            {plans.map(p => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-950">{p.name}</span>
                    <span className="font-mono text-sm font-bold text-blue-700">{formatNaira(p.price)}</span>
                    {p.is_featured && (
                      <span className="rounded bg-blue-600 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase text-white">
                        Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500">
                    {p.price_note || 'No subtitle'} · {(p.features || []).length} deliverables
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(p)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

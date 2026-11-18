'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/AdminSidebar'
import { formatNaira } from '@/lib/format'

const CATEGORIES = [
  { key: 'platform', label: 'Platform / Suite', desc: 'Turnkey Naira suites and core custom foundations' },
  { key: 'scope', label: 'Architecture Scope', desc: 'Complexity tiers added to the project base' },
  { key: 'design', label: 'Design Tier', desc: 'UI/UX polish and custom branding levels' },
  { key: 'timeline', label: 'Timeline', desc: 'Delivery speed multiplier' },
  { key: 'support', label: 'Support Plan', desc: 'Post-launch maintenance retainer options' },
  { key: 'addon', label: 'Add-on Modules', desc: 'Optional technical integrations priced in ₦' },
]

const BLANK = {
  category: 'platform',
  name: '',
  base_price: '',
  multiplier: '1.0',
  display_order: 0,
  is_active: true,
}

export default function AdminCalculator() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)
  const [activeTab, setActiveTab] = useState('platform')
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/calculator')
    const data = await res.json()
    setItems(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    load()
  }, [])

  const handleSave = async () => {
    if (!form.name) {
      toast.error('Option name is required')
      return
    }
    setSaving(true)
    try {
      const payload = {
        ...form,
        base_price: parseFloat(form.base_price) || 0,
        multiplier: parseFloat(form.multiplier) || 1.0,
      }
      const res = await fetch(editing ? `/api/admin/calculator/${editing}` : '/api/admin/calculator', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success(editing ? 'Item updated' : 'Item created')
      setForm({ ...BLANK, category: activeTab })
      setEditing(null)
      load()
    } catch {
      toast.error('Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = item => {
    setEditing(item.id)
    setActiveTab(item.category)
    setForm({
      category: item.category,
      name: item.name,
      base_price: item.base_price ?? '0',
      multiplier: item.multiplier ?? '1.0',
      display_order: item.display_order || 0,
      is_active: item.is_active !== false,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async id => {
    if (!confirm('Delete this calculator item?')) return
    await fetch(`/api/admin/calculator/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  const filtered = items.filter(i => i.category === activeTab)

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mb-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">Estimator Engine</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Naira Quote Calculator Options</h1>
          <p className="mt-1 text-sm text-slate-600">All option base amounts are denominated in Nigerian Naira (₦).</p>
        </div>

        <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">{editing ? 'Edit Calculator Option' : 'Add Calculator Option'}</h2>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null)
                  setForm({ ...BLANK, category: activeTab })
                }}
                className="text-xs font-semibold text-red-600 hover:underline"
              >
                Cancel Edit
              </button>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Category</label>
              <select
                className="input-field"
                value={form.category}
                onChange={e => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map(c => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Option Name *</label>
              <input
                className="input-field"
                placeholder="e.g. Restaurant & Ordering Suite"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Base Price (₦ NGN)</label>
              <input
                type="number"
                className="input-field"
                placeholder="849999"
                value={form.base_price}
                onChange={e => setForm({ ...form, base_price: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Multiplier</label>
              <input
                type="number"
                step="0.05"
                className="input-field"
                value={form.multiplier}
                onChange={e => setForm({ ...form, multiplier: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
            >
              {saving ? 'Saving...' : editing ? 'Update Item' : 'Add Item'}
            </button>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={e => setForm({ ...form, is_active: e.target.checked })}
              />
              Active in public quote builder
            </label>
          </div>
        </section>

        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button
                key={c.key}
                type="button"
                onClick={() => {
                  setActiveTab(c.key)
                  if (!editing) setForm(prev => ({ ...prev, category: c.key }))
                }}
                className={`rounded-lg px-3.5 py-2 text-xs font-semibold transition ${
                  activeTab === c.key ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-700'
                }`}
              >
                {c.label} ({items.filter(i => i.category === c.key).length})
              </button>
            ))}
          </div>

          <p className="mb-4 text-xs text-slate-500">{CATEGORIES.find(c => c.key === activeTab)?.desc}</p>

          <div className="space-y-2.5">
            {filtered.map(item => (
              <div key={item.id} className="flex flex-wrap items-center justify-between gap-4 rounded-lg bg-slate-50 p-3.5">
                <div>
                  <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                  <p className="mt-0.5 font-mono text-xs text-slate-500">
                    {formatNaira(item.base_price)}
                    {Number(item.multiplier || 1) !== 1 ? ` · ×${Number(item.multiplier).toFixed(2)}` : ''} ·{' '}
                    {item.is_active ? 'Active' : 'Hidden'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-800"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
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

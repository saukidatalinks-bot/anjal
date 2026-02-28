'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'

const ICONS = ['🌐','📱','☁️','🤖','🎓','💼','🛒','🌙','🚀','💡','📊','🔐','🏥','🎯','🌍','⚡','💳','🔧']
const BLANK = { name:'', description:'', icon:'🌐', tags:'', display_order:0, is_active:true }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const res = await fetch('/api/admin/services')
    setServices(await res.json())
  }

  useEffect(() => { load() }, [])

  const handleSave = async () => {
    if (!form.name) { toast.error('Service name is required'); return }
    setSaving(true)
    const payload = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags }
    try {
      const res = await fetch(editing ? `/api/admin/services/${editing}` : '/api/admin/services', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) { toast.success(editing ? 'Updated!' : 'Created!'); setForm(BLANK); setEditing(null); load() }
      else { const d = await res.json(); toast.error(d.error || 'Save failed') }
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  const handleEdit = (s) => {
    setEditing(s.id)
    setForm({ ...s, tags: Array.isArray(s.tags) ? s.tags.join(', ') : s.tags || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this service?')) return
    await fetch(`/api/admin/services/${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-navy mb-1">Services</h1>
          <p className="text-slate-500 text-sm">Manage the service cards displayed on your homepage. These also appear in contact form dropdowns.</p>
        </div>

        {/* FORM */}
        <div className="admin-card mb-8">
          <h2 className="font-bold text-navy mb-5 flex items-center gap-2">
            {editing ? '✏️ Edit Service' : '➕ Add New Service'}
            {editing && <button onClick={() => { setEditing(null); setForm(BLANK) }} className="text-xs text-slate-400 hover:text-red-500 ml-2">Cancel</button>}
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="label">Service Name *</label>
              <input className="input-field" placeholder="e.g. Web Development & Cloud Infrastructure" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input-field" rows={3} placeholder="Describe this service offering..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Technology Tags (comma-separated)</label>
              <input className="input-field" placeholder="React, Firebase, AWS" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" className="input-field" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>

          <div className="mb-5">
            <label className="label">Service Icon</label>
            <div className="flex flex-wrap gap-2">
              {ICONS.map(ic => (
                <button key={ic} onClick={() => setForm({ ...form, icon: ic })}
                  className={`w-10 h-10 rounded-lg border-2 text-xl flex items-center justify-center transition-all ${form.icon === ic ? 'border-brand-green bg-brand-green-pale' : 'border-slate-200 hover:border-slate-300'}`}>
                  {ic}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn btn-green">
              {saving ? 'Saving...' : editing ? '✓ Update Service' : '+ Add Service'}
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="accent-brand-green" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              Active (visible on site)
            </label>
          </div>
        </div>

        {/* LIST */}
        <div className="admin-card">
          <h2 className="font-bold text-navy mb-5">All Services ({services.length})</h2>
          {services.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No services yet.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {services.map(s => (
                <div key={s.id} className="table-row">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 bg-slate-100 rounded-xl flex items-center justify-center text-2xl">{s.icon}</div>
                    <div>
                      <div className="font-semibold text-navy text-sm">{s.name}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className={`status-badge ${s.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>{s.is_active ? 'Active' : 'Hidden'}</span>
                        {' · '}{(s.tags || []).slice(0,3).join(', ')}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(s)} className="btn btn-primary py-2 px-4 text-xs">✏️ Edit</button>
                    <button onClick={() => handleDelete(s.id)} className="btn py-2 px-4 text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white">🗑</button>
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

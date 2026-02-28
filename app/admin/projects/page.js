'use client'
import { useState, useEffect, useRef } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import Image from 'next/image'
import toast from 'react-hot-toast'
import { Toaster } from 'react-hot-toast'

const EMOJIS = ['🚀','🌐','📱','☁️','🤖','🎓','💼','🛒','🌙','💡','📊','🔐','🏥','🎯','🌍','⚡','💳','🔧','🏗️','🎨']
const COLORS = ['#0A1628','#112240','#16A34A','#1e40af','#7c3aed','#dc2626','#d97706','#0891b2','#374151','#1f2937','#065f46','#86198f']
const STATUS_OPTIONS = ['LIVE', 'BETA', 'IN DEVELOPMENT', 'COMPLETED', 'COMING SOON']

const BLANK = { title:'', description:'', url:'', status:'LIVE', tags:'', image_url:'', emoji:'🚀', banner_color:'#0A1628', display_order:0, is_active:true }

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef()

  const load = async () => {
    const res = await fetch('/api/admin/projects')
    setProjects(await res.json())
  }

  useEffect(() => { load() }, [])

  const handleUpload = async (file) => {
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.url) {
        setForm(f => ({ ...f, image_url: data.url }))
        toast.success('Image uploaded!')
      } else {
        toast.error(data.error || 'Upload failed')
      }
    } catch {
      toast.error('Upload failed')
    }
    setUploading(false)
  }

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = { ...form, tags: typeof form.tags === 'string' ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : form.tags }
    try {
      const res = await fetch(editing ? `/api/admin/projects/${editing}` : '/api/admin/projects', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        toast.success(editing ? 'Project updated!' : 'Project created!')
        setForm(BLANK); setEditing(null); load()
      } else {
        const d = await res.json()
        toast.error(d.error || 'Save failed')
      }
    } catch { toast.error('Save failed') }
    setSaving(false)
  }

  const handleEdit = (p) => {
    setEditing(p.id)
    setForm({ ...p, tags: Array.isArray(p.tags) ? p.tags.join(', ') : p.tags || '' })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this project permanently?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-navy mb-1">Projects / Portfolio</h1>
          <p className="text-slate-500 text-sm">Manage your live portfolio projects. Images are hosted on Vercel Blob.</p>
        </div>

        {/* FORM */}
        <div className="admin-card mb-8">
          <h2 className="font-bold text-navy mb-6 text-lg flex items-center gap-2">
            {editing ? '✏️ Edit Project' : '➕ Add New Project'}
            {editing && <button onClick={() => { setEditing(null); setForm(BLANK) }} className="text-xs text-slate-400 hover:text-red-500 ml-2">Cancel</button>}
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-5">
            <div className="col-span-2">
              <label className="label">Project Title *</label>
              <input className="input-field" placeholder="e.g. SaukiMart — Online Marketplace Platform" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <label className="label">Live URL</label>
              <input className="input-field" placeholder="https://yourproject.com" value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} />
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
                {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="col-span-2">
              <label className="label">Description</label>
              <textarea className="input-field" rows={4} placeholder="Describe the project, its features and impact..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <label className="label">Technology Tags (comma-separated)</label>
              <input className="input-field" placeholder="React, Firebase, Paystack, AI LLM" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <div>
              <label className="label">Display Order</label>
              <input type="number" className="input-field" value={form.display_order} onChange={e => setForm({ ...form, display_order: parseInt(e.target.value) || 0 })} />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-5">
            <label className="label">Project Banner Image</label>
            <div className="flex gap-4 items-start">
              <div className="flex-1">
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-brand-green transition-colors cursor-pointer"
                  onClick={() => fileRef.current?.click()}>
                  <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={e => handleUpload(e.target.files[0])} />
                  {uploading ? (
                    <div className="text-sm text-slate-400">Uploading...</div>
                  ) : form.image_url ? (
                    <div className="text-sm text-brand-green">✓ Image uploaded. Click to replace.</div>
                  ) : (
                    <div>
                      <div className="text-3xl mb-2">🖼️</div>
                      <div className="text-sm text-slate-400">Click to upload project image</div>
                      <div className="text-xs text-slate-300 mt-1">JPG, PNG, WebP, GIF · Max 5MB</div>
                    </div>
                  )}
                </div>
                {form.image_url && (
                  <div className="mt-2 flex items-center gap-2">
                    <input className="input-field text-xs" value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Or paste image URL directly" />
                    <button onClick={() => setForm({ ...form, image_url: '' })} className="text-red-400 hover:text-red-600 text-xs whitespace-nowrap">Clear</button>
                  </div>
                )}
              </div>
              {form.image_url && (
                <div className="w-32 h-24 relative rounded-lg overflow-hidden border border-slate-200 flex-shrink-0">
                  <Image src={form.image_url} alt="Preview" fill className="object-cover" />
                </div>
              )}
            </div>
          </div>

          {/* Emoji & Color */}
          <div className="grid grid-cols-2 gap-5 mb-6">
            <div>
              <label className="label">Emoji Icon (shown if no image)</label>
              <div className="flex flex-wrap gap-2">
                {EMOJIS.map(e => (
                  <button key={e} onClick={() => setForm({ ...form, emoji: e })}
                    className={`w-10 h-10 rounded-lg border-2 text-xl flex items-center justify-center transition-all ${form.emoji === e ? 'border-brand-green bg-brand-green-pale' : 'border-slate-200 hover:border-slate-300'}`}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Banner Color (shown if no image)</label>
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c} onClick={() => setForm({ ...form, banner_color: c })}
                    className={`w-10 h-10 rounded-lg border-2 transition-all ${form.banner_color === c ? 'border-navy scale-110' : 'border-transparent hover:border-slate-300'}`}
                    style={{ background: c }} />
                ))}
              </div>
              <input className="input-field mt-2 text-xs font-mono" value={form.banner_color} onChange={e => setForm({ ...form, banner_color: e.target.value })} placeholder="#0A1628" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn btn-green">
              {saving ? 'Saving...' : editing ? '✓ Update Project' : '+ Add Project'}
            </button>
            <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
              <input type="checkbox" className="accent-brand-green" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              Active (visible on site)
            </label>
          </div>
        </div>

        {/* LIST */}
        <div className="admin-card">
          <h2 className="font-bold text-navy mb-5 flex items-center justify-between">
            <span>All Projects ({projects.length})</span>
          </h2>
          {projects.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-8">No projects yet. Add your first one above.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {projects.map(p => (
                <div key={p.id} className="table-row">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex-shrink-0 relative overflow-hidden" style={{ background: p.banner_color || '#0A1628' }}>
                      {p.image_url ? (
                        <Image src={p.image_url} alt={p.title} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl">{p.emoji}</div>
                      )}
                    </div>
                    <div>
                      <div className="font-semibold text-navy text-sm">{p.title}</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        <span className={`status-badge ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'}`}>
                          {p.is_active ? 'Active' : 'Hidden'}
                        </span>
                        {' · '}{p.status}{p.url ? ` · ${p.url}` : ''}
                      </div>
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

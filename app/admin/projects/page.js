'use client'

import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'
import { ImagePlus, Plus, Save, Trash2 } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const BLANK = {
  title: '',
  slug: '',
  description: '',
  summary: '',
  url: '',
  status: 'LIVE',
  tags: '',
  image_url: '',
  banner_color: '#0A1628',
  display_order: 0,
  is_active: true,
  project_type: 'website',
  industry: '',
  client_name: '',
  role: '',
  challenge: '',
  solution: '',
  outcomes: '',
  app_store_url: '',
  play_store_url: '',
  featured: false,
  launched_at: '',
}

const PROJECT_TYPES = [
  { value: 'website', label: 'Website' },
  { value: 'mobile-app', label: 'Mobile App' },
  { value: 'saas', label: 'SaaS / Platform' },
]

export default function AdminProjects() {
  const [projects, setProjects] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaOrientation, setMediaOrientation] = useState('landscape')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef(null)

  const load = async () => {
    const res = await fetch('/api/admin/projects')
    const data = await res.json()
    setProjects(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const normalizePayload = () => ({
    ...form,
    tags: stringList(form.tags),
    outcomes: stringList(form.outcomes),
    display_order: Number(form.display_order || 0),
  })

  const save = async () => {
    if (!form.title) {
      toast.error('Project title is required')
      return
    }
    setSaving(true)
    try {
      const res = await fetch(editing ? `/api/admin/projects/${editing}` : '/api/admin/projects', {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(normalizePayload()),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.success(editing ? 'Project updated' : 'Project created')
      setEditing(data.id)
      setForm(fromProject(data))
      load()
    } catch (err) {
      toast.error(err.message || 'Save failed')
    }
    setSaving(false)
  }

  const edit = (project) => {
    setEditing(project.id)
    setForm(fromProject(project))
    setMediaUrl('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const remove = async (id) => {
    if (!confirm('Delete this project permanently?')) return
    await fetch(`/api/admin/projects/${id}`, { method: 'DELETE' })
    toast.success('Project deleted')
    if (editing === id) {
      setEditing(null)
      setForm(BLANK)
    }
    load()
  }

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('folder', `projects/${form.project_type || 'website'}`)
    try {
      const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Upload failed')
      setMediaUrl(data.url)
      if (!form.image_url) setForm(prev => ({ ...prev, image_url: data.url }))
      toast.success('Image uploaded')
    } catch (err) {
      toast.error(err.message || 'Upload failed')
    }
    setUploading(false)
  }

  const addMedia = async () => {
    if (!editing) {
      toast.error('Save the project before adding media')
      return
    }
    if (!mediaUrl) {
      toast.error('Media URL is required')
      return
    }
    const res = await fetch(`/api/admin/projects/${editing}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: mediaUrl,
        alt: form.title,
        orientation: mediaOrientation,
        display_order: 0,
        is_primary: mediaOrientation === 'landscape',
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error || 'Media save failed')
      return
    }
    toast.success('Media added')
    setMediaUrl('')
    load()
  }

  const deleteMedia = async (projectId, mediaId) => {
    await fetch(`/api/admin/projects/${projectId}/media?mediaId=${mediaId}`, { method: 'DELETE' })
    toast.success('Media removed')
    load()
  }

  const current = projects.find(p => p.id === editing)

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Portfolio</p>
          <h1 className="text-3xl font-semibold tracking-normal text-slate-950">Projects and media</h1>
          <p className="mt-2 text-sm text-slate-500">Manage websites, mobile apps, SaaS systems, case studies, and screenshot galleries.</p>
        </div>

        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">{editing ? 'Edit project' : 'Create project'}</h2>
            {editing && <button onClick={() => { setEditing(null); setForm(BLANK) }} className="text-sm font-bold text-slate-500 hover:text-red-600">Cancel</button>}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Title" value={form.title} onChange={v => setForm({ ...form, title: v })} />
            <Input label="Slug" value={form.slug} onChange={v => setForm({ ...form, slug: v })} />
            <Select label="Project type" value={form.project_type} onChange={v => setForm({ ...form, project_type: v })} options={PROJECT_TYPES} />
            <Input label="Live URL" value={form.url} onChange={v => setForm({ ...form, url: v })} />
            <Input label="Client" value={form.client_name} onChange={v => setForm({ ...form, client_name: v })} />
            <Input label="Industry" value={form.industry} onChange={v => setForm({ ...form, industry: v })} />
            <Input label="Status" value={form.status} onChange={v => setForm({ ...form, status: v })} />
            <Input label="Display order" type="number" value={form.display_order} onChange={v => setForm({ ...form, display_order: v })} />
            <Input label="App Store URL" value={form.app_store_url} onChange={v => setForm({ ...form, app_store_url: v })} />
            <Input label="Play Store URL" value={form.play_store_url} onChange={v => setForm({ ...form, play_store_url: v })} />
            <Textarea label="Summary" value={form.summary} onChange={v => setForm({ ...form, summary: v })} />
            <Textarea label="Description" value={form.description} onChange={v => setForm({ ...form, description: v })} />
            <Textarea label="Role" value={form.role} onChange={v => setForm({ ...form, role: v })} />
            <Textarea label="Outcomes (comma-separated)" value={form.outcomes} onChange={v => setForm({ ...form, outcomes: v })} />
            <Textarea label="Challenge" value={form.challenge} onChange={v => setForm({ ...form, challenge: v })} />
            <Textarea label="Solution" value={form.solution} onChange={v => setForm({ ...form, solution: v })} />
            <Input label="Tags (comma-separated)" value={form.tags} onChange={v => setForm({ ...form, tags: v })} />
            <Input label="Primary image URL" value={form.image_url} onChange={v => setForm({ ...form, image_url: v })} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              Published
            </label>
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
              Featured
            </label>
            <button onClick={save} disabled={saving} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-60">
              <Save className="h-4 w-4" />
              {saving ? 'Saving...' : 'Save project'}
            </button>
          </div>
        </section>

        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-950">Gallery media</h2>
          <div className="grid gap-4 md:grid-cols-[1fr_180px_auto]">
            <div>
              <div className="mb-3 flex gap-3">
                <button onClick={() => fileRef.current?.click()} disabled={uploading} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 hover:border-blue-600">
                  <ImagePlus className="h-4 w-4" />
                  {uploading ? 'Uploading...' : 'Upload image'}
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => upload(e.target.files?.[0])} />
              </div>
              <input value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="Paste image URL or upload" className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-600" />
            </div>
            <Select label="Orientation" value={mediaOrientation} onChange={setMediaOrientation} options={[{ value: 'landscape', label: 'Landscape' }, { value: 'portrait', label: 'Portrait' }]} />
            <div className="flex items-end">
              <button onClick={addMedia} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-3 text-sm font-bold text-white hover:bg-blue-700">
                <Plus className="h-4 w-4" />
                Add media
              </button>
            </div>
          </div>

          {current?.media?.length > 0 && (
            <div className="mt-6 grid gap-3 md:grid-cols-4">
              {current.media.map(item => (
                <div key={item.id} className="rounded-lg border border-slate-200 p-2">
                  <div className={`relative overflow-hidden rounded-md bg-slate-100 ${item.orientation === 'portrait' ? 'aspect-[9/16]' : 'aspect-video'}`}>
                    <img src={item.url} alt={item.alt || form.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">{item.orientation}</span>
                    <button onClick={() => deleteMedia(current.id, item.id)} className="text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-950">Published projects</h2>
          <div className="grid gap-3">
            {projects.map(project => (
              <div key={project.id} className="flex items-center justify-between rounded-lg bg-slate-50 p-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-950">{project.title}</p>
                  <p className="mt-1 text-xs text-slate-500">{project.project_type} / {project.status} / {(project.media || []).length} media</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => edit(project)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">Edit</button>
                  <button onClick={() => remove(project.id)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function stringList(value) {
  if (Array.isArray(value)) return value
  return String(value || '').split(',').map(item => item.trim()).filter(Boolean)
}

function fromProject(project) {
  return {
    ...BLANK,
    ...project,
    tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags || '',
    outcomes: Array.isArray(project.outcomes) ? project.outcomes.join(', ') : project.outcomes || '',
    launched_at: project.launched_at ? String(project.launched_at).slice(0, 10) : '',
  }
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-600" />
    </label>
  )
}

function Textarea({ label, value, onChange }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <textarea value={value || ''} onChange={e => onChange(e.target.value)} rows={3} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-600" />
    </label>
  )
}

function Select({ label, value, onChange, options }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <select value={value || ''} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-600">
        {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </label>
  )
}

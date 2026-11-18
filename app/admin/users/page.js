'use client'

import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'
import { Save, Trash2, UserPlus } from 'lucide-react'
import { useEffect, useState } from 'react'

const BLANK = { name: '', email: '', password: '', role: 'admin', is_active: true }

export default function AdminUsersPage() {
  const [users, setUsers] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editing, setEditing] = useState(null)

  const load = async () => {
    const res = await fetch('/api/admin/users')
    const data = await res.json()
    setUsers(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const save = async () => {
    if (!form.name || !form.email || (!editing && !form.password)) {
      toast.error('Name, email, and password are required')
      return
    }
    const res = await fetch(editing ? `/api/admin/users/${editing}` : '/api/admin/users', {
      method: editing ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error || 'Save failed')
      return
    }
    toast.success(editing ? 'Admin updated' : 'Admin created')
    setEditing(null)
    setForm(BLANK)
    load()
  }

  const edit = (user) => {
    setEditing(user.id)
    setForm({ name: user.name, email: user.email, password: '', role: user.role, is_active: user.is_active })
  }

  const remove = async (id) => {
    if (!confirm('Delete this admin user?')) return
    const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' })
    const data = await res.json()
    if (!res.ok) {
      toast.error(data.error || 'Delete failed')
      return
    }
    toast.success('Admin deleted')
    load()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mb-8">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">Security</p>
          <h1 className="text-3xl font-semibold tracking-normal text-slate-950">Admin users</h1>
          <p className="mt-2 text-sm text-slate-500">Manage database-backed admin accounts and roles.</p>
        </div>

        <section className="mb-8 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-950">{editing ? 'Edit admin' : 'Create admin'}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <Input label="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
            <Input label="Email" type="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
            <Input label={editing ? 'New password (optional)' : 'Password'} type="password" value={form.password} onChange={v => setForm({ ...form, password: v })} />
            <label>
              <span className="mb-2 block text-sm font-semibold text-slate-700">Role</span>
              <select value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-600">
                <option value="owner">Owner</option>
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
            </label>
          </div>
          <div className="mt-5 flex items-center gap-5">
            <label className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
              Active
            </label>
            <button onClick={save} className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-bold text-white hover:bg-blue-700">
              {editing ? <Save className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
              {editing ? 'Save admin' : 'Create admin'}
            </button>
            {editing && <button onClick={() => { setEditing(null); setForm(BLANK) }} className="text-sm font-bold text-slate-500">Cancel</button>}
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-5 text-lg font-semibold text-slate-950">Current admins</h2>
          <div className="space-y-3">
            {users.map(user => (
              <div key={user.id} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-4">
                <div>
                  <p className="text-sm font-bold text-slate-950">{user.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{user.email} / {user.role} / {user.is_active ? 'active' : 'inactive'}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => edit(user)} className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-bold text-slate-700">Edit</button>
                  <button onClick={() => remove(user.id)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-bold text-red-700"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

function Input({ label, value, onChange, type = 'text' }) {
  return (
    <label>
      <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} className="w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-blue-600" />
    </label>
  )
}

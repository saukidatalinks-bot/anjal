'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminContacts() {
  const [messages, setMessages] = useState([])
  const [filter, setFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    const res = await fetch('/api/admin/contacts')
    const data = await res.json()
    setMessages(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const markRead = async (id) => {
    await fetch('/api/admin/contacts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m))
  }

  const deleteMsg = async (id) => {
    if (!confirm('Delete this message?')) return
    await fetch(`/api/admin/contacts?id=${id}`, { method: 'DELETE' })
    toast.success('Deleted')
    load()
  }

  const clearAll = async () => {
    if (!confirm('Clear ALL messages? This cannot be undone.')) return
    await fetch('/api/admin/contacts?id=all', { method: 'DELETE' })
    toast.success('All messages cleared')
    load()
  }

  const filtered = messages.filter(m => {
    if (filter === 'unread') return !m.is_read
    if (filter === 'read') return m.is_read
    return true
  })

  const unread = messages.filter(m => !m.is_read).length

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-3xl text-navy mb-1">Contact Messages</h1>
            <p className="text-slate-500 text-sm">{messages.length} total · <span className="text-brand-green font-semibold">{unread} unread</span></p>
          </div>
          <button onClick={clearAll} className="btn py-2 px-4 text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white">
            🗑 Clear All
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {['all', 'unread', 'read'].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold capitalize transition-all ${filter === f ? 'bg-navy text-white' : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300'}`}>
              {f} {f === 'all' ? `(${messages.length})` : f === 'unread' ? `(${unread})` : `(${messages.length - unread})`}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex flex-col gap-4">
          {filtered.length === 0 ? (
            <div className="admin-card text-center py-12 text-slate-400">No messages in this filter.</div>
          ) : filtered.map(m => (
            <div key={m.id} className={`admin-card cursor-pointer transition-all ${!m.is_read ? 'border-l-4 border-l-blue-500' : ''}`}
              onClick={() => { setExpanded(expanded === m.id ? null : m.id); if (!m.is_read) markRead(m.id) }}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-navy rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                    {m.name?.[0]?.toUpperCase() || '?'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-navy">{m.name}</span>
                      {!m.is_read && <span className="status-badge bg-blue-100 text-blue-700 text-[10px]">NEW</span>}
                      {m.service && <span className="status-badge bg-slate-100 text-slate-600 text-[10px]">{m.service}</span>}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400">
                      <a href={`mailto:${m.email}`} onClick={e => e.stopPropagation()} className="hover:text-brand-green transition-colors">📧 {m.email}</a>
                      {m.phone && <span>📞 {m.phone}</span>}
                      {m.budget && <span>💰 {m.budget}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-300 font-mono">{new Date(m.created_at).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' })}</span>
                  <button onClick={e => { e.stopPropagation(); deleteMsg(m.id) }} className="text-red-300 hover:text-red-500 transition-colors text-lg">×</button>
                </div>
              </div>

              {expanded === m.id && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">{m.message}</p>
                  <div className="flex gap-3 mt-3">
                    <a href={`mailto:${m.email}?subject=Re: Your enquiry to Anjal Ventures`} className="btn btn-primary py-2 px-4 text-xs">📧 Reply by Email</a>
                    {m.phone && <a href={`https://wa.me/${m.phone.replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener" className="btn btn-green py-2 px-4 text-xs">💬 WhatsApp</a>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

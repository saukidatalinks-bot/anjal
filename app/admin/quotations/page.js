'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState([])
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    const res = await fetch('/api/admin/quotations')
    const data = await res.json()
    setQuotations(Array.isArray(data) ? data : [])
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id) => {
    if (!confirm('Delete this quotation request?')) return
    await fetch(`/api/admin/quotations?id=${id}`, { method: 'DELETE' })
    toast.success('Deleted'); load()
  }

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-navy mb-1">Quotation Requests</h1>
          <p className="text-slate-500 text-sm">{quotations.length} total quotation request{quotations.length !== 1 ? 's' : ''} received</p>
        </div>

        {quotations.length === 0 ? (
          <div className="admin-card text-center py-16">
            <div className="text-5xl mb-3">📋</div>
            <p className="text-slate-400">No quotation requests yet. They will appear here when clients fill the quotation form.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {quotations.map(q => {
              const items = typeof q.selected_items === 'string' ? JSON.parse(q.selected_items) : q.selected_items || []
              return (
                <div key={q.id} className="admin-card cursor-pointer" onClick={() => setExpanded(expanded === q.id ? null : q.id)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-brand-green rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {q.client_name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-semibold text-navy">{q.client_name}</div>
                        {q.entity_name && <div className="text-xs text-slate-500">{q.entity_name}</div>}
                        <div className="flex gap-3 text-xs text-slate-400 mt-1">
                          {q.email && <a href={`mailto:${q.email}`} onClick={e => e.stopPropagation()} className="hover:text-brand-green">📧 {q.email}</a>}
                          {q.phone && <span>📞 {q.phone}</span>}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-display text-xl font-bold text-brand-green">${parseFloat(q.total_amount || 0).toFixed(2)}</div>
                        <div className="text-[11px] text-slate-300">{items.length} items</div>
                      </div>
                      <div className="text-xs text-slate-300 font-mono">{new Date(q.created_at).toLocaleDateString()}</div>
                      <button onClick={e => { e.stopPropagation(); handleDelete(q.id) }} className="text-red-300 hover:text-red-500 text-lg">×</button>
                    </div>
                  </div>

                  {expanded === q.id && (
                    <div className="mt-5 pt-5 border-t border-slate-100">
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        {q.address && <div><div className="text-xs text-slate-400 mb-1">Address</div><div className="text-sm text-navy">{q.address}</div></div>}
                        {q.notes && <div><div className="text-xs text-slate-400 mb-1">Notes</div><div className="text-sm text-navy">{q.notes}</div></div>}
                      </div>
                      <div className="bg-slate-50 rounded-xl p-4">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Selected Services</div>
                        {items.map((item, i) => (
                          <div key={i} className="flex justify-between items-center py-2 border-b border-slate-200 last:border-0">
                            <span className="text-sm text-slate-700">{item.name}</span>
                            <span className="text-sm font-semibold text-brand-green">${parseFloat(item.base_price || 0).toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center pt-3 font-bold">
                          <span className="text-navy">Total</span>
                          <span className="text-brand-green text-lg">${parseFloat(q.total_amount || 0).toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-4">
                        {q.email && <a href={`mailto:${q.email}?subject=Your Anjal Ventures Quotation`} className="btn btn-primary py-2 px-4 text-xs">📧 Reply</a>}
                        {q.phone && <a href={`https://wa.me/${(q.phone || '').replace(/[^0-9]/g,'')}`} target="_blank" rel="noopener" className="btn btn-green py-2 px-4 text-xs">💬 WhatsApp</a>}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/AdminSidebar'
import { formatNaira } from '@/lib/format'

export default function AdminQuotations() {
  const [quotations, setQuotations] = useState([])
  const [expanded, setExpanded] = useState(null)

  const load = async () => {
    const res = await fetch('/api/admin/quotations')
    const data = await res.json()
    setQuotations(Array.isArray(data) ? data : [])
  }

  useEffect(() => {
    load()
  }, [])

  const deleteQuote = async id => {
    if (!confirm('Delete this quotation record?')) return
    await fetch(`/api/admin/quotations?id=${id}`, { method: 'DELETE' })
    toast.success('Quotation deleted')
    load()
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mb-8">
          <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
            Commercial Pipeline
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Naira Quotation Requests</h1>
          <p className="mt-1 text-sm text-slate-600">{quotations.length} submitted proposal configurations</p>
        </div>

        <div className="space-y-4">
          {quotations.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
              No quotation requests submitted yet.
            </div>
          ) : (
            quotations.map(q => {
              const items = Array.isArray(q.selected_items) ? q.selected_items : []
              const amount = Number(q.total_naira || q.total_amount || 0)

              return (
                <article
                  key={q.id}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <button
                      type="button"
                      onClick={() => setExpanded(expanded === q.id ? null : q.id)}
                      className="text-left"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-950">{q.client_name}</h2>
                        {q.reference && (
                          <span className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-700">
                            {q.reference}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-xs text-slate-500">
                        {q.project_title || q.entity_name || 'Custom Software Engagement'} · {q.email}
                        {q.phone ? ` · ${q.phone}` : ''}
                      </p>
                    </button>

                    <div className="flex items-center gap-3">
                      <span className="font-mono text-lg font-bold text-slate-950">{formatNaira(amount)}</span>
                      <button
                        type="button"
                        onClick={() => deleteQuote(q.id)}
                        aria-label="Delete quotation"
                        className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  {expanded === q.id && (
                    <div className="mt-4 border-t border-slate-100 pt-4 text-sm text-slate-700">
                      {items.length > 0 && (
                        <div className="mb-3 grid gap-2 sm:grid-cols-2">
                          {items.map((item, idx) => (
                            <div
                              key={`${item.name}-${idx}`}
                              className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"
                            >
                              <span className="font-medium text-slate-800">{item.name}</span>
                              <span className="font-mono font-semibold text-slate-900">
                                {Number(item.price || 0) > 0 ? formatNaira(item.price) : `×${Number(item.multiplier || 1).toFixed(2)}`}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                      {q.address && <p className="text-xs text-slate-500">Address: {q.address}</p>}
                      {q.notes && <p className="mt-2 rounded-lg bg-slate-50 p-3 text-xs text-slate-700">{q.notes}</p>}
                    </div>
                  )}
                </article>
              )
            })
          )}
        </div>
      </main>
    </div>
  )
}

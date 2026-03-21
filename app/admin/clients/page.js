'use client'

import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/AdminSidebar'

const BLANK = {
  slug: '',
  client_name: '',
  company_name: '',
  contact_email: '',
  project_title: '',
  project_description: '',
  project_status: 'in_progress',
  total_amount: 0,
  currency: 'NGN',
  total_amount_usd: 0,
  progress_percent: 0,
  current_milestone: 1,
  milestones_json: [
    { title: 'Discovery & Kickoff', description: 'Requirements and planning', status: 'in_progress', due: 'Week 1' },
    { title: 'Core Build', description: 'Development phase', status: 'pending', due: 'Week 2' },
    { title: 'Integration', description: 'Mobile/API integration', status: 'pending', due: 'Week 3' },
    { title: 'QA & Handover', description: 'Testing and deployment', status: 'pending', due: 'Week 4' },
  ],
  allow_final_payment: false,
  is_active: true,
  payment_bank: 'Opay',
  payment_account_number: '9024099561',
  payment_account_name: 'Ahmad Muhammad Jawa',
  payment_note: 'Project Lead account for transfer. Client uploads receipt for verification.',
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState([])
  const [payments, setPayments] = useState([])
  const [form, setForm] = useState(BLANK)
  const [milestonesText, setMilestonesText] = useState(JSON.stringify(BLANK.milestones_json, null, 2))
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [selectedClient, setSelectedClient] = useState('all')
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [activeFilter, setActiveFilter] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [receiptPreview, setReceiptPreview] = useState('')

  const load = async () => {
    try {
      const [clientRes, paymentRes] = await Promise.all([
        fetch('/api/admin/clients'),
        fetch('/api/admin/clients/payments'),
      ])
      const [clientData, paymentData] = await Promise.all([clientRes.json(), paymentRes.json()])
      setClients(Array.isArray(clientData) ? clientData : [])
      setPayments(Array.isArray(paymentData) ? paymentData : [])
    } catch {
      toast.error('Failed to load client data')
    }
  }

  useEffect(() => {
    load()
  }, [])

  const filteredPayments = useMemo(() => {
    let list = payments
    if (selectedClient !== 'all') {
      list = list.filter((p) => String(p.client_id) === String(selectedClient))
    }
    if (paymentStatusFilter !== 'all') {
      list = list.filter((p) => p.status === paymentStatusFilter)
    }
    return list
  }, [payments, selectedClient, paymentStatusFilter])

  const filteredClients = useMemo(() => {
    let list = clients
    if (statusFilter !== 'all') {
      list = list.filter((c) => c.project_status === statusFilter)
    }
    if (activeFilter !== 'all') {
      list = list.filter((c) => (activeFilter === 'active' ? c.is_active !== false : c.is_active === false))
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim()
      list = list.filter((c) => {
        return (
          String(c.client_name || '').toLowerCase().includes(q) ||
          String(c.slug || '').toLowerCase().includes(q) ||
          String(c.project_title || '').toLowerCase().includes(q) ||
          String(c.contact_email || '').toLowerCase().includes(q)
        )
      })
    }
    return list
  }, [clients, statusFilter, activeFilter, searchText])

  const dashboardStats = useMemo(() => {
    const totalClients = clients.length
    const activeClients = clients.filter((c) => c.is_active !== false).length
    const pendingPayments = payments.filter((p) => p.status === 'pending').length
    const verifiedAmount = payments
      .filter((p) => p.status === 'verified')
      .reduce((sum, p) => sum + (Number(p.paid_amount) || 0), 0)

    return {
      totalClients,
      activeClients,
      pendingPayments,
      verifiedAmount,
    }
  }, [clients, payments])

  const resetForm = () => {
    setEditingId(null)
    setForm(BLANK)
    setMilestonesText(JSON.stringify(BLANK.milestones_json, null, 2))
  }

  const startEdit = (client) => {
    setEditingId(client.id)
    setForm({ ...client, milestones_json: client.milestones_json || [] })
    setMilestonesText(JSON.stringify(client.milestones_json || [], null, 2))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const quickStatusUpdate = async (client, update) => {
    try {
      const payload = {
        ...client,
        ...update,
        milestones_json: client.milestones_json || [],
      }

      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Status update failed')
      toast.success('Client status updated')
      await load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const saveClient = async () => {
    setSaving(true)
    try {
      let milestones = []
      try {
        milestones = JSON.parse(milestonesText)
      } catch {
        toast.error('Milestones JSON is invalid')
        setSaving(false)
        return
      }

      const payload = {
        ...form,
        milestones_json: milestones,
        total_amount: parseFloat(form.total_amount) || 0,
        total_amount_usd: parseFloat(form.total_amount_usd) || 0,
        progress_percent: parseInt(form.progress_percent) || 0,
        current_milestone: parseInt(form.current_milestone) || 1,
      }

      const res = await fetch(editingId ? `/api/admin/clients/${editingId}` : '/api/admin/clients', {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')

      toast.success(editingId ? 'Client updated' : 'Client created')
      resetForm()
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSaving(false)
    }
  }

  const removeClient = async (id) => {
    if (!confirm('Delete this client portal?')) return
    try {
      await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' })
      toast.success('Client deleted')
      await load()
    } catch {
      toast.error('Delete failed')
    }
  }

  const updatePayment = async (payment, status, options = {}) => {
    try {
      const res = await fetch('/api/admin/clients/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: payment.id,
          status,
          admin_note: options.admin_note || null,
          unlock_final_payment: options.unlock_final_payment || false,
          advance_milestone: options.advance_milestone || false,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Payment update failed')
      toast.success('Payment status updated')
      await load()
    } catch (err) {
      toast.error(err.message)
    }
  }

  const askAndUpdatePayment = async (payment, status, extra = {}) => {
    const note = window.prompt('Optional admin note for this payment action:', '')
    await updatePayment(payment, status, {
      ...extra,
      admin_note: note || null,
    })
  }

  const formatMoney = (amount, currency = 'NGN') => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number(amount || 0))
  }

  return (
    <div className="flex min-h-screen bg-[#f3f5f8]">
      <Toaster position="top-right" />
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8 md:p-10">
        <div className="hero-entrance hero-entrance-delayed-100 mb-8 rounded-3xl border border-black/5 bg-white px-7 py-6 shadow-[0_20px_60px_rgba(15,23,42,0.08)] premium-card">
          <h1 className="font-display text-3xl text-[#1d1d1f] mb-1">Client Operations Command Center</h1>
          <p className="text-slate-600 text-sm">Enterprise-grade control for contract delivery, progress governance, and staged payment compliance.</p>
          <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="stagger-item rounded-2xl border border-black/5 bg-[#f8f8fb] p-4 premium-card">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Client Portals</p>
              <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">{dashboardStats.totalClients}</p>
            </div>
            <div className="stagger-item rounded-2xl border border-black/5 bg-[#f8f8fb] p-4 premium-card">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Active Programs</p>
              <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">{dashboardStats.activeClients}</p>
            </div>
            <div className="stagger-item rounded-2xl border border-black/5 bg-[#f8f8fb] p-4 premium-card">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Pending Verifications</p>
              <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">{dashboardStats.pendingPayments}</p>
            </div>
            <div className="stagger-item rounded-2xl border border-black/5 bg-[#f8f8fb] p-4 premium-card">
              <p className="text-[11px] uppercase tracking-[0.14em] text-slate-500">Verified Revenue</p>
              <p className="text-2xl font-semibold text-[#1d1d1f] mt-1">{formatMoney(dashboardStats.verifiedAmount, 'NGN')}</p>
            </div>
          </div>
        </div>

        <div className="hero-entrance hero-entrance-delayed-200 rounded-3xl border border-black/5 bg-white p-7 mb-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] premium-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1d1d1f] text-lg">{editingId ? 'Edit Client Portal' : 'Create Client Portal'}</h2>
            {editingId && <button onClick={resetForm} className="text-xs text-slate-500 hover:text-red-500">Cancel Edit</button>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Slug *</label>
              <input className="input-field" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="adam" />
            </div>
            <div>
              <label className="label">Client Name *</label>
              <input className="input-field" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} placeholder="ADAM" />
            </div>
            <div>
              <label className="label">Company</label>
              <input className="input-field" value={form.company_name || ''} onChange={e => setForm({ ...form, company_name: e.target.value })} />
            </div>
            <div>
              <label className="label">Contact Email</label>
              <input className="input-field" value={form.contact_email || ''} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Project Title *</label>
              <input className="input-field" value={form.project_title} onChange={e => setForm({ ...form, project_title: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Project Description</label>
              <textarea className="input-field" rows={3} value={form.project_description || ''} onChange={e => setForm({ ...form, project_description: e.target.value })} />
            </div>
            <div>
              <label className="label">Total Amount (NGN)</label>
              <input type="number" className="input-field" value={form.total_amount} onChange={e => setForm({ ...form, total_amount: e.target.value })} />
            </div>
            <div>
              <label className="label">Total Amount (USD)</label>
              <input type="number" className="input-field" value={form.total_amount_usd} onChange={e => setForm({ ...form, total_amount_usd: e.target.value })} />
            </div>
            <div>
              <label className="label">Progress (%)</label>
              <input type="number" className="input-field" value={form.progress_percent} onChange={e => setForm({ ...form, progress_percent: e.target.value })} />
            </div>
            <div>
              <label className="label">Current Milestone #</label>
              <input type="number" className="input-field" value={form.current_milestone} onChange={e => setForm({ ...form, current_milestone: e.target.value })} />
            </div>
            <div>
              <label className="label">Project Status</label>
              <select className="input-field" value={form.project_status || 'in_progress'} onChange={e => setForm({ ...form, project_status: e.target.value })}>
                <option value="onboarding">Onboarding</option>
                <option value="in_progress">In Progress</option>
                <option value="review">In Review</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
            </div>
            <div className="flex flex-col justify-end gap-2 pb-2">
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.allow_final_payment === true} onChange={e => setForm({ ...form, allow_final_payment: e.target.checked })} />
                Allow final payment
              </label>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <input type="checkbox" checked={form.is_active !== false} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                Active portal
              </label>
            </div>
            <div>
              <label className="label">Payment Bank</label>
              <input className="input-field" value={form.payment_bank || ''} onChange={e => setForm({ ...form, payment_bank: e.target.value })} />
            </div>
            <div>
              <label className="label">Account Number</label>
              <input className="input-field" value={form.payment_account_number || ''} onChange={e => setForm({ ...form, payment_account_number: e.target.value })} />
            </div>
            <div>
              <label className="label">Account Name</label>
              <input className="input-field" value={form.payment_account_name || ''} onChange={e => setForm({ ...form, payment_account_name: e.target.value })} />
            </div>
            <div className="col-span-2">
              <label className="label">Payment Note</label>
              <textarea className="input-field" rows={2} value={form.payment_note || ''} onChange={e => setForm({ ...form, payment_note: e.target.value })} />
            </div>
          </div>

          <div className="mb-4">
            <label className="label">Milestones JSON</label>
            <textarea
              className="input-field font-mono text-xs"
              rows={8}
              value={milestonesText}
              onChange={e => setMilestonesText(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2">Use an array of objects: title, description, status, due.</p>
          </div>

          <button onClick={saveClient} disabled={saving} className="inline-flex items-center justify-center px-7 py-3 rounded-xl bg-[#0071e3] hover:bg-[#0077ed] text-white font-semibold transition-colors disabled:opacity-60 premium-button">
            {saving ? 'Saving...' : editingId ? 'Update Client' : 'Create Client'}
          </button>
        </div>

        <div className="hero-entrance hero-entrance-delayed-300 rounded-3xl border border-black/5 bg-white p-7 mb-8 shadow-[0_20px_60px_rgba(15,23,42,0.08)] premium-card">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 mb-4">
            <h2 className="font-bold text-[#1d1d1f]">Client Portals ({filteredClients.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-2 w-full lg:w-auto">
              <input
                className="input-field md:w-56 luxury-input"
                placeholder="Search name, slug, email"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <select className="input-field luxury-input" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="all">All statuses</option>
                <option value="onboarding">Onboarding</option>
                <option value="in_progress">In progress</option>
                <option value="review">Review</option>
                <option value="completed">Completed</option>
                <option value="blocked">Blocked</option>
              </select>
              <select className="input-field luxury-input" value={activeFilter} onChange={(e) => setActiveFilter(e.target.value)}>
                <option value="all">All portals</option>
                <option value="active">Active only</option>
                <option value="inactive">Inactive only</option>
              </select>
              <button
                type="button"
                onClick={() => {
                  setSearchText('')
                  setStatusFilter('all')
                  setActiveFilter('all')
                }}
                className="inline-flex items-center justify-center px-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredClients.map(c => (
              <div key={c.id} className="stagger-item rounded-2xl border border-black/5 bg-[#fafafc] p-4 md:p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 premium-card premium-hover">
                <div>
                  <div className="font-semibold text-[#1d1d1f]">{c.client_name} · /clients/{c.slug}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.project_title}</div>
                  <div className="text-xs text-slate-500 mt-1">Progress {c.progress_percent}% · Pending payments {c.pending_payments || 0}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border ${c.is_active !== false ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                      {c.is_active !== false ? 'Active' : 'Inactive'}
                    </span>
                    <span className="text-[10px] uppercase tracking-[0.12em] px-2.5 py-1 rounded-full border border-blue-200 bg-blue-50 text-blue-700">
                      {(c.project_status || 'in_progress').replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <a href={`/clients/${c.slug}`} target="_blank" rel="noopener" className="inline-flex items-center px-4 py-2 text-xs rounded-lg bg-[#0071e3] text-white hover:bg-[#0077ed] premium-button">Open Portal</a>
                  <button onClick={() => startEdit(c)} className="inline-flex items-center px-4 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 premium-button">Edit</button>
                  <button
                    onClick={() => quickStatusUpdate(c, { is_active: c.is_active === false })}
                    className="inline-flex items-center px-4 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 premium-button"
                  >
                    {c.is_active === false ? 'Activate' : 'Deactivate'}
                  </button>
                  <button
                    onClick={() => quickStatusUpdate(c, {
                      allow_final_payment: c.allow_final_payment !== true,
                    })}
                    className="inline-flex items-center px-4 py-2 text-xs rounded-lg border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 premium-button"
                  >
                    {c.allow_final_payment ? 'Lock Final Pay' : 'Unlock Final Pay'}
                  </button>
                  <button onClick={() => removeClient(c.id)} className="inline-flex items-center px-4 py-2 text-xs rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 premium-button">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-entrance hero-entrance-delayed-400 rounded-3xl border border-black/5 bg-white p-7 shadow-[0_20px_60px_rgba(15,23,42,0.08)] premium-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#1d1d1f]">Payment Verification Queue</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <select
                className="input-field max-w-xs luxury-input"
                value={selectedClient}
                onChange={e => setSelectedClient(e.target.value)}
              >
                <option value="all">All clients</option>
                {clients.map(c => <option key={c.id} value={c.id}>{c.client_name} ({c.slug})</option>)}
              </select>

              <select
                className="input-field max-w-xs luxury-input"
                value={paymentStatusFilter}
                onChange={e => setPaymentStatusFilter(e.target.value)}
              >
                <option value="all">All payment states</option>
                <option value="pending">Pending</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSelectedClient('all')
                  setPaymentStatusFilter('all')
                }}
                className="inline-flex items-center justify-center px-4 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {filteredPayments.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-8">No payment submissions yet.</div>
            ) : filteredPayments.map(p => (
              <div key={p.id} className="stagger-item border border-slate-200 rounded-2xl p-4 bg-[#fafafc] premium-card premium-hover">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-[#1d1d1f]">{p.client_name} · {p.project_title}</div>
                    <div className="text-xs text-slate-500 mt-1">/{p.slug} · {p.payment_phase} payment · Amount: {p.paid_amount}</div>
                    <div className="text-xs text-slate-400 mt-1">Submitted: {new Date(p.submitted_at).toLocaleString()}</div>
                    {p.transfer_reference && <div className="text-xs text-slate-500 mt-1">Ref: {p.transfer_reference}</div>}
                    {p.admin_note && <div className="text-xs text-slate-500 mt-1">Admin note: {p.admin_note}</div>}
                  </div>

                  <span className={`status-badge ${p.status === 'verified' ? 'bg-green-100 text-green-700' : p.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                    {p.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <button onClick={() => setReceiptPreview(p.receipt_url)} className="inline-flex items-center px-4 py-2 text-xs rounded-lg bg-[#0071e3] text-white hover:bg-[#0077ed] premium-button">View Receipt Image</button>
                  <button onClick={() => askAndUpdatePayment(p, 'verified')} className="inline-flex items-center px-4 py-2 text-xs rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 premium-button">Verify</button>
                  <button onClick={() => askAndUpdatePayment(p, 'verified', { unlock_final_payment: true, advance_milestone: true })} className="inline-flex items-center px-4 py-2 text-xs rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 premium-button">Verify + Unlock Final + Advance</button>
                  <button onClick={() => askAndUpdatePayment(p, 'rejected')} className="inline-flex items-center px-4 py-2 text-xs rounded-lg bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 premium-button">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {receiptPreview && (
          <div className="fixed inset-0 z-50 bg-[#111827]/70 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setReceiptPreview('')}>
            <div className="max-w-5xl w-full rounded-2xl overflow-hidden bg-white" onClick={(e) => e.stopPropagation()}>
              <div className="px-5 py-3 border-b border-slate-200 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-[#1d1d1f]">Client Payment Receipt</h3>
                <button type="button" onClick={() => setReceiptPreview('')} className="text-sm text-slate-500 hover:text-[#1d1d1f]">Close</button>
              </div>
              <div className="bg-slate-50 p-4">
                <img src={receiptPreview} alt="Payment receipt" className="w-full max-h-[78vh] object-contain rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/AdminSidebar'

const DEFAULT_QUOTATION = `ANJAL VENTURES
Technology & Digital Solutions
QUOTATION
Ref: AV/DEV/2026/001

FROM:
Anjal Ventures (Anjal Developers Team)
BN Reg. No. 9258709 | CAC Certified
TIN: 2623553716975
No. 4, MJG Global Ventures Complex,
Kolomi Ali Street, Sabon Pegi,
Damaturu, Yobe State, Nigeria

QUOTATION DETAILS
Date: February 19, 2026
Valid Until: March 19, 2026 (30 Days)
Currency: USD / NGN
Exchange Rate: $1 = N1,350
Payment Terms: 50% Upfront, 50% on Delivery

SCOPE OF SERVICES & ITEMISED QUOTATION

1. Website Development (Serverless Cloud Infrastructure)
   Cost: $65.00 / N87,750
   Fully responsive, production-ready website on serverless cloud infrastructure.
   Includes: Custom frontend & backend, cloud-hosted database, auto-scaling, SSL, admin dashboard & CMS.

2. Google Play Developer Account (Registered & Verified)
   Cost: $25.00 / N33,750
   Registered Google Play Console developer account in client's name.
   Lifetime app publishing rights, full ownership & access.

3. .app Domain Registration (1-Year Premium Domain)
   Cost: $15.00 / N20,250
   Branded .app top-level domain with Google-managed HTTPS enforcement,
   1-year registration & DNS setup.

4. Android Mobile Application (Native Android / Cross-platform)
   Cost: $40.00 / N54,000
   Full-featured Android app synced with web platform.
   Includes: UI/UX design, API integration, push notifications, Google Play submission, source code delivery.

5. Subsidized Data Vending API Access & Integration
   Cost: $25.00 / N33,750
   Exclusive access to Anjal Ventures subsidized data vending API.
   Includes: API key provisioning, integration, below-market rates, technical documentation & support.

Subtotal:     $170.00
Tax / VAT:     Nil
TOTAL:        $170.00
NGN Equiv:    N229,500

Payment Schedule:
50% deposit ($85 / N114,750) required before project commencement.
Balance of 50% ($85 / N114,750) payable upon project delivery and handover.

Delivery Timeline:
Estimated delivery: 2-4 weeks from deposit confirmation.

Post-Delivery Support:
14-day complimentary bug-fix support included.

Issued By: Anjal Developers Team
Anjal Ventures | CAC Reg. No. 9258709
anjalventures@gmail.com`

const DEFAULT_CONTRACT = `CONTRACT AGREEMENT
Anjal Ventures x Client
Reference: AV/DEV/2026/001

1. PARTIES
This Agreement is between Anjal Ventures (Anjal Developers Team), BN Reg. No. 9258709, CAC Certified, and the above-named client.

2. SCOPE OF SERVICES
The Service Provider agrees to deliver all services as described in the Quotation. Scope changes must be agreed in writing.

3. PAYMENT SCHEDULE
Stage 1 - Initial Payment: 50% of total quoted amount due before project commencement.
Stage 2 - Final Payment: Remaining 50% payable upon satisfactory project delivery.

4. DELIVERY TIMELINE
Estimated delivery: 2-4 weeks from Stage 1 payment confirmation.

5. INTELLECTUAL PROPERTY
Upon receipt of Stage 2 payment, all deliverables and source code become the sole property of the Client.

6. POST-DELIVERY SUPPORT
14-day complimentary bug-fix support included.

7. CONFIDENTIALITY
Both parties maintain strict confidentiality of all proprietary information.

8. LIMITATION OF LIABILITY
Total liability shall not exceed the amount paid by the Client under this agreement.

9. GOVERNING LAW
Governed by the laws of the Federal Republic of Nigeria.

10. ACCEPTANCE
Proceeding to payment constitutes full acceptance of this agreement.

Issued By: Anjal Developers Team, Anjal Ventures
CAC Reg. No. 9258709 | Damaturu, Yobe State, Nigeria`

const STATUS_COLORS = {
  verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  rejected: 'bg-red-100 text-red-700 border-red-200',
  none: 'bg-slate-100 text-slate-500 border-slate-200',
}

const BLANK = {
  slug: '',
  client_name: '',
  company_name: '',
  contact_email: '',
  project_title: '',
  project_description: '',
  project_status: 'in_progress',
  total_amount: 229500,
  currency: 'NGN',
  total_amount_usd: 170,
  progress_percent: 0,
  current_milestone: 1,
  milestones_json: [],
  allow_final_payment: false,
  is_active: true,
  portal_stage: 'review',
  payment_bank: 'Opay',
  payment_account_number: '9024099561',
  payment_account_name: 'Ahmad Muhammad Jawa',
  payment_note: 'Project Lead account for transfer. Client uploads receipt for verification.',
  quotation_content: DEFAULT_QUOTATION,
  contract_content: DEFAULT_CONTRACT,
}

function fmt(v, cur = 'NGN') {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(Number(v || 0))
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState([])
  const [payments, setPayments] = useState([])
  const [form, setForm] = useState(BLANK)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)
  const [view, setView] = useState('list')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [stageFilter, setStageFilter] = useState('all')
  const [selectedClient, setSelectedClient] = useState('all')
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('all')
  const [receiptPreview, setReceiptPreview] = useState('')

  const load = async () => {
    try {
      const [cRes, pRes] = await Promise.all([
        fetch('/api/admin/clients'),
        fetch('/api/admin/clients/payments'),
      ])
      const [cData, pData] = await Promise.all([cRes.json(), pRes.json()])
      setClients(Array.isArray(cData) ? cData : [])
      setPayments(Array.isArray(pData) ? pData : [])
    } catch {
      toast.error('Failed to load data')
    }
  }

  useEffect(() => { load() }, [])

  const stats = useMemo(() => ({
    total: clients.length,
    active: clients.filter(c => c.is_active !== false).length,
    pendingPayments: payments.filter(p => p.status === 'pending').length,
    completed: clients.filter(c => c.project_completed_at).length,
    verifiedRevenue: payments.filter(p => p.status === 'verified').reduce((s, p) => s + Number(p.paid_amount || 0), 0),
  }), [clients, payments])

  const clientPayments = (clientId) => payments.filter(p => String(p.client_id) === String(clientId))
  const stage1Payment = (clientId) => clientPayments(clientId).find(p => p.payment_phase === 'initial' && p.status !== 'rejected') || null
  const stage2Payment = (clientId) => clientPayments(clientId).find(p => p.payment_phase === 'final' && p.status !== 'rejected') || null

  const filteredClients = useMemo(() => {
    let list = clients
    if (statusFilter !== 'all') list = list.filter(c => c.project_status === statusFilter)
    if (stageFilter !== 'all') list = list.filter(c => (c.portal_stage || 'review') === stageFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(c =>
        (c.client_name || '').toLowerCase().includes(q) ||
        (c.slug || '').toLowerCase().includes(q) ||
        (c.project_title || '').toLowerCase().includes(q) ||
        (c.contact_email || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [clients, statusFilter, stageFilter, search])

  const filteredPayments = useMemo(() => {
    let list = payments
    if (selectedClient !== 'all') list = list.filter(p => String(p.client_id) === String(selectedClient))
    if (paymentStatusFilter !== 'all') list = list.filter(p => p.status === paymentStatusFilter)
    return list
  }, [payments, selectedClient, paymentStatusFilter])

  const resetForm = () => { setEditingId(null); setForm(BLANK); setView('list') }

  const startEdit = (c) => {
    setEditingId(c.id)
    setForm({
      slug: c.slug || '',
      client_name: c.client_name || '',
      company_name: c.company_name || '',
      contact_email: c.contact_email || '',
      project_title: c.project_title || '',
      project_description: c.project_description || '',
      project_status: c.project_status || 'in_progress',
      total_amount: c.total_amount || 229500,
      currency: c.currency || 'NGN',
      total_amount_usd: c.total_amount_usd || 170,
      progress_percent: c.progress_percent || 0,
      current_milestone: c.current_milestone || 1,
      milestones_json: c.milestones_json || [],
      allow_final_payment: c.allow_final_payment === true,
      is_active: c.is_active !== false,
      portal_stage: c.portal_stage || 'review',
      payment_bank: c.payment_bank || 'Opay',
      payment_account_number: c.payment_account_number || '',
      payment_account_name: c.payment_account_name || '',
      payment_note: c.payment_note || '',
      quotation_content: c.quotation_content || DEFAULT_QUOTATION,
      contract_content: c.contract_content || DEFAULT_CONTRACT,
    })
    setView('form')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const save = async () => {
    setSaving(true)
    try {
      const payload = {
        ...form,
        total_amount: parseFloat(form.total_amount) || 0,
        total_amount_usd: parseFloat(form.total_amount_usd) || 0,
        progress_percent: parseInt(form.progress_percent) || 0,
        current_milestone: parseInt(form.current_milestone) || 1,
        milestones_json: form.milestones_json || [],
      }
      const url = editingId ? `/api/admin/clients/${editingId}` : '/api/admin/clients'
      const res = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Save failed')
      toast.success(editingId ? 'Client updated' : 'Portal created')
      resetForm()
      await load()
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  const deleteClient = async (id) => {
    if (!confirm('Permanently delete this client portal?')) return
    try {
      await fetch(`/api/admin/clients/${id}`, { method: 'DELETE' })
      toast.success('Client deleted')
      await load()
    } catch { toast.error('Delete failed') }
  }

  const quickUpdate = async (client, patch) => {
    try {
      const res = await fetch(`/api/admin/clients/${client.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...client, milestones_json: client.milestones_json || [], ...patch }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Update failed')
      toast.success('Updated')
      await load()
    } catch (e) { toast.error(e.message) }
  }

  const verifyPayment = async (payment, opts = {}) => {
    const note = window.prompt('Admin note (optional):', '') ?? null
    try {
      const res = await fetch('/api/admin/clients/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_id: payment.id,
          status: 'verified',
          admin_note: note || null,
          unlock_final_payment: opts.unlockFinal || false,
          advance_milestone: opts.advance || false,
        }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Verification failed')
      toast.success('Payment verified')
      await load()
    } catch (e) { toast.error(e.message) }
  }

  const rejectPayment = async (payment) => {
    const note = window.prompt('Reason for rejection (shown to client):', '') ?? null
    try {
      const res = await fetch('/api/admin/clients/payments', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_id: payment.id, status: 'rejected', admin_note: note || null }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Rejection failed')
      toast.success('Payment rejected')
      await load()
    } catch (e) { toast.error(e.message) }
  }

  const markComplete = async (clientId) => {
    if (!confirm('Mark project as fully completed? This unlocks Stage 3 for the client.')) return
    try {
      const res = await fetch('/api/admin/clients/payments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: clientId, action: 'mark_complete' }),
      })
      const d = await res.json()
      if (!res.ok) throw new Error(d.error || 'Failed')
      toast.success('Project marked complete')
      await load()
    } catch (e) { toast.error(e.message) }
  }

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">

        {/* KPI cards */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Client Portal Management</h1>
              <p className="text-slate-500 text-sm mt-1">Manage portals, quotations, payments, and project delivery</p>
            </div>
            {view === 'list' && (
              <button
                onClick={() => { setEditingId(null); setForm(BLANK); setView('form') }}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                + New Portal
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { label: 'Total Clients', value: stats.total, c: 'from-blue-50 to-indigo-50 border-blue-200/60', t: 'text-blue-700' },
              { label: 'Active Portals', value: stats.active, c: 'from-emerald-50 to-teal-50 border-emerald-200/60', t: 'text-emerald-700' },
              { label: 'Pending Payments', value: stats.pendingPayments, c: 'from-amber-50 to-orange-50 border-amber-200/60', t: 'text-amber-700' },
              { label: 'Projects Complete', value: stats.completed, c: 'from-purple-50 to-pink-50 border-purple-200/60', t: 'text-purple-700' },
              { label: 'Verified Revenue', value: fmt(stats.verifiedRevenue), c: 'from-rose-50 to-pink-50 border-rose-200/60', t: 'text-rose-700' },
            ].map(s => (
              <div key={s.label} className={`rounded-2xl border bg-gradient-to-br ${s.c} p-4`}>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                <p className={`text-2xl font-bold ${s.t} leading-tight`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Create / Edit form */}
        {view === 'form' && (
          <div className="rounded-2xl border border-blue-200/50 bg-gradient-to-br from-blue-50/60 to-white p-7 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? 'Edit Client Portal' : 'Create New Client Portal'}</h2>
              <button onClick={resetForm} className="text-sm text-slate-400 hover:text-red-500">Cancel</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FF label="Portal Slug *" hint="/portal/[slug]">
                <input className="fin" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s/g, '-') })} placeholder="adam" />
              </FF>
              <FF label="Client Name *">
                <input className="fin" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} />
              </FF>
              <FF label="Company Name">
                <input className="fin" value={form.company_name} onChange={e => setForm({ ...form, company_name: e.target.value })} />
              </FF>
              <FF label="Contact Email">
                <input type="email" className="fin" value={form.contact_email} onChange={e => setForm({ ...form, contact_email: e.target.value })} />
              </FF>
              <FF label="Project Title *" className="md:col-span-2">
                <input className="fin" value={form.project_title} onChange={e => setForm({ ...form, project_title: e.target.value })} />
              </FF>
              <FF label="Project Description" className="md:col-span-2">
                <textarea className="fin" rows={2} value={form.project_description} onChange={e => setForm({ ...form, project_description: e.target.value })} />
              </FF>
              <FF label="Total Amount (NGN)">
                <input type="number" className="fin" value={form.total_amount} onChange={e => setForm({ ...form, total_amount: e.target.value })} />
              </FF>
              <FF label="Total Amount (USD)">
                <input type="number" className="fin" value={form.total_amount_usd} onChange={e => setForm({ ...form, total_amount_usd: e.target.value })} />
              </FF>
              <FF label="Payment Bank">
                <input className="fin" value={form.payment_bank} onChange={e => setForm({ ...form, payment_bank: e.target.value })} />
              </FF>
              <FF label="Account Number">
                <input className="fin" value={form.payment_account_number} onChange={e => setForm({ ...form, payment_account_number: e.target.value })} />
              </FF>
              <FF label="Account Name">
                <input className="fin" value={form.payment_account_name} onChange={e => setForm({ ...form, payment_account_name: e.target.value })} />
              </FF>
              <FF label="Project Status">
                <select className="fin" value={form.project_status} onChange={e => setForm({ ...form, project_status: e.target.value })}>
                  <option value="onboarding">Onboarding</option>
                  <option value="in_progress">In Progress</option>
                  <option value="review">In Review</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
              </FF>
              <FF label="Portal Stage">
                <select className="fin" value={form.portal_stage} onChange={e => setForm({ ...form, portal_stage: e.target.value })}>
                  <option value="review">Review (awaiting first payment)</option>
                  <option value="progress">Progress (in delivery)</option>
                </select>
              </FF>
              <FF label="Payment Note" className="md:col-span-2">
                <textarea className="fin" rows={2} value={form.payment_note} onChange={e => setForm({ ...form, payment_note: e.target.value })} />
              </FF>
              <div className="md:col-span-2 flex flex-wrap gap-5">
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({ ...form, is_active: e.target.checked })} />
                  Active portal
                </label>
                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                  <input type="checkbox" checked={form.allow_final_payment} onChange={e => setForm({ ...form, allow_final_payment: e.target.checked })} />
                  Stage 2 payment unlocked
                </label>
              </div>
              <FF label="Quotation Content (displayed to client in portal)" className="md:col-span-2">
                <textarea className="fin font-mono text-xs" rows={14} value={form.quotation_content} onChange={e => setForm({ ...form, quotation_content: e.target.value })} />
              </FF>
              <FF label="Contract Terms (displayed to client in portal)" className="md:col-span-2">
                <textarea className="fin font-mono text-xs" rows={12} value={form.contract_content} onChange={e => setForm({ ...form, contract_content: e.target.value })} />
              </FF>
            </div>
            <div className="mt-6 flex gap-3">
              <button onClick={save} disabled={saving} className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50 transition-colors">
                {saving ? 'Saving...' : editingId ? 'Update Portal' : 'Create Portal'}
              </button>
              <button onClick={resetForm} className="px-5 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm hover:bg-slate-50">Cancel</button>
            </div>
          </div>
        )}

        {/* Client list */}
        {view === 'list' && (
          <div className="rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50/60 to-white p-6 mb-8 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-5">
              <h2 className="font-bold text-slate-800 flex-1">
                Client Portals ({filteredClients.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                <input className="fin-sm" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
                <select className="fin-sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="in_progress">In Progress</option>
                  <option value="onboarding">Onboarding</option>
                  <option value="completed">Completed</option>
                  <option value="blocked">Blocked</option>
                </select>
                <select className="fin-sm" value={stageFilter} onChange={e => setStageFilter(e.target.value)}>
                  <option value="all">All portal stages</option>
                  <option value="review">Review</option>
                  <option value="progress">Progress</option>
                </select>
                <button onClick={() => { setSearch(''); setStatusFilter('all'); setStageFilter('all') }}
                  className="px-3 py-1.5 text-xs border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50">
                  Reset
                </button>
              </div>
            </div>
            <div className="space-y-3">
              {filteredClients.length === 0 && (
                <p className="text-center py-12 text-slate-400 text-sm">No clients found.</p>
              )}
              {filteredClients.map(c => {
                const p1 = stage1Payment(c.id)
                const p2 = stage2Payment(c.id)
                const isComplete = !!c.project_completed_at
                const portalStage = c.portal_stage || 'review'
                return (
                  <div key={c.id} className="rounded-xl border border-slate-200/60 bg-white hover:border-slate-300 hover:shadow-sm transition-all p-5">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-bold text-slate-800">{c.client_name}</span>
                          {c.company_name && <span className="text-slate-400 text-sm">- {c.company_name}</span>}
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase ${c.is_active !== false ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-100 text-slate-400 border-slate-200'}`}>
                            {c.is_active !== false ? 'Active' : 'Inactive'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase ${portalStage === 'progress' ? 'bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                            {portalStage}
                          </span>
                          {isComplete && <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200 uppercase">Delivered</span>}
                        </div>
                        <p className="text-slate-600 text-sm font-medium">{c.project_title}</p>
                        <p className="text-xs text-slate-400 mt-0.5">/portal/{c.slug}{c.contact_email ? ` - ${c.contact_email}` : ''} - {fmt(c.total_amount)} total</p>
                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          <StagePill label="Stage 1" payment={p1} />
                          <StagePill label="Stage 2" payment={p2} unlocked={c.allow_final_payment} />
                          <div className={`text-xs px-2.5 py-1 rounded-full border font-medium ${isComplete ? STATUS_COLORS.verified : STATUS_COLORS.none}`}>
                            Stage 3: {isComplete ? 'Delivered' : 'Pending'}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 flex-shrink-0">
                        <a href={`/portal/${c.slug}`} target="_blank" rel="noopener"
                          className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors">
                          View Portal
                        </a>
                        <button onClick={() => startEdit(c)} className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 transition-colors">Edit</button>
                        <button onClick={() => deleteClient(c.id)} className="px-3 py-1.5 text-xs rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 transition-colors">Delete</button>
                      </div>
                    </div>

                    {/* Inline payment stage actions */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex flex-wrap gap-2">
                      {p1?.status === 'pending' && (
                        <>
                          {p1.receipt_url && (
                            <button onClick={() => setReceiptPreview(p1.receipt_url)} className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">View S1 Receipt</button>
                          )}
                          <button onClick={() => verifyPayment(p1, { unlockFinal: false })} className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium">Verify Stage 1</button>
                          <button onClick={() => verifyPayment(p1, { unlockFinal: true, advance: true })} className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Verify + Unlock Stage 2</button>
                          <button onClick={() => rejectPayment(p1)} className="px-3 py-1.5 text-xs rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100">Reject</button>
                        </>
                      )}
                      {p1?.status === 'verified' && !c.allow_final_payment && !isComplete && (
                        <button onClick={() => quickUpdate(c, { allow_final_payment: true })} className="px-3 py-1.5 text-xs rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600 hover:bg-indigo-100">Unlock Stage 2 Payment</button>
                      )}
                      {p2?.status === 'pending' && (
                        <>
                          {p2.receipt_url && (
                            <button onClick={() => setReceiptPreview(p2.receipt_url)} className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">View S2 Receipt</button>
                          )}
                          <button onClick={() => verifyPayment(p2)} className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium">Verify Stage 2</button>
                          <button onClick={() => rejectPayment(p2)} className="px-3 py-1.5 text-xs rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100">Reject</button>
                        </>
                      )}
                      {p2?.status === 'verified' && !isComplete && (
                        <button onClick={() => markComplete(c.id)} className="px-3 py-1.5 text-xs rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-medium">Mark Project Complete</button>
                      )}
                      {!p1 && !p2 && <span className="text-xs text-slate-400 py-1.5">No payment submissions yet.</span>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Payment Queue */}
        {view === 'list' && (
          <div className="rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50/60 to-white p-6 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
              <h2 className="font-bold text-slate-800 flex-1">
                Payment Queue
                {payments.filter(p => p.status === 'pending').length > 0 && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                    {payments.filter(p => p.status === 'pending').length} pending
                  </span>
                )}
              </h2>
              <div className="flex gap-2">
                <select className="fin-sm" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
                  <option value="all">All clients</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.client_name}</option>)}
                </select>
                <select className="fin-sm" value={paymentStatusFilter} onChange={e => setPaymentStatusFilter(e.target.value)}>
                  <option value="all">All statuses</option>
                  <option value="pending">Pending</option>
                  <option value="verified">Verified</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              {filteredPayments.length === 0 && <p className="text-center py-8 text-slate-400 text-sm">No payment records found.</p>}
              {filteredPayments.map(p => (
                <div key={p.id} className="rounded-xl border border-amber-200/40 bg-white p-4 flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex-1">
                    <div className="font-semibold text-slate-800 text-sm">{p.client_name} - {p.project_title}</div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {p.payment_phase === 'initial' ? 'Stage 1' : 'Stage 2'} - {fmt(p.paid_amount)} - {new Date(p.submitted_at).toLocaleString()}
                    </div>
                    {p.transfer_reference && <div className="text-xs text-slate-400 mt-0.5">Ref: {p.transfer_reference}</div>}
                    {p.admin_note && <div className="text-xs text-indigo-500 mt-0.5">Note: {p.admin_note}</div>}
                    <span className={`inline-block mt-2 text-[10px] px-2.5 py-0.5 rounded-full border font-medium uppercase ${p.status === 'verified' ? STATUS_COLORS.verified : p.status === 'rejected' ? STATUS_COLORS.rejected : STATUS_COLORS.pending}`}>
                      {p.status}
                    </span>
                  </div>
                  {p.status === 'pending' && (
                    <div className="flex flex-wrap gap-2">
                      {p.receipt_url && (
                        <button onClick={() => setReceiptPreview(p.receipt_url)} className="px-3 py-1.5 text-xs rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200">Receipt</button>
                      )}
                      <button onClick={() => verifyPayment(p, { unlockFinal: p.payment_phase === 'initial', advance: p.payment_phase === 'initial' })}
                        className="px-3 py-1.5 text-xs rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium">Verify</button>
                      {p.payment_phase === 'initial' && (
                        <button onClick={() => verifyPayment(p, { unlockFinal: true, advance: true })}
                          className="px-3 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium">Verify + Unlock S2</button>
                      )}
                      <button onClick={() => rejectPayment(p)} className="px-3 py-1.5 text-xs rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100">Reject</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Receipt preview modal */}
        {receiptPreview && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-6" onClick={() => setReceiptPreview('')}>
            <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <p className="font-semibold text-slate-800">Payment Receipt</p>
                <button onClick={() => setReceiptPreview('')} className="text-slate-400 hover:text-slate-600 text-sm">Close</button>
              </div>
              <div className="bg-slate-50 p-4">
                <img src={receiptPreview} alt="Payment receipt" className="w-full max-h-[75vh] object-contain rounded-xl" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function FF({ label, hint, children, className = '' }) {
  return (
    <div className={className}>
      <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
        {label}{hint && <span className="ml-2 text-slate-400 text-[9px] normal-case font-normal">{hint}</span>}
      </label>
      {children}
    </div>
  )
}

function StagePill({ label, payment, unlocked }) {
  const s = payment?.status === 'verified' ? 'verified' : payment?.status === 'pending' ? 'pending' : unlocked ? 'unlocked' : 'none'
  const colors = { verified: STATUS_COLORS.verified, pending: STATUS_COLORS.pending, unlocked: 'bg-blue-50 text-blue-600 border-blue-200', none: STATUS_COLORS.none }
  const labels = { verified: 'Verified', pending: 'Pending', unlocked: 'Unlocked', none: 'Not submitted' }
  return (
    <div className={`text-xs px-2.5 py-1 rounded-full border font-medium ${colors[s]}`}>
      {label}: {labels[s]}
    </div>
  )
}
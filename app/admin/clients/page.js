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
    if (selectedClient === 'all') return payments
    return payments.filter(p => String(p.client_id) === String(selectedClient))
  }, [payments, selectedClient])

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

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />

      <main className="ml-64 flex-1 p-8 bg-slate-50">
        <div className="mb-6">
          <h1 className="font-display text-3xl text-navy mb-1">Client Portals</h1>
          <p className="text-slate-500 text-sm">Full CRM-style control for client dashboard, milestones, and staged payment verification.</p>
        </div>

        <div className="admin-card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy text-lg">{editingId ? 'Edit Client Portal' : 'Create Client Portal'}</h2>
            {editingId && <button onClick={resetForm} className="text-xs text-slate-400 hover:text-red-500">Cancel Edit</button>}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
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

          <button onClick={saveClient} disabled={saving} className="btn btn-green">
            {saving ? 'Saving...' : editingId ? 'Update Client' : 'Create Client'}
          </button>
        </div>

        <div className="admin-card mb-8">
          <h2 className="font-bold text-navy mb-4">Client Portals ({clients.length})</h2>
          <div className="flex flex-col gap-3">
            {clients.map(c => (
              <div key={c.id} className="table-row">
                <div>
                  <div className="font-semibold text-navy">{c.client_name} · /clients/{c.slug}</div>
                  <div className="text-xs text-slate-500 mt-1">{c.project_title}</div>
                  <div className="text-xs text-slate-400 mt-1">Progress {c.progress_percent}% · Pending payments {c.pending_payments || 0}</div>
                </div>
                <div className="flex gap-2">
                  <a href={`/clients/${c.slug}`} target="_blank" rel="noopener" className="btn btn-primary py-2 px-4 text-xs">Open Portal</a>
                  <button onClick={() => startEdit(c)} className="btn btn-primary py-2 px-4 text-xs">Edit</button>
                  <button onClick={() => removeClient(c.id)} className="btn py-2 px-4 text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy">Payment Verification Queue</h2>
            <select
              className="input-field max-w-xs"
              value={selectedClient}
              onChange={e => setSelectedClient(e.target.value)}
            >
              <option value="all">All clients</option>
              {clients.map(c => <option key={c.id} value={c.id}>{c.client_name} ({c.slug})</option>)}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            {filteredPayments.length === 0 ? (
              <div className="text-sm text-slate-400 text-center py-8">No payment submissions yet.</div>
            ) : filteredPayments.map(p => (
              <div key={p.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="font-semibold text-navy">{p.client_name} · {p.project_title}</div>
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
                  <a href={p.receipt_url} target="_blank" rel="noopener" className="btn btn-primary py-2 px-4 text-xs">View Receipt</a>
                  <button onClick={() => updatePayment(p, 'verified')} className="btn btn-green py-2 px-4 text-xs">Verify</button>
                  <button onClick={() => updatePayment(p, 'verified', { unlock_final_payment: true, advance_milestone: true })} className="btn py-2 px-4 text-xs bg-blue-600 text-white hover:bg-blue-700">Verify + Unlock Final + Advance Milestone</button>
                  <button onClick={() => updatePayment(p, 'rejected')} className="btn py-2 px-4 text-xs bg-red-50 text-red-600 hover:bg-red-600 hover:text-white">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}

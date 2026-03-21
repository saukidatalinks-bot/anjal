'use client'

import { useEffect, useMemo, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'

function formatMoney(value, currency = 'NGN') {
  const amount = parseFloat(value || 0)
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 2,
  }).format(amount)
}

export default function ClientPortalDashboard({ slug }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [receiptUrl, setReceiptUrl] = useState('')
  const [transferReference, setTransferReference] = useState('')
  const [phase, setPhase] = useState('initial')

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/client/${slug}`)
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Failed to load client dashboard')
      setData(payload)
      if (payload?.paymentState?.canSubmitFinal && !payload?.paymentState?.canSubmitInitial) {
        setPhase('final')
      } else {
        setPhase('initial')
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [slug])

  const milestones = useMemo(() => data?.client?.milestones_json || [], [data])
  const progress = data?.client?.progress_percent || 0

  const uploadReceipt = async (file) => {
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/client/upload-receipt', { method: 'POST', body: formData })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Upload failed')
      setReceiptUrl(payload.url)
      toast.success('Receipt uploaded successfully')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUploading(false)
    }
  }

  const submitPayment = async () => {
    if (!receiptUrl) {
      toast.error('Please upload your transfer receipt image')
      return
    }

    setSubmitting(true)
    try {
      const amount = data?.paymentPolicy?.halfAmount || 0
      const res = await fetch(`/api/client/${slug}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_phase: phase,
          paid_amount: amount,
          transfer_reference: transferReference,
          receipt_url: receiptUrl,
        }),
      })

      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Payment submission failed')

      toast.success('Payment receipt submitted. Awaiting admin verification.')
      setReceiptUrl('')
      setTransferReference('')
      await load()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading dashboard...</div>
  }

  if (!data?.client) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Client portal not found.</div>
  }

  const transfer = data.paymentPolicy.transfer
  const halfAmount = data.paymentPolicy.halfAmount
  const canSubmitInitial = data.paymentState.canSubmitInitial
  const canSubmitFinal = data.paymentState.canSubmitFinal
  const canSubmitCurrentPhase = phase === 'initial' ? canSubmitInitial : canSubmitFinal

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Toaster position="top-right" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(56,189,248,0.15),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(16,185,129,0.18),transparent_35%),radial-gradient(circle_at_50%_100%,rgba(59,130,246,0.12),transparent_45%)] pointer-events-none" />

      <main className="relative z-10 container mx-auto px-6 py-10">
        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 mb-8">
          <p className="text-cyan-300 text-xs uppercase tracking-[0.2em] mb-3">Anjal Ventures Client Portal</p>
          <h1 className="text-3xl md:text-4xl font-semibold mb-3">{data.client.project_title}</h1>
          <p className="text-slate-300 max-w-3xl">{data.client.project_description}</p>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4">
              <p className="text-xs text-slate-400">Client</p>
              <p className="font-semibold mt-1">{data.client.client_name}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4">
              <p className="text-xs text-slate-400">Status</p>
              <p className="font-semibold mt-1 capitalize">{(data.client.project_status || 'in_progress').replace('_', ' ')}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4">
              <p className="text-xs text-slate-400">Total Project Value</p>
              <p className="font-semibold mt-1">{formatMoney(data.paymentPolicy.totalAmount, data.paymentPolicy.currency)}</p>
            </div>
            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4">
              <p className="text-xs text-slate-400">Current Milestone</p>
              <p className="font-semibold mt-1">#{data.client.current_milestone}</p>
            </div>
          </div>

          <div className="mt-7">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-slate-300">Overall Progress</span>
              <span className="font-semibold">{progress}%</span>
            </div>
            <div className="h-3 rounded-full bg-white/10 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-emerald-400" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h2 className="text-xl font-semibold mb-5">Milestone Timeline</h2>
            <div className="space-y-4">
              {milestones.map((m, idx) => {
                const step = idx + 1
                const active = step === data.client.current_milestone
                const done = step < data.client.current_milestone

                return (
                  <div key={`${m.title}-${idx}`} className="rounded-2xl border border-white/10 bg-slate-900/60 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400 mb-1">Milestone {step}</p>
                        <h3 className="font-semibold text-lg">{m.title}</h3>
                        <p className="text-sm text-slate-300 mt-1">{m.description}</p>
                        <p className="text-xs text-slate-400 mt-2">Target: {m.due || 'N/A'}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full border ${done ? 'border-emerald-400/30 text-emerald-300 bg-emerald-500/10' : active ? 'border-cyan-400/30 text-cyan-300 bg-cyan-500/10' : 'border-slate-500/30 text-slate-300 bg-slate-500/10'}`}>
                        {done ? 'Completed' : active ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6">
            <h2 className="text-xl font-semibold mb-2">Project Payments</h2>
            <p className="text-slate-300 text-sm mb-5">Payment terms: 50% upfront, 50% after admin milestone upgrade and approval.</p>

            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4 mb-4">
              <p className="text-xs text-slate-400 mb-1">Transfer Account</p>
              <p className="font-semibold">{transfer.bank} - {transfer.accountNumber}</p>
              <p className="text-sm text-slate-300">{transfer.accountName} [Project Lead]</p>
              <p className="text-xs text-slate-400 mt-2">{transfer.note}</p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4 mb-4">
              <label className="text-xs text-slate-400 block mb-2">Payment Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm"
              >
                <option value="initial">Initial 50% (Milestone Start)</option>
                <option value="final" disabled={!data.paymentState.initialVerified}>Final 50% (After Admin Unlock)</option>
              </select>
              <p className="text-xs text-cyan-300 mt-2">Required amount: {formatMoney(halfAmount, data.paymentPolicy.currency)}</p>
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4 mb-4">
              <label className="text-xs text-slate-400 block mb-2">Transfer Reference (Optional)</label>
              <input
                className="w-full bg-slate-950 border border-white/15 rounded-xl px-3 py-2 text-sm"
                value={transferReference}
                onChange={(e) => setTransferReference(e.target.value)}
                placeholder="Transaction ID / Narration"
              />
            </div>

            <div className="rounded-2xl bg-slate-900/70 border border-white/10 p-4 mb-4">
              <label className="text-xs text-slate-400 block mb-2">Receipt Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadReceipt(e.target.files?.[0])}
                className="w-full text-xs"
              />
              {uploading && <p className="text-xs text-amber-300 mt-2">Uploading receipt...</p>}
              {receiptUrl && <p className="text-xs text-emerald-300 mt-2">Receipt ready for submission</p>}
            </div>

            <button
              onClick={submitPayment}
              disabled={submitting || uploading || !canSubmitCurrentPhase}
              className="w-full py-3 rounded-xl font-semibold bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 disabled:opacity-40"
            >
              {submitting ? 'Submitting...' : `Submit ${phase === 'initial' ? 'Initial' : 'Final'} Payment Receipt`}
            </button>

            {!canSubmitCurrentPhase && (
              <p className="text-xs text-amber-300 mt-3">
                {phase === 'initial'
                  ? 'Initial payment is already submitted or verified.'
                  : 'Final payment is locked until admin verifies milestone upgrade.'}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 mt-6">
          <h2 className="text-lg font-semibold mb-4">Payment Verification History</h2>
          <div className="space-y-3">
            {data.payments.length === 0 ? (
              <p className="text-slate-400 text-sm">No payment receipts submitted yet.</p>
            ) : (
              data.payments.map((p) => (
                <div key={p.id} className="rounded-xl border border-white/10 bg-slate-900/70 p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-medium capitalize">{p.payment_phase} Payment - {formatMoney(p.paid_amount, data.paymentPolicy.currency)}</p>
                    <p className="text-xs text-slate-400">Submitted: {new Date(p.submitted_at).toLocaleString()}</p>
                    {p.admin_note && <p className="text-xs text-slate-300 mt-1">Admin note: {p.admin_note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <a href={p.receipt_url} target="_blank" rel="noopener" className="text-xs px-3 py-1 rounded-full border border-white/20 hover:bg-white/10">View Receipt</a>
                    <span className={`text-xs px-3 py-1 rounded-full border ${p.status === 'verified' ? 'border-emerald-400/30 text-emerald-300 bg-emerald-500/10' : p.status === 'rejected' ? 'border-red-400/30 text-red-300 bg-red-500/10' : 'border-amber-400/30 text-amber-300 bg-amber-500/10'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  )
}

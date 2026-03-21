'use client'

import { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
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
  const [previewReceipt, setPreviewReceipt] = useState('')

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
    return <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center">Preparing your project workspace...</div>
  }

  if (!data?.client) {
    return <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex items-center justify-center">Client portal not found.</div>
  }

  const transfer = data.paymentPolicy.transfer
  const halfAmount = data.paymentPolicy.halfAmount
  const canSubmitInitial = data.paymentState.canSubmitInitial
  const canSubmitFinal = data.paymentState.canSubmitFinal
  const canSubmitCurrentPhase = phase === 'initial' ? canSubmitInitial : canSubmitFinal

  return (
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] relative overflow-hidden">
      <Toaster position="top-right" />

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_10%,rgba(0,113,227,0.10),transparent_28%),radial-gradient(circle_at_85%_20%,rgba(18,18,18,0.07),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(0,113,227,0.09),transparent_45%)] pointer-events-none" />
      <div className="absolute -top-28 -left-24 h-96 w-96 bg-white/70 blur-3xl rounded-full pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 h-[28rem] w-[28rem] bg-[#0071e3]/10 blur-3xl rounded-full pointer-events-none" />

      <main className="relative z-10 container mx-auto px-6 py-10 lg:py-12">
        <section className="rounded-[2rem] border border-black/5 bg-white/85 shadow-[0_30px_80px_rgba(15,23,42,0.10)] backdrop-blur-2xl p-8 md:p-10 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white px-4 py-1.5 mb-5">
                <Image src="/logo.webp" alt="Anjal Ventures" width={26} height={26} className="h-6 w-auto" />
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#1d1d1f]/70">Anjal Ventures Private Client Workspace</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-semibold tracking-tight text-[#1d1d1f] mb-3">{data.client.project_title}</h1>
              <p className="text-slate-600 max-w-3xl text-sm md:text-base">{data.client.project_description}</p>
            </div>

            <div className="rounded-2xl bg-[#1d1d1f] text-white p-5 min-w-[260px]">
              <p className="text-[11px] uppercase tracking-[0.16em] text-white/70">Program Performance</p>
              <p className="text-3xl font-semibold mt-2">{progress}%</p>
              <p className="text-xs text-white/70 mt-1">Delivery confidence aligned with current milestone approvals.</p>
              <div className="mt-4 h-2.5 rounded-full bg-white/15 overflow-hidden">
                <div className="h-full bg-white" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-4 gap-4 mt-8">
            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Client</p>
              <p className="font-semibold mt-1 text-[#1d1d1f]">{data.client.client_name}</p>
            </div>
            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Status</p>
              <p className="font-semibold mt-1 capitalize text-[#1d1d1f]">{(data.client.project_status || 'in_progress').replace('_', ' ')}</p>
            </div>
            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Contract Value</p>
              <p className="font-semibold mt-1 text-[#1d1d1f]">{formatMoney(data.paymentPolicy.totalAmount, data.paymentPolicy.currency)}</p>
            </div>
            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4">
              <p className="text-[11px] uppercase tracking-wider text-slate-500">Current Milestone</p>
              <p className="font-semibold mt-1 text-[#1d1d1f]">#{data.client.current_milestone}</p>
            </div>
          </div>
        </section>

        <section className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 rounded-[1.75rem] border border-black/5 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-5 text-[#1d1d1f]">Delivery Milestone Timeline</h2>
            <div className="space-y-4">
              {milestones.map((m, idx) => {
                const step = idx + 1
                const active = step === data.client.current_milestone
                const done = step < data.client.current_milestone

                return (
                  <div key={`${m.title}-${idx}`} className="rounded-2xl border border-black/5 bg-[#fafafc] p-4 md:p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Milestone {step}</p>
                        <h3 className="font-semibold text-lg text-[#1d1d1f]">{m.title}</h3>
                        <p className="text-sm text-slate-600 mt-1">{m.description}</p>
                        <p className="text-xs text-slate-500 mt-2">Target: {m.due || 'N/A'}</p>
                      </div>
                      <span className={`px-3 py-1 text-xs rounded-full border ${done ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : active ? 'border-blue-200 text-blue-700 bg-blue-50' : 'border-slate-200 text-slate-600 bg-slate-100'}`}>
                        {done ? 'Completed' : active ? 'In Progress' : 'Pending'}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-black/5 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-6 md:p-7">
            <h2 className="text-xl font-semibold mb-2 text-[#1d1d1f]">Finance and Verification</h2>
            <p className="text-slate-600 text-sm mb-5">Payment terms: 50% upfront and 50% after verified milestone progression from the delivery office.</p>

            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4 mb-4">
              <p className="text-[11px] uppercase tracking-wide text-slate-500 mb-1">Transfer Account</p>
              <p className="font-semibold text-[#1d1d1f]">{transfer.bank} - {transfer.accountNumber}</p>
              <p className="text-sm text-slate-600">{transfer.accountName} [Project Lead]</p>
              <p className="text-xs text-slate-500 mt-2">{transfer.note}</p>
            </div>

            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4 mb-4">
              <label className="text-[11px] uppercase tracking-wide text-slate-500 block mb-2">Payment Phase</label>
              <select
                value={phase}
                onChange={(e) => setPhase(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"
              >
                <option value="initial">Initial 50% (Milestone Start)</option>
                <option value="final" disabled={!data.paymentState.initialVerified}>Final 50% (After Admin Unlock)</option>
              </select>
              <p className="text-xs text-[#0071e3] mt-2">Required amount: {formatMoney(halfAmount, data.paymentPolicy.currency)}</p>
            </div>

            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4 mb-4">
              <label className="text-[11px] uppercase tracking-wide text-slate-500 block mb-2">Transfer Reference (Optional)</label>
              <input
                className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm"
                value={transferReference}
                onChange={(e) => setTransferReference(e.target.value)}
                placeholder="Transaction ID / Narration"
              />
            </div>

            <div className="rounded-2xl bg-[#f8f8fb] border border-black/5 p-4 mb-4">
              <label className="text-[11px] uppercase tracking-wide text-slate-500 block mb-2">Receipt Upload</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => uploadReceipt(e.target.files?.[0])}
                className="w-full text-xs"
              />
              {uploading && <p className="text-xs text-amber-600 mt-2">Uploading receipt...</p>}
              {receiptUrl && (
                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-emerald-700">Receipt ready for submission</p>
                  <button type="button" onClick={() => setPreviewReceipt(receiptUrl)} className="text-xs text-[#0071e3] hover:underline">Preview</button>
                </div>
              )}
            </div>

            <button
              onClick={submitPayment}
              disabled={submitting || uploading || !canSubmitCurrentPhase}
              className="w-full py-3 rounded-xl font-semibold bg-[#0071e3] hover:bg-[#0077ed] text-white disabled:opacity-40 transition-colors"
            >
              {submitting ? 'Submitting...' : `Submit ${phase === 'initial' ? 'Initial' : 'Final'} Payment Receipt`}
            </button>

            {!canSubmitCurrentPhase && (
              <p className="text-xs text-amber-700 mt-3">
                {phase === 'initial'
                  ? 'Initial payment is already submitted or verified.'
                  : 'Final payment is locked until admin verifies milestone upgrade.'}
              </p>
            )}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-black/5 bg-white/85 shadow-[0_24px_60px_rgba(15,23,42,0.08)] p-6 md:p-7 mt-6">
          <h2 className="text-lg font-semibold mb-4 text-[#1d1d1f]">Payment Verification History</h2>
          <div className="space-y-3">
            {data.payments.length === 0 ? (
              <p className="text-slate-500 text-sm">No payment receipts submitted yet.</p>
            ) : (
              data.payments.map((p) => (
                <div key={p.id} className="rounded-xl border border-black/5 bg-[#fafafc] p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-medium capitalize text-[#1d1d1f]">{p.payment_phase} Payment - {formatMoney(p.paid_amount, data.paymentPolicy.currency)}</p>
                    <p className="text-xs text-slate-500">Submitted: {new Date(p.submitted_at).toLocaleString()}</p>
                    {p.admin_note && <p className="text-xs text-slate-600 mt-1">Admin note: {p.admin_note}</p>}
                  </div>
                  <div className="flex items-center gap-2">
                    <button type="button" onClick={() => setPreviewReceipt(p.receipt_url)} className="text-xs px-3 py-1 rounded-full border border-slate-300 text-slate-700 hover:bg-white">View Receipt</button>
                    <span className={`text-xs px-3 py-1 rounded-full border ${p.status === 'verified' ? 'border-emerald-200 text-emerald-700 bg-emerald-50' : p.status === 'rejected' ? 'border-red-200 text-red-700 bg-red-50' : 'border-amber-200 text-amber-700 bg-amber-50'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {previewReceipt && (
          <div className="fixed inset-0 z-50 bg-[#1d1d1f]/75 backdrop-blur-md flex items-center justify-center p-6" onClick={() => setPreviewReceipt('')}>
            <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200">
                <p className="text-sm font-semibold text-[#1d1d1f]">Receipt Preview</p>
                <button type="button" onClick={() => setPreviewReceipt('')} className="text-slate-500 hover:text-[#1d1d1f] text-sm">Close</button>
              </div>
              <div className="p-4 bg-slate-50">
                <img src={previewReceipt} alt="Payment receipt" className="w-full max-h-[75vh] object-contain rounded-lg" />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

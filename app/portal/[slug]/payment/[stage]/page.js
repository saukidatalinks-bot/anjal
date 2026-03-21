'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

export default function PortalPaymentPage() {
  const { slug, stage } = useParams()
  const router = useRouter()
  const stageNum = parseInt(stage || '1', 10)
  const phase = stageNum === 2 ? 'final' : 'initial'

  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [receiptFile, setReceiptFile] = useState(null)
  const [receiptUrl, setReceiptUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [reference, setReference] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/portal/${slug}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)

        if (!d?.client) return
        const { stages, client } = d
        // Guard: stage 2 not yet unlocked
        if (stageNum === 2) {
          if (stages.stage2.status === 'locked') {
            toast.error('Second payment is locked. Please wait for admin to unlock it.')
            router.replace(`/portal/${slug}/progress`)
          } else if (stages.stage2.status === 'pending' || stages.stage2.status === 'verified') {
            router.replace(`/portal/${slug}/progress`)
          }
        }
        // Guard: stage 1 already submitted or verified
        if (stageNum === 1) {
          if (stages.stage1.status === 'pending' || stages.stage1.status === 'verified') {
            router.replace(`/portal/${slug}/progress`)
          }
        }
      })
      .catch(() => setLoading(false))
  }, [slug, stageNum])

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setReceiptFile(file)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/client/upload-receipt', { method: 'POST', body: formData })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Upload failed')
      setReceiptUrl(payload.url)
      toast.success('Receipt uploaded')
    } catch (err) {
      toast.error(err.message)
      setReceiptFile(null)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const amount = data?.payment?.halfAmount || 0
      const res = await fetch(`/api/portal/${slug}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_phase: phase,
          paid_amount: amount,
          transfer_reference: reference,
          receipt_url: receiptUrl || null,
        }),
      })
      const payload = await res.json()
      if (!res.ok) throw new Error(payload.error || 'Submission failed')
      setSubmitted(true)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 flex items-center justify-center">
        <div className="text-white/60 animate-pulse text-sm">Loading payment details…</div>
      </div>
    )
  }

  if (!data?.client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 flex items-center justify-center text-white">
        <p>Portal not found.</p>
      </div>
    )
  }

  const { client, payment } = data

  const formatMoney = (v, cur = 'NGN') =>
    new Intl.NumberFormat('en-NG', { style: 'currency', currency: cur, maximumFractionDigits: 0 }).format(Number(v || 0))

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950/30 to-slate-950 flex items-center justify-center px-6">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-4xl">
            ✅
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Submitted!</h1>
            <p className="text-white/60 text-sm leading-relaxed">
              Thank you. Your Stage {stageNum} payment submission has been received.<br />
              An admin will verify your payment shortly.
            </p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 px-5 py-4 text-sm text-white/60">
            You'll be able to track your project progress from the dashboard.
          </div>
          <button
            onClick={() => router.push(`/portal/${slug}/progress`)}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold transition-all duration-300 hover:-translate-y-0.5"
          >
            View Progress Dashboard →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 text-white">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
              <Image src="/logo.webp" alt="Anjal Ventures" fill className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-white/40">Anjal Ventures</p>
              <p className="text-sm font-medium text-white">Stage {stageNum} Payment</p>
            </div>
          </div>
          <button onClick={() => router.back()} className="text-xs text-white/40 hover:text-white/70 transition-colors">
            ← Back
          </button>
        </div>
      </header>

      {/* Progress steps */}
      <div className="max-w-2xl mx-auto px-6 pt-6 pb-2">
        <div className="flex items-center gap-2">
          {['Review & Sign', `Stage ${stageNum} Payment`, 'Tracking'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
                i === 1
                  ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                  : 'border-white/10 bg-white/5 text-white/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${i === 1 ? 'bg-blue-400' : 'bg-white/20'}`} />
                {step}
              </div>
              {i < 2 && <span className="text-white/20">›</span>}
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-6">
        {/* Stage label */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20 px-6 py-5">
          <p className="text-xs uppercase tracking-widest text-blue-300/70 mb-1">
            Stage {stageNum} of 2 — {stageNum === 1 ? 'Initial Payment (50%)' : 'Final Payment (50%)'}
          </p>
          <h1 className="text-xl font-bold text-white">{client.project_title}</h1>
          <p className="text-white/50 text-sm mt-1">Transfer the amount below to the account details provided, then click the button to confirm.</p>
        </div>

        {/* Amount due */}
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Amount Due (NGN)</p>
            <p className="text-2xl font-bold text-white">{formatMoney(payment.halfAmount, 'NGN')}</p>
          </div>
          <div className="rounded-xl bg-white/5 border border-white/10 p-4 text-center">
            <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Amount Due (USD)</p>
            <p className="text-2xl font-bold text-white">${payment.halfUSD?.toFixed(2) || '0.00'}</p>
          </div>
        </div>

        {/* Bank account details */}
        <div className="rounded-2xl bg-gradient-to-br from-indigo-600/10 to-blue-600/5 border border-indigo-500/20 overflow-hidden">
          <div className="px-6 py-4 border-b border-white/5 bg-white/[0.02]">
            <p className="text-xs uppercase tracking-widest text-indigo-300/70">Transfer To</p>
            <p className="text-white font-semibold mt-1">Company Payment Account</p>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-sm">Bank</span>
              <span className="text-white font-semibold text-sm">{payment.bank}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-sm">Account Number</span>
              <div className="flex items-center gap-2">
                <span className="text-white font-mono font-bold text-lg tracking-widest">{payment.accountNumber}</span>
                <button
                  onClick={() => { navigator.clipboard.writeText(payment.accountNumber); toast.success('Copied!') }}
                  className="text-xs text-blue-400 hover:text-blue-300 border border-blue-400/30 hover:border-blue-300/50 px-2 py-0.5 rounded-md transition-colors"
                >
                  Copy
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/40 text-sm">Account Name</span>
              <span className="text-white font-semibold text-sm">{payment.accountName}</span>
            </div>
            {payment.note && (
              <div className="mt-3 pt-3 border-t border-white/5">
                <p className="text-xs text-white/40">{payment.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Receipt upload (optional) */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-white">Upload Payment Receipt</p>
            <span className="text-xs text-white/40 bg-white/5 border border-white/10 px-2.5 py-1 rounded-full">Optional</span>
          </div>
          <p className="text-xs text-white/40">Upload a screenshot or photo of your transfer confirmation to help speed up verification.</p>

          <label className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl py-8 cursor-pointer transition-all ${
            receiptFile
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : 'border-white/10 hover:border-white/20 bg-white/[0.01]'
          }`}>
            <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="sr-only" />
            {uploading ? (
              <div className="text-center">
                <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-white/50">Uploading…</p>
              </div>
            ) : receiptFile ? (
              <div className="text-center">
                <div className="text-2xl mb-2">✅</div>
                <p className="text-emerald-400 text-sm font-medium">{receiptFile.name}</p>
                <p className="text-white/30 text-xs mt-1">Click to replace</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-3 text-xl">📎</div>
                <p className="text-white/60 text-sm font-medium">Tap to upload receipt</p>
                <p className="text-white/30 text-xs mt-1">PNG, JPG, PDF accepted</p>
              </div>
            )}
          </label>
        </div>

        {/* Reference */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4 space-y-2">
          <label className="text-sm font-medium text-white">Transfer Reference / Narration <span className="text-white/30 text-xs font-normal">(Optional)</span></label>
          <input
            type="text"
            value={reference}
            onChange={e => setReference(e.target.value)}
            placeholder="e.g. Transaction ID or bank narration"
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/20 focus:outline-none focus:border-blue-500/50 focus:bg-white/10 transition-all"
          />
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || uploading}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0"
        >
          {submitting ? 'Submitting…' : 'I Have Transferred the Money ✓'}
        </button>
        <p className="text-center text-xs text-white/30">
          By clicking above you confirm you have transferred {formatMoney(payment.halfAmount, 'NGN')} to the account above.
        </p>

        <div className="text-center text-xs text-white/20 pb-8">
          Anjal Ventures · anjalventures@gmail.com
        </div>
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

function formatMoney(value, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export default function PortalPaymentPage() {
  const { slug, stage } = useParams()
  const router = useRouter()
  const stageNumber = Number(stage || '1')
  const phase = stageNumber === 2 ? 'final' : 'initial'

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
      .then((response) => response.json())
      .then((payload) => {
        setData(payload)
        setLoading(false)

        if (!payload?.client) return

        const stage1 = payload?.stages?.stage1?.status
        const stage2 = payload?.stages?.stage2?.status

        if (stageNumber === 1 && ['pending', 'verified'].includes(stage1)) {
          router.replace(`/portal/${slug}/progress`)
          return
        }

        if (stageNumber === 2) {
          if (stage2 === 'locked') {
            toast.error('Second payment is not available yet.')
            router.replace(`/portal/${slug}/progress`)
            return
          }
          if (['pending', 'verified'].includes(stage2)) {
            router.replace(`/portal/${slug}/progress`)
          }
        }
      })
      .catch(() => setLoading(false))
  }, [router, slug, stageNumber])

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setReceiptFile(file)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/client/upload-receipt', {
        method: 'POST',
        body: formData,
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Upload failed')

      setReceiptUrl(payload.url)
      toast.success('Receipt uploaded successfully')
    } catch (error) {
      toast.error(error.message)
      setReceiptFile(null)
      setReceiptUrl('')
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    try {
      const amount = data?.payment?.halfAmount || 0
      const response = await fetch(`/api/portal/${slug}/pay`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          payment_phase: phase,
          paid_amount: amount,
          transfer_reference: reference,
          receipt_url: receiptUrl || null,
        }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload.error || 'Payment submission failed')
      setSubmitted(true)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <p className="text-sm text-slate-500">Loading payment details...</p>
      </div>
    )
  }

  if (!data?.client) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Portal not found</h1>
          <p className="mt-2 text-sm text-slate-500">This payment page is not available.</p>
        </div>
      </div>
    )
  }

  const { client, payment } = data
  const amountLabel = stageNumber === 2 ? 'Final payment' : 'Initial payment'

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 px-5 py-10 sm:px-6">
        <Toaster position="top-right" />
        <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
            <span className="text-lg font-semibold">OK</span>
          </div>
          <h1 className="mt-5 text-2xl font-semibold text-slate-900">Payment submitted</h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Your payment confirmation has been submitted successfully. Processing begins only after your submission, and the team will verify it shortly.
          </p>
          <button
            onClick={() => router.push(`/portal/${slug}/progress`)}
            className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Open Progress Page
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-right" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white">
              <Image src="/logo.webp" alt="Anjal Ventures" fill className="object-contain p-1" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Anjal Ventures</p>
              <p className="text-sm font-medium text-slate-700">Payment Details</p>
            </div>
          </div>
          <button onClick={() => router.push(`/portal/${slug}/review`)} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Back
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1fr_0.95fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Transfer Information</p>
            <h1 className="mt-3 text-2xl font-semibold text-slate-900">{amountLabel}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              Please review the account details below. The portal will move to processing only after you click the confirmation button at the bottom of this page.
            </p>

            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4 border-b border-slate-200 pb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Application</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{client.project_title}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Amount</p>
                    <p className="mt-2 text-base font-semibold text-slate-900">{formatMoney(payment.halfAmount, 'NGN')}</p>
                    <p className="text-sm text-slate-500">{formatMoney(payment.halfUSD, 'USD')}</p>
                  </div>
                </div>
                <Row label="Bank" value={payment.bank} />
                <Row label="Account Number" value={payment.accountNumber} copyValue={payment.accountNumber} />
                <Row label="Account Name" value={payment.accountName} />
                {payment.note && <Row label="Note" value={payment.note} multiline />}
              </div>
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Confirmation</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">Submit when payment is done</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              You can optionally upload a receipt and add a transfer reference before confirming.
            </p>

            <div className="mt-6 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Transfer reference</label>
                <input
                  type="text"
                  value={reference}
                  onChange={(event) => setReference(event.target.value)}
                  placeholder="Transaction ID or narration"
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-slate-400"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">Receipt upload (optional)</label>
                <label className="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-6 text-center transition hover:border-slate-400 hover:bg-slate-100">
                  <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="sr-only" />
                  <p className="text-sm font-medium text-slate-700">
                    {uploading ? 'Uploading receipt...' : receiptFile ? receiptFile.name : 'Choose a receipt file'}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">PNG, JPG or PDF</p>
                </label>
              </div>
            </div>

            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-sm font-medium text-slate-900">Important</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Opening this page does not start processing. Processing starts only when you click the confirmation button below.
              </p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || uploading}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Submitting...' : 'I Have Transferred the Money'}
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}

function Row({ label, value, copyValue, multiline = false }) {
  const handleCopy = async () => {
    if (!copyValue) return
    await navigator.clipboard.writeText(copyValue)
    toast.success('Copied to clipboard')
  }

  return (
    <div className={`flex gap-4 ${multiline ? 'flex-col' : 'items-center justify-between'}`}>
      <p className="min-w-28 text-xs font-medium uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <div className={`flex ${multiline ? 'w-full' : 'items-center gap-3'} ${multiline ? 'justify-start' : 'justify-end'} flex-1`}>
        <p className={`text-sm text-slate-900 ${multiline ? 'leading-6' : 'font-medium'}`}>{value}</p>
        {copyValue && (
          <button onClick={handleCopy} className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50">
            Copy
          </button>
        )}
      </div>
    </div>
  )
}

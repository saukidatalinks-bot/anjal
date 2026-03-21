'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

function formatMoney(value, currency = 'NGN') {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
}

export default function PortalReviewPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [proceeding, setProceeding] = useState(false)

  useEffect(() => {
    if (!slug) return

    fetch(`/api/portal/${slug}`)
      .then((response) => response.json())
      .then((payload) => {
        setData(payload)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [slug])

  const handleProceed = () => {
    setProceeding(true)
    router.push(`/portal/${slug}/payment/1`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <p className="text-sm text-slate-500">Loading portal...</p>
      </div>
    )
  }

  if (!data?.client) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Portal not found</h1>
          <p className="mt-2 text-sm text-slate-500">This client portal is not available.</p>
        </div>
      </div>
    )
  }

  const { client, payment } = data

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Toaster position="top-right" />

      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="relative h-10 w-10 overflow-hidden rounded-full border border-slate-200 bg-white">
              <Image src="/logo.webp" alt="Anjal Ventures" fill className="object-contain p-1" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Anjal Ventures</p>
              <p className="text-sm font-medium text-slate-700">Client Portal</p>
            </div>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">Quotation Review</span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Project Summary</p>
            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">{client.project_title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Please review the project name and payment amount below. When you are ready, click the button to open the payment page.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Client</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{client.client_name}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Company</p>
                <p className="mt-2 text-base font-semibold text-slate-900">{client.company_name || 'Private Client'}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Total Project Amount</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{formatMoney(client.total_amount, 'NGN')}</p>
                <p className="mt-1 text-sm text-slate-500">{formatMoney(client.total_amount_usd, 'USD')}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Initial Payment</p>
                <p className="mt-2 text-xl font-semibold text-slate-900">{formatMoney(payment.halfAmount, 'NGN')}</p>
                <p className="mt-1 text-sm text-slate-500">{formatMoney(payment.halfUSD, 'USD')}</p>
              </div>
            </div>

            <div className="mt-8 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-slate-900">Before proceeding</p>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                The next screen will show the Opay account details for transfer. Nothing will move to processing until the confirmation button is clicked.
              </p>
            </div>
          </section>

          <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Next Step</p>
            <h2 className="mt-3 text-xl font-semibold text-slate-900">Proceed to payment</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Open the payment page to view the transfer account and submit payment when ready.
            </p>

            <div className="mt-6 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Application</span>
                <span className="font-medium text-slate-900 text-right">{client.project_title}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">First payment</span>
                <span className="font-medium text-slate-900">{formatMoney(payment.halfAmount, 'NGN')}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-medium text-slate-900">Awaiting payment</span>
              </div>
            </div>

            <button
              onClick={handleProceed}
              disabled={proceeding}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {proceeding ? 'Opening payment...' : 'Proceed to Payment'}
            </button>

            <button
              onClick={() => toast('Payment processing starts only after you click the confirmation button on the next page.')}
              className="mt-3 inline-flex w-full items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
            >
              Need clarification?
            </button>
          </aside>
        </div>
      </main>
    </div>
  )
}

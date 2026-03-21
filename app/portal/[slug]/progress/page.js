'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Toaster } from 'react-hot-toast'

function statusMeta(status) {
  switch (status) {
    case 'verified':
      return { label: 'Completed', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    case 'pending':
      return { label: 'Pending Review', tone: 'bg-amber-50 text-amber-700 border-amber-200' }
    case 'active':
      return { label: 'Available', tone: 'bg-blue-50 text-blue-700 border-blue-200' }
    case 'complete':
      return { label: 'Delivered', tone: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
    default:
      return { label: 'Locked', tone: 'bg-slate-100 text-slate-600 border-slate-200' }
  }
}

export default function PortalProgressPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!slug) return
    fetch(`/api/portal/${slug}`)
      .then((response) => response.json())
      .then((payload) => {
        setData(payload)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [slug])
  useEffect(() => {
    const timer = setInterval(load, 30000)
    return () => clearInterval(timer)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <p className="text-sm text-slate-500">Loading progress...</p>
      </div>
    )
  }

  if (!data?.client) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">Portal not found</h1>
          <p className="mt-2 text-sm text-slate-500">This progress page is not available.</p>
        </div>
      </div>
    )
  }

  const { client, stages } = data
  const cards = [
    {
      number: '01',
      title: 'Initial Payment',
      description: 'The first payment is submitted and reviewed by the team.',
      status: stages.stage1.status,
      details: stages.stage1.payment?.submitted_at ? `Submitted: ${new Date(stages.stage1.payment.submitted_at).toLocaleString()}` : 'Awaiting submission',
    },
    {
      number: '02',
      title: 'Final Payment',
      description: 'The second payment becomes available after the first payment is verified.',
      status: stages.stage2.status,
      details: stages.stage2.payment?.submitted_at ? `Submitted: ${new Date(stages.stage2.payment.submitted_at).toLocaleString()}` : stages.stage2.status === 'active' ? 'Ready for payment submission' : 'Not yet available',
      cta: stages.stage2.status === 'active' ? 'Proceed to Final Payment' : null,
      onClick: () => router.push(`/portal/${slug}/payment/2`),
    },
    {
      number: '03',
      title: 'Delivery',
      description: 'The team completes delivery after payment confirmation.',
      status: stages.stage3.status,
      details: stages.stage3.completedAt ? `Completed: ${new Date(stages.stage3.completedAt).toLocaleString()}` : stages.stage3.status === 'active' ? 'Delivery is in progress' : 'Waiting for final payment verification',
    },
  ]

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
              <p className="text-sm font-medium text-slate-700">Project Progress</p>
            </div>
          </div>
          <button onClick={() => router.push(`/portal/${slug}/review`)} className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
            Review Quote
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8 sm:px-6 sm:py-10">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Project</p>
          <h1 className="mt-3 text-2xl font-semibold text-slate-900 sm:text-3xl">{client.project_title}</h1>
          <p className="mt-2 text-sm text-slate-600">Client: {client.client_name}</p>
        </section>

        <section className="mt-6 grid gap-4">
          {cards.map((card) => {
            const meta = statusMeta(card.status)
            return (
              <div key={card.number} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Stage {card.number}</p>
                    <h2 className="mt-2 text-lg font-semibold text-slate-900">{card.title}</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{card.description}</p>
                    <p className="mt-3 text-sm text-slate-500">{card.details}</p>
                    {card.status === 'pending' && card.number !== '03' && card.number === '01' && (
                      <p className="mt-2 text-sm text-slate-600">Your payment has been submitted and is awaiting verification.</p>
                    )}
                  </div>
                  <div className="flex flex-col items-start gap-3 sm:items-end">
                    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${meta.tone}`}>{meta.label}</span>
                    {card.cta && (
                      <button
                        onClick={card.onClick}
                        className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
                      >
                        {card.cta}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-900">Status updates</p>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            This page refreshes automatically every 30 seconds so you can monitor payment verification and delivery updates.
          </p>
        </section>
      </main>
    </div>
  )
}

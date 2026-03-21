'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

function StatusIcon({ status }) {
  if (status === 'verified' || status === 'complete') {
    return (
      <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 text-xl animate-pulse-once">
        ✓
      </div>
    )
  }
  if (status === 'pending') {
    return (
      <div className="w-12 h-12 rounded-full bg-amber-500/20 border-2 border-amber-500/50 flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }
  if (status === 'active') {
    return (
      <div className="w-12 h-12 rounded-full bg-blue-500/20 border-2 border-blue-500/50 flex items-center justify-center text-blue-400 text-xl">
        ●
      </div>
    )
  }
  // locked
  return (
    <div className="w-12 h-12 rounded-full bg-white/5 border-2 border-white/10 flex items-center justify-center text-white/20 text-xl">
      🔒
    </div>
  )
}

function statusLabel(status) {
  switch (status) {
    case 'verified': return { text: 'Verified & Completed', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
    case 'complete': return { text: 'Project Delivered', color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/30' }
    case 'pending': return { text: 'Pending Verification', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/30' }
    case 'active': return { text: 'Ready — Action Required', color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/30' }
    default: return { text: 'Locked', color: 'text-white/30', bg: 'bg-white/5 border-white/10' }
  }
}

function connector(fromStatus) {
  const done = fromStatus === 'verified' || fromStatus === 'complete'
  return (
    <div className="flex justify-center py-2 my-1">
      <div className={`w-0.5 h-10 rounded-full transition-all duration-1000 ${done ? 'bg-gradient-to-b from-emerald-500/60 to-emerald-500/20' : 'bg-white/10'}`} />
    </div>
  )
}

export default function PortalProgressPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  const load = () => {
    if (!slug) return
    fetch(`/api/portal/${slug}`)
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { load() }, [slug])
  // Refresh every 30 seconds to catch admin updates
  useEffect(() => {
    const t = setInterval(load, 30000)
    return () => clearInterval(t)
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 flex items-center justify-center">
        <div className="text-white/60 animate-pulse text-sm">Loading your progress…</div>
      </div>
    )
  }

  if (!data?.client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/30 to-slate-950 flex items-center justify-center text-white">
        <div className="text-center">
          <p className="text-4xl mb-3">🔍</p>
          <p className="text-white/60 text-sm">Portal not found.</p>
        </div>
      </div>
    )
  }

  const { client, stages } = data
  const s1 = stages.stage1
  const s2 = stages.stage2
  const s3 = stages.stage3

  const allComplete = s3.status === 'complete'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/20 to-slate-950 text-white">
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
              <p className="text-sm font-medium text-white">Project Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-white/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-10 space-y-8">
        {/* Project overview */}
        <div className={`rounded-2xl border px-6 py-6 ${allComplete ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/10 border-emerald-500/20' : 'bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border-blue-500/20'}`}>
          <p className="text-xs uppercase tracking-widest text-white/40 mb-1">
            {allComplete ? 'Project Completed' : 'Project In Progress'}
          </p>
          <h1 className="text-xl font-bold text-white mb-1">{client.project_title}</h1>
          <p className="text-white/50 text-sm">Client: {client.client_name}</p>
          {allComplete && (
            <div className="mt-4 text-sm text-white/60 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
              🎉 Your project has been completed. An admin will contact you shortly to arrange handover of all deliverables.
            </div>
          )}
        </div>

        {/* Progress tracker */}
        <div className="space-y-0">
          <h2 className="text-xs uppercase tracking-widest text-white/30 mb-5">Project Progress Tracker</h2>

          {/* ── Stage 1 ── */}
          <StageCard
            number={1}
            title="First Payment"
            subtitle="Initial 50% — Project commencement fee"
            status={s1.status}
            payment={s1.payment}
            ctaLabel={null}
          />

          {connector(s1.status)}

          {/* ── Stage 2 ── */}
          <StageCard
            number={2}
            title="Second Payment"
            subtitle="Final 50% — Payable on delivery"
            status={s2.status}
            payment={s2.payment}
            ctaLabel={s2.status === 'active' ? 'Make Second Payment' : null}
            onCta={() => router.push(`/portal/${slug}/payment/2`)}
          />

          {connector(s2.status)}

          {/* ── Stage 3 ── */}
          <StageCard
            number={3}
            title="Project Delivery"
            subtitle="Final handover, source code & assets"
            status={s3.status}
            completedAt={s3.completedAt}
            payment={null}
            ctaLabel={null}
          />
        </div>

        {/* Info panel */}
        <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-3">
          <p className="text-xs font-semibold text-white/50 uppercase tracking-widest">How It Works</p>
          <div className="space-y-2 text-xs text-white/40 leading-relaxed">
            <p>1. After you submit your <strong className="text-white/60">first payment</strong>, an admin will verify the receipt and mark Stage 1 complete.</p>
            <p>2. Once Stage 1 is verified, <strong className="text-white/60">Stage 2</strong> becomes unlocked for your final payment.</p>
            <p>3. After final payment verification, the project enters <strong className="text-white/60">delivery phase</strong>. An admin will contact you to arrange full handover.</p>
          </div>
          <p className="text-xs text-white/25 pt-2 border-t border-white/5">This page auto-refreshes every 30 seconds. You can also manually refresh.</p>
        </div>

        {/* View quotation link */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/portal/${slug}/review`)}
            className="text-xs text-white/30 hover:text-white/60 transition-colors underline underline-offset-4"
          >
            View Quotation & Contract
          </button>
        </div>

        <div className="text-center text-xs text-white/20 pb-6">
          Anjal Ventures · anjalventures@gmail.com
        </div>
      </main>
    </div>
  )
}

function StageCard({ number, title, subtitle, status, payment, ctaLabel, onCta, completedAt }) {
  const label = statusLabel(status)
  const isLocked = status === 'locked'
  const isActive = status === 'active'
  const isDone = status === 'verified' || status === 'complete'

  return (
    <div className={`rounded-2xl border transition-all duration-500 overflow-hidden ${
      isDone
        ? 'bg-gradient-to-br from-emerald-600/10 to-teal-600/5 border-emerald-500/20'
        : isActive
        ? 'bg-gradient-to-br from-blue-600/15 to-indigo-600/10 border-blue-500/30 shadow-lg shadow-blue-500/10'
        : status === 'pending'
        ? 'bg-gradient-to-br from-amber-600/10 to-orange-600/5 border-amber-500/20'
        : 'bg-white/[0.02] border-white/5 opacity-50'
    }`}>
      <div className="p-5">
        <div className="flex items-center gap-4">
          <StatusIcon status={status} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold text-white/30 uppercase tracking-widest">Stage {number}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border ${label.bg} ${label.color} font-medium`}>
                {label.text}
              </span>
            </div>
            <h3 className={`font-bold text-base mt-1 ${isLocked ? 'text-white/30' : 'text-white'}`}>{title}</h3>
            <p className={`text-xs mt-0.5 ${isLocked ? 'text-white/20' : 'text-white/50'}`}>{subtitle}</p>
          </div>
        </div>

        {/* Payment details if submitted */}
        {payment && (
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-white/40 space-y-1">
            <p>Submitted: {new Date(payment.submitted_at).toLocaleString()}</p>
            {payment.transfer_reference && <p>Reference: {payment.transfer_reference}</p>}
            {payment.admin_note && <p className="text-white/60">Admin note: {payment.admin_note}</p>}
          </div>
        )}

        {/* Completion date */}
        {completedAt && (
          <div className="mt-4 pt-4 border-t border-white/5 text-xs text-emerald-400/60">
            Completed: {new Date(completedAt).toLocaleString()}
          </div>
        )}

        {/* Active stage pending message */}
        {status === 'pending' && (
          <div className="mt-4 rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-xs text-amber-300/80">
            ⏳ Payment submitted — An admin will verify your payment shortly.
          </div>
        )}

        {/* Stage 3 active message */}
        {number === 3 && status === 'active' && (
          <div className="mt-4 rounded-lg bg-blue-500/10 border border-blue-500/20 px-4 py-3 text-xs text-blue-300/80">
            🚀 Your project is now in the final delivery phase. Our team is preparing your deliverables. An admin will contact you shortly.
          </div>
        )}

        {/* CTA button */}
        {ctaLabel && onCta && (
          <button
            onClick={onCta}
            className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm transition-all duration-300 hover:-translate-y-0.5 shadow-lg shadow-blue-500/20"
          >
            {ctaLabel} →
          </button>
        )}
      </div>
    </div>
  )
}

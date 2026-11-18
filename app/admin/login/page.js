'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Lock, Mail } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async e => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid admin credentials')
      }
    } catch {
      setError('Connection error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 py-12 text-white">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] shadow-2xl lg:grid-cols-[1.05fr_.95fr]">
        <section className="hidden flex-col justify-between border-r border-white/10 p-10 lg:flex">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white p-1.5">
              <Image src="/logo-sm.webp" alt="Anjal Solutions LTD" width={32} height={32} className="h-8 w-8 object-contain" />
            </div>
            <div>
              <p className="text-sm font-semibold">Anjal Solutions LTD</p>
              <p className="font-mono text-[11px] text-slate-400">Operations Console</p>
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-blue-400">Corporate Portal</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight tracking-tight">
              Manage projects, Naira quotations, pricing tiers, and corporate settings.
            </h1>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">Projects & Media</div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">Naira Quotes</div>
            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-3">Governance</div>
          </div>
        </section>

        <section className="bg-white p-8 text-slate-950 sm:p-10">
          <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-blue-700">Restricted Access</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight">Admin Sign In</h2>
          <p className="mt-1 text-sm text-slate-500">Authenticate with your database-backed administrator account.</p>

          {error && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-medium text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Email</span>
              <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:bg-white">
                <Mail className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full bg-transparent text-sm outline-none"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">Password</span>
              <span className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2.5 focus-within:border-blue-600 focus-within:bg-white">
                <Lock className="h-4 w-4 text-slate-400" aria-hidden="true" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  className="w-full bg-transparent text-sm outline-none"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <Link href="/" className="mt-6 inline-flex text-xs font-semibold text-slate-500 hover:text-slate-900">
            ← Return to public website
          </Link>
        </section>
      </div>
    </main>
  )
}

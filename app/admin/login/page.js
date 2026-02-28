'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (res.ok) {
        router.push('/admin')
        router.refresh()
      } else {
        setError(data.error || 'Invalid password')
      }
    } catch {
      setError('Connection error. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      {/* Background pattern */}
      <div className="absolute inset-0 hero-grid-pattern" />
      <div className="absolute -top-40 -right-20 w-96 h-96 rounded-full bg-brand-green/8 blur-[80px]" />

      <div className="relative bg-white rounded-3xl p-12 w-full max-w-md shadow-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 relative mx-auto mb-4">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" onError={() => {}} />
          </div>
          <h1 className="font-display text-3xl text-navy mb-1">Admin Panel</h1>
          <p className="text-sm text-slate-400">Anjal Ventures · Internal Management</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-sm mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-6">
            <label className="label">Admin Password</label>
            <input
              type="password"
              className="input-field text-base"
              placeholder="Enter your admin password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoFocus
            />
          </div>
          <button type="submit" disabled={loading} className="btn btn-green w-full justify-center py-4 text-base">
            {loading ? 'Authenticating...' : 'Login to Admin Panel →'}
          </button>
        </form>

        <p className="text-xs text-slate-300 text-center mt-6">
          This panel is for authorised Anjal Ventures administrators only.
        </p>

        <a href="/" className="flex items-center justify-center gap-2 text-xs text-slate-400 hover:text-slate-600 mt-4 transition-colors">
          ← Return to website
        </a>
      </div>
    </div>
  )
}

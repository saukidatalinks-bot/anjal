'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState } from 'react'

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/projects', label: 'Projects', icon: '📁' },
  { href: '/admin/services', label: 'Services', icon: '⚡' },
  { href: '/admin/pricing', label: 'Pricing Plans', icon: '💰' },
  { href: '/admin/calculator', label: 'Calculator Items', icon: '🧮' },
  { href: '/admin/contacts', label: 'Contact Messages', icon: '📩' },
  { href: '/admin/quotations', label: 'Quotations', icon: '📋' },
  { href: '/admin/settings', label: 'Site Settings', icon: '⚙️' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [loggingOut, setLoggingOut] = useState(false)

  const handleLogout = async () => {
    setLoggingOut(true)
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  return (
    <aside className="w-64 bg-navy min-h-screen flex flex-col fixed left-0 top-0 bottom-0 z-30">
      {/* Logo */}
      <div className="p-6 border-b border-white/8">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 relative flex-shrink-0">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" onError={() => {}} />
          </div>
          <div>
            <div className="font-display font-bold text-white text-sm">Anjal Ventures</div>
            <div className="text-[10px] text-white/30 font-mono uppercase">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4">
        <div className="text-[10px] text-white/25 uppercase tracking-widest font-bold px-3 mb-3">Management</div>
        <div className="flex flex-col gap-1">
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  isActive ? 'bg-white/15 text-white' : 'text-white/45 hover:text-white hover:bg-white/8'
                }`}>
                <span className="text-base">{item.icon}</span>
                {item.label}
                {isActive && <span className="ml-auto w-1.5 h-1.5 bg-brand-green rounded-full" />}
              </Link>
            )
          })}
        </div>

        <div className="mt-8 border-t border-white/8 pt-4">
          <Link href="/" target="_blank"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/35 hover:text-white hover:bg-white/8 transition-all">
            <span>🌐</span> View Website
          </Link>
          <button onClick={handleLogout} disabled={loggingOut}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all">
            <span>🚪</span> {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </nav>
    </aside>
  )
}

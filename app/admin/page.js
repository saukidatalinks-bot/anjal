'use client'
import { useEffect, useState } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import TestimonialsModal from '@/components/TestimonialsModal'
import Link from 'next/link'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [messages, setMessages] = useState([])
  const [testimonialsModalOpen, setTestimonialsModalOpen] = useState(false)

  useEffect(() => {
    // Fetch stats from various endpoints
    Promise.all([
      fetch('/api/admin/projects').then(r => r.json()),
      fetch('/api/admin/services').then(r => r.json()),
      fetch('/api/admin/pricing').then(r => r.json()),
      fetch('/api/admin/contacts').then(r => r.json()),
      fetch('/api/admin/quotations').then(r => r.json()),
    ]).then(([projects, services, pricing, contacts, quotations]) => {
      setStats({
        projects: projects.length || 0,
        services: services.length || 0,
        pricing: pricing.length || 0,
        contacts: contacts.length || 0,
        unread: (contacts || []).filter(c => !c.is_read).length,
        quotations: quotations.length || 0,
      })
      setMessages((contacts || []).slice(0, 5))
    }).catch(() => {})
  }, [])

  const quickLinks = [
    { href: '/admin/projects', label: 'Add Project', icon: '📁', desc: 'Upload new portfolio project' },
    { href: '/admin/services', label: 'Edit Services', icon: '⚡', desc: 'Manage service offerings' },
    { href: '/admin/pricing', label: 'Update Pricing', icon: '💰', desc: 'Modify pricing plans' },
    { href: '/admin/calculator', label: 'Calculator Items', icon: '🧮', desc: 'Edit estimator services' },
    { href: '/admin/testimonials', label: 'Manage Testimonials', icon: '💬', desc: 'View, edit & publish testimonies', onClick: (e) => { e.preventDefault(); setTestimonialsModalOpen(true) } },
    { href: '/admin/settings', label: 'Site Settings', icon: '⚙️', desc: 'Update contact info & config' },
    { href: '/admin/contacts', label: 'View Messages', icon: '📩', desc: `${stats?.unread || 0} unread messages` },
  ]

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-8">
          <h1 className="font-display text-3xl text-navy mb-1">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome back. You have full control over your Anjal Ventures website.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {[
            { label: 'Projects', value: stats?.projects ?? '—', icon: '📁', color: 'bg-blue-50 text-blue-600' },
            { label: 'Services', value: stats?.services ?? '—', icon: '⚡', color: 'bg-green-50 text-green-600' },
            { label: 'Messages', value: stats?.contacts ?? '—', icon: '📩', color: 'bg-amber-50 text-amber-600', badge: stats?.unread },
            { label: 'Quotations', value: stats?.quotations ?? '—', icon: '📋', color: 'bg-purple-50 text-purple-600' },
          ].map(s => (
            <div key={s.label} className="admin-card relative overflow-hidden">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-3 ${s.color}`}>
                {s.icon}
              </div>
              <div className="font-display text-4xl font-bold text-navy mb-1">{s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
              {s.badge > 0 && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {s.badge}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-10">
          <h2 className="font-bold text-navy text-sm uppercase tracking-widest mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map(link => (
              <Link key={link.href} href={link.href}
                onClick={link.onClick}
                className="admin-card hover:border-brand-green hover:bg-brand-green-pale/30 transition-all group p-5 cursor-pointer">
                <div className="text-2xl mb-2">{link.icon}</div>
                <div className="font-semibold text-navy text-sm mb-1 group-hover:text-brand-green transition-colors">{link.label}</div>
                <div className="text-xs text-slate-400">{link.desc}</div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Messages */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-navy text-sm uppercase tracking-widest">Recent Messages</h2>
            <Link href="/admin/contacts" className="text-xs text-brand-green font-semibold hover:underline">View All →</Link>
          </div>
          <div className="admin-card">
            {messages.length === 0 ? (
              <p className="text-slate-400 text-sm text-center py-8">No contact messages yet.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map(m => (
                  <div key={m.id} className={`flex items-start gap-4 p-4 rounded-lg ${!m.is_read ? 'bg-blue-50 border border-blue-100' : 'bg-slate-50'}`}>
                    <div className="w-9 h-9 bg-navy rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                      {m.name?.[0]?.toUpperCase() || '?'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-semibold text-navy text-sm">{m.name}</span>
                        {!m.is_read && <span className="bg-blue-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">NEW</span>}
                      </div>
                      <div className="text-xs text-slate-400 mb-1">{m.email} · {m.service || 'No service specified'}</div>
                      <p className="text-sm text-slate-600 truncate">{m.message}</p>
                    </div>
                    <div className="text-[11px] text-slate-300 flex-shrink-0">
                      {new Date(m.created_at).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Testimonials Modal */}
        <TestimonialsModal isOpen={testimonialsModalOpen} onClose={() => setTestimonialsModalOpen(false)} />
      </main>
    </div>
  )
}

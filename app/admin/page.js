'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FolderKanban, MessageSquare, ReceiptText, Settings } from 'lucide-react'
import AdminSidebar from '@/components/AdminSidebar'
import { formatNaira } from '@/lib/format'

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    quotations: 0,
    contacts: 0,
    unreadContacts: 0,
    services: 0,
  })
  const [quotations, setQuotations] = useState([])
  const [contacts, setContacts] = useState([])

  useEffect(() => {
    Promise.all([
      fetch('/api/admin/projects').then(r => r.json()).catch(() => []),
      fetch('/api/admin/quotations').then(r => r.json()).catch(() => []),
      fetch('/api/admin/contacts').then(r => r.json()).catch(() => []),
      fetch('/api/admin/services').then(r => r.json()).catch(() => []),
    ]).then(([projectsData, quotationsData, contactsData, servicesData]) => {
      const safeProjects = Array.isArray(projectsData) ? projectsData : []
      const safeQuotations = Array.isArray(quotationsData) ? quotationsData : []
      const safeContacts = Array.isArray(contactsData) ? contactsData : []
      const safeServices = Array.isArray(servicesData) ? servicesData : []

      setQuotations(safeQuotations.slice(0, 5))
      setContacts(safeContacts.slice(0, 5))
      setStats({
        projects: safeProjects.length,
        quotations: safeQuotations.length,
        contacts: safeContacts.length,
        unreadContacts: safeContacts.filter(c => !c.is_read).length,
        services: safeServices.length,
      })
    })
  }, [])

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminSidebar />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">
              Operations Console
            </p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Anjal Solutions Overview</h1>
          </div>
          <Link
            href="/admin/projects"
            className="inline-flex items-center gap-2 rounded-lg bg-slate-950 px-4 py-2.5 text-xs font-semibold text-white hover:bg-blue-700"
          >
            Manage Projects
          </Link>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Portfolio Projects" value={stats.projects} href="/admin/projects" icon={FolderKanban} />
          <StatCard label="Naira Quotations" value={stats.quotations} href="/admin/quotations" icon={ReceiptText} />
          <StatCard
            label="Contact Inquiries"
            value={stats.contacts}
            sub={`${stats.unreadContacts} unread`}
            href="/admin/contacts"
            icon={MessageSquare}
          />
          <StatCard label="Active Services" value={stats.services} href="/admin/services" icon={Settings} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">Recent Quotations</h2>
              <Link href="/admin/quotations" className="text-xs font-semibold text-blue-700 hover:underline">
                View all
              </Link>
            </div>
            {quotations.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                No quotation requests yet.
              </p>
            ) : (
              <div className="space-y-3">
                {quotations.map(q => (
                  <div key={q.id} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">
                        {q.project_title || q.client_name || 'Untitled Quotation'}
                      </p>
                      <p className="mt-0.5 truncate font-mono text-xs text-slate-500">
                        {q.reference || `#${q.id}`} · {q.email}
                      </p>
                    </div>
                    <p className="shrink-0 font-mono text-xs font-bold text-slate-900">
                      {formatNaira(q.total_naira || q.total_amount || 0)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold text-slate-950">Recent Contact Messages</h2>
              <Link href="/admin/contacts" className="text-xs font-semibold text-blue-700 hover:underline">
                View all
              </Link>
            </div>
            {contacts.length === 0 ? (
              <p className="rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                No contact inquiries yet.
              </p>
            ) : (
              <div className="space-y-3">
                {contacts.map(c => (
                  <div key={c.id} className="flex items-center justify-between gap-4 rounded-lg bg-slate-50 p-3.5">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-slate-950">{c.name}</p>
                      <p className="mt-0.5 truncate text-xs text-slate-500">
                        {c.email} · {c.service || 'General Inquiry'}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase ${
                        c.is_read ? 'bg-slate-200 text-slate-700' : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {c.is_read ? 'Read' : 'New'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

function StatCard({ label, value, sub, href, icon: Icon }) {
  return (
    <Link
      href={href}
      className="flex items-start justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{label}</p>
        <p className="mt-2 font-mono text-3xl font-semibold text-slate-950">{value}</p>
        {sub && <p className="mt-1 text-xs font-medium text-blue-700">{sub}</p>}
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-900">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
    </Link>
  )
}

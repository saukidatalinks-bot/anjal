'use client'

import { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast'
import AdminSidebar from '@/components/AdminSidebar'

const SETTING_GROUPS = [
  {
    title: 'Corporate Identity & Registry',
    desc: 'Official legal and registry details shown across header, footer, about page, and PDF quotes.',
    fields: [
      { key: 'company_name', label: 'Company Name', placeholder: 'Anjal Solutions LTD' },
      { key: 'company_cac', label: 'CAC Number (RC)', placeholder: '9854225' },
      { key: 'company_tin', label: 'Tax Identification Number (TIN)', placeholder: '2623598796685' },
      { key: 'company_duns', label: 'D-U-N-S Number', placeholder: '352297161' },
      {
        key: 'company_address',
        label: 'Headquarters Address',
        placeholder: 'No. 4, Kolomi Ali Street, Njiwaji Layout, Sabon Fegi, Damaturu, Yobe State, Nigeria',
        type: 'textarea',
      },
    ],
  },
  {
    title: 'Contact & Communication Desks',
    desc: 'Emails, phone, and WhatsApp channels rendered across Contact, Footer, and PDF proposals.',
    fields: [
      { key: 'company_email', label: 'Primary Corporate Email', placeholder: 'office@anjalsolutionsltd.com' },
      { key: 'company_email2', label: 'Secondary Client Email', placeholder: 'contact@anjalventures.com' },
      { key: 'company_email3', label: 'Developers Desk Email', placeholder: 'developers@anjalventures.com' },
      { key: 'company_phone', label: 'Official Telephone', placeholder: '+234 816 413 5836' },
      { key: 'company_whatsapp', label: 'WhatsApp Number', placeholder: '+234 816 413 5836' },
    ],
  },
  {
    title: 'Hero & Footer Copy',
    desc: 'Customize primary hero messaging and footer tagline.',
    fields: [
      { key: 'hero_title', label: 'Hero Headline', placeholder: 'Dependable software platforms built for real operations.' },
      {
        key: 'hero_description',
        label: 'Hero Description',
        type: 'textarea',
        placeholder: 'Anjal Solutions LTD engineers production web systems, native iOS & Android applications...',
      },
      {
        key: 'footer_tagline',
        label: 'Footer Tagline',
        type: 'textarea',
        placeholder: 'Enterprise software, mobile platforms, and operational systems engineered in Nigeria.',
      },
    ],
  },
  {
    title: 'EmailJS Delivery Integration',
    desc: 'Shared by both the Contact page and Naira Quote Builder notifications.',
    fields: [
      { key: 'emailjs_public_key', label: 'EmailJS Public Key', placeholder: 'your_public_key' },
      { key: 'emailjs_service_id', label: 'EmailJS Service ID', placeholder: 'service_xxxxxx' },
      { key: 'emailjs_template_id', label: 'EmailJS Template ID', placeholder: 'template_xxxxxx' },
    ],
  },
]

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(data => {
        setSettings(data || {})
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const update = (key, val) => setSettings(prev => ({ ...prev, [key]: val }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (!res.ok) throw new Error('Save failed')
      toast.success('Corporate settings saved')
    } catch {
      toast.error('Failed to save settings')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <AdminSidebar />
        <main className="p-6 lg:ml-64 lg:p-8 text-sm text-slate-500">Loading settings...</main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="p-4 sm:p-6 lg:ml-64 lg:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em] text-blue-700">Configuration</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Corporate & EmailJS Settings</h1>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>

        <div className="space-y-6">
          {SETTING_GROUPS.map(group => (
            <section key={group.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-slate-950">{group.title}</h2>
              <p className="mt-1 text-xs text-slate-500">{group.desc}</p>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {group.fields.map(field => (
                  <div key={field.key} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-600">
                      {field.label}
                    </label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={3}
                        className="input-field"
                        placeholder={field.placeholder}
                        value={settings[field.key] || ''}
                        onChange={e => update(field.key, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        className="input-field"
                        placeholder={field.placeholder}
                        value={settings[field.key] || ''}
                        onChange={e => update(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  )
}

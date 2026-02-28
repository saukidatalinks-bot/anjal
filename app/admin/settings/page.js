'use client'
import { useState, useEffect } from 'react'
import AdminSidebar from '@/components/AdminSidebar'
import toast, { Toaster } from 'react-hot-toast'

const SETTING_GROUPS = [
  {
    title: '🏢 Company Information',
    desc: 'Basic company details shown across the website',
    fields: [
      { key: 'company_name', label: 'Company Name', placeholder: 'Anjal Ventures' },
      { key: 'company_tagline', label: 'Tagline', placeholder: "Building Africa's Digital Infrastructure" },
      { key: 'company_email', label: 'Primary Email', type: 'email', placeholder: 'anjalventures@gmail.com' },
      { key: 'company_email2', label: 'Business Email', type: 'email', placeholder: 'contact@anjal.com' },
      { key: 'company_phone', label: 'Phone Number', placeholder: '+234 000 000 0000' },
      { key: 'company_whatsapp', label: 'WhatsApp Number (digits only)', placeholder: '2348012345678' },
      { key: 'company_address', label: 'Office Address', placeholder: 'Damaturu, Yobe State, Nigeria' },
      { key: 'company_cac', label: 'CAC Registration Number', placeholder: 'BN 9258709' },
      { key: 'company_tin', label: 'Tax ID (TIN)', placeholder: '2623553716975' },
    ],
  },
  {
    title: '💱 Currency & Exchange',
    desc: 'Exchange rate for Naira equivalent pricing throughout the site',
    fields: [
      { key: 'exchange_rate', label: 'Naira per USD (e.g., 1400)', type: 'number', placeholder: '1400' },
    ],
  },
  {
    title: '🏠 Homepage Content',
    desc: 'Text and content shown on the main landing page',
    fields: [
      { key: 'hero_badge', label: 'Hero Badge Text', placeholder: 'CAC Registered · BN 9258709 · Active' },
      { key: 'about_text', label: 'About Section Main Text', type: 'textarea', placeholder: 'Enter your company overview...' },
      { key: 'footer_tagline', label: 'Footer Tagline', placeholder: 'We Build Digital Excellence — From Damaturu to the World.' },
      { key: 'meta_description', label: 'SEO Meta Description', type: 'textarea', placeholder: 'Enter site description for search engines...' },
    ],
  },
  {
    title: '📊 Statistics Numbers',
    desc: 'Numbers shown in the stats banner section',
    fields: [
      { key: 'stats_smes', label: 'SMEs Number (shown as XM+)', placeholder: '42' },
      { key: 'stats_undigitised', label: 'Undigitised % Number', placeholder: '70' },
      { key: 'stats_starting_price', label: 'Starting Price (USD)', placeholder: '100' },
      { key: 'stats_services', label: 'Number of Service Verticals', placeholder: '6' },
    ],
  },
  {
    title: '📧 EmailJS Configuration',
    desc: 'Connect EmailJS to forward contact form submissions directly to your Gmail inbox. Free service — no backend required.',
    link: { href: 'https://www.emailjs.com', label: 'Get free EmailJS account →' },
    fields: [
      { key: 'emailjs_public_key', label: 'EmailJS Public Key', placeholder: 'your_public_key_here' },
      { key: 'emailjs_service_id', label: 'EmailJS Service ID', placeholder: 'service_xxxxxxx' },
      { key: 'emailjs_template_id', label: 'EmailJS Template ID', placeholder: 'template_xxxxxxx' },
    ],
  },
]

export default function AdminSettings() {
  const [settings, setSettings] = useState({})
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch('/api/admin/settings')
      .then(r => r.json())
      .then(d => { setSettings(d); setLoaded(true) })
  }, [])

  const update = (key, value) => setSettings(s => ({ ...s, [key]: value }))

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) {
        toast.success('All settings saved! Changes are live on the site.')
      } else {
        toast.error('Failed to save settings.')
      }
    } catch {
      toast.error('Save failed. Check your connection.')
    }
    setSaving(false)
  }

  if (!loaded) {
    return (
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="text-slate-400 text-sm">Loading settings...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Toaster position="top-right" />
      <AdminSidebar />
      <main className="ml-64 flex-1 p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl text-navy mb-1">Site Settings</h1>
            <p className="text-slate-500 text-sm">
              All text, contact details, EmailJS config, and statistics — controlled from here. Changes go live instantly.
            </p>
          </div>
          <button onClick={handleSave} disabled={saving} className="btn btn-green px-8">
            {saving ? 'Saving...' : '💾 Save All Settings'}
          </button>
        </div>

        {/* Grouped fields */}
        <div className="flex flex-col gap-7">
          {SETTING_GROUPS.map(group => (
            <div key={group.title} className="admin-card">
              <div className="flex items-start justify-between mb-1">
                <h2 className="font-bold text-navy text-lg">{group.title}</h2>
                {group.link && (
                  <a href={group.link.href} target="_blank" rel="noopener"
                    className="text-xs text-brand-green font-semibold hover:underline">
                    {group.link.label}
                  </a>
                )}
              </div>
              <p className="text-xs text-slate-400 mb-6">{group.desc}</p>

              <div className="grid grid-cols-2 gap-4">
                {group.fields.map(field => (
                  <div key={field.key} className={field.type === 'textarea' ? 'col-span-2' : ''}>
                    <label className="label">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        className="input-field"
                        rows={3}
                        placeholder={field.placeholder}
                        value={settings[field.key] || ''}
                        onChange={e => update(field.key, e.target.value)}
                      />
                    ) : (
                      <input
                        type={field.type || 'text'}
                        className="input-field"
                        placeholder={field.placeholder}
                        value={settings[field.key] || ''}
                        onChange={e => update(field.key, e.target.value)}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* EmailJS setup guide */}
              {group.title.includes('EmailJS') && (
                <div className="mt-5 bg-blue-50 border border-blue-100 rounded-xl p-5 text-sm text-blue-700">
                  <strong className="block mb-2">📘 EmailJS Setup Guide</strong>
                  <ol className="list-decimal list-inside space-y-1 text-xs">
                    <li>Create a free account at <a href="https://www.emailjs.com" target="_blank" rel="noopener" className="underline">emailjs.com</a></li>
                    <li>Add an Email Service (connect your Gmail account)</li>
                    <li>Create an Email Template — use variables: <code className="bg-blue-100 px-1 rounded">from_name</code>, <code className="bg-blue-100 px-1 rounded">from_email</code>, <code className="bg-blue-100 px-1 rounded">message</code>, <code className="bg-blue-100 px-1 rounded">service</code>, <code className="bg-blue-100 px-1 rounded">budget</code>, <code className="bg-blue-100 px-1 rounded">phone</code></li>
                    <li>Copy your Public Key, Service ID, and Template ID into the fields above</li>
                    <li>Save settings — the contact form will now deliver directly to your Gmail</li>
                  </ol>
                </div>
              )}
            </div>
          ))}

          {/* Danger zone */}
          <div className="admin-card border-red-200">
            <h2 className="font-bold text-red-600 text-lg mb-1">⚠️ Danger Zone</h2>
            <p className="text-xs text-slate-400 mb-4">These actions are irreversible. Proceed with caution.</p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (confirm('This will log you out. Continue?')) {
                    fetch('/api/auth/logout', { method: 'POST' }).then(() => window.location.href = '/admin/login')
                  }
                }}
                className="btn py-2 px-5 text-sm bg-slate-100 text-slate-700 hover:bg-slate-200">
                🚪 Logout
              </button>
              <button
                onClick={() => toast('To change your admin password, update ADMIN_PASSWORD in your Vercel environment variables.', { icon: 'ℹ️', duration: 6000 })}
                className="btn py-2 px-5 text-sm bg-amber-50 text-amber-700 hover:bg-amber-100">
                🔑 Change Password Info
              </button>
            </div>
            <p className="text-xs text-slate-300 mt-3">
              Admin password is managed via the <code className="bg-slate-100 px-1 rounded text-slate-500">ADMIN_PASSWORD</code> environment variable in Vercel. Update it there and redeploy to change it.
            </p>
          </div>
        </div>

        {/* Sticky save button at bottom */}
        <div className="sticky bottom-6 mt-8 flex justify-end">
          <button onClick={handleSave} disabled={saving}
            className="btn btn-green shadow-xl px-10 py-4 text-base">
            {saving ? '⏳ Saving...' : '💾 Save All Settings'}
          </button>
        </div>
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import toast, { Toaster } from 'react-hot-toast'

const DEFAULT_CONTRACT = `CONTRACT AGREEMENT
Anjal Ventures × Client

REFERENCE: AV/DEV/2026/001

─────────────────────────────────────────

1. PARTIES
This Agreement is entered into between Anjal Ventures (Anjal Developers Team), BN Reg. No. 9258709, CAC Certified, TIN: 2623553716975, hereinafter referred to as "Service Provider", and the above-named client, hereinafter referred to as "Client".

2. SCOPE OF SERVICES
The Service Provider agrees to deliver all services, features, and deliverables as described in the Quotation above. Any additions or modifications to the agreed scope must be confirmed in writing by both parties.

3. PAYMENT SCHEDULE
• Stage 1 — Initial Payment: 50% of the total quoted amount is due upon agreement, prior to project commencement.
• Stage 2 — Final Payment: The remaining 50% is payable upon satisfactory project delivery and client approval of all deliverables.

4. DELIVERY TIMELINE
Estimated delivery is 2–4 weeks from confirmation of Stage 1 payment, subject to timely provision of required content, assets, credentials, and feedback by the Client.

5. INTELLECTUAL PROPERTY & OWNERSHIP
Upon receipt of the final Stage 2 payment, all project deliverables including source code, design files, and assets become the sole property of the Client. The Service Provider retains no claim over delivered work following full settlement.

6. POST-DELIVERY SUPPORT
A 14-day complimentary bug-fix support period is included post-delivery. Extended maintenance packages are available upon request at separate pricing.

7. CONFIDENTIALITY
Both parties agree to maintain strict confidentiality of all proprietary, technical, and business information shared during the engagement. No information shall be disclosed to third parties without prior written consent.

8. LIMITATION OF LIABILITY
The Service Provider's total liability shall not exceed the total amount paid by the Client under this agreement. The Service Provider bears no liability for indirect or consequential damages.

9. GOVERNING LAW
This agreement is governed by the laws of the Federal Republic of Nigeria. Any disputes shall be resolved through the courts of Yobe State, Nigeria.

10. ACCEPTANCE
By clicking "Proceed to Payment" below, the Client acknowledges having read and fully understood this agreement, and accepts all terms and conditions herein along with the attached Quotation.

─────────────────────────────────────────
Issued By: Anjal Developers Team
Anjal Ventures | CAC Reg. No. 9258709
No. 4, MJG Global Ventures Complex
Kolomi Ali Street, Sabon Pegi
Damaturu, Yobe State, Nigeria
anjalventures@gmail.com`

export default function PortalReviewPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [agreed, setAgreed] = useState(false)
  const [proceeding, setProceeding] = useState(false)

  useEffect(() => {
    if (!slug) return
    fetch(`/api/portal/${slug}`)
      .then(r => r.json())
      .then(d => {
        setData(d)
        setLoading(false)
        // If already in progress stage, redirect
        if (d?.client?.portal_stage === 'progress') {
          router.replace(`/portal/${slug}/progress`)
        }
      })
      .catch(() => { setLoading(false) })
  }, [slug])

  const handleProceed = async () => {
    if (!agreed) {
      toast.error('Please read and agree to the terms before proceeding.')
      return
    }
    setProceeding(true)
    router.push(`/portal/${slug}/payment/1`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
        <div className="text-white/70 text-sm animate-pulse">Loading your portal…</div>
      </div>
    )
  }

  if (!data?.client) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center px-6">
        <div className="text-center">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-white text-2xl font-semibold mb-2">Portal Not Found</h1>
          <p className="text-white/60">This client portal does not exist or is not active.</p>
        </div>
      </div>
    )
  }

  const { client } = data
  const quotation = client.quotation_content || ''
  const contract = client.contract_content || DEFAULT_CONTRACT

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950/40 to-slate-950 text-white">
      <Toaster position="top-right" />

      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur-xl bg-slate-950/80 border-b border-white/5">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 rounded-full overflow-hidden ring-1 ring-white/20">
              <Image src="/logo.webp" alt="Anjal Ventures" fill className="object-contain" />
            </div>
            <div>
              <p className="text-xs font-semibold tracking-widest uppercase text-white/50">Anjal Ventures</p>
              <p className="text-sm font-medium text-white leading-none">{client.project_title}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/50">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block animate-pulse" />
            Portal Active
          </div>
        </div>
      </header>

      {/* Progress indicator */}
      <div className="max-w-5xl mx-auto px-6 pt-8 pb-2">
        <div className="flex items-center gap-3">
          {['Review & Sign', 'Payment', 'Tracking'].map((step, i) => (
            <div key={step} className="flex items-center gap-2">
              <div className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border ${
                i === 0
                  ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                  : 'border-white/10 bg-white/5 text-white/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-blue-400' : 'bg-white/20'}`} />
                {step}
              </div>
              {i < 2 && <span className="text-white/20">›</span>}
            </div>
          ))}
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Client greeting */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600/20 to-indigo-600/10 border border-blue-500/20 px-7 py-6">
          <p className="text-xs uppercase tracking-widest text-blue-300/70 mb-2">Welcome, {client.client_name}</p>
          <h1 className="text-2xl md:text-3xl font-semibold text-white mb-2">{client.project_title}</h1>
          <p className="text-white/60 text-sm max-w-2xl">
            Please review the complete quotation and contract agreement below. Once satisfied, check the agreement box and click <strong className="text-white">Proceed to Payment</strong> to begin.
          </p>
        </div>

        {/* QUOTATION SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-sm font-bold">1</div>
            <h2 className="text-lg font-semibold text-white">Quotation Document</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {/* Quotation header bar */}
            <div className="bg-gradient-to-r from-blue-600/30 to-indigo-600/20 border-b border-white/10 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/10 ring-1 ring-white/20 flex-shrink-0">
                  <Image src="/logo.webp" alt="Anjal Ventures" fill className="object-contain p-1" />
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Anjal Ventures</p>
                  <p className="text-white/50 text-xs">Technology & Digital Solutions</p>
                </div>
              </div>
              <div className="text-right hidden sm:block">
                <p className="text-white/50 text-xs">Ref: AV/DEV/2026/001</p>
                <p className="text-white/50 text-xs">Valid 30 days from issue</p>
              </div>
            </div>

            {/* Quotation body */}
            {quotation ? (
              <div className="px-6 py-6">
                <pre className="whitespace-pre-wrap font-sans text-sm text-white/80 leading-relaxed">{quotation}</pre>
              </div>
            ) : (
              /* Render the Anjal Ventures standard quotation */
              <div className="px-6 py-8 text-white/80 text-sm leading-relaxed space-y-6">
                <div className="text-center space-y-1 pb-4 border-b border-white/10">
                  <p className="text-white font-bold text-xl">QUOTATION</p>
                  <p className="text-white/50 text-xs">Ref: AV/DEV/2026/001 · Date: February 19, 2026</p>
                  <p className="text-white/50 text-xs">Valid Until: March 19, 2026 (30 Days) · Currency: USD / NGN · Exchange Rate: $1 = ₦1,350</p>
                  <p className="text-white/50 text-xs font-medium">Payment Terms: 50% Upfront · 50% on Delivery</p>
                </div>

                <div>
                  <p className="text-white/50 text-xs uppercase tracking-widest mb-1">From</p>
                  <p className="font-semibold text-white">Anjal Ventures (Anjal Developers Team)</p>
                  <p className="text-white/60 text-xs">BN Reg. No. 9258709 | CAC Certified | TIN: 2623553716975</p>
                  <p className="text-white/60 text-xs">No. 4, MJG Global Ventures Complex, Kolomi Ali Street, Sabon Pegi</p>
                  <p className="text-white/60 text-xs">Damaturu, Yobe State, Nigeria</p>
                </div>

                <div>
                  <p className="text-white/40 text-xs uppercase tracking-widest mb-3">Scope of Services & Itemised Quotation</p>
                  <div className="space-y-3">
                    {[
                      { no: 1, name: 'Website Development (Serverless Cloud Infrastructure)', desc: 'Fully responsive, production-ready website on serverless cloud infrastructure. Custom frontend & backend, cloud-hosted database, auto-scaling, SSL, admin dashboard & CMS.', usd: '$65.00', ngn: '₦87,750' },
                      { no: 2, name: 'Google Play Developer Account (Registered & Verified)', desc: 'Registered Google Play Console developer account in client\'s name — lifetime app publishing rights, full ownership & access, ability to host unlimited future apps.', usd: '$25.00', ngn: '₦33,750' },
                      { no: 3, name: '.app Domain Registration (1-Year Premium Domain)', desc: 'Branded .app top-level domain name with Google-managed HTTPS enforcement, 1-year registration, DNS setup, and domain pointing.', usd: '$15.00', ngn: '₦20,250' },
                      { no: 4, name: 'Android Mobile Application (Native / Cross-platform)', desc: 'Full-featured Android app synced with web platform — UI/UX design, API integration, push notifications, Google Play submission, and source code delivery.', usd: '$40.00', ngn: '₦54,000' },
                      { no: 5, name: 'Subsidized Data Vending API Access & Integration', desc: 'Exclusive access to Anjal Ventures\' subsidized data vending API with API key provisioning, integration into website and app, below-market rates, and technical support.', usd: '$25.00', ngn: '₦33,750' },
                    ].map(item => (
                      <div key={item.no} className="rounded-xl bg-white/5 border border-white/10 p-4">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div className="flex items-start gap-3">
                            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-500/20 text-blue-300 text-xs flex items-center justify-center font-bold">{item.no}</span>
                            <p className="font-semibold text-white text-sm">{item.name}</p>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-white font-bold text-sm">{item.usd}</p>
                            <p className="text-white/50 text-xs">{item.ngn}</p>
                          </div>
                        </div>
                        <p className="text-white/50 text-xs pl-9">{item.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl bg-gradient-to-r from-blue-500/20 to-indigo-500/10 border border-blue-500/30 p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/60 text-sm">Subtotal</span>
                    <span className="text-white font-semibold">$170.00</span>
                  </div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-white/60 text-sm">Tax / VAT</span>
                    <span className="text-white/60 text-sm">Nil</span>
                  </div>
                  <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center">
                    <span className="text-white font-bold">TOTAL</span>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">$170.00</p>
                      <p className="text-white/50 text-sm">₦229,500 equivalent</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-white/60">
                  <p><span className="text-white/80 font-medium">Payment Schedule:</span> 50% deposit ($85 / ₦114,750) required before project commencement. Balance of 50% ($85 / ₦114,750) payable upon project delivery.</p>
                  <p><span className="text-white/80 font-medium">Delivery Timeline:</span> Estimated 2–4 weeks from deposit confirmation, subject to timely provision of content and assets by client.</p>
                  <p><span className="text-white/80 font-medium">Post-Delivery Support:</span> 14-day complimentary bug-fix support included. Ongoing maintenance packages available on request.</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CONTRACT SECTION */}
        <section>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-sm font-bold">2</div>
            <h2 className="text-lg font-semibold text-white">Contract Agreement</h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/10 border-b border-white/10 px-6 py-4">
              <p className="text-emerald-300 font-semibold text-sm">Service Agreement — Anjal Ventures</p>
              <p className="text-white/40 text-xs mt-0.5">Please read all terms carefully before proceeding</p>
            </div>
            <div className="px-6 py-6">
              <pre className="whitespace-pre-wrap font-sans text-sm text-white/70 leading-relaxed">{contract}</pre>
            </div>
          </div>
        </section>

        {/* AGREEMENT & CTA */}
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-blue-500/5 p-6 space-y-5">
          <label className="flex items-start gap-4 cursor-pointer group">
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                agreed ? 'bg-blue-500 border-blue-500' : 'border-white/30 group-hover:border-white/50'
              }`}>
                {agreed && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>}
              </div>
            </div>
            <p className="text-sm text-white/70 leading-relaxed">
              I, <strong className="text-white">{client.client_name}</strong>, confirm that I have read and fully understood the Quotation document and Contract Agreement above. I accept all terms and conditions and am ready to proceed with the project.
            </p>
          </label>

          <button
            onClick={handleProceed}
            disabled={!agreed || proceeding}
            className={`w-full py-4 rounded-xl font-bold text-base transition-all duration-300 ${
              agreed
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/25 hover:-translate-y-0.5'
                : 'bg-white/5 text-white/30 cursor-not-allowed border border-white/10'
            }`}
          >
            {proceeding ? 'Redirecting…' : 'Proceed to Payment →'}
          </button>
          {!agreed && (
            <p className="text-center text-xs text-white/30">Check the box above to enable this button</p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-white/25 pb-8">
          Anjal Ventures · anjalventures@gmail.com · CAC Reg No. 9258709 · Damaturu, Yobe State, Nigeria
        </div>
      </main>
    </div>
  )
}

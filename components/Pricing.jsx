'use client'
import { useState } from 'react'

export default function Pricing({ plans = [], settings = {} }) {
  const [quotationOpen, setQuotationOpen] = useState(false)

  const NAIRA_TO_DOLLAR = parseInt(settings?.exchange_rate || 1400)

  const getPriceValue = (priceStr) => {
    if (!priceStr) return 0
    const match = priceStr.toString().match(/[\d.]+/)
    return match ? parseFloat(match[0]) : 0
  }

  const convertToNaira = (usdPrice) => {
    return Math.round(usdPrice * NAIRA_TO_DOLLAR)
  }

  const formatNaira = (amount) => {
    return '₦' + amount.toLocaleString()
  }

  return (
    <section id="pricing" className="section bg-slate-50">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="section-tag">Transparent Pricing</div>
          <h2 className="section-title">Enterprise Quality, African-Market Pricing</h2>
          <p className="section-subtitle mx-auto text-center">
            Professional digital solutions built to international standards, priced for accessibility. With as little as <strong className="text-navy">$100</strong>, your business can have a professional website.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12 text-slate-400">No pricing plans configured yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-5xl mx-auto">
            {plans.map(plan => (
              <div key={plan.id} className={`rounded-2xl p-9 border transition-all relative flex flex-col ${
                plan.is_featured
                  ? 'bg-navy border-navy text-white shadow-2xl lg:scale-105'
                  : 'bg-white border-slate-200 hover:-translate-y-2 hover:shadow-xl'
              }`}>
                {plan.is_featured && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-brand-green text-white px-5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap">
                    Most Popular
                  </div>
                )}
                <div className={`text-sm font-bold uppercase tracking-widest mb-3 ${plan.is_featured ? 'text-white/50' : 'text-slate-400'}`}>
                  {plan.name}
                </div>
                <div className={`font-display text-5xl font-bold mb-1 ${plan.is_featured ? 'text-white' : 'text-navy'}`}>
                  {plan.price}
                </div>
                <div className={`text-xs mb-7 ${plan.is_featured ? 'text-white/40' : 'text-slate-400'}`}>
                  {plan.price_note}
                </div>
                <div className={`text-sm font-semibold mb-6 px-3 py-2 rounded-lg ${plan.is_featured ? 'bg-white/10 text-white' : 'bg-slate-100 text-navy'}`}>
                  {formatNaira(convertToNaira(getPriceValue(plan.price)))} at ₦{NAIRA_TO_DOLLAR.toLocaleString()}/$
                </div>

                <ul className="flex-1 space-y-0 mb-8">
                  {(plan.features || []).map((feature, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm py-2.5 border-b ${
                      plan.is_featured ? 'text-white/75 border-white/10' : 'text-slate-600 border-slate-100'
                    }`}>
                      <span className={`font-bold mt-0.5 flex-shrink-0 ${plan.is_featured ? 'text-brand-green-light' : 'text-brand-green'}`}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a href="#contact"
                  className={`btn justify-center w-full ${plan.is_featured ? 'btn-green' : 'btn-outline'}`}>
                  {plan.cta_text || 'Get Started'} →
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Quotation CTA */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-6 bg-white rounded-2xl px-8 py-6 shadow-lg border border-slate-200">
            <div className="text-3xl">📋</div>
            <div className="text-left">
              <div className="font-bold text-navy text-sm">Need a custom quote?</div>
              <div className="text-xs text-slate-500">Fill out our quotation form and download a branded PDF proposal</div>
            </div>
            <button onClick={() => document.getElementById('quotation')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-primary whitespace-nowrap">
              Request Quotation →
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

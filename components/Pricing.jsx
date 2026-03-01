'use client'

export default function Pricing({ plans = [], settings = {} }) {
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
    <section id="pricing" className="section bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Pricing</div>
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-6">
            Enterprise Quality, African-Market Pricing
          </h2>
          <p className="text-lg text-gray-600">
            Professional digital solutions built to international standards, priced for accessibility. Starting from just <span className="font-semibold text-black">$100</span>.
          </p>
        </div>

        {plans.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No pricing plans configured yet.</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto mb-20">
            {plans.map(plan => (
              <div key={plan.id} className={`rounded-lg border p-10 flex flex-col transition-all ${
                plan.is_featured
                  ? 'border-black bg-black text-white ring-2 ring-black'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}>
                {plan.is_featured && (
                  <div className="text-xs font-semibold text-white/60 uppercase tracking-wider mb-4">
                    Recommended
                  </div>
                )}
                
                <div className={`text-sm font-semibold uppercase tracking-wide mb-4 ${plan.is_featured ? 'text-white/60' : 'text-gray-500'}`}>
                  {plan.name}
                </div>
                
                <div className={`text-5xl font-semibold mb-2 ${plan.is_featured ? 'text-white' : 'text-black'}`}>
                  {plan.price}
                </div>
                
                <div className={`text-sm mb-6 ${plan.is_featured ? 'text-white/60' : 'text-gray-600'}`}>
                  {plan.price_note}
                </div>
                
                <div className={`text-sm font-semibold mb-8 px-4 py-3 rounded-lg ${
                  plan.is_featured ? 'bg-white/10 text-white' : 'bg-gray-100 text-black'
                }`}>
                  {formatNaira(convertToNaira(getPriceValue(plan.price)))} at ₦{NAIRA_TO_DOLLAR.toLocaleString()}/$
                </div>

                <ul className="flex-1 space-y-0 mb-8">
                  {(plan.features || []).map((feature, i) => (
                    <li key={i} className={`flex items-start gap-3 text-sm py-3 border-b ${
                      plan.is_featured 
                        ? 'text-white/80 border-white/10' 
                        : 'text-gray-700 border-gray-200'
                    }`}>
                      <span className="font-bold mt-0.5 flex-shrink-0">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <a href="#quotation"
                  className={`px-6 py-3 rounded-lg font-semibold text-center transition-colors ${
                    plan.is_featured 
                      ? 'bg-white text-black hover:bg-gray-100' 
                      : 'bg-black text-white hover:bg-gray-800'
                  }`}>
                  {plan.cta_text || 'Get Started'} →
                </a>
              </div>
            ))}
          </div>
        )}

        {/* Quotation CTA */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-10 text-center">
            <h3 className="text-2xl font-semibold text-black mb-3">Need a custom solution?</h3>
            <p className="text-gray-600 mb-6">
              Requirements not in our standard offerings? Request a custom quote and we'll prepare a detailed proposal.
            </p>
            <a href="#QuotationSection"
              className="inline-block px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-colors">
              Request Custom Quote →
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

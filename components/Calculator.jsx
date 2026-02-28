'use client'
import { useState, useEffect } from 'react'

export default function Calculator({ calculator = {} }) {
  const types = calculator.type || []
  const scales = calculator.scale || []
  const timelines = calculator.timeline || []
  const supports = calculator.support || []
  const addons = calculator.addon || []

  const [selectedType, setSelectedType] = useState(null)
  const [selectedScale, setSelectedScale] = useState(null)
  const [selectedTimeline, setSelectedTimeline] = useState(null)
  const [selectedSupport, setSelectedSupport] = useState(null)
  const [selectedAddons, setSelectedAddons] = useState([])
  const [estimate, setEstimate] = useState(0)

  useEffect(() => {
    if (types.length) setSelectedType(types[0])
    if (scales.length) setSelectedScale(scales[0])
    if (timelines.length) setSelectedTimeline(timelines[0])
    if (supports.length) setSelectedSupport(supports[0])
  }, [calculator])

  useEffect(() => {
    let base = parseFloat(selectedType?.base_price || 0)
    base += parseFloat(selectedScale?.base_price || 0)
    const timelineMult = parseFloat(selectedTimeline?.multiplier || 1)
    base = base * timelineMult
    base += parseFloat(selectedSupport?.base_price || 0)
    selectedAddons.forEach(a => { base += parseFloat(a.base_price || 0) })
    setEstimate(Math.round(base))
  }, [selectedType, selectedScale, selectedTimeline, selectedSupport, selectedAddons])

  const toggleAddon = (addon) => {
    setSelectedAddons(prev =>
      prev.find(a => a.id === addon.id)
        ? prev.filter(a => a.id !== addon.id)
        : [...prev, addon]
    )
  }

  return (
    <section id="calculator" className="section bg-white">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="text-center mb-12">
          <div className="section-tag">Project Estimator</div>
          <h2 className="section-title">Calculate Your Project Cost</h2>
          <p className="section-subtitle mx-auto text-center">
            Configure your requirements and get an instant indicative estimate. All services and pricing are maintained by our admin team.
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-8 lg:p-12">
            {/* Project Type */}
            {types.length > 0 && (
              <div className="mb-8">
                <label className="label">Project Type</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {types.map(t => (
                    <button key={t.id} onClick={() => setSelectedType(t)}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        selectedType?.id === t.id
                          ? 'border-brand-green bg-brand-green-pale text-navy'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}>
                      <div className="text-sm font-semibold">{t.name}</div>
                      <div className="text-xs text-brand-green font-bold mt-1">from ${parseFloat(t.base_price).toFixed(0)}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Scale + Timeline + Support */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {scales.length > 0 && (
                <div>
                  <label className="label">Project Scale</label>
                  <select className="input-field" value={selectedScale?.id || ''} onChange={e => setSelectedScale(scales.find(s => s.id === parseInt(e.target.value)))}>
                    {scales.map(s => <option key={s.id} value={s.id}>{s.name} {s.base_price > 0 ? `(+$${parseFloat(s.base_price).toFixed(0)})` : ''}</option>)}
                  </select>
                </div>
              )}
              {timelines.length > 0 && (
                <div>
                  <label className="label">Timeline</label>
                  <select className="input-field" value={selectedTimeline?.id || ''} onChange={e => setSelectedTimeline(timelines.find(t => t.id === parseInt(e.target.value)))}>
                    {timelines.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
              )}
              {supports.length > 0 && (
                <div>
                  <label className="label">Support Plan</label>
                  <select className="input-field" value={selectedSupport?.id || ''} onChange={e => setSelectedSupport(supports.find(s => s.id === parseInt(e.target.value)))}>
                    {supports.map(s => <option key={s.id} value={s.id}>{s.name} {s.base_price > 0 ? `(+$${parseFloat(s.base_price).toFixed(0)})` : ''}</option>)}
                  </select>
                </div>
              )}
            </div>

            {/* Add-ons */}
            {addons.length > 0 && (
              <div className="mb-8">
                <label className="label">Add-On Features</label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {addons.map(addon => (
                    <label key={addon.id} className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      selectedAddons.find(a => a.id === addon.id)
                        ? 'border-brand-green bg-brand-green-pale'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}>
                      <input type="checkbox" className="accent-brand-green w-4 h-4"
                        checked={!!selectedAddons.find(a => a.id === addon.id)}
                        onChange={() => toggleAddon(addon)} />
                      <div>
                        <div className="text-sm font-semibold text-navy">{addon.name}</div>
                        <div className="text-xs text-brand-green font-bold">+${parseFloat(addon.base_price).toFixed(0)}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            <div className="bg-navy rounded-2xl p-8 text-center">
              <div className="text-xs text-white/40 uppercase tracking-widest mb-3">Estimated Investment</div>
              <div className="font-display text-6xl font-bold text-white mb-2">
                <span className="text-3xl text-brand-gold">$</span>{estimate.toLocaleString()}
              </div>
              <div className="text-xs text-white/40 mb-6">Indicative estimate · Final quote after consultation</div>
              <div className="flex gap-4 justify-center">
                <a href="#contact" className="btn btn-green">Discuss My Project →</a>
                <a href="#quotation-section" className="btn btn-outline-white">Download Quote</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

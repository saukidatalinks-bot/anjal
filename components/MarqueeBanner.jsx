export default function MarqueeBanner({ services = [] }) {
  const items = services.length > 0
    ? services.map(s => `${s.icon} ${s.name}`)
    : ['🌐 Web Development', '📱 Android Apps', '🤖 AI Integration', '☁️ Enterprise SaaS', '⚡ Automation', '🎓 Tech Training', '💳 Payment APIs', '📊 Analytics']

  const doubled = [...items, ...items]

  return (
    <div className="bg-apple-blue py-4 marquee-wrapper overflow-hidden">
      <div className="marquee-track inline-flex gap-12 whitespace-nowrap" style={{ animation: 'marquee 30s linear infinite' }}>
        {doubled.map((item, i) => (
          <span key={i} className="text-white text-sm font-semibold uppercase tracking-widest flex items-center gap-3 flex-shrink-0">
            {item}
            {i < doubled.length - 1 && <span className="text-white/40 text-lg">·</span>}
          </span>
        ))}
      </div>
    </div>
  )
}

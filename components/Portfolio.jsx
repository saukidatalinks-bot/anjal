'use client'
import Image from 'next/image'

export default function Portfolio({ projects = [] }) {
  return (
    <section id="portfolio" className="section bg-white">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-6">
          <div>
            <div className="section-tag">Live Portfolio</div>
            <h2 className="section-title mb-0">Proven Deployments</h2>
          </div>
          <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
            Every product listed here is live, publicly accessible, and serving real users — not prototypes or mock-ups.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-slate-500 text-sm">No projects yet. Add your first project via the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7">
            {projects.map((project, i) => (
              <div key={project.id} className="card card-hover overflow-hidden group">
                {/* Banner */}
                <div className="h-52 relative overflow-hidden" style={{ background: project.banner_color || '#0A1628' }}>
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <>
                      <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 100%)' }} />
                      <div className="absolute inset-0 flex items-center justify-center text-7xl">
                        {project.emoji || '🚀'}
                      </div>
                    </>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-5 font-mono text-[11px] text-white/50 bg-black/30 px-2 py-1 rounded-full">
                    PROJECT {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="bg-brand-green text-white px-3 py-1 rounded-full text-[11px] font-bold uppercase">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-7">
                  <h3 className="font-display text-xl text-navy mb-2 leading-snug">{project.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4 line-clamp-3">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {(project.tags || []).map(tag => (
                      <span key={tag} className="bg-slate-100 text-navy/70 px-2.5 py-1 rounded-full text-[11px] font-semibold font-mono border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    {project.url ? (
                      <a href={project.url} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm font-semibold text-brand-green hover:gap-3 transition-all">
                        Visit Live Site <span>→</span>
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400">URL not configured</span>
                    )}
                    <span className="text-[11px] text-slate-400 font-mono">
                      {project.banner_color?.toUpperCase() || '#0A1628'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

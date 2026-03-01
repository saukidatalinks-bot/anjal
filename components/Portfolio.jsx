'use client'
import Image from 'next/image'

export default function Portfolio({ projects = [] }) {
  return (
    <section id="portfolio" className="section bg-white py-24">
      <div className="container mx-auto px-6">
        <div className="mb-20">
          <div className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Portfolio</div>
          <h2 className="text-5xl md:text-6xl font-semibold text-black mb-8">Live Projects & Deployments</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Every project here is live, publicly accessible, and serving real users — not prototypes or demos.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-5xl mb-4">📁</div>
            <p className="text-gray-600">No projects configured yet. Add your projects via the Admin Panel.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="border border-gray-200 rounded-lg overflow-hidden hover:border-gray-300 transition-colors group">
                {/* Image */}
                <div className="h-48 relative overflow-hidden bg-gray-100">
                  {project.image_url ? (
                    <Image
                      src={project.image_url}
                      alt={project.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl bg-gray-50">
                      {project.emoji || '🚀'}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-semibold text-black flex-1">{project.title}</h3>
                    {project.status && (
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2.5 py-1 rounded whitespace-nowrap">
                        {project.status}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  {/* Tags */}
                  {(project.tags || []).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-5">
                      {project.tags.map(tag => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded text-xs font-medium border border-gray-200">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Link */}
                  {project.url ? (
                    <a href={project.url} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-semibold text-black hover:text-gray-700 transition-colors pt-4 border-t border-gray-200">
                      View Project <span>→</span>
                    </a>
                  ) : (
                    <span className="text-xs text-gray-400 block pt-4 border-t border-gray-200">No URL configured</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

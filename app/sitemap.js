import { getDb, initDb } from '@/lib/db'

export default async function sitemap() {
  const baseUrl = 'https://anjalventures.com'
  const lastModified = new Date()

  try {
    await initDb()
    const sql = getDb()

    // Get all dynamic content
    const [projects, services] = await Promise.all([
      sql`SELECT id FROM projects WHERE is_active = true`,
      sql`SELECT id FROM services WHERE is_active = true`,
    ])

    // Static pages
    const staticPages = [
      { url: '', priority: 1.0, changefreq: 'weekly' },
      { url: '/admin/login', priority: 0.5, changefreq: 'monthly' },
    ]

    // Dynamic project pages (if you have individual project pages)
    const projectPages = projects.map((p) => ({
      url: `/projects/${p.id}`,
      priority: 0.7,
      changefreq: 'monthly',
    }))

    // Dynamic service pages (if you have individual service pages)
    const servicePages = services.map((s) => ({
      url: `/services/${s.id}`,
      priority: 0.7,
      changefreq: 'monthly',
    }))

    return [
      ...staticPages,
      ...projectPages,
      ...servicePages,
    ].map((page) => ({
      url: `${baseUrl}${page.url}`,
      lastModified,
      changeFrequency: page.changefreq,
      priority: page.priority,
    }))
  } catch (error) {
    console.error('Sitemap generation error:', error)
    // Return basic sitemap on error
    return [
      {
        url: baseUrl,
        lastModified,
        changeFrequency: 'weekly',
        priority: 1.0,
      },
    ]
  }
}

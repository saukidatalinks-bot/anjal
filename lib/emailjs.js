import { officialEmails } from '@/lib/company'

/**
 * Shared EmailJS notification dispatcher for Contact & Quotation submissions.
 * Uses settings configured in Admin -> Site Settings (`emailjs_public_key`, `emailjs_service_id`, `emailjs_template_id`).
 */
export async function sendEmailJsNotification(settings = {}, templateParams = {}) {
  const pubKey = settings?.emailjs_public_key
  const serviceId = settings?.emailjs_service_id
  const templateId = settings?.emailjs_template_id

  if (!pubKey || !serviceId || !templateId || typeof window === 'undefined') {
    return { sent: false, skipped: true }
  }

  try {
    if (!window.__anjalEmailJs) {
      const emailjs = (await import('@emailjs/browser')).default
      emailjs.init(pubKey)
      window.__anjalEmailJs = emailjs
    }

    await window.__anjalEmailJs.send(serviceId, templateId, {
      to_email: settings.company_email || officialEmails.general,
      ...templateParams,
    })

    return { sent: true, skipped: false }
  } catch (error) {
    console.error('[EmailJS] Notification delivery failed:', error)
    return { sent: false, skipped: false, error }
  }
}

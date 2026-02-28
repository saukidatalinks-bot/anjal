import { logEvent } from 'firebase/analytics'
import { analytics } from '@/lib/firebase'

/**
 * Track analytics events using both Firebase Analytics and Google Analytics
 * @param {string} eventName - Name of the event
 * @param {object} eventData - Event properties/data
 */
export const trackEvent = (eventName, eventData = {}) => {
  try {
    // Firebase Analytics
    if (analytics) {
      logEvent(analytics, eventName, eventData)
    }

    // Google Analytics
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', eventName, eventData)
    }
  } catch (error) {
    console.warn('⚠ Analytics tracking failed:', error.message)
  }
}

/**
 * Track page view events
 * @param {string} pageName - Name of the page
 * @param {string} pagePath - URL path of the page
 */
export const trackPageView = (pageName, pageePath = '') => {
  trackEvent('page_view', {
    page_title: pageName,
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: pageePath || (typeof window !== 'undefined' ? window.location.pathname : ''),
  })
}

/**
 * Track form submissions
 * @param {string} formName - Name of the form
 * @param {object} formData - Form submission metadata
 */
export const trackFormSubmit = (formName, formData = {}) => {
  trackEvent('form_submit', {
    form_name: formName,
    timestamp: new Date().toISOString(),
    ...formData,
  })
}

/**
 * Track quotation requests
 * @param {object} quotationData - Quotation details
 */
export const trackQuotationRequest = (quotationData = {}) => {
  trackEvent('quotation_request', {
    value: parseFloat(quotationData.total_amount) || 0,
    currency: 'USD',
    items_count: quotationData.items_count || 0,
    ...quotationData,
  })
}

/**
 * Track contact form submissions
 * @param {object} contactData - Contact form data
 */
export const trackContactForm = (contactData = {}) => {
  trackEvent('contact_form_submit', {
    timestamp: new Date().toISOString(),
    ...contactData,
  })
}

/**
 * Track PDF downloads
 * @param {string} documentName - Name of the PDF
 * @param {object} metadata - Additional metadata
 */
export const trackPdfDownload = (documentName, metadata = {}) => {
  trackEvent('pdf_download', {
    document_name: documentName,
    timestamp: new Date().toISOString(),
    ...metadata,
  })
}

/**
 * Track button clicks
 * @param {string} buttonName - Name/label of button
 * @param {string} section - Section where button is located
 */
export const trackButtonClick = (buttonName, section = '') => {
  trackEvent('button_click', {
    button_name: buttonName,
    section: section,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track scroll engagement
 * @param {string} sectionName - Name of section scrolled to
 */
export const trackScrollToSection = (sectionName) => {
  trackEvent('scroll_to_section', {
    section: sectionName,
    timestamp: new Date().toISOString(),
  })
}

/**
 * Track feature usage
 * @param {string} featureName - Name of feature being used
 * @param {object} metadata - Feature usage metadata
 */
export const trackFeatureUsage = (featureName, metadata = {}) => {
  trackEvent('feature_usage', {
    feature_name: featureName,
    timestamp: new Date().toISOString(),
    ...metadata,
  })
}

export default trackEvent

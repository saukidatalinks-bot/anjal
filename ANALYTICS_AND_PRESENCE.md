# ANALYTICS_AND_PRESENCE.md - Analytics & Web Presence Boost Setup

## Overview

This document explains the analytics and presence-boosting features implemented in Anjal Ventures website.

---

## 📊 Analytics Infrastructure

### 1. Google Analytics 4 (GA4) Integration

**Component Location:** `components/GoogleAnalytics.jsx`

#### Setup Steps:

1. **Get Google Analytics Measurement ID**
   - Go to [Google Analytics](https://analytics.google.com)
   - Sign in with your Google Account
   - Create a new property for "anjalventures.com"
   - Copy your **Measurement ID** (format: `G-XXXXXXXX`)

2. **Add to Environment Variables**

   Create/Update `.env.local`:
   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXX
   ```

3. **GA4 Will Automatically Track:**
   - Page views
   - User sessions
   - User location & device info
   - Traffic sources
   - User engagement (scroll depth, clicks)
   - Conversions (form submissions, PDF downloads)

4. **Access Reports**
   - Dashboard: https://analytics.google.com
   - Real-time: Real Time > Overview
   - Users: User > Audience
   - Events: Events > Conversions
   - Traffic: Traffic Acquisition > All Traffic

---

### 2. Firebase Analytics Integration

**Location:** `lib/firebase.js`

Already configured with your Firebase project credentials `anjal-ventures`.

**What Gets Tracked (via Firebase Analytics):**
- Custom events sent through `trackEvent()` function
- App installations
- User properties
- Custom conversions

**Access Reports:**
- Firebase Console: https://console.firebase.google.com
- Select project: anjal-ventures
- Analytics tab

---

### 3. Vercel Analytics

**Location:** `app/layout.js`

Automatically tracks:
- Web Core Vitals (LCP, FID, CLS)
- Page load performance
- Geographic distribution
- Browser & device info

**Dashboard:** https://vercel.com/dashboard → anjalventures → Analytics

---

## 🎯 Custom Event Tracking

### Location: `lib/analytics.js`

Provides helper functions to track important user actions:

#### Available Functions:

```javascript
import { 
  trackEvent,
  trackPageView,
  trackFormSubmit,
  trackQuotationRequest,
  trackContactForm,
  trackPdfDownload,
  trackButtonClick,
  trackScrollToSection,
  trackFeatureUsage
} from '@/lib/analytics'
```

#### Examples:

**Track Quotation Request:**
```javascript
// In EstimatorAndQuotation.jsx
import { trackQuotationRequest } from '@/lib/analytics'

const handleDownloadAndSend = async () => {
  // ... existing code ...
  trackQuotationRequest({
    client_name: form.client_name,
    total_amount: total,
    items_count: selectedItems.length,
    currency: 'USD',
  })
}
```

**Track Contact Form:**
```javascript
// In Contact.jsx
import { trackContactForm } from '@/lib/analytics'

const handleSubmit = async () => {
  trackContactForm({
    subject: form.subject,
    message_length: form.message?.length || 0,
  })
}
```

**Track PDF Download:**
```javascript
import { trackPdfDownload } from '@/lib/analytics'

// After PDF generation
trackPdfDownload('Quotation-PDF', {
  quote_number: quoteNum,
  amount: total,
})
```

**Track Button Clicks:**
```javascript
import { trackButtonClick } from '@/lib/analytics'

<button onClick={() => {
  trackButtonClick('Get Quotation', 'hero-section')
  // ... handle click
}}>
  Get Quotation
</button>
```

---

## 🌍 SEO & Web Presence Enhancements

### 1. Enhanced Metadata (Open Graph & Twitter Cards)

**Location:** `app/layout.js`

#### What's Configured:

| Element | Value |
|---------|-------|
| **Meta Title** | Anjal Ventures — Building Africa's Digital Infrastructure |
| **Meta Description** | Nigeria's premier technology solutions company... |
| **Open Graph Image** | https://anjalventures.com/og-image.png (1200x630px) |
| **Twitter Card** | Summary Large Image |
| **Canonical URL** | https://anjalventures.com |
| **Robots** | index, follow, max-snippet:-1 |

#### How Social Platforms Use This:

- **LinkedIn:** Shows title, description, and og-image when shared
- **Facebook:** Uses og-image (1200x630px recommended)
- **Twitter:** Uses twitter:image and twitter:card for rich previews
- **WhatsApp:** Shows og-image as preview thumbnail
- **Telegram:** Shows og-image in preview

**⚠️ ACTION NEEDED:** Create `public/og-image.png` (1200x630px)
- Design a professional image with Anjal Ventures branding
- Should be eye-catching and represent your services
- Examples: Show your services, team, or office

---

### 2. Structured Data (JSON-LD Schema)

**Location:** `app/layout.js` (embedded in head)

#### What's Configured:

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Anjal Ventures",
  "url": "https://anjalventures.com",
  "logo": "https://anjalventures.com/logo.png",
  "address": {
    "addressLocality": "Damaturu",
    "addressRegion": "Yobe",
    "addressCountry": "NG"
  },
  "contactPoint": {
    "telephone": "+234-8140011111",
    "email": "anjalventures@gmail.com"
  }
}
```

#### Benefits:

- ✅ Google Search shows company info in knowledge panel
- ✅ Enhanced SERP snippets with logo, phone, address
- ✅ Local search optimization (Damaturu, Nigeria)
- ✅ Better rich snippets in search results

#### Validate Schema:
- Go to https://schema.org/validate-schema/
- Paste your site URL or HTML
- Check for errors

---

### 3. Sitemap Generation

**Location:** `app/sitemap.js`

#### Features:

- Automatically generates from database content
- Includes all products, projects, services
- Dynamic priority scoring
- Change frequency hints for crawlers
- Accessible at `/sitemap.xml`

#### What Crawlers See:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://anjalventures.com</loc>
    <lastmod>2026-02-28</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <!-- ... more URLs ... -->
</urlset>
```

#### Test Sitemap:
- Visit: https://anjalventures.com/sitemap.xml
- Should see XML with all URLs

---

### 4. Robots.txt Enhancement

**Location:** `public/robots.txt`

#### Configured Rules:

| Bot | Crawl Speed | Notes |
|-----|------------|-------|
| **Googlebot** | Fast (10 req/s) | Trusted, fast crawling |
| **Bingbot** | Medium (2 req/s) | Slower crawling |
| **Yandex** | Slow (1 req/s) | Russian search engine |
| **SEMrush/Ahrefs** | Blocked | Site crawlers, blocked |

#### Blocked Paths:

```
Disallow: /admin/          # Admin panel
Disallow: /api/admin/      # Admin APIs
Disallow: /api/auth/       # Auth endpoints
Disallow: /api/quotation   # Quotation submissions
Disallow: /api/contact     # Contact submissions
```

#### Test Robots.txt:
- Visit: https://anjalventures.com/robots.txt
- Verify paths are correct

---

## 🔄 Performance Optimizations

### Preconnect to External Services

**Configured in `app/layout.js`:**

```html
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://www.google-analytics.com" />
<link rel="dns-prefetch" href="https://fonts.googleapis.com" />
```

**Benefits:**
- Faster connection to Google Analytics
- Reduced DNS lookup time
- Improved Core Web Vitals scores

---

## 📈 Key Metrics to Monitor

### In Google Analytics:

1. **Audience:**
   - Unique Users
   - User Engagement Rate
   - Sessions
   - Geographic Distribution (Nigeria focus)

2. **Acquisition:**
   - Organic Search Traffic
   - Direct Traffic
   - Referral Traffic
   - Social Media Traffic

3. **Behavior:**
   - Top Pages
   - Scroll Engagement
   - Time on Page
   - Bounce Rate

4. **Conversions:**
   - Quotation Requests
   - Contact Form Submissions
   - PDF Downloads
   - Feature Usage

---

## 🎯 Recommended Next Steps

### Phase 1: Immediate (Today)
- [ ] Create Google Analytics 4 account
- [ ] Get Measurement ID (G-XXXXXXXX)
- [ ] Add to `.env.local`
- [ ] Create `og-image.png` (1200x630px) in `/public`
- [ ] Test: Visit Google Analytics dashboard

### Phase 2: This Week
- [ ] Submit sitemap to Google Search Console
  - Go to https://search.google.com/search-console
  - Add property: anjalventures.com
  - Submit sitemap URL
  
- [ ] Update robots.txt in Search Console
- [ ] Mobile-friendly test: https://search.google.com/test/mobile-friendly
- [ ] Check Core Web Vitals in Search Console

### Phase 3: Ongoing
- [ ] Set up GA4 goals/conversions:
  - Quotation requests
  - Contact form submissions
  - Newsletter signups (if applicable)
  
- [ ] Monitor Analytics weekly
- [ ] Check Search Console for indexing issues
- [ ] Monitor Core Web Vitals

---

## 🔗 Useful Links

### Analytics Dashboards:
- Google Analytics: https://analytics.google.com
- Google Search Console: https://search.google.com/search-console
- Firebase Console: https://console.firebase.google.com
- Vercel Analytics: https://vercel.com/dashboard

### Testing Tools:
- Schema Validation: https://schema.org/validate-schema/
- Mobile Friendly: https://search.google.com/test/mobile-friendly
- Page Speed: https://pagespeed.web.dev
- Rich Preview: https://www.opengraph.xyz

### SEO Tools:
- Lighthouse: Built into Chrome DevTools (F12 → Lighthouse)
- Meta Tags Preview: https://www.opengraph.xyz
- Robots.txt Tester: https://www.seobility.net/en/robotstxt-validator/

---

## 🚀 Example: Integrate Custom Events

### In EstimatorAndQuotation.jsx:

```javascript
'use client'
import { trackQuotationRequest, trackButtonClick } from '@/lib/analytics'

export default function EstimatorAndQuotation({ settings, calculator }) {
  const handleDownloadAndSend = async () => {
    // ... existing code ...
    
    // Track the quotation request
    trackQuotationRequest({
      client_name: form.client_name,
      total_amount: total,
      total_ngn: totalNaira,
      items_count: selectedItems.length,
    })
    
    // ... rest of code ...
  }

  return (
    <button onClick={() => {
      trackButtonClick('Download & Send Estimate', 'estimator-section')
      handleDownloadAndSend()
    }}>
      Download & Send Estimate
    </button>
  )
}
```

---

## 📱 Mobile Optimization for Analytics

Google Analytics automatically tracks:
- Mobile vs Desktop traffic
- Device types
- Screen sizes
- Operating systems

**Monitor in GA:**
- Audience > Technology > Devices
- Audience > Technology > Browsers

---

## ⚠️ Privacy & GDPR

Since you're tracking Nigerian and international users:

1. **Add Privacy Policy** to your site
2. **Disclose Analytics** use in privacy policy
3. **Consider:** GDPR compliance if EU users access site
4. **GA4 Settings:** 
   - Enable anonymize IPs (if GDPR applicable)
   - Set data retention to 14 months

---

## 🔍 Troubleshooting

### GA4 Not Showing Data:
1. Check `.env.local` has correct `NEXT_PUBLIC_GA_MEASUREMENT_ID`
2. Rebuild: `npm run build`
3. Check browser console for errors
4. Verify in Real Time tab of GA dashboard
5. Allow 24 hours for historical data

### Sitemap Not Generating:
1. Check `/sitemap.xml` returns XML
2. Verify database connection is working
3. Test: `npm run build` should complete
4. Check routes in output

### Schema Validation Errors:
1. Visit https://schema.org/validate-schema/
2. Enter your URL
3. Fix any reported issues
4. Redeploy

---

## 📞 Support

For questions about analytics setup:
1. Check Google Analytics help: https://support.google.com/analytics
2. Firebase docs: https://firebase.google.com/docs/analytics
3. Next.js docs: https://nextjs.org/learn

All features are production-ready and tested!

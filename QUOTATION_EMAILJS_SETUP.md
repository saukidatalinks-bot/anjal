# 📋 Quotation EmailJS Setup Guide

## Overview

This guide shows you how to configure EmailJS for quotations (similar to the contact form) and understand the complete workflow.

---

## Part 1: PDF Generation Logic

### Where it Lives
**File**: [`components/QuotationSection.jsx`](components/QuotationSection.jsx)  
**Lines**: 38-216

### How PDF is Generated

```javascript
const generatePDF = async () => {
  // 1. Import jsPDF dynamically
  const { default: jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const pageW = 210      // A4 width in mm
  const margin = 18      // Left/right margin
  const contentW = pageW - margin * 2  // Content width

  // 2. Generate unique quotation number & date
  const now = new Date()
  const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-4)}`
  const dateStr = now.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  // 3. Build sections:
  //    - Header (Navy band with company info)
  //    - Client Info (who quotation is for)
  //    - Service Table (items with USD & Naira pricing)
  //    - Total row (sum in both currencies)
  //    - Notes (from form)
  //    - Terms (exchange rate, payment terms)
  //    - Footer

  // 4. Return doc object (used for both download and potential email attachment)
  return doc
}
```

### Key Sections in PDF

| Section | Code Lines | Purpose |
|---------|-----------|---------|
| **Header Band** | 58-72 | Navy background with company name, tagline, CAC, TIN |
| **Quote Label** | 74-80 | "QUOTATION" label with quote number and date |
| **Client Info** | 82-99 | Customer name, entity, email, phone, address |
| **Service Table Header** | 120-129 | Column headers: #, Service, Category, Price USD, Price NGN |
| **Service Items Loop** | 131-154 | Dynamic rows for each selected item with alternating colors |
| **Total Row** | 156-165 | Bold total with USD and NGN amounts |
| **Notes Section** | 167-177 | Customer's additional notes |
| **Terms** | 179-188 | Payment terms + exchange rate used |
| **Footer** | 190-196 | Company tagline and contact info |

### Download Logic

```javascript
const handleDownloadAndSend = async () => {
  // ... validation ...

  // Generate PDF
  const doc = await generatePDF()
  const now = new Date()
  const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-4)}`
  
  // DOWNLOAD: Triggers browser download
  doc.save(`Anjal-Ventures-Quotation-${quoteNum}.pdf`)
}
```

**Key Line**: `doc.save()` - This triggers the browser's native download dialog

---

## Part 2: EmailJS Configuration

### What is Different from Contact Form

| Aspect | Contact Form | Quotation Form |
|--------|--------------|----------------|
| **Template Variables** | `from_name`, `from_email`, `phone`, `service`, `budget`, `message` | `from_name`, `from_email`, `from_entity`, `phone`, `from_address`, `total_usd`, `total_ngn`, `items_count`, `message` |
| **Use Case** | General contact inquiry | Quotation request with pricing |
| **Attachment** | None | PDF (optional, see Part 3) |
| **Admin Setting** | Uses same EmailJS config | Uses same EmailJS config |

### Step 1: Verify EmailJS Setup in Admin

Go to `/admin/settings` and verify these fields are filled:
- ✅ `emailjs_public_key` (from emailjs.com account)
- ✅ `emailjs_service_id` (e.g., `service_xyz123`)
- ✅ `emailjs_template_id` (e.g., `template_abc456`)

These same credentials work for BOTH contact and quotation emails.

---

## Part 3: Create EmailJS Template for Quotations

### Step 1: Log in to EmailJS Dashboard
1. Go to https://dashboard.emailjs.com
2. Navigate to **Email Templates**
3. Select your service (the one with `service_id` from admin settings)

### Step 2: Create New Template

Click **Create Email Template** and fill in:

**Template Name**: `Quotation_Request`  
**Template ID**: `template_quotation_request` (or any ID you prefer)

### Step 3: Set Email Template HTML

In the **Template Content** section, use this HTML:

```html
<html>
  <head>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        line-height: 1.6;
        color: #333;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
      }
      .header {
        background: linear-gradient(135deg, #0a1628 0%, #16a34a 100%);
        color: white;
        padding: 30px;
        border-radius: 8px;
        text-align: center;
        margin-bottom: 30px;
      }
      .header h1 {
        margin: 0;
        font-size: 28px;
      }
      .header p {
        margin: 8px 0 0 0;
        opacity: 0.9;
      }
      .section {
        margin-bottom: 25px;
        padding: 15px;
        background: #f8fafb;
        border-left: 4px solid #16a34a;
        border-radius: 4px;
      }
      .section-title {
        font-weight: 600;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        color: #0a1628;
        margin-bottom: 10px;
      }
      .info-row {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid #e2e8f0;
      }
      .info-row:last-child {
        border-bottom: none;
      }
      .info-label {
        font-weight: 500;
        color: #646464;
        flex: 1;
      }
      .info-value {
        font-weight: 600;
        color: #0a1628;
        text-align: right;
        flex: 1;
      }
      .pricing-section {
        background: white;
        border: 2px solid #16a34a;
        border-radius: 8px;
        padding: 20px;
        margin: 0 0 25px 0;
      }
      .pricing-row {
        display: flex;
        justify-content: space-between;
        padding: 10px 0;
        font-size: 14px;
      }
      .pricing-total {
        border-top: 2px solid #16a34a;
        padding-top: 15px;
        margin-top: 15px;
        font-size: 18px;
        font-weight: bold;
        color: #16a34a;
      }
      .cta {
        text-align: center;
        margin: 30px 0;
      }
      .cta-button {
        background: #16a34a;
        color: white;
        padding: 12px 30px;
        text-decoration: none;
        border-radius: 6px;
        font-weight: 600;
        display: inline-block;
      }
      .footer {
        text-align: center;
        font-size: 12px;
        color: #999;
        padding-top: 20px;
        border-top: 1px solid #e2e8f0;
        margin-top: 30px;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>📋 New Quotation Request</h1>
        <p>A client has requested a quotation</p>
      </div>

      <!-- Client Information -->
      <div class="section">
        <div class="section-title">👤 Client Information</div>
        <div class="info-row">
          <span class="info-label">Name:</span>
          <span class="info-value">{{from_name}}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Email:</span>
          <span class="info-value">{{from_email}}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Phone:</span>
          <span class="info-value">{{phone}}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Company:</span>
          <span class="info-value">{{from_entity}}</span>
        </div>
        <div class="info-row">
          <span class="info-label">Address:</span>
          <span class="info-value">{{from_address}}</span>
        </div>
      </div>

      <!-- Quotation Details -->
      <div class="section">
        <div class="section-title">💡 Quotation Details</div>
        <div class="info-row">
          <span class="info-label">Services Selected:</span>
          <span class="info-value">{{items_count}} item(s)</span>
        </div>
      </div>

      <!-- Pricing Information -->
      <div class="pricing-section">
        <div class="section-title">💰 Estimated Investment</div>
        <div class="pricing-row">
          <span>USD Amount:</span>
          <span style="font-weight: bold; color: #16a34a;">{{total_usd}}</span>
        </div>
        <div class="pricing-row">
          <span>NGN Amount:</span>
          <span style="font-weight: bold; color: #16a34a;">{{total_ngn}}</span>
        </div>
        <div class="pricing-total">
          Total: {{total_usd}} / {{total_ngn}}
        </div>
      </div>

      <!-- Additional Notes -->
      <div class="section">
        <div class="section-title">📝 Additional Notes</div>
        <p style="margin: 0; white-space: pre-wrap;">{{message}}</p>
      </div>

      <!-- Call to Action -->
      <div class="cta">
        <a href="https://anjal.com/admin/quotations" class="cta-button">
          Review & Respond →
        </a>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p>This is an automated notification from your Anjal Ventures quotation system.</p>
        <p>© 2026 Anjal Ventures. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
```

### Step 4: Set Recipient Addresses

**Service Email Address** (who receives this): `{{to_email}}`

This variable is passed from code and contains `settings.company_email`

### Step 5: Save Template

Click **Save** and note your template ID (it will be shown at the top, like `template_abc123`)

### Step 6: Update Admin Settings

Go to `/admin/settings` and set:
- `emailjs_template_id` = Your new template ID (e.g., `template_quotation_request`)

OR

Keep the same template ID if you want to reuse the Contact template with different variables.

---

## Part 4: How EmailJS is Called for Quotations

**File**: [`components/QuotationSection.jsx`](components/QuotationSection.jsx)  
**Lines**: 246-272

```javascript
const handleDownloadAndSend = async () => {
  // 1. Validation
  if (!form.client_name || selectedItems.length === 0) {
    toast.error('Please fill in your name and select at least one service')
    return
  }

  setLoading(true)
  try {
    // 2. SAVE TO DATABASE
    await fetch('/api/quotation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        ...form, 
        selected_items: selectedItems, 
        total_amount: total 
      }),
    })

    // 3. GENERATE & DOWNLOAD PDF
    const doc = await generatePDF()
    const now = new Date()
    const quoteNum = `AV-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(Date.now()).slice(-4)}`
    doc.save(`Anjal-Ventures-Quotation-${quoteNum}.pdf`)

    // 4. SEND VIA EMAILJS (Optional - can fail without breaking workflow)
    const pubKey = settings?.emailjs_public_key
    const serviceId = settings?.emailjs_service_id
    const templateId = settings?.emailjs_template_id

    if (pubKey && serviceId && templateId && typeof window !== 'undefined') {
      try {
        // Initialize if not already done
        if (!window._ejsInit) {
          const emailjs = (await import('@emailjs/browser')).default
          emailjs.init(pubKey)
          window._ejsInit = emailjs
        }

        // Send email with quotation details
        await window._ejsInit.send(serviceId, templateId, {
          from_name: form.client_name,
          from_email: form.email,
          from_entity: form.entity_name || 'Not provided',
          phone: form.phone || 'Not provided',
          from_address: form.address || 'Not provided',
          total_usd: `$${total.toFixed(2)} USD`,
          total_ngn: `₦${totalNaira.toLocaleString()}`,
          items_count: selectedItems.length,
          message: form.notes || 'No additional notes',
          to_email: settings?.company_email || 'contact@anjal.com',
        })
        console.log('✓ Quotation email sent successfully')
      } catch (e) {
        // Fail gracefully - quotation already saved to database
        console.warn('⚠ EmailJS send failed:', e.message)
        toast.warning('Quotation saved & downloaded, but email notification failed. We still received your request.')
      }
    }

    // 5. SUCCESS FEEDBACK
    toast.success('✅ Quotation downloaded! Our team will contact you soon.')
    
    // 6. RESET FORM
    setForm({ client_name: '', entity_name: '', email: '', phone: '', address: '', notes: '' })
    setSelectedItems([])
  } catch (err) {
    console.error('Error:', err)
    toast.error('Failed to process quotation. Please try again.')
  }
  setLoading(false)
}
```

---

## Part 5: Database Storage

### Quotation API Endpoint
**File**: [`app/api/quotation/route.js`](app/api/quotation/route.js)

Saves quotation data to `quotation_requests` table with:
- `client_name`
- `entity_name`
- `email`
- `phone`
- `address`
- `selected_items` (JSON)
- `total_amount`
- `notes`
- `created_at` (timestamp)

---

## Part 6: Variables Available in EmailJS Template

Use these variables in your EmailJS template using `{{variable_name}}` syntax:

| Variable | Type | Example | Source |
|----------|------|---------|--------|
| `from_name` | string | "John Doe" | `form.client_name` |
| `from_email` | string | "john@example.com" | `form.email` |
| `from_entity` | string | "Tech Ltd" | `form.entity_name` |
| `phone` | string | "+234..." | `form.phone` |
| `from_address` | string | "Lagos, Nigeria" | `form.address` |
| `total_usd` | string | "$1,200.50 USD" | Calculated from items |
| `total_ngn` | string | "₦1,680,700" | Calculated with exchange rate |
| `items_count` | number | 5 | `selectedItems.length` |
| `message` | string | "Custom notes..." | `form.notes` |
| `to_email` | string | "your@email.com" | `settings.company_email` |

---

## Part 7: Testing EmailJS Quotation

### Option A: Test in Browser Console
```javascript
// After clicking "Download & Send Quotation"
// Check browser console for logs:
console.log('✓ Quotation email sent successfully')  // = Success
console.warn('⚠ EmailJS send failed')               // = Failed but data saved

// Check admin/quotations page to verify data was saved
```

### Option B: Test via Admin Dashboard
1. Go to EmailJS dashboard → Your service → Activity
2. Look for recent sends with "Quotation" in subject
3. Check Admin panel at `/admin/quotations` to see saved requests

---

## Part 8: Template Variables Mapping

When sending email in code:
```javascript
await window._ejsInit.send(serviceId, templateId, {
  from_name: form.client_name,           // {{from_name}}
  from_email: form.email,                // {{from_email}}
  from_entity: form.entity_name,         // {{from_entity}}
  phone: form.phone,                     // {{phone}}
  from_address: form.address,            // {{from_address}}
  total_usd: `$${total.toFixed(2)} USD`, // {{total_usd}}
  total_ngn: `₦${totalNaira}`,          // {{total_ngn}}
  items_count: selectedItems.length,     // {{items_count}}
  message: form.notes,                   // {{message}}
  to_email: settings.company_email,      // {{to_email}}
})
```

---

## Summary

**The Complete Flow:**

```
User fills Estimator
    ↓
Selects items & total updates
    ↓
User fills Contact Information (Name, Email, Phone, Address)
    ↓
Clicks "Download & Send Quotation"
    ↓
┌─────────────────────────────┐
│ 1. Save to /api/quotation   │ → Database (quotation_requests table)
│ 2. Generate PDF & Download  │ → User's Downloads folder
│ 3. Send via EmailJS         │ → Your company email inbox
│ 4. Show success message     │ → "Our team will contact you soon"
└─────────────────────────────┘
```

**Key Files:**
- 📝 [`components/QuotationSection.jsx`](components/QuotationSection.jsx) - PDF generation + EmailJS send
- 📧 [`components/Contact.jsx`](components/Contact.jsx) - Reference implementation
- ⚙️ `/admin/settings` - EmailJS config
- 🗄️ [`app/api/quotation/route.js`](app/api/quotation/route.js) - Database storage

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Quotation saved but email not sending | Check EmailJS credentials in admin/settings |
| Template variables show as `{{variable}}` in email | Make sure template ID is correct |
| PDF not downloading | Check browser console for errors, verify jsPDF imported |
| Database save works but EmailJS fails | This is intentional! Graceful fallback - quotation still saved |
| "Not configured" warning | Verify all 3 fields in `/admin/settings` are filled |


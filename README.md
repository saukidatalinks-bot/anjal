# Anjal Ventures — Full-Stack Next.js Website

> **Premium corporate website with full admin panel, Neon PostgreSQL database, Vercel Blob image storage, PDF quotation generator, and EmailJS contact form integration.**

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
```bash
cp .env.local.example .env.local
```
Then edit `.env.local` and fill in all values (see section below).

### 3. Initialize Database
```bash
npm run db:init
```

### 4. Add Your Logo
Place your logo file at: `public/logo.png`  
(The site uses it in the navbar, admin panel, and quotation PDFs)

### 5. Start Development Server
```bash
npm run dev
```

Visit:
- 🌐 **Website:** http://localhost:3000
- 🔐 **Admin Panel:** http://localhost:3000/admin/login

---

## 🌿 Environment Variables

Edit `.env.local` with your actual values:

| Variable | Description | Where to Get |
|---|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string | [neon.tech](https://neon.tech) → Create Project |
| `ADMIN_PASSWORD` | Your admin panel password | Choose any strong password |
| `JWT_SECRET` | 64+ char random string for JWT tokens | Run: `openssl rand -base64 64` |
| `NEXT_PUBLIC_APP_URL` | Your deployment URL | e.g. `https://anjal.vercel.app` |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob storage token | Vercel Dashboard → Storage → Blob |
| `NEXT_PUBLIC_EMAILJS_*` | EmailJS keys (optional, set via Admin) | [emailjs.com](https://emailjs.com) |

---

## ☁️ Deploy to Vercel (Production)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit: Anjal Ventures website"
git remote add origin https://github.com/YOUR_USERNAME/anjal-ventures.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to [vercel.com](https://vercel.com) → New Project
2. Import your GitHub repository
3. Framework: **Next.js** (auto-detected)

### Step 3: Add Environment Variables
In Vercel project settings → Environment Variables, add:
- `DATABASE_URL` — your Neon connection string
- `ADMIN_PASSWORD` — your chosen admin password
- `JWT_SECRET` — a long random secret
- `NEXT_PUBLIC_APP_URL` — your Vercel URL

### Step 4: Add Vercel Blob Storage
1. In Vercel Dashboard → Storage → Create → **Blob**
2. Connect it to your project
3. `BLOB_READ_WRITE_TOKEN` is set automatically

### Step 5: Set Up Neon Database
1. Go to [neon.tech](https://neon.tech) → Create a free project
2. Copy the **Connection String** (postgresql://...)
3. Add it as `DATABASE_URL` in Vercel environment variables
4. Tables are created automatically on first admin login

### Step 6: Deploy
```bash
vercel --prod
```
Or just push to main — Vercel auto-deploys.

---

## 🔐 Admin Panel Guide

**URL:** `/admin/login`  
**Password:** Value of `ADMIN_PASSWORD` environment variable

### What You Can Control from Admin:

| Section | What You Can Do |
|---|---|
| **Projects** | Add/Edit/Delete portfolio projects with image upload, emoji, banner color, tags, URL, status |
| **Services** | Add/Edit/Delete service cards shown on homepage and in contact form dropdown |
| **Pricing Plans** | Add/Edit/Delete pricing tiers, features, CTAs, featured status |
| **Calculator Items** | Full CRUD over every project type, scale, timeline, support & add-on item with prices |
| **Contact Messages** | View/Read/Delete all contact form submissions, reply via email or WhatsApp |
| **Quotations** | View all PDF quotation requests with full item breakdowns |
| **Site Settings** | Company name, emails, WhatsApp number, address, registration details, hero text, stats, EmailJS config |

---

## 📋 Quotation PDF System

The quotation section on the homepage allows clients to:
1. Enter their name, company, email, phone, address
2. Select services from the calculator inventory
3. Add custom line items
4. Download a **branded PDF quotation** instantly (generated client-side with jsPDF)
5. The request is also saved to the database (visible in Admin → Quotations)

---

## 📧 EmailJS Setup (Contact Form → Gmail)

1. Create a free account at [emailjs.com](https://emailjs.com)
2. Add an Email Service → connect your Gmail
3. Create a Template with these variables:
   - `{{from_name}}` — sender name
   - `{{from_email}}` — sender email
   - `{{phone}}` — phone number
   - `{{service}}` — selected service
   - `{{budget}}` — budget range
   - `{{message}}` — message content
4. In Admin → Site Settings → EmailJS Configuration, enter:
   - Public Key
   - Service ID
   - Template ID
5. Save — contact form now delivers to your Gmail

---

## 🖼️ Logo

Place your company logo at `public/logo.png`.  
It will appear in:
- Website navbar
- Admin panel sidebar  
- Downloaded quotation PDFs

Recommended: transparent background PNG, at least 200×200px.

---

## 📁 Project Structure

```
anjal-ventures/
├── app/
│   ├── page.js                    # Main homepage (server component)
│   ├── layout.js                  # Root layout with fonts
│   ├── globals.css                # Tailwind + custom styles
│   ├── admin/
│   │   ├── login/page.js          # Admin login
│   │   ├── page.js                # Admin dashboard
│   │   ├── projects/page.js       # Portfolio CRUD
│   │   ├── services/page.js       # Services CRUD
│   │   ├── pricing/page.js        # Pricing plans CRUD
│   │   ├── calculator/page.js     # Calculator items CRUD
│   │   ├── contacts/page.js       # Contact messages viewer
│   │   ├── quotations/page.js     # Quotation requests viewer
│   │   └── settings/page.js       # All site settings
│   └── api/
│       ├── auth/login/route.js    # Admin login API
│       ├── auth/logout/route.js   # Admin logout API
│       ├── public/data/route.js   # Public site data
│       ├── contact/route.js       # Contact form submission
│       ├── quotation/route.js     # Quotation save
│       └── admin/
│           ├── projects/          # Projects CRUD API
│           ├── services/          # Services CRUD API
│           ├── pricing/           # Pricing CRUD API
│           ├── calculator/        # Calculator CRUD API
│           ├── contacts/          # Messages API
│           ├── quotations/        # Quotations API
│           ├── settings/          # Settings API
│           └── upload/            # Image upload → Vercel Blob
├── components/
│   ├── Navbar.jsx
│   ├── Hero.jsx
│   ├── MarqueeBanner.jsx
│   ├── About.jsx
│   ├── Services.jsx
│   ├── Portfolio.jsx
│   ├── Pricing.jsx
│   ├── Calculator.jsx
│   ├── QuotationSection.jsx
│   ├── Contact.jsx
│   ├── Footer.jsx
│   └── AdminSidebar.jsx
├── lib/
│   ├── db.js                      # Neon database + schema + seed
│   └── auth.js                    # JWT auth utilities
├── middleware.js                  # Route protection for /admin
├── scripts/
│   └── db-init.js                 # Database initialization script
├── public/
│   └── logo.png                   # ← ADD YOUR LOGO HERE
├── .env.local.example             # Environment variables template
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## 🛟 Troubleshooting

**"DATABASE_URL not set" error**  
→ Make sure `.env.local` exists and has the correct Neon connection string.

**Admin login fails**  
→ Check `ADMIN_PASSWORD` in `.env.local` matches what you're typing.

**Images not uploading**  
→ Add Vercel Blob storage to your Vercel project and ensure `BLOB_READ_WRITE_TOKEN` is set.

**Contact form not sending emails**  
→ Configure EmailJS in Admin → Site Settings. Messages are always saved to the database regardless.

**Build errors**  
→ Run `npm install` to ensure all dependencies are installed, then `npm run build`.

---

## 📞 Support

Built by **Anjal Ventures** — [anjalventures@gmail.com](mailto:anjalventures@gmail.com)

CAC Registered · BN 9258709 · Damaturu, Yobe State, Nigeria

# Vaswani Industries Limited — Website & CMS Platform

## Project Documentation

**Prepared for:** Vaswani Industries Limited  
**Document Version:** 1.0  
**Date:** May 19, 2026  
**Confidential — For Internal Use Only**

---

## 1. Executive Summary

This document presents the complete technical and functional overview of the Vaswani Industries Limited corporate website and Content Management System (CMS). The platform is a unified, modern web application built to serve both the public-facing corporate website and the internal admin management panel on a single deployment.

**Key Highlights:**
- Single unified deployment (website + admin + API on one server)
- Real-time content management without developer intervention
- Mobile-responsive design for all devices
- SEO-optimized for search engine visibility
- Secure admin panel with JWT authentication
- Hostinger VPS ready for production deployment
- Domain: https://www.vaswaniindustries.com

---

## 2. Technology Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Frontend | Next.js 16 (React) | Server-side rendered website |
| Styling | Tailwind CSS 3.4 | Responsive, modern UI |
| Backend API | Express.js 4.19 | REST API for all operations |
| Database | MongoDB Atlas | Cloud-hosted data storage |
| Authentication | JWT (JSON Web Tokens) | Secure admin access |
| File Storage | Local (public/uploads/) | PDFs, images |
| Animations | Framer Motion | Smooth page transitions |
| Icons | Lucide React | Consistent icon system |
| Hosting | Hostinger VPS | Production server |

---

## 3. Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  SINGLE SERVER (Port 3001)           │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────┐ │
│  │   Website    │  │  Admin CMS   │  │  REST    │ │
│  │  (Public)    │  │  (Protected) │  │  API     │ │
│  │              │  │              │  │          │ │
│  │  Next.js     │  │  Next.js     │  │ Express  │ │
│  │  Pages       │  │  Pages       │  │ Routes   │ │
│  └──────────────┘  └──────────────┘  └──────────┘ │
│                                                     │
├─────────────────────────────────────────────────────┤
│              MongoDB Atlas (Cloud Database)          │
└─────────────────────────────────────────────────────┘
```

---

## 4. Website Pages (Public)

### 4.1 Homepage
- Hero banner with dynamic content from CMS
- About section with company overview
- Products showcase (Sponge Iron, Billets, Power)
- Latest news slider
- Call-to-action buttons

### 4.2 About Us Section
| Page | URL | Description |
|------|-----|-------------|
| The Company | /about/the-company | Company overview, culture, stats |
| Vision & Mission | /about/the-company#vision | Dynamic from admin CMS |
| Chairman's Message | /about/chairmans-message | Leadership message |
| Board of Directors | /about/board-of-directors | Board member profiles |
| Committees | /about/committees | Committee structure |
| Familiarization Programme | /about/familiarization-programme | Director training |

### 4.3 Products Section
| Page | URL | Description |
|------|-----|-------------|
| Forging Ingots & Billets | /products/forging-ingots-and-billets | Specifications, sizes |
| Sponge Iron (DRI) | /products/sponge-iron | Process, chemical reactions |
| Power Generation | /products/power | Thermal + Solar energy |

### 4.4 Investors Section
| Page | URL | Description |
|------|-----|-------------|
| Financials | /investors/financials | Annual reports, quarterly results |
| Disclosures | /investors/disclosures | Corporate governance, returns |
| Listing Information | /investors/listing-information | BSE listing details |
| Policies | /investors/policies | Company policies |
| SEBI Disclosure | /investors/sebi-disclosure | Regulatory filings |
| Others | /investors/others | Miscellaneous documents |

### 4.5 Other Pages
| Page | URL | Description |
|------|-----|-------------|
| News & Media | /news | CSR activities, announcements |
| Careers | /careers | Job listings, applications |
| Contact | /contact | Contact form, office addresses, map |

---

## 5. Admin CMS Panel

**Access URL:** https://www.vaswaniindustries.com/admin  
**Authentication:** Email + Password (JWT secured)

### 5.1 Dashboard Overview
- Quick stats: Documents, News, Board Members, Products, Jobs, Contacts
- Unread notification count
- Quick action buttons

### 5.2 Admin Modules

| Module | Path | Capabilities |
|--------|------|-------------|
| **Pages** | /admin/pages | Edit all website page content (hero banners, sections, images, buttons) |
| **Documents** | /admin/documents | Upload/manage PDFs (financials, disclosures, policies) |
| **News & Media** | /admin/news | Create/edit/delete news articles with images |
| **Board Members** | /admin/board-members | Manage director profiles and committees |
| **Products** | /admin/products | Add/edit/delete product listings |
| **Careers** | /admin/careers | Post jobs, view applications |
| **Contact Cards** | /admin/contact-cards | Manage office contact information |
| **Contacts (Inbox)** | /admin/contacts | View website enquiries, mark read, reply |
| **Notifications** | /admin/notifications | System alerts for all activities |
| **System Settings** | /admin/settings | Site name, phone, email, social links |

### 5.3 Page Content Editor
The CMS allows editing every section of every page:
- **Mini Title** — Small tag above heading
- **Main Title** — Section heading
- **Subtitle** — Supporting text
- **Paragraph** — Body content
- **Images** — Upload multiple, auto-carousel
- **Buttons** — CTA with URL, style, new tab option
- **Visibility** — Show/hide sections

---

## 6. Document Management System

### 6.1 Categories
Documents are organized in a structured folder hierarchy:

```
uploads/documents/
├── financials_annual_reports/
├── financials_quarterly_results/
├── financials_related_party/
├── disclosures_annual_return/
├── disclosures_secretarial/
├── disclosures_corporate_governance/
├── disclosures_general_meetings/
├── disclosures_newspaper/
├── disclosures_others/
├── disclosures_share_capital/
├── disclosures_shareholding/
├── listing_information/
├── policies/
├── sebi_disclosure/
└── others/
```

### 6.2 Features
- Category-wise folder storage
- Year and quarter tagging
- Unique ID-based file naming (no conflicts)
- Download count tracking
- Active/inactive toggle
- Search and filter

---

## 7. Notification System

All important actions trigger admin notifications:

| Event | Notification |
|-------|-------------|
| New contact form submission | "Contact: [Name]" |
| New job application | "New application for [Job Title]" |
| Page content updated | "Page content updated: [Section]" |
| News article published | "News published: [Title]" |
| Document uploaded | "Document uploaded: [Title]" |
| Product added | "Product added: [Name]" |

---

## 8. Security Features

| Feature | Implementation |
|---------|---------------|
| Authentication | JWT tokens with 7-day expiry |
| Password Storage | bcrypt hashing |
| API Protection | Admin routes require valid token |
| Rate Limiting | express-rate-limit on sensitive endpoints |
| Helmet | HTTP security headers |
| CORS | Configured for same-origin |
| Input Validation | Required fields enforced |
| File Validation | PDF-only for documents, images-only for media |
| Auto-logout | 401 response triggers client-side logout |

---

## 9. SEO & Performance

| Feature | Status |
|---------|--------|
| Server-Side Rendering | ✅ All pages SSR for SEO |
| Meta Tags | ✅ Title, description, canonical on every page |
| Open Graph | ✅ Social media sharing optimized |
| Sitemap-ready | ✅ Clean URL structure |
| Image Optimization | ✅ Unoptimized mode (Hostinger compatible) |
| Responsive Design | ✅ Mobile, tablet, desktop |
| Fast Loading | ✅ Tailwind CSS (minimal bundle) |

---

## 10. Responsive Design

The website is fully responsive across all devices:

| Breakpoint | Screen Size | Layout |
|-----------|-------------|--------|
| Mobile | < 640px | Single column, hamburger menu |
| Tablet | 640px - 1024px | 2-column grids |
| Desktop | > 1024px | Full layout with sidebars |

**Key responsive features:**
- Mobile hamburger menu with slide-in drawer
- Collapsible sidebar navigation
- Responsive data tables
- Touch-friendly buttons and interactions
- Admin panel adapts to mobile screens

---

## 11. API Reference

### Public Endpoints (No Auth Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Server health check |
| GET | /api/pages/:pageKey | Get page content |
| GET | /api/news | List all news |
| GET | /api/news/:slug | Single news article |
| GET | /api/products | List active products |
| GET | /api/products/:slug | Single product |
| GET | /api/board-members | List board members |
| GET | /api/careers | List active jobs |
| GET | /api/documents | List active documents |
| GET | /api/documents/by-category | Documents grouped |
| GET | /api/settings | Site settings |
| GET | /api/contact-cards | Office contact info |
| POST | /api/contacts | Submit contact form |
| POST | /api/careers/:id/apply | Submit job application |

### Admin Endpoints (JWT Required)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/login | Admin login |
| GET | /api/notifications | List notifications |
| PUT | /api/notifications/read-all | Mark all read |
| PUT | /api/pages/:key/section/:section | Update page section |
| POST | /api/documents | Upload PDF |
| PUT | /api/documents/:id | Update document meta |
| DELETE | /api/documents/:id | Delete document |
| POST | /api/news | Create news |
| PUT | /api/news/:id | Update news |
| DELETE | /api/news/:id | Delete news |
| POST | /api/products | Create product |
| PUT | /api/products/:id | Update product |
| DELETE | /api/products/:id | Delete product |
| GET | /api/contacts | List enquiries |
| PUT | /api/contacts/:id/read | Mark as read |
| DELETE | /api/contacts/:id | Delete enquiry |

---

## 12. Deployment Guide (Hostinger VPS)

### Prerequisites
- Hostinger VPS with Node.js 18+ support
- MongoDB Atlas connection (already configured)
- Domain: www.vaswaniindustries.com pointed to VPS IP

### Deployment Steps

```
1. Upload project files to VPS (via Git or SFTP)
2. Rename .env.production → .env
3. Install dependencies:
   npm install --production
4. Build the application:
   npm run build
5. Start with PM2 (process manager):
   pm2 start server.js --name vaswani
6. Configure Nginx reverse proxy:
   proxy_pass http://localhost:3001
7. Enable SSL via Hostinger panel
8. Verify: https://www.vaswaniindustries.com
```

### Environment Variables (Production)

| Variable | Value |
|----------|-------|
| PORT | 3001 |
| NODE_ENV | production |
| MONGO_URI | mongodb+srv://... (Atlas) |
| JWT_SECRET | [secure random string] |
| NEXT_PUBLIC_API_URL | https://www.vaswaniindustries.com/api |
| NEXT_PUBLIC_BACKEND_URL | https://www.vaswaniindustries.com |
| NEXT_PUBLIC_SITE_URL | https://www.vaswaniindustries.com |
| BACKEND_URL | https://www.vaswaniindustries.com |

---

## 13. Maintenance & Support

### Regular Tasks
- Monitor server health via /api/health
- Check notification panel for new enquiries
- Upload quarterly financial documents
- Update news/CSR activities
- Review and respond to contact form submissions

### Backup Strategy
- MongoDB Atlas provides automatic daily backups
- Uploaded files stored in /public/uploads/ (backup periodically)

### Updating Content
All content updates can be done through the admin panel without any developer involvement:
- Edit page text, images, buttons
- Upload/manage documents
- Publish news articles
- Manage board member profiles
- Post job openings

---

## 14. Project Statistics

| Metric | Value |
|--------|-------|
| Total Pages | 30 (18 public + 12 admin) |
| API Endpoints | 30+ |
| Database Models | 8 (User, News, Product, Document, Contact, PageContent, Notification, Settings) |
| Production Dependencies | 18 packages |
| Build Time | ~30 seconds |
| Server Start Time | ~3 seconds |

---

## 15. Contact & Support

**Developer Contact:** [Your Contact Info]  
**Hosting:** Hostinger VPS  
**Domain Registrar:** [Domain Provider]  
**Database:** MongoDB Atlas (Cloud)

---

*This document is confidential and intended for Vaswani Industries Limited management only.*

**© 2026 Vaswani Industries Limited. All Rights Reserved.**

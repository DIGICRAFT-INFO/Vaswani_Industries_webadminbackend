# Vaswani Industries — Complete Project Documentation

> **Single Source of Truth** for the Vaswani Industries Limited corporate website.
> Domain: https://www.vaswaniindustries.com

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Folder Structure](#2-folder-structure)
3. [Environment Variables](#3-environment-variables)
4. [API Routes](#4-api-routes)
5. [Frontend Pages](#5-frontend-pages)
6. [Database Models](#6-database-models)
7. [Authentication System](#7-authentication-system)
8. [File Upload System](#8-file-upload-system)
9. [Deployment Guide (Hostinger)](#9-deployment-guide-hostinger)
10. [Admin Panel](#10-admin-panel)
11. [Important URLs (Post-Deploy)](#11-important-urls-post-deploy)

---

## 1. Project Overview

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Runtime | Node.js |
| Database | MongoDB Atlas (Mongoose ODM) |
| Styling | Tailwind CSS 3.4 |
| Animation | Framer Motion 12 |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| HTTP Client | Axios |
| Icons | Lucide React |
| Slugs | slugify |
| Hosting | Hostinger (Node.js hosting) |

### Architecture

- **Pure Next.js** — No Express server. All backend logic runs via Next.js API Routes (`app/api/`).
- **Unified deployment** — Frontend and API on the same port/origin.
- **MongoDB Atlas** — Cloud database with replica set.
- **Local file storage** — Images and PDFs stored in `public/uploads/` and `public/investor/`.
- **JWT Authentication** — Bearer token in Authorization header.

---

## 2. Folder Structure

```
vaswani/
├── app/
│   ├── layout.js                    # Root layout (WebsiteShell)
│   ├── page.js                      # Homepage
│   ├── globals.css                  # Tailwind + global styles
│   ├── about/                       # Public: About pages
│   │   ├── the-company/page.js
│   │   ├── chairmans-message/page.js
│   │   ├── board-of-directors/page.js
│   │   ├── committees/page.js
│   │   └── familiarization-programme/page.js
│   ├── products/                    # Public: Product pages
│   │   ├── sponge-iron/page.js
│   │   ├── forging-ingots-and-billets/page.js
│   │   └── power/page.js
│   ├── investors/                   # Public: Investor relations
│   │   ├── financials/page.js
│   │   ├── disclosures/page.js
│   │   ├── listing-information/page.js
│   │   ├── policies/page.js
│   │   ├── sebi-disclosure/page.js
│   │   ├── others/page.js
│   │   └── documents/[slug]/page.js
│   ├── news/                        # Public: News listing & detail
│   │   ├── page.js
│   │   └── [slug]/page.js
│   ├── careers/page.js              # Public: Careers page
│   ├── contact/page.js              # Public: Contact page
│   ├── admin/                       # Admin panel
│   │   ├── layout.js                # Admin root layout (AuthProvider)
│   │   ├── login/page.js            # Login page
│   │   └── (dashboard)/             # Protected dashboard (route group)
│   │       ├── layout.js            # Dashboard sidebar layout
│   │       ├── page.js              # Dashboard home
│   │       ├── news/page.js
│   │       ├── documents/page.js
│   │       ├── products/page.js
│   │       ├── board-members/page.js
│   │       ├── careers/page.js
│   │       ├── contacts/page.js
│   │       ├── contact-cards/page.js
│   │       ├── notifications/page.js
│   │       ├── pages/page.js
│   │       ├── pages/[pageKey]/page.js
│   │       └── settings/page.js
│   └── api/                         # API Routes (see Section 4)
│       ├── auth/
│       ├── documents/
│       ├── news/
│       ├── board-members/
│       ├── careers/
│       ├── contacts/
│       ├── products/
│       ├── settings/
│       ├── pages/
│       ├── notifications/
│       ├── contact-cards/
│       ├── health/
│       └── investor-files/
├── components/
│   ├── Navbar.js                    # Main navigation bar
│   ├── Footer.js                    # Site footer
│   ├── Topbar.js                    # Top info bar
│   ├── WebsiteShell.js              # Wraps Topbar + Navbar + Footer
│   ├── HomepageClient.js            # Homepage client component
│   ├── DynamicHero.js               # Dynamic hero banner
│   ├── PageBanner.js                # Page header banner
│   ├── InvestorSidebar.js           # Investor section sidebar
│   ├── InvestorDocList.js           # Document listing component
│   ├── ProductSidebar.js            # Product section sidebar
│   └── admin/                       # Admin-specific components
├── lib/
│   ├── db.js                        # MongoDB connection (cached)
│   ├── auth.js                      # JWT auth helpers (server-side)
│   ├── AuthContext.js               # React context for admin auth
│   ├── upload.js                    # File upload/delete utilities
│   ├── api.js                       # Public API client (axios)
│   ├── admin-api.js                 # Admin API client (with JWT interceptor)
│   └── page-defaults.js             # Default page content seeds
├── models/
│   ├── index.js                     # News, BoardMember, Career, Contact, Product, Settings
│   ├── User.js                      # User model (admin/superadmin)
│   ├── Document.js                  # Investor document model
│   ├── Notification.js              # Notification model
│   ├── PageContent.js               # CMS page content model
│   └── ContactCard.js               # Contact info cards model
├── public/
│   ├── uploads/                     # Uploaded files (images, documents)
│   │   ├── images/                  # News, product, board member images
│   │   └── documents/               # Uploaded PDFs
│   └── investor/                    # Static investor PDFs (pre-loaded)
│       ├── financials/
│       ├── disclosures/
│       ├── policies/
│       ├── listing-information/
│       └── ...
├── package.json
├── next.config.js
├── tailwind.config.js
├── .env                             # Local development env
├── .env.production                  # Production env
└── DOCUMENTATION.md                 # This file
```

---

## 3. Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` |
| `MONGO_URI` | MongoDB Atlas connection string | `mongodb://***:***@cluster.mongodb.net/vaswani_db?ssl=true&...` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `vaswani_super_secret_key_***` |
| `JWT_EXPIRE` | Token expiration duration | `7d` |
| `NEXT_PUBLIC_API_URL` | API base URL (relative) | `/api` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend base URL (empty for same-origin) | `` (empty) |
| `NEXT_PUBLIC_SITE_URL` | Full site URL | `https://www.vaswaniindustries.com` |
| `BACKEND_URL` | Server-side backend URL | `https://www.vaswaniindustries.com` |
| `STORAGE_MODE` | File storage mode | `local` |
| `MAX_IMAGE_SIZE_MB` | Max image upload size | `10` |
| `MAX_PDF_SIZE_MB` | Max PDF upload size | `50` |

> **Note:** `NEXT_PUBLIC_BACKEND_URL` is intentionally empty in production because the API and frontend run on the same origin.

---

## 4. API Routes

All routes are prefixed with `/api`. Responses follow the format:
```json
{ "success": true|false, "message": "...", "data": {...} }
```

### 4.1 Auth (`/api/auth/*`)

#### POST `/api/auth/login`
- **Auth:** Public
- **Body:** `{ "email": "string", "password": "string" }`
- **Response:** `{ success, token, user: { id, name, email, role, avatar } }`
- **Example:**
```json
POST /api/auth/login
{ "email": "admin@vaswaniindustries.com", "password": "Admin@2026" }
```

#### GET `/api/auth/seed`
- **Auth:** Public (one-time use)
- **Description:** Creates the initial superadmin user
- **Response:** `{ success, message: "Superadmin created successfully" }`

#### GET `/api/auth/me`
- **Auth:** Admin/Superadmin (Bearer token)
- **Response:** `{ success, user }`

#### PUT `/api/auth/profile`
- **Auth:** Admin/Superadmin
- **Body:** `{ "name": "string", "email": "string", "avatar": "string" }`
- **Response:** `{ success, user }`

#### PUT `/api/auth/change-password`
- **Auth:** Admin/Superadmin
- **Body:** `{ "currentPassword": "string", "newPassword": "string" }`
- **Response:** `{ success, message }`

#### POST `/api/auth/register`
- **Auth:** Superadmin only
- **Body:** `{ "name": "string", "email": "string", "password": "string", "role": "admin|superadmin" }`
- **Response:** `{ success, user: { id, name, email, role } }`

#### GET `/api/auth/users`
- **Auth:** Superadmin only
- **Response:** `{ success, users: [...] }`

#### DELETE `/api/auth/users/[id]`
- **Auth:** Superadmin only
- **Params:** `id` — User ObjectId
- **Response:** `{ success, message }`

---

### 4.2 Documents (`/api/documents/*`)

#### GET `/api/documents`
- **Auth:** Public
- **Query Params:** `category`, `search`
- **Description:** Returns documents from MongoDB; falls back to static PDFs from `public/investor/` if none found
- **Response:** `{ success, documents: [...] }`

#### POST `/api/documents`
- **Auth:** Admin/Superadmin
- **Content-Type:** `multipart/form-data`
- **Body:** `pdf` (file), `title`, `category`, `year`, `quarter`, `description`
- **Response:** `{ success, document }`
- **Categories:** `financials_annual_reports`, `financials_quarterly_results`, `financials_related_party`, `disclosures_annual_return`, `disclosures_secretarial`, `disclosures_corporate_governance`, `disclosures_general_meetings`, `disclosures_newspaper`, `disclosures_others`, `disclosures_share_capital`, `disclosures_shareholding`, `listing_information`, `policies`, `sebi_disclosure`, `others`

#### PUT `/api/documents/[id]`
- **Auth:** Admin/Superadmin
- **Body:** `{ title, category, year, quarter, description, isActive }`
- **Response:** `{ success, document }`

#### DELETE `/api/documents/[id]`
- **Auth:** Admin/Superadmin
- **Description:** Deletes document record and associated file
- **Response:** `{ success, message }`

#### GET `/api/documents/by-category`
- **Auth:** Public
- **Description:** Returns all documents grouped by category (MongoDB + static fallback)
- **Response:** `{ success, data: { category_key: [...docs] } }`

#### GET `/api/documents/folders`
- **Auth:** Admin/Superadmin
- **Description:** Returns all documents grouped by category for admin management
- **Response:** `{ success, folders: { category: [...] } }`

#### GET `/api/documents/slug/[slug]`
- **Auth:** Public
- **Description:** Get single document by slug, increments download count
- **Response:** `{ success, document }`

#### GET `/api/documents/seed-from-files`
- **Auth:** Public (one-time use)
- **Description:** Scans `public/investor/` folders, deletes all existing documents, and re-seeds MongoDB from static PDF files
- **Response:** `{ success, message, total, perCategory: {...} }`

---

### 4.3 News (`/api/news/*`)

#### GET `/api/news`
- **Auth:** Public
- **Query Params:** `category`, `limit` (default 50), `page` (default 1)
- **Response:** `{ success, news: [...] }`

#### POST `/api/news`
- **Auth:** Admin/Superadmin
- **Content-Type:** `multipart/form-data`
- **Body:** `title`, `excerpt`, `content`, `category`, `author`, `tags` (comma-separated), `isPublished`, `image` (file)
- **Response:** `{ success, news }`

#### GET `/api/news/[idOrSlug]`
- **Auth:** Public
- **Description:** Get article by ID or slug, increments view count
- **Response:** `{ success, news }`

#### PUT `/api/news/[idOrSlug]`
- **Auth:** Admin/Superadmin
- **Content-Type:** `multipart/form-data`
- **Body:** Same as POST (partial updates allowed), `image` replaces old image
- **Response:** `{ success, news }`

#### DELETE `/api/news/[idOrSlug]`
- **Auth:** Admin/Superadmin
- **Description:** Deletes article and associated image file
- **Response:** `{ success, message }`

---

### 4.4 Board Members (`/api/board-members/*`)

#### GET `/api/board-members`
- **Auth:** Public
- **Query Params:** `admin=true` (returns all including inactive)
- **Response:** `{ success, members: [...] }`

#### POST `/api/board-members`
- **Auth:** Admin/Superadmin
- **Content-Type:** `multipart/form-data`
- **Body:** `name`, `designation`, `type`, `bio`, `facebook`, `twitter`, `linkedin`, `committees` (JSON string), `order`, `image` (file)
- **Response:** `{ success, member }`

#### PUT `/api/board-members/[id]`
- **Auth:** Admin/Superadmin
- **Content-Type:** `multipart/form-data`
- **Body:** Same as POST (partial updates), replaces old image if new one uploaded
- **Response:** `{ success, member }`

#### DELETE `/api/board-members/[id]`
- **Auth:** Admin/Superadmin
- **Description:** Deletes member and associated image
- **Response:** `{ success, message }`

#### GET `/api/board-members/committees`
- **Auth:** Public
- **Description:** Returns board members grouped by committee name
- **Response:** `{ success, data: { "Committee Name": [...members] } }`

---

### 4.5 Careers (`/api/careers/*`)

#### GET `/api/careers`
- **Auth:** Public
- **Description:** Returns active job listings (without applications)
- **Response:** `{ success, jobs: [...] }`

#### POST `/api/careers`
- **Auth:** Admin/Superadmin
- **Body:** `{ title, department, location, experience, qualification, description, responsibilities, skills, salary, lastDate, isActive }`
- **Response:** `{ success, job }`

#### GET `/api/careers/[id]`
- **Auth:** Public
- **Response:** `{ success, job }` (without applications)

#### PUT `/api/careers/[id]`
- **Auth:** Admin/Superadmin
- **Body:** Same as POST (partial updates)
- **Response:** `{ success, job }`

#### DELETE `/api/careers/[id]`
- **Auth:** Admin/Superadmin
- **Response:** `{ success, message }`

#### POST `/api/careers/[id]/apply`
- **Auth:** Public
- **Body:** `{ "name": "string", "email": "string", "phone": "string", "resumeUrl": "string", "coverLetter": "string" }`
- **Description:** Submit job application (creates notification)
- **Response:** `{ success, message: "Application submitted successfully!" }`

#### GET `/api/careers/[id]/applications`
- **Auth:** Admin/Superadmin
- **Description:** Get all applications for a specific job
- **Response:** `{ success, data: { title, applications: [...] } }`

#### GET `/api/careers/admin/all`
- **Auth:** Admin/Superadmin
- **Description:** Get all jobs (including inactive) without applications
- **Response:** `{ success, jobs: [...] }`

---

### 4.6 Contacts (`/api/contacts/*`)

#### GET `/api/contacts`
- **Auth:** Admin/Superadmin
- **Query Params:** `isRead` (true/false), `limit` (default 20), `page` (default 1)
- **Response:** `{ success, contacts, pagination: { total, unreadCount, currentPage, totalPages } }`

#### POST `/api/contacts`
- **Auth:** Public
- **Body:** `{ "name": "string", "email": "string", "phone": "string", "subject": "string", "message": "string" }`
- **Description:** Submit contact form (creates notification)
- **Response:** `{ success, message: "Your message has been sent successfully!" }`

#### PUT `/api/contacts/[id]/read`
- **Auth:** Admin/Superadmin
- **Description:** Mark contact message as read
- **Response:** `{ success, contact }`

#### DELETE `/api/contacts/[id]`
- **Auth:** Admin/Superadmin
- **Response:** `{ success, message }`

---

### 4.7 Products (`/api/products/*`)

#### GET `/api/products`
- **Auth:** Public
- **Query Params:** `admin=true` (returns all including inactive)
- **Response:** `{ success, products: [...] }`

#### POST `/api/products`
- **Auth:** Admin/Superadmin
- **Content-Type:** `multipart/form-data`
- **Body:** `name`, `tagline`, `description`, `category`, `badge`, `specifications` (JSON), `specHeaders` (JSON), `reactions` (JSON), `reactionsTitle`, `quickFact`, `pdfCatalogUrl`, `order`, `isActive`, `images` (multiple files)
- **Response:** `{ success, product }`

#### GET `/api/products/[slug]`
- **Auth:** Public
- **Response:** `{ success, product }`

#### PUT `/api/products/[slug]`
- **Auth:** Admin/Superadmin
- **Content-Type:** `multipart/form-data`
- **Params:** Accepts both ObjectId and slug
- **Body:** Same as POST (partial updates), new images replace old ones
- **Response:** `{ success, product }`

#### DELETE `/api/products/[slug]`
- **Auth:** Admin/Superadmin
- **Params:** Accepts both ObjectId and slug
- **Description:** Deletes product and all associated images
- **Response:** `{ success, message }`

---

### 4.8 Settings (`/api/settings`)

#### GET `/api/settings`
- **Auth:** Public
- **Description:** Returns site settings (auto-creates defaults if none exist)
- **Response:** `{ success, settings }`

#### PUT `/api/settings`
- **Auth:** Admin/Superadmin
- **Body:** `{ siteName, phone, email, address, facebook, twitter, linkedin, heroBannerTitle, heroBannerSubtext, aboutTitle, aboutText, sisterConcern, sisterConcernUrl, vision, mission }`
- **Response:** `{ success, message, settings }`

---

### 4.9 Pages (`/api/pages/*`)

#### GET `/api/pages`
- **Auth:** Admin/Superadmin
- **Description:** Returns all CMS pages (auto-seeds defaults if missing)
- **Response:** `{ success, pages: [...] }`

#### GET `/api/pages/[pageKey]`
- **Auth:** Public
- **Params:** `pageKey` — one of: `home`, `about`, `products`, `news`, `investors`, `careers`
- **Description:** Returns page content (auto-seeds from defaults if not found)
- **Response:** `{ success, page }`

---

### 4.10 Notifications (`/api/notifications/*`)

#### GET `/api/notifications`
- **Auth:** Admin/Superadmin
- **Query Params:** `limit` (default 20), `page` (default 1), `unreadOnly` (true/false)
- **Response:** `{ success, notifications, pagination: { total, unreadCount, currentPage, totalPages } }`

#### GET `/api/notifications/count`
- **Auth:** Admin/Superadmin
- **Response:** `{ success, count }` (unread count)

#### PUT `/api/notifications/read-all`
- **Auth:** Admin/Superadmin
- **Description:** Marks all notifications as read
- **Response:** `{ success, message }`

#### DELETE `/api/notifications/clear-all`
- **Auth:** Admin/Superadmin
- **Description:** Deletes all read notifications
- **Response:** `{ success, message }`

#### DELETE `/api/notifications/[id]`
- **Auth:** Admin/Superadmin
- **Response:** `{ success, message }`

---

### 4.11 Contact Cards (`/api/contact-cards/*`)

#### GET `/api/contact-cards`
- **Auth:** Public
- **Description:** Returns active contact info cards (auto-seeds defaults if empty)
- **Response:** `{ success, cards: [...] }`

#### POST `/api/contact-cards`
- **Auth:** Admin/Superadmin
- **Body:** `{ "title": "string", "icon": "string", "lines": ["string"], "order": number, "isActive": boolean }`
- **Response:** `{ success, card }`

#### GET `/api/contact-cards/admin`
- **Auth:** Admin/Superadmin
- **Description:** Returns all cards (including inactive) for admin management
- **Response:** `{ success, cards: [...] }`

#### PUT `/api/contact-cards/[id]`
- **Auth:** Admin/Superadmin
- **Body:** Same as POST (partial updates)
- **Response:** `{ success, card }`

#### DELETE `/api/contact-cards/[id]`
- **Auth:** Admin/Superadmin
- **Response:** `{ success, message }`

---

### 4.12 Health (`/api/health`)

#### GET `/api/health`
- **Auth:** Public
- **Description:** Health check endpoint — verifies server and database connectivity
- **Response:**
```json
{ "success": true, "status": "OK", "timestamp": "2026-01-01T00:00:00.000Z", "db": "connected" }
```

---

### 4.13 Investor Files (`/api/investor-files`)

#### GET `/api/investor-files`
- **Auth:** Public
- **Query Params:** `category` (optional filter)
- **Description:** Scans `public/investor/` directory recursively and returns all PDFs with metadata
- **Response:** `{ success, documents: [...] }`

---

## 5. Frontend Pages

### Public Pages

| URL | Description |
|-----|-------------|
| `/` | Homepage (hero, about, products, quote, news sections) |
| `/about/the-company` | Company overview |
| `/about/chairmans-message` | Chairman's message |
| `/about/board-of-directors` | Board of Directors listing |
| `/about/committees` | Board committees |
| `/about/familiarization-programme` | Familiarization programme for directors |
| `/products/sponge-iron` | Sponge Iron (DRI) product page |
| `/products/forging-ingots-and-billets` | Forging Ingots & Billets product page |
| `/products/power` | Power Generation product page |
| `/investors/financials` | Financial documents (Annual Reports, Quarterly Results) |
| `/investors/disclosures` | Regulatory disclosures |
| `/investors/listing-information` | BSE listing information |
| `/investors/policies` | Company policies |
| `/investors/sebi-disclosure` | SEBI LODR disclosures |
| `/investors/others` | Other investor documents |
| `/investors/documents/[slug]` | Individual document detail page |
| `/news` | News listing page |
| `/news/[slug]` | Individual news article |
| `/careers` | Job listings and application |
| `/contact` | Contact form and info cards |

### Admin Pages

| URL | Description |
|-----|-------------|
| `/admin/login` | Admin login page |
| `/admin` | Dashboard home (stats overview) |
| `/admin/news` | Manage news articles |
| `/admin/documents` | Manage investor documents |
| `/admin/products` | Manage products |
| `/admin/board-members` | Manage board of directors |
| `/admin/careers` | Manage job listings & applications |
| `/admin/contacts` | View contact form submissions |
| `/admin/contact-cards` | Manage contact info cards |
| `/admin/notifications` | View system notifications |
| `/admin/pages` | CMS page content management |
| `/admin/pages/[pageKey]` | Edit specific page sections |
| `/admin/settings` | Site settings (name, contact, social) |

---

## 6. Database Models

### User (`models/User.js`)

| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required, min 6 chars, auto-hashed (bcrypt, 12 rounds) |
| `role` | String | Enum: `admin`, `superadmin` (default: `admin`) |
| `avatar` | String | URL to avatar image |
| `isActive` | Boolean | Default: `true` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Methods:** `matchPassword(enteredPassword)` — compares bcrypt hash

---

### News (`models/index.js`)

| Field | Type | Details |
|-------|------|---------|
| `title` | String | Required, trimmed |
| `slug` | String | Unique, auto-generated from title |
| `excerpt` | String | Short description |
| `content` | String | Full article HTML/text |
| `category` | String | Enum: `Industrial`, `Factory`, `Business`, `Finance`, `CSR`, `Other` |
| `image` | String | URL to uploaded image |
| `tags` | [String] | Array of tag strings |
| `author` | String | Default: `Vaswani Industries` |
| `views` | Number | View counter |
| `isPublished` | Boolean | Default: `true` |
| `publishedAt` | Date | Default: now |
| `uploadedBy` | ObjectId → User | Reference |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### BoardMember (`models/index.js`)

| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required, trimmed |
| `designation` | String | Required |
| `type` | String | Enum: `WHOLE TIME DIRECTOR`, `NON-EXECUTIVE DIRECTOR`, `INDEPENDENT DIRECTOR`, `EXECUTIVE DIRECTOR`, `CHAIRMAN`, `ADDITIONAL WOMAN DIRECTOR` |
| `image` | String | URL to uploaded image |
| `bio` | String | Biography text |
| `facebook` | String | Social link |
| `twitter` | String | Social link |
| `linkedin` | String | Social link |
| `committees` | [{ name, role }] | Committee memberships |
| `order` | Number | Display order |
| `isActive` | Boolean | Default: `true` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### Career (`models/index.js`)

| Field | Type | Details |
|-------|------|---------|
| `title` | String | Required, trimmed |
| `department` | String | Department name |
| `location` | String | Default: `Raipur, Chhattisgarh` |
| `experience` | String | Required |
| `qualification` | String | Required qualifications |
| `description` | String | Job description |
| `responsibilities` | [String] | List of responsibilities |
| `skills` | [String] | Required skills |
| `salary` | String | Salary range |
| `lastDate` | Date | Application deadline |
| `isActive` | Boolean | Default: `true` |
| `applications` | [Application] | Embedded applications (see below) |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Application subdocument:**
| Field | Type | Details |
|-------|------|---------|
| `name` | String | Applicant name |
| `email` | String | Applicant email |
| `phone` | String | Phone number |
| `resumeUrl` | String | Resume link |
| `coverLetter` | String | Cover letter text |
| `appliedAt` | Date | Default: now |
| `status` | String | Enum: `pending`, `reviewed`, `shortlisted`, `rejected` |

---

### Contact (`models/index.js`)

| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required, trimmed |
| `email` | String | Required |
| `phone` | String | Optional |
| `subject` | String | Optional |
| `message` | String | Required |
| `isRead` | Boolean | Default: `false` |
| `repliedAt` | Date | When admin replied |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### Product (`models/index.js`)

| Field | Type | Details |
|-------|------|---------|
| `name` | String | Required |
| `slug` | String | Unique, auto-generated |
| `tagline` | String | Short tagline |
| `description` | String | Full description |
| `category` | String | Enum: `FORGING INGOTS & BILLETS`, `SPONGE IRON`, `POWER`, `TMT BARS`, `CASTING` |
| `badge` | String | Display badge text |
| `specifications` | [[String]] | 2D array (table rows) |
| `specHeaders` | [String] | Table column headers |
| `reactions` | [{ left, right }] | Chemical reactions display |
| `reactionsTitle` | String | Default: `BASIC REDUCTION REACTIONS:` |
| `quickFact` | String | Quick fact callout |
| `pdfCatalogUrl` | String | PDF catalog download URL |
| `images` | [String] | Array of image URLs |
| `order` | Number | Display order |
| `isActive` | Boolean | Default: `true` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### Settings (`models/index.js`)

| Field | Type | Details |
|-------|------|---------|
| `siteName` | String | Default: `Vaswani Industries Ltd.` |
| `phone` | String | Default: `+91 7713540221` |
| `email` | String | Default: `hrd@vaswaniindustries.com` |
| `address` | String | Default: `Raipur, Chhattisgarh, India` |
| `facebook` | String | Social link |
| `twitter` | String | Social link |
| `linkedin` | String | Social link |
| `heroBannerTitle` | String | Homepage hero title |
| `heroBannerSubtext` | String | Homepage hero subtitle |
| `aboutTitle` | String | About section title |
| `aboutText` | String | About section text |
| `sisterConcern` | String | Default: `Kwality Foundry Industries` |
| `sisterConcernUrl` | String | Sister concern website URL |
| `vision` | String | Company vision |
| `mission` | String | Company mission |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### Document (`models/Document.js`)

| Field | Type | Details |
|-------|------|---------|
| `title` | String | Required, trimmed |
| `fileName` | String | Required — original filename |
| `filePath` | String | Required — relative path |
| `fileUrl` | String | Required — accessible URL |
| `category` | String | Required — one of 15 category enums (see API section 4.2) |
| `subcategory` | String | Optional |
| `year` | String | e.g., `2024` |
| `quarter` | String | Enum: ``, `Q1`, `Q2`, `Q3`, `Q4` |
| `slug` | String | Unique, auto-generated |
| `description` | String | Optional |
| `fileSize` | Number | File size in bytes |
| `uploadedBy` | ObjectId → User | Reference |
| `isActive` | Boolean | Default: `true` |
| `downloadCount` | Number | Default: `0` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### Notification (`models/Notification.js`)

| Field | Type | Details |
|-------|------|---------|
| `type` | String | Enum: `new_contact`, `new_application`, `new_document`, `system`, `page_updated`, `user_created` |
| `title` | String | Required |
| `message` | String | Notification body |
| `link` | String | Admin panel link |
| `icon` | String | Icon name (default: `bell`) |
| `isRead` | Boolean | Default: `false` |
| `readBy` | [ObjectId → User] | Users who read it |
| `meta` | Mixed | Additional metadata |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

### PageContent (`models/PageContent.js`)

| Field | Type | Details |
|-------|------|---------|
| `pageKey` | String | Required, unique (e.g., `home`, `about`, `products`) |
| `pageLabel` | String | Display label |
| `sections` | [Section] | Array of page sections (see below) |
| `isActive` | Boolean | Default: `true` |
| `lastEditedBy` | ObjectId → User | Reference |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

**Section subdocument:**
| Field | Type | Details |
|-------|------|---------|
| `sectionKey` | String | Required (e.g., `hero`, `about`, `products`) |
| `sectionLabel` | String | Display label |
| `miniTitle` | String | Small title above main title |
| `title` | String | Main heading |
| `subtitle` | String | Subtitle |
| `paragraph` | String | Body text |
| `paragraph2` | String | Additional paragraph |
| `images` | [{ url, alt, caption, order }] | Section images |
| `buttons` | [{ text, url, style, openNewTab }] | CTA buttons |
| `isActive` | Boolean | Default: `true` |
| `order` | Number | Display order |
| `extra` | Mixed | Additional data (e.g., quickFact) |

---

### ContactCard (`models/ContactCard.js`)

| Field | Type | Details |
|-------|------|---------|
| `title` | String | Required, trimmed (e.g., `HEAD OFFICE`) |
| `icon` | String | Lucide icon name (default: `MapPin`) |
| `lines` | [String] | Array of text lines |
| `order` | Number | Display order |
| `isActive` | Boolean | Default: `true` |
| `createdAt` | Date | Auto |
| `updatedAt` | Date | Auto |

---

## 7. Authentication System

### Overview

- **Method:** JWT (JSON Web Tokens)
- **Library:** `jsonwebtoken` for signing/verifying, `bcryptjs` for password hashing
- **Token Storage:** Client-side `localStorage` (keys: `vil_admin_token`, `vil_admin_user`)
- **Token Delivery:** `Authorization: Bearer <token>` header

### Roles

| Role | Permissions |
|------|-------------|
| `superadmin` | Full access — manage users, delete users, register new admins |
| `admin` | Content management — CRUD on news, documents, products, careers, etc. |

### Login Flow

1. Client sends `POST /api/auth/login` with `{ email, password }`
2. Server verifies credentials against bcrypt hash
3. Server returns JWT token (signed with `JWT_SECRET`, expires in `JWT_EXPIRE`)
4. Client stores token in `localStorage` as `vil_admin_token`
5. All subsequent admin requests include `Authorization: Bearer <token>`

### Protected Route Flow (Server-side)

1. `getAuthUser(request)` extracts token from `Authorization` header
2. Verifies token with `jwt.verify(token, JWT_SECRET)`
3. Looks up user by decoded `id`, checks `isActive`
4. Returns user object or `null`
5. Route handler calls `unauthorized()` (401) or `forbidden()` (403) as needed

### Protected Route Flow (Client-side)

1. `AuthContext` checks `localStorage` on mount
2. `admin-api.js` axios interceptor auto-attaches token to every request
3. On 401 response, interceptor clears storage and redirects to `/admin/login`

---

## 8. File Upload System

### How It Works

- **Storage:** Local filesystem at `public/uploads/`
- **Images:** Stored in `public/uploads/images/`
- **Documents (uploaded PDFs):** Stored in `public/uploads/documents/{category}/`
- **Static Investor PDFs:** Pre-loaded in `public/investor/{category-folder}/`

### Upload Process

1. Client sends `multipart/form-data` with file
2. `saveUploadedFile(file, type, subFolder)` in `lib/upload.js`:
   - Generates UUID filename (preserves extension)
   - Writes to `public/uploads/{type}/{subFolder}/`
   - Returns `{ filename, filepath, relativePath, url, size }`
3. URL stored in database record

### URL Formats

| Type | URL Pattern | Example |
|------|-------------|---------|
| Uploaded Image | `/uploads/images/{uuid}.jpg` | `/uploads/images/a1b2c3d4-e5f6.jpg` |
| Uploaded PDF | `/uploads/documents/{category}/{uuid}.pdf` | `/uploads/documents/financials_annual_reports/abc123.pdf` |
| Static Investor PDF | `/investor/{folder}/{filename}.pdf` | `/investor/financials/Annual-Reports/Annual-Report-2024.pdf` |

### Image Upload Contexts

- **News articles:** Single image per article
- **Products:** Multiple images per product
- **Board Members:** Single profile image per member

### File Deletion

When a record is deleted (news, product, board member), the associated file is also deleted from disk via `deleteFile()`.

### URL Normalization

The `normalizeFileUrl()` helper (in both `lib/api.js` and `lib/admin-api.js`) handles legacy URLs stored with full domain or localhost references, extracting just the relative path.

---

## 9. Deployment Guide (Hostinger)

### Prerequisites

- Hostinger Node.js hosting plan
- Domain pointed to Hostinger nameservers
- MongoDB Atlas cluster configured with network access (allow all IPs: `0.0.0.0/0`)

### Step-by-Step Deployment

#### 1. Prepare the Build

```bash
npm run build
```

#### 2. Upload to Hostinger

Upload the entire project (including `.next/`, `public/`, `node_modules/`) via:
- File Manager (zip and extract)
- SSH + git clone
- FTP

#### 3. Set Environment Variables

In Hostinger panel → Node.js settings → Environment Variables, set:

```
NODE_ENV=production
MONGO_URI=mongodb://***:***@cluster.mongodb.net:27017/vaswani_db?ssl=true&replicaSet=...&authSource=admin
JWT_SECRET=your_strong_secret_key_here
JWT_EXPIRE=7d
NEXT_PUBLIC_API_URL=/api
NEXT_PUBLIC_BACKEND_URL=
NEXT_PUBLIC_SITE_URL=https://www.vaswaniindustries.com
BACKEND_URL=https://www.vaswaniindustries.com
STORAGE_MODE=local
MAX_IMAGE_SIZE_MB=10
MAX_PDF_SIZE_MB=50
```

#### 4. Configure Node.js App

- **Entry point:** `node_modules/.bin/next` or use custom `server.js`
- **Start command:** `npm start` (runs `next start`)
- **Node version:** 18+ recommended

#### 5. Domain Setup

- Point domain A record to Hostinger IP
- Enable SSL (Let's Encrypt) in Hostinger panel
- Set up www → non-www redirect (or vice versa)

#### 6. Post-Deploy Steps (IMPORTANT)

After first deployment, hit these URLs in order:

1. **Health Check:** `https://www.vaswaniindustries.com/api/health`
   - Verify: `{ "status": "OK", "db": "connected" }`

2. **Seed Admin User:** `https://www.vaswaniindustries.com/api/auth/seed`
   - Creates superadmin account
   - Only works once (returns error if admin already exists)

3. **Seed Documents:** `https://www.vaswaniindustries.com/api/documents/seed-from-files`
   - Scans `public/investor/` and populates MongoDB with document records
   - Can be re-run to refresh (deletes and re-inserts all)

#### 7. Verify

- Visit homepage: `https://www.vaswaniindustries.com`
- Login to admin: `https://www.vaswaniindustries.com/admin/login`
- Check investor documents load correctly

### Important Notes

- **Images are unoptimized** (`next.config.js` → `images.unoptimized: true`) because Hostinger doesn't support `sharp`
- **Mongoose, bcryptjs, jsonwebtoken, slugify** are listed as `serverExternalPackages` to avoid bundling issues
- Security headers (X-Content-Type-Options, X-Frame-Options, Referrer-Policy) are set via `next.config.js`

---

## 10. Admin Panel

### Login Credentials (Default)

| Field | Value |
|-------|-------|
| URL | `/admin/login` |
| Email | `admin@vaswaniindustries.com` |
| Password | `Admin@2026` |
| Role | `superadmin` |

> ⚠️ **Change the default password immediately after first login** via Settings or the Change Password API.

### Admin Features

| Section | Capabilities |
|---------|-------------|
| **Dashboard** | Overview stats, recent activity |
| **News** | Create, edit, delete articles with images; manage categories and tags |
| **Documents** | Upload investor PDFs, categorize by type/year/quarter; manage existing documents |
| **Products** | Add/edit products with multiple images, specifications tables, chemical reactions |
| **Board Members** | Manage directors with photos, bios, committee assignments |
| **Careers** | Post job listings, view applications, manage application status |
| **Contacts** | View contact form submissions, mark as read, delete |
| **Contact Cards** | Edit contact info displayed on the contact page |
| **Notifications** | View system notifications (new contacts, applications, uploads) |
| **Pages (CMS)** | Edit page content sections (hero banners, text, buttons, images) |
| **Settings** | Update site name, contact info, social links, hero text |

### Content Management Workflow

1. Login at `/admin/login`
2. Navigate to desired section via sidebar
3. Create/Edit content using forms
4. Images are uploaded inline with the form
5. Changes are immediately live on the public site

### User Management (Superadmin Only)

- Register new admin users via `/api/auth/register`
- View all users via Settings page
- Delete users (cannot delete yourself)

---

## 11. Important URLs (Post-Deploy)

### System URLs

| Purpose | URL | Method |
|---------|-----|--------|
| Health Check | `https://www.vaswaniindustries.com/api/health` | GET |
| Seed Admin | `https://www.vaswaniindustries.com/api/auth/seed` | GET |
| Seed Documents | `https://www.vaswaniindustries.com/api/documents/seed-from-files` | GET |
| Admin Login | `https://www.vaswaniindustries.com/admin/login` | Browser |

### First-Time Setup Order

```
1. GET /api/health              → Verify server + DB connection
2. GET /api/auth/seed           → Create superadmin user
3. GET /api/documents/seed-from-files → Populate investor documents from PDFs
4. Visit /admin/login           → Login with admin@vaswaniindustries.com / Admin@2026
5. Change password immediately
```

### Public Site URLs

| Page | URL |
|------|-----|
| Homepage | `https://www.vaswaniindustries.com/` |
| About | `https://www.vaswaniindustries.com/about/the-company` |
| Products | `https://www.vaswaniindustries.com/products/sponge-iron` |
| Investors | `https://www.vaswaniindustries.com/investors/financials` |
| News | `https://www.vaswaniindustries.com/news` |
| Careers | `https://www.vaswaniindustries.com/careers` |
| Contact | `https://www.vaswaniindustries.com/contact` |

---

## Appendix: Quick Reference

### npm Scripts

```bash
npm run dev      # Start development server (localhost:3000)
npm run build    # Production build
npm start        # Start production server
npm run lint     # Run ESLint
```

### Key Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| next | ^16.2.6 | Framework |
| react | ^18.3.1 | UI library |
| mongoose | ^8.4.4 | MongoDB ODM |
| jsonwebtoken | ^9.0.2 | JWT auth |
| bcryptjs | ^2.4.3 | Password hashing |
| axios | ^1.7.2 | HTTP client |
| tailwindcss | ^3.4.4 | CSS framework |
| framer-motion | ^12.38.0 | Animations |
| lucide-react | ^0.383.0 | Icons |
| slugify | ^1.6.6 | URL slug generation |

---

*Last updated: 2025*
*Maintained by: Vaswani Industries IT Team*

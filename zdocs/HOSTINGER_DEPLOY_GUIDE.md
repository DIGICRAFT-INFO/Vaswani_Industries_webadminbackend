# Hostinger Node.js Deployment Guide
## Vaswani Industries — https://www.vaswaniindustries.com

> **Hosting Type:** Hostinger Node.js (NOT VPS)
> **Method:** GitHub Auto-Deploy
> **Important:** Do NOT touch mobile and sap folders

---

## Step 1: Push Code to GitHub

```bash
git add .
git commit -m "Production ready - Vaswani Industries"
git push origin main
```

---

## Step 2: Hostinger Panel Setup

1. Login to **Hostinger hPanel**
2. Go to **Websites** → Select your domain (`vaswaniindustries.com`)
3. Click **Manage**

---

## Step 3: Connect GitHub Repository

1. Go to **Advanced** → **Node.js** section
2. Click **"Manage"** or **"Setup Node.js App"**
3. Settings:
   - **Node.js Version:** 18.x or 20.x (latest available)
   - **Application Root:** `/` (root of your repo)
   - **Application Startup File:** `server.js`
   - **Application URL:** `https://www.vaswaniindustries.com`

4. Click **"Connect to GitHub"**
5. Select your repository and branch (`main`)
6. Enable **Auto Deploy** (optional — deploys on every push)

---

## Step 4: Environment Variables

In Hostinger Node.js panel → **Environment Variables** section, add these:

| Variable | Value |
|----------|-------|
| `PORT` | `3001` (or whatever Hostinger assigns) |
| `NODE_ENV` | `production` |
| `MONGO_URI` | `mongodb://vaswani_admin:Vaswani%40Db2026@ac-qzwlv2l-shard-00-00.bddlo5y.mongodb.net:27017,ac-qzwlv2l-shard-00-01.bddlo5y.mongodb.net:27017,ac-qzwlv2l-shard-00-02.bddlo5y.mongodb.net:27017/vaswani_db?ssl=true&replicaSet=atlas-zgyw2s-shard-0&authSource=admin&appName=Vaswani-Cluster` |
| `JWT_SECRET` | `vaswani_super_secret_key_2026_change_this_later` |
| `JWT_EXPIRE` | `7d` |
| `NEXT_PUBLIC_API_URL` | `https://www.vaswaniindustries.com/api` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://www.vaswaniindustries.com` |
| `NEXT_PUBLIC_SITE_URL` | `https://www.vaswaniindustries.com` |
| `BACKEND_URL` | `https://www.vaswaniindustries.com` |
| `STORAGE_MODE` | `local` |
| `MAX_IMAGE_SIZE_MB` | `10` |
| `MAX_PDF_SIZE_MB` | `50` |

---

## Step 5: Build & Start Commands

Hostinger Node.js panel mein:

- **Build Command:** `npm install && npm run build`
- **Start Command:** `npm start`

Or if Hostinger asks separately:
- **Install Command:** `npm install`
- **Build Command:** `npm run build`
- **Run Command:** `node server.js`

---

## Step 6: Domain Setup

1. Go to **Domains** → `vaswaniindustries.com`
2. Make sure **www** subdomain points to same app
3. Enable **SSL** (Force HTTPS)
4. Set **Application URL** to `https://www.vaswaniindustries.com`

---

## Step 7: File Structure on Hostinger

```
/home/user/domains/vaswaniindustries.com/
├── public_html/          ← DO NOT USE (Hostinger default, ignore)
├── mobile/               ← DO NOT TOUCH ⚠️
├── sap/                  ← DO NOT TOUCH ⚠️
└── node_app/             ← YOUR APP GOES HERE (via GitHub)
    ├── server.js
    ├── package.json
    ├── next.config.js
    ├── .next/            (generated after build)
    ├── app/
    ├── components/
    ├── lib/
    ├── server/
    ├── public/
    │   └── uploads/
    │       ├── images/
    │       └── documents/
    └── node_modules/
```

**⚠️ IMPORTANT:** `mobile/` and `sap/` folders ko bilkul touch mat karna!

---

## Step 8: After Deploy — Verify

1. Visit: `https://www.vaswaniindustries.com` → Homepage should load
2. Visit: `https://www.vaswaniindustries.com/api/health` → Should show `{"success":true}`
3. Visit: `https://www.vaswaniindustries.com/admin` → Admin login page
4. Login: `admin@vaswaniindustries.com` / `Admin@2026`

---

## Troubleshooting

### App not starting?
- Check **Node.js version** is 18+ 
- Check **Startup file** is `server.js` (not `index.js`)
- Check environment variables are set

### MongoDB connection error?
- Go to MongoDB Atlas → Network Access
- Add `0.0.0.0/0` (Allow from anywhere)
- Hostinger's IP changes, so allow all

### Images/PDFs not loading?
- Check `public/uploads/` folder has write permissions
- Run in Hostinger terminal: `chmod -R 755 public/uploads/`

### 502 Bad Gateway?
- App crashed — check Hostinger logs
- Usually means build failed or env vars missing
- Re-run build: `npm run build`

### Port issue?
- Hostinger may assign its own port via `PORT` env variable
- Our `server.js` reads `process.env.PORT` automatically

---

## Quick Reference

| Item | Value |
|------|-------|
| Domain | https://www.vaswaniindustries.com |
| Admin URL | https://www.vaswaniindustries.com/admin |
| Admin Email | admin@vaswaniindustries.com |
| Admin Password | Admin@2026 |
| MongoDB User | vaswani_admin |
| MongoDB Pass | Vaswani@Db2026 |
| Database | vaswani_db |
| Startup File | server.js |
| Build | npm run build |
| Start | npm start |
| Node Version | 18.x+ |

---

## DO NOT TOUCH

- ❌ `mobile/` folder
- ❌ `sap/` folder
- ❌ `public_html/` (if exists, ignore it)

## SAFE TO MODIFY

- ✅ Your Node.js app folder
- ✅ Environment variables
- ✅ Node.js version settings
- ✅ GitHub connection settings

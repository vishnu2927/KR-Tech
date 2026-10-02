# DEPLOYMENT READY REPORT

**PROJECT:** KR GLOBAL LEARNING PRIVATE LIMITED  
**BRAND IDENTITY:** Learn. Build. Grow. Globally.  
**DATE:** October 3, 2026  
**TARGET DOMAIN:** `https://krgloballearning.com`  
**OVERALL STATUS:** READY FOR DEPLOYMENT  

---

## 1. Executive Summary & Status Dashboard

| Category | Status | Evaluation Summary |
| :--- | :---: | :--- |
| **Frontend Deployment** | **READY** | Vite 8 + React 19 production build succeeds with 0 errors. `vercel.json` configured. |
| **Backend Deployment** | **READY** | Node.js/Express starts cleanly in production mode. `render.yaml` configured. |
| **Database** | **READY** | MongoDB Atlas production cluster active via `MONGO_URI`. 84 courses synchronized. |
| **Environment Variables** | **READY** | Documented in root and backend `.env.example`. Zero secrets committed to git. |
| **Payment Gateway** | **READY** | Razorpay integration complete. Webhook route `/api/payment/webhook` active. |
| **Email (SMTP)** | **NEEDS CONFIGURATION** | Service code ready with sandbox fallback; live SMTP credentials not yet provided. |
| **AI Learning Engine** | **NEEDS CONFIGURATION** | Service code ready with domain fallback; live OpenAI/Gemini API key not yet provided. |
| **Custom Domain** | **NEEDS CONFIGURATION** | Domain purchased (`krgloballearning.com`); DNS A/CNAME records pending configuration. |
| **SSL / HTTPS** | **NEEDS CONFIGURATION** | Auto-managed by Vercel & Render upon DNS pointing; not live yet. |
| **Code & Secret Security** | **PASS** | No secrets in git; `.env*` ignored; zero hardcoded `localhost` URLs in client bundle. |
| **Brand Policy** | **PASS** | Zero placement, job guarantee, hiring, or CTC claims across the application. |

---

## 2. Frontend Deployment Status: READY

- **Build System:** Vite 8.0.5 + React 19 + Tailwind CSS v4.
- **Build Verification:** `npm run build` completed with exit code `0` in 5.21s (0 errors).
- **Host Configuration (`vercel.json`):**
  - **Framework:** `vite`
  - **Build Command:** `npm run build`
  - **Output Directory:** `dist`
  - **Single Page Application Routing:** Rewrites `/(.*)` to `/index.html` to guarantee clean client-side routing on all routes.
  - **Domain Redirect:** Canonical 301 redirect from `www.krgloballearning.com` to `https://krgloballearning.com`.
  - **Security Headers:** HSTS (2-year preload), X-Content-Type-Options (`nosniff`), X-Frame-Options (`DENY`), X-XSS-Protection, Referrer-Policy, and Permissions-Policy.
  - **Asset Caching:** 1-year immutable caching for `/assets/*`.
- **API URL Parameterization:**
  - Base URL configured through `import.meta.env.VITE_API_URL` with resilient fallback to `/api`.
  - Socket.io connection configured through `import.meta.env.VITE_SOCKET_URL`.
  - Zero hardcoded `localhost:5000` URLs in `src/`.

---

## 3. Backend Deployment Status: READY

- **Runtime & Engine:** Node.js 20+ / Express 4.21 / Socket.io 4.8.
- **Production Mode Startup:** Verified clean execution with `NODE_ENV=production`.
- **Port Binding:** Uses `process.env.PORT || 5000`, dynamically accepting Render's assigned port.
- **Health Check Endpoint:**
  - Route: `GET /api/health`
  - Status: Returns HTTP `200 OK` with database connection state, memory telemetry, and uptime.
- **CORS Configuration:**
  - Configured to automatically allow `process.env.CLIENT_URL`, `https://krgloballearning.com`, `https://www.krgloballearning.com`, and preview domains matching `*.vercel.app` and `*.krgloballearning.com`.
- **Security Middlewares:**
  - Helmet security headers active.
  - Rate limiting active: 300 req/15 min for general API, 60 req/15 min for auth and lead endpoints.
  - Payload limits enforced (50kb JSON limit).

---

## 4. Database Status: READY

- **Database Engine:** MongoDB Atlas (AWS replica set).
- **Configuration Variable:** `process.env.MONGO_URI`.
- **Catalog Dataset:** Exactly 84 canonical course records synchronized to the Atlas cluster. Legacy auto-generated duplicate slugs pruned.
- **Connection Resilience:** `backend/config/db.js` implements a 15-second timeout with non-blocking dual-engine fallback store.
- **Credentials Protection:** Connection strings and passwords are completely isolated in environment variables.

---

## 5. Payments Status: READY

- **Provider:** Razorpay Payments SDK v2.9.8.
- **Environment Variables:** `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`.
- **Webhook Endpoint:** `/api/payment/webhook` (Confirmed and mounted under `/api/payment`).
- **Signature Verification:** Cryptographic HMAC SHA-256 validation enforced in production.
- **Current Mode:** Test / sandbox mode ready; live production merchant keys `NEEDS CONFIGURATION` upon owner activation.

---

## 6. Email (SMTP) Status: NEEDS CONFIGURATION

- **Integration:** Nodemailer with automated template rendering and PDF certificate generation.
- **Environment Variables:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`.
- **Current Operational Status:** Falls back to test Ethereal sandbox / local test mode until production Gmail App Password or SMTP credentials are added to Render environment variables.
- **Owner Action:** Add verified SMTP credentials in Render dashboard before launching customer notifications.

---

## 7. AI Engine Status: NEEDS CONFIGURATION

- **Architecture:** Hybrid AI Engine with live OpenAI GPT-4o-mini API connector and domain-trained engineering fallback intelligence.
- **Environment Variable:** `OPENAI_API_KEY`.
- **Current Operational Status:** Operates smoothly via resilient offline domain intelligence. Live API calls will activate once `OPENAI_API_KEY` is provided in Render environment variables.

---

## 8. Domain & SSL Status: NEEDS CONFIGURATION

- **Target Domain:** `https://krgloballearning.com`
- **Ownership:** Purchased by client.
- **DNS Status:** Pending DNS record creation at domain registrar.
- **SSL / HTTPS Status:** Pending DNS propagation (will automatically issue via Let's Encrypt through Vercel and Render).

---

## 9. Code & Security Audit: PASS

- **Hardcoded Secrets:** None found. No API keys, passwords, or tokens are committed.
- **Git Tracking:** `.env` and `backend/.env` are untracked and verified in `.gitignore`.
- **Localhost Scan:** 0 instances of `localhost` in client production code (`src/`).
- **Course Catalog Integrity:** Incomplete course title `Google Professional Cl…` (ID: `google-professional-cl`) preserved verbatim without guessing; flagged as **NEEDS TITLE CONFIRMATION**.
- **Brand Compliance:** 0 occurrences of placement, job guarantee, hiring, salary, CTC, or LPA claims.

---

## 10. Exact Commands & Settings Needed for Vercel (Frontend)

### A. Vercel Project Setup
1. Log in to **[Vercel Dashboard](https://vercel.com/)** -> Click **Add New...** -> **Project**.
2. Import the Git repository containing this project.
3. Configure the Project Settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `./`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### B. Vercel Environment Variables
Add the following in **Settings -> Environment Variables**:

| Variable Name | Recommended Production Value | Description |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://kr-global-learning-api.onrender.com/api` | Render backend API URL |
| `VITE_SITE_URL` | `https://krgloballearning.com` | Production canonical site URL |
| `VITE_SOCKET_URL` | `https://kr-global-learning-api.onrender.com` | Render Socket.io endpoint |
| `VITE_RAZORPAY_KEY_ID` | `your_live_razorpay_key_id` | Live Razorpay key (or test key) |

### C. Vercel Custom Domain Setup
1. Go to **Settings -> Domains**.
2. Add `krgloballearning.com` and `www.krgloballearning.com`.
3. Vercel will provide the required DNS records (A Record: `76.76.21.21` or CNAME `cname.vercel-dns.com`).

---

## 11. Exact Commands & Settings Needed for Render (Backend)

### A. Render Web Service Setup
1. Log in to **[Render Dashboard](https://dashboard.render.com/)** -> Click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the Web Service:
   - **Name:** `kr-global-learning-api`
   - **Region:** Singapore / Frankfurt / Oregon (closest to target audience)
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Health Check Path:** `/api/health`

### B. Render Environment Variables
Add the following under **Environment Variables** in Render:

| Key | Recommended Value / Source | Secret? |
| :--- | :--- | :---: |
| `NODE_ENV` | `production` | No |
| `PORT` | `5000` *(Render sets this automatically)* | No |
| `CLIENT_URL` | `https://krgloballearning.com` | No |
| `MONGO_URI` | `mongodb+srv://<user>:<password>@cluster0...` | **YES** |
| `JWT_SECRET` | Strong 64-character random string | **YES** |
| `RAZORPAY_KEY_ID` | Live Razorpay Key ID | **YES** |
| `RAZORPAY_KEY_SECRET` | Live Razorpay Key Secret | **YES** |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay Webhook Secret | **YES** |
| `SMTP_HOST` | `smtp.gmail.com` | No |
| `SMTP_PORT` | `587` | No |
| `SMTP_USER` | `krglobal0713@gmail.com` | No |
| `SMTP_PASS` | Google 16-character App Password | **YES** |
| `OPENAI_API_KEY` | OpenAI API Secret Key | **YES** |

*(Note: `render.yaml` is pre-configured in the repository root for one-click Blueprint deployment).*

---

## 12. Final List of Owner Actions

To complete the first go-live deployment, the owner only needs to perform these external platform actions:

1. **Deploy Backend to Render:**
   - Create Web Service with root directory `backend`, build `npm install`, start `node server.js`.
   - Paste production environment variables (`MONGO_URI`, `JWT_SECRET`, `CLIENT_URL`).
   - Copy the deployed Render URL (e.g., `https://kr-global-learning-api.onrender.com`).

2. **Deploy Frontend to Vercel:**
   - Import repository with root `./`, preset `Vite`.
   - Set `VITE_API_URL=https://<your-render-url>/api` and `VITE_SOCKET_URL=https://<your-render-url>`.
   - Deploy.

3. **Configure DNS Records at Domain Registrar:**
   - Point Apex domain `krgloballearning.com` to Vercel's IP (`76.76.21.21`).
   - Point `www.krgloballearning.com` CNAME to `cname.vercel-dns.com`.
   - *(Optional)* Point `api.krgloballearning.com` CNAME to Render if using a custom backend domain.

4. **Activate Live Services:**
   - **Razorpay:** Generate Live Key ID and Secret in Razorpay Dashboard; add Webhook pointing to `https://<backend-url>/api/payment/webhook`.
   - **Email:** Create a Google App Password for `krglobal0713@gmail.com` and set `SMTP_PASS` in Render.
   - **AI:** Add `OPENAI_API_KEY` in Render.

5. **Run Final Smoke Test:**
   - Access `https://krgloballearning.com`.
   - Verify course catalog loading (84 courses, USD prices).
   - Test user login/registration.
   - Test test-mode checkout / demo booking.
   - Confirm `/api/health` returns `200 OK`.

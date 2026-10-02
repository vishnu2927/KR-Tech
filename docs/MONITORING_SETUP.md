# KR GLOBAL LEARNING PRIVATE LIMITED
## Production Monitoring & Observability Setup Guide
**Platform:** KR GLOBAL LEARNING PRIVATE LIMITED  
**Tagline:** *Learn. Build. Grow. Globally.*  
**Support Contact:** Phone: `+91 9311073936` | Email: `krglobal0713@gmail.com`  
**Address:** Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318

---

### 1. Architecture Overview

The KR Global Learning monitoring architecture provides end-to-end observability without compromising student privacy or exposing operational secrets:

```
[ Learner Browser ]
       │
       ▼ (X-Request-ID, Web Vitals, Privacy Analytics)
[ Reverse Proxy / Nginx ]
       │
       ▼
[ Express Backend (Port 5000) ]
       ├─► Request Correlation Middleware (`req.id = UUID`)
       ├─► Structured JSON Logger (stdout -> APM forwarder)
       ├─► In-Memory Telemetry Aggregator (`monitoringService.js`)
       ├─► Security & Incident Sentinel
       │
       ▼
[ Protected Admin Dashboard (`/admin/monitoring`) ]
```

---

### 2. Endpoints & Authentication

| Route | Method | Access Level | Description |
| :--- | :--- | :--- | :--- |
| `/api/health` | `GET` | Public | Fast synthetic health check returning status, uptime, and database state. |
| `/api/admin/monitoring/stats` | `GET` | Admin Only | Protected telemetry diagnostic payload with full system status. |
| `/admin/monitoring` | UI | Protected Admin Route | Real-time administrative dashboard displaying 8 monitoring zones. |

**Authentication Mechanism:**  
The `/api/admin/monitoring/stats` endpoint requires a valid JWT with `admin` or `superAdmin` role in the `Authorization: Bearer <token>` header, or a valid `x-admin-key` header in authorized environments.

---

### 3. Request Correlation & Structured Logging

Every request passing through the backend is stamped with a unique correlation identifier:
- **Header:** `X-Request-ID` (Generated using `crypto.randomUUID()` if not supplied by reverse proxy).
- **Format:** Standard JSON logged directly to `stdout`:

```json
{
  "timestamp": "2026-10-02T15:00:00.000Z",
  "level": "INFO",
  "service": "kr-global-learning-backend",
  "environment": "production",
  "requestId": "e7b0c953-294b-4bbf-85f2-51c312788e0b",
  "method": "GET",
  "endpoint": "/api/courses",
  "statusCode": 200,
  "durationMs": 14
}
```

*Privacy & Security Rule:* Request bodies containing passwords, tokens, or personal identifiers are strictly filtered from logs.

---

### 4. Telemetry Metric Groups

The in-memory metric store categorizes API performance into discrete groups:
1. **Authentication:** `/api/auth` (tracks login attempts, 401s, 403s, rate limits).
2. **Courses:** `/api/courses`, `/api/lectures` (tracks catalog browsing latency and syllabus views).
3. **Payments:** `/api/payment`, `/api/invoice`, `/api/coupons` (tracks order creation, verification, and webhooks).
4. **Certificates:** `/api/certificates` (tracks public credential verification requests).
5. **AI:** `/api/ai` (tracks AI assistant prompts, token limits, and deterministic fallback activations).
6. **Admin:** `/api/admin`, `/api/super-admin` (tracks administrative actions).
7. **Support:** `/api/support`, `/api/leads` (tracks demo requests and support tickets).
8. **Email:** `/api/emails`, `/api/whatsapp` (tracks notification dispatches).

---

### 5. External Integrations Status

| Service | Target Purpose | Status in Environment | Action Required |
| :--- | :--- | :--- | :--- |
| **Sentry (Frontend)** | Real-time JS uncaught error capture | `NOT CONFIGURED` | Provide `VITE_SENTRY_DSN` in production environment |
| **Sentry (Backend)** | Node.js uncaught exception tracker | `NOT CONFIGURED` | Provide `SENTRY_DSN` in `backend/.env` |
| **Google Analytics 4** | Privacy-conscious learning events | `NOT CONFIGURED` | Provide `VITE_GA_MEASUREMENT_ID` |
| **Google Search Console** | SEO indexation verification | `NOT CONFIGURED` | Verify DNS ownership via TXT record |
| **Razorpay Live** | Real payment processing | `NEEDS VERIFICATION` | Replace test keys with verified live credentials |
| **SMTP (Gmail/Workspace)** | Transactional email delivery | `NEEDS VERIFICATION` | Enter authorized Google Workspace App Password |

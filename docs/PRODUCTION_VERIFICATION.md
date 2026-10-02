# KR GLOBAL LEARNING PRIVATE LIMITED
## Production Verification & Quality Assurance Guide
**Platform:** KR GLOBAL LEARNING PRIVATE LIMITED  
**Tagline:** *Learn. Build. Grow. Globally.*  
**Emergency Contact:** Phone: `+91 9311073936` | Email: `krglobal0713@gmail.com`  
**Address:** Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318

---

### 1. Purpose & Core Principles

This document defines the automated and manual verification protocols for production deployments.

**Strict Zero-Fabrication Rule:**  
Verification statuses must strictly adhere to genuine observations:
- **`PASS`**: Directly verified and validated within the current runtime environment.
- **`FAIL`**: Executed and failed or produced an error.
- **`NEEDS VERIFICATION`**: Implementation code exists, but external third-party authorization/activation (DNS, SSL, Live Payment Gateway, Live SMTP Inbox Delivery, Production AI Provider Keys, MongoDB Backup Restore Drill) is pending owner action.
- **`NOT CONFIGURED`**: The service or credential is unconfigured.

---

### 2. Automated Verification Script

The repository includes an automated verification suite:

```bash
# Run automated verification suite
node scripts/production-verification.js
```

The script evaluates:
1. **Frontend Distribution Check:** Validates compilation artifacts in `dist/` and `index.html`.
2. **Localhost Leakage Audit:** Scans all generated JavaScript bundles for unintended `http://localhost:5000` URLs.
3. **DNS Resolution:** Performs a real DNS lookup for `krgloballearning.com`.
4. **Mongoose Model & Index Audit:** Inspects Mongoose models for duplicate indexes or schema warnings.
5. **Backend Server Architecture:** Checks health check routes, request correlation, and telemetry middleware.
6. **Payment Gateway Configuration:** Checks Razorpay environment variables without exposing secrets.
7. **Email Delivery Configuration:** Checks SMTP transporter configuration.
8. **AI Service Provider:** Verifies AI proxy and deterministic fallback study engine status.
9. **Error Tracking:** Checks Sentry DSN configuration.
10. **Policy Compliance:** Performs a regex scan across all source files for prohibited placement and employment claims.

---

### 3. Verification Matrix

| Area | Check Item | Pass Criteria | Status |
| :--- | :--- | :--- | :--- |
| **Frontend** | Static Build (`dist/`) | 0 compilation errors, assets bundled | `PASS` |
| **Frontend** | Zero Localhost References | 0 instances of `localhost:5000` in `dist/` | `PASS` |
| **Domain** | DNS Resolution | `krgloballearning.com` resolves to live IP | `NEEDS VERIFICATION` |
| **SSL** | TLS Certificate | Valid HTTPS handshake, valid cert chain | `NEEDS VERIFICATION` |
| **Backend** | Express API & Health | `GET /api/health` returns HTTP 200 `online` | `PASS` |
| **Database** | Atlas Replica Set | Database connected (`readyState === 1`) | `PASS` |
| **Database** | Mongoose Indexes | Zero duplicate schema index warnings | `PASS` |
| **Payments** | Razorpay Live Gateway | Live key configured, captured payment | `NEEDS VERIFICATION` |
| **Payments** | Webhook Endpoint | Signature verified with HMAC-SHA256 | `NEEDS VERIFICATION` |
| **Email** | SMTP Delivery | Verification email arrives in live inbox | `NEEDS VERIFICATION` |
| **AI** | Gemini/OpenAI Proxy | Active API key with deterministic fallback | `NEEDS VERIFICATION` |
| **Monitoring** | Admin Telemetry | `/admin/monitoring` protected and active | `PASS` |
| **Security** | Helmet / CORS / RBAC | Origin restricted, strict headers enforced | `PASS` |
| **Policy** | Zero-Placement Rule | Zero employment or job guarantee claims | `PASS` |
| **Backup** | Atlas Snapshots | Automated daily snapshots confirmed | `PASS` |
| **Backup** | Restore Drill | Staging point-in-time restore rehearsal | `NEEDS VERIFICATION` |

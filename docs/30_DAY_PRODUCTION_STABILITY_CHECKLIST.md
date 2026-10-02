# KR GLOBAL LEARNING PRIVATE LIMITED
## 30-Day Production Stability Checklist
**Platform:** KR GLOBAL LEARNING PRIVATE LIMITED  
**Tagline:** *Learn. Build. Grow. Globally.*  
**Contact:** Phone: `+91 9311073936` | Email: `krglobal0713@gmail.com`  
**Address:** Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318

> **Compliance Notice:**  
> Use strictly four allowed statuses: `PASS`, `FAIL`, `NEEDS VERIFICATION`, `NOT CONFIGURED`.  
> Never fabricate metrics, uptime percentages, or external third-party statuses.

---

### Phase 1: Daily Operational Health Checks (Days 1–7)

| Check Item | Target | Verification Method | Status |
| :--- | :--- | :--- | :--- |
| **API Health & Uptime** | Online, 0 unhandled crashes | Check `GET /api/health` response and process uptime | `PASS` |
| **MongoDB Atlas Connectivity** | Cluster connected, 0 disconnects | Monitor `dbState` in health diagnostics | `NEEDS VERIFICATION` |
| **Edge DNS & SSL Certificate** | Valid SSL, HTTPS enforced | Check SSL expiration date and HSTS headers | `NEEDS VERIFICATION` |
| **4xx / 5xx Error Rates** | 5xx errors = 0 | Review `/admin/monitoring` API Observability table | `PASS` |
| **Payment Webhook Health** | 0 signature validation errors | Check Razorpay Webhook Logs | `NEEDS VERIFICATION` |
| **SMTP Delivery Health** | Zero stuck queue messages | Verify transactional emails reaching recipient inboxes | `NEEDS VERIFICATION` |
| **Rate Limit & Security Audit** | 0 brute-force anomalies | Review 429 rate limit triggers in structured logs | `PASS` |

---

### Phase 2: Weekly Operational Reviews (Weeks 1–4)

| Check Item | Schedule | Scope | Status |
| :--- | :--- | :--- | :--- |
| **Database Snapshot Verification** | Every Monday | Confirm automated daily backups completed on MongoDB Atlas | `NEEDS VERIFICATION` |
| **Certificate Verification Audit** | Every Wednesday | Test QR code and credential lookup for random verified certificates | `PASS` |
| **Payment Reconciliation** | Every Friday | Reconcile Razorpay settlements with backend invoice records | `NEEDS VERIFICATION` |
| **Zero-Placement Policy Audit** | Every Sunday | Scan frontend strings and blogs for prohibited employment terms | `PASS` |
| **Core Web Vitals Review** | Weekly | Check LCP (< 2.5s), CLS (< 0.1), and page load duration | `PASS` |

---

### Phase 3: Bi-Weekly Infrastructure & Security Drills

| Drill / Review Item | Target | Protocol | Status |
| :--- | :--- | :--- | :--- |
| **Staging Restore Drill** | Point-in-time recovery | Restore latest Atlas snapshot into isolated staging database | `NEEDS VERIFICATION` |
| **Secret Rotation Readiness** | Zero hardcoded keys | Audit `.env` files for stale credentials or leaked tokens | `PASS` |
| **Dependency Security Scan** | 0 critical vulnerabilities | Run `npm audit` on frontend and backend dependencies | `PASS` |
| **CORS & CSP Policy Audit** | Strict origin compliance | Verify unauthorized origins receive 403 / CORS rejection | `PASS` |

---

### Phase 4: 30-Day Milestone Sign-Off & Review

| Milestone Criterion | Required Proof | Reviewer | Sign-Off Status |
| :--- | :--- | :--- | :--- |
| **Production Domain & SSL** | `krgloballearning.com` active on DNS | DevOps Lead | `NEEDS VERIFICATION` |
| **Live Payment Processing** | 100% genuine bank settlements | Finance Lead | `NEEDS VERIFICATION` |
| **Live Email Deliverability** | Verified SPF/DKIM/DMARC | Platform Lead | `NEEDS VERIFICATION` |
| **Zero Claims Policy** | No employment or salary promises | Legal / Compliance | `PASS` |
| **Platform Monitoring** | Admin dashboard receiving real metrics | Lead Architect | `PASS` |
| **30-Day Stability Result** | All critical P1/P2 runbooks validated | Managing Director | `READY WITH EXTERNAL VERIFICATION REQUIRED` |

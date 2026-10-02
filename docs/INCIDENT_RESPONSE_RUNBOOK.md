# KR GLOBAL LEARNING PRIVATE LIMITED
## Incident Response Runbook (Production Tier)
**Tagline:** *Learn. Build. Grow. Globally.*  
**Emergency Operational Support:** Phone: `+91 9311073936` | Email: `krglobal0713@gmail.com`  
**Headquarters:** Unit No. 615, Artha Mart, Tech Zone IV, Greater Noida West, Uttar Pradesh – 201318

---

### Incident Severity Classification

| Severity Level | Definition | Target Triage Time | Target Resolution Time |
| :--- | :--- | :--- | :--- |
| **P1 - CRITICAL** | Full outage of frontend, backend, or MongoDB Atlas database; zero user logins possible. | < 15 minutes | < 2 hours |
| **P2 - HIGH** | Payment capture failure, certificate verification outage, or webhook breakdown. | < 30 minutes | < 4 hours |
| **P3 - MEDIUM** | SMTP delay, AI fallback activation, non-blocking administrative dashboard latency. | < 2 hours | < 12 hours |
| **P4 - LOW** | Minor cosmetic glitch, non-critical static asset cache miss. | < 8 hours | Next release window |

---

### Standard Operating Procedures by Scenario

#### 1. Website Unavailable (Frontend CDN / Web Server)
- **Detection:** Synthetic ping failure on `https://krgloballearning.com`, Vercel / Cloudflare edge alert, HTTP 502/503.
- **Immediate Checks:** Check edge provider deployment status (`vercel inspect` or DNS provider dashboard); verify SSL certificate validity.
- **Containment:** Failover to secondary static origin or rollback to previous known immutable production release hash.
- **Recovery:** Clear edge cache purge (`/*`); redeploy vetted production bundle from `dist/`.
- **Verification:** Run `curl -I https://krgloballearning.com` to confirm HTTP 200 with valid HSTS and CSP headers.
- **Post-Incident:** Document edge route cause, DNS propagation latency, and CDN uptime metrics.

#### 2. Backend API Unavailable
- **Detection:** `GET /api/health` returning 5xx or connection refused; APM alert for zero traffic response.
- **Immediate Checks:** Check host container logs via `pm2 status` or container orchestrator; review server memory and CPU metrics.
- **Containment:** Restart backend node cluster via zero-downtime rolling restart (`pm2 reload kr-backend`).
- **Recovery:** Verify port 5000 is listening and reverse proxy (Nginx) correctly proxies upstream requests.
- **Verification:** Execute `GET /api/health` and verify HTTP 200 status with JSON payload containing `status: "online"`.
- **Post-Incident:** Analyze heap dump and request logs for memory leaks or unhandled promise rejections.

#### 3. MongoDB Connection Failure
- **Detection:** Backend reports `connecting_or_error` on `/api/health`; Mongoose emits `disconnected` or `reconnectFailed`.
- **Immediate Checks:** Verify MongoDB Atlas cluster status at `status.mongodb.com`; inspect Network Access IP Whitelist in Atlas console.
- **Containment:** Enable temporary read-only cached mode if possible; ensure connection pool reconnect attempts do not exhaust file descriptors.
- **Recovery:** Update IP access list if host egress IP changed; restart backend connection pool after Atlas replica set primary election finishes.
- **Verification:** Query course count via internal diagnostic check; confirm `readyState === 1`.
- **Post-Incident:** Ensure Atlas static NAT gateway or VPC peering is active to avoid dynamic IP disconnects.

#### 4. Razorpay Payment Gateway Failure
- **Detection:** Spikes in checkout drop-offs; `order creation` errors in `/admin/monitoring`.
- **Immediate Checks:** Check `status.razorpay.com`; verify API credentials in environment (`RAZORPAY_KEY_ID` / `RAZORPAY_KEY_SECRET`).
- **Containment:** Display user-friendly prompt requesting the learner to retry or book a free consultation while checkout is restored.
- **Recovery:** Update API credentials if expired; check webhook endpoint availability.
- **Verification:** Create test order in sandbox mode; confirm signature verification returns authentic.
- **Post-Incident:** Reconcile pending bank charges with Razorpay settlement dashboard; issue manual enrollment if payment succeeded upstream.

#### 5. Webhook Validation Failure
- **Detection:** Increase in `webhookSignatureFailures` metric on `/admin/monitoring`; missed auto-enrollments.
- **Immediate Checks:** Compare webhook secret configured in Razorpay dashboard with `RAZORPAY_WEBHOOK_SECRET` in production `.env`.
- **Containment:** Log raw webhook headers and request ID safely without logging sensitive payloads.
- **Recovery:** Re-sync webhook signing secret; replay unverified webhook events from Razorpay dashboard.
- **Verification:** Post mock test payload signed with HMAC-SHA256 to `/api/payment/webhook` and verify HTTP 200 `status: 'ok'`.
- **Post-Incident:** Audit automated retry mechanism and duplicate event idempotency keys.

#### 6. SMTP Email Delivery Failure
- **Detection:** Registration OTP emails or consultation confirmations failing; SMTP transporter timeouts in logs.
- **Immediate Checks:** Verify Gmail / Google Workspace app password validity; check TLS handshake on port 587.
- **Containment:** Queue failed messages in `EmailLog` collection with retry flag enabled.
- **Recovery:** Re-authenticate SMTP account or switch to backup transactional provider (SendGrid / AWS SES).
- **Verification:** Send test diagnostic email to `krglobal0713@gmail.com` and verify inbox receipt.
- **Post-Incident:** Review daily sending quotas and deliverability reputation (SPF / DKIM / DMARC records).

#### 7. AI Service Provider Outage
- **Detection:** AI Study Assistant or Interview Bot returning 500 or timeout errors.
- **Immediate Checks:** Check Google Gemini or OpenAI status page; verify API key quota limits.
- **Containment:** The system automatically falls back to the deterministic local curriculum engine.
- **Recovery:** Rotate AI API key if quota exhausted; restore primary model connection.
- **Verification:** Submit query to `/api/ai/chat` and ensure fast response without fallback warning.
- **Post-Incident:** Track monthly token consumption and implement token rate-limiting safeguards.

#### 8. Certificate Verification Issue
- **Detection:** Public certificate verification at `/verify-certificate/:credentialId` returning 404 for valid graduates.
- **Immediate Checks:** Query MongoDB `certificates` collection for exact `credentialId`; inspect indexing on `credentialId`.
- **Containment:** Route student queries to manual credential validation desk via official support email.
- **Recovery:** Repair database index; ensure certificate seed records match production student documents.
- **Verification:** Verify `KRT-2026-JAVA-9102` resolves accurately with student name and issue date.
- **Post-Incident:** Implement immutable audit trail for certificate issuance.

#### 9. Authentication & RBAC Issue
- **Detection:** Users unable to log in; unexpected 401/403 spikes across student dashboard or admin routes.
- **Immediate Checks:** Check `JWT_SECRET` stability across instances; inspect token expiry configurations.
- **Containment:** Do NOT log authorization tokens or passwords; verify bcrypt hashing logic.
- **Recovery:** Ensure cluster instances share identical secret configurations; refresh student session tokens.
- **Verification:** Log in with verified student test profile; inspect issued JWT claims and role boundaries.
- **Post-Incident:** Review user password reset flows and session lifetime parameters.

#### 10. Security Incident (DDoS, Brute Force, Injection)
- **Detection:** High 429 rate limit triggers; suspicious repetitive requests; WAF alerts.
- **Immediate Checks:** Identify offending IP ranges via structured logs using `requestId` and reverse proxy headers.
- **Containment:** Block malicious CIDR blocks at edge firewall (Cloudflare / Cloud WAF); tighten rate limiters.
- **Recovery:** Verify database integrity; review audit logs for unauthorized record access.
- **Verification:** Ensure legitimate users can access services without captcha loops.
- **Post-Incident:** File security audit log; notify technical leadership within SLA boundaries.

#### 11. Backup / Restore Emergency
- **Detection:** Data corruption or accidental administrative deletion requiring point-in-time recovery.
- **Immediate Checks:** Locate latest automated snapshot in MongoDB Atlas Backup console.
- **Containment:** Pause all write operations to the active cluster immediately to prevent divergence.
- **Recovery:** Restore snapshot to an isolated staging cluster; verify data integrity; sync delta to production.
- **Verification:** Validate total collection documents (55 courses, users, enrollments, certificates).
- **Post-Incident:** Conduct mandatory root-cause post-mortem and schedule restore drill.

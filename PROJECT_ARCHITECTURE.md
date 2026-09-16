# KR Tech System Architecture & Engineering Blueprint

This document outlines the architectural patterns, data flow, state management, and resiliency engineering powering KR Tech v9.0.

---

## 1. High-Level Architecture Diagram

```
+─────────────────────────────────────────────────────────────────────────────+
|                         KR TECH ARCHITECTURE BLUEPRINT                      |
+─────────────────────────────────────────────────────────────────────────────+
|                                                                             |
|  CLIENT LAYER (Browser / Mobile / Tablet)                                   |
|  ├── Progressive Web App (PWA) Manifest + Service Worker Ready              |
|  ├── Responsive Tailwind CSS v4 UI + Glassmorphism Theme Tokens            |
|  └── React 19 Virtual DOM with Concurrent Mode                              |
|                                                                             |
|  FRONTEND APPLICATION LAYER (Vite 8 SPA)                                    |
|  ├── Route Code Splitting (React.lazy + Suspense Lazy-Chunking)             |
|  ├── ErrorBoundary (Global Unhandled React Crash Interception)             |
|  ├── State & Session Management (AuthContext + localStorage Persistence)    |
|  ├── SEO & Analytics Engine (updateSEOTags + Google Analytics GA4 Emitter)  |
|  └── API Client & Resilience Layer (Axios with Bearer Interceptor)          |
|          │                                                                  |
|          ├── (Offline / Fallback) ──► In-Memory / Local Storage Store       |
|          │                                                                  |
|          ▼ (HTTPS / JSON REST API)                                          |
|  BACKEND API GATEWAY (Node.js + Express 4.21)                               |
|  ├── Security Middleware: Helmet (CSP/HSTS) + Rate Limiter + CORS Whitelist |
|  ├── JSON Body Parsers (Size-bounded DDoS protection)                       |
|  ├── Authentication Middleware (JWT Bearer Token + Role Authorization)      |
|  └── Controllers: Auth, CRM Leads, Courses CRUD, Mentors Directory          |
|          │                                                                  |
|          ▼ (Mongoose ODM / TCP Pool)                                        |
|  DATABASE LAYER (MongoDB Atlas Cloud)                                       |
|  ├── users (Hashed passwords, Roles, Enrolled course sub-documents)         |
|  ├── leads (Conversion status pipeline, preferred times, timezones)         |
|  ├── courses (Categorized curriculums, pricing, syllabi milestones)         |
|  └── mentors (Skills, domain specializations, experience, ratings)          |
|                                                                             |
+─────────────────────────────────────────────────────────────────────────────+
```

---

## 2. Frontend State & Navigation Design

### `AuthContext`
Central state hub storing user session tokens, active role (`student` vs `admin`), and live persistent notifications. Changes to state automatically persist to `localStorage` under `krtech_user` and `krtech_notifications`.

### Dual-Engine Failover Pattern
Every service in `src/services/` implements an offline-resilient pattern:
```typescript
try {
  const res = await api.get("/leads");
  if (res.data?.leads) return res.data.leads;
} catch {
  // Silent fallback to persistent localStorage cache or static dataset
}
return loadLeadsFromStorage();
```

---

## 3. Security Hardening

1. **Helmet**: Injects HTTP security headers including `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection`.
2. **Rate Limiting**: Protects against brute-force password attempts and automated lead spamming.
3. **Password Security**: Uses bcryptjs with salt rounds (10) in Mongoose `pre('save')` lifecycle hook.
4. **JWT Verification**: Token verified on private routes; `role: "admin"` checked for privileged CRUD mutations.

# COURSE CATALOG UPDATE REPORT

**PROJECT:** KR GLOBAL LEARNING PRIVATE LIMITED  
**BRAND IDENTITY:** Learn. Build. Grow. Globally.  
**DATE:** October 3, 2026  
**STATUS:** COMPLETE  

---

## 1. Updated Categories

Four core technology domains were updated and synchronized across the frontend catalog (`src/data/coursesData.ts`), service layer (`src/services/courseService.ts`), UI components, and the backend MongoDB Atlas database (`backend/models/Course.js`):

| Category / Domain | Course Count | Status |
| :--- | :---: | :---: |
| **Cloud & Cloud Architecture** | 17 | **PASS** |
| **AI, Machine Learning & GenAI** | 10 | **PASS** |
| **Cybersecurity** | 14 | **PASS** |
| **Networking** | 12 | **PASS** |
| *Preserved Unaffected Categories (Dev, Enterprise, PM, Data, etc.)* | 31 | **PASS** |
| **Total Catalog Offerings** | **84** | **PASS** |

---

## 2. Number of Courses Updated

- **Total Courses in Target Domains:** 53
- **Preserved Unrelated Courses:** 31
- **Total Catalog Active Courses:** 84
- **Database Synchronization:** 84 canonical documents synced to MongoDB Atlas. Legacy unmapped slugs pruned.

---

## 3. Newly Added Courses

A total of 36 courses were added to expand the catalog to meet the exact domain specifications:

### Cloud & Cloud Architecture
1. **AWS Certified Advanced Networking – Specialty** — `$599`
2. **Azure Network Engineer Associate (AZ-700)** — `$599`
3. **Azure Security Engineer Associate (AZ-500)** — `$599`
4. **Google Cloud Digital Leader** — `$599`
5. **Google Professional Cl…** — `$599` *(Preserved verbatim)*

### AI, Machine Learning & GenAI
6. **AWS Certified AI Practitioner** — `$499`
7. **AWS Certified Machine Learning Engineer – Associate** — `$599`
8. **AWS Certified Machine Learning – Specialty** — `$599`
9. **Microsoft Azure AI Fundamentals (AI-900)** — `$499`
10. **Azure AI Engineer Associate (AI-103)** — `$599`
11. **Google Professional Machine Learning Engineer** — `$599`
12. **Google Cloud Generative AI Leader** — `$599`
13. **Databricks Certified Generative AI Engineer Associate** — `$599`
14. **Databricks Certified Machine Learning Associate** — `$599`
15. **Databricks Certified Machine Learning Professional** — `$599`

### Cybersecurity
16. **CompTIA CySA+** — `$599`
17. **CompTIA PenTest+** — `$699`
18. **CompTIA CASP+ / SecurityX** — `$699`
19. **CompTIA Network+** — `$699`
20. **CISA** — `$699`
21. **CRISC** — `$799`
22. **CCSP** — `$799`
23. **GIAC Penetration Tester (GPEN)** — `$699`
24. **Palo Alto Networks Cybersecurity Certifications** — `$699`
25. **Fortinet NSE / FCP Cybersecurity** — `$699`

### Networking
26. **Cisco CCNP Enterprise** — `$599`
27. **Cisco CCNP Security** — `$599`
28. **Cisco CCNP Data Center** — `$599`
29. **Cisco CCIE Enterprise Infrastructure** — `$599`
30. **Cisco CCIE Security** — `$599`
31. **Cisco DevNet Associate** — `$599`
32. **Cisco CyberOps Associate** — `$599`
33. **Fortinet Certified Fundamentals in Cybersecurity** — `$599`
34. **Fortinet Certified Associate Cybersecurity** — `$599`
35. **Fortinet Certified Professional** — `$599`
36. **Fortinet Certified Solution Specialist** — `$599`

---

## 4. Existing Courses Modified

A total of 17 existing courses had their metadata, pricing, category groups, and description schemas updated to align with the prompt requirements:

1. **AWS Certified Cloud Practitioner** — Updated price to `$499`
2. **AWS Certified Solutions Architect – Associate** — Updated price to `$549`
3. **AWS Certified Solutions Architect – Professional** — Updated price to `$599`
4. **AWS Certified Developer – Associate** — Updated price to `$549`
5. **AWS Certified SysOps Administrator – Associate** — Updated price to `$549`
6. **AWS Certified DevOps Engineer – Professional** — Updated price to `$599`
7. **AWS Certified Security – Specialty** — Updated price to `$599`
8. **Microsoft Azure Fundamentals (AZ-900)** — Updated price to `$499`
9. **Microsoft Azure Administrator (AZ-104)** — Updated price to `$549`
10. **Azure Solutions Architect Expert (AZ-305)** — Updated price to `$599`
11. **Azure DevOps Engineer Expert (AZ-400)** — Updated price to `$599`
12. **Google Associate Cloud Engineer** — Updated price to `$599`
13. **CompTIA Security+** — Updated price to `$599`
14. **Certified Ethical Hacker (CEH)** — Updated price to `$799`
15. **CISSP** — Updated price to `$899`
16. **CISM** — Updated price to `$699`
17. **Cisco CCNA** — Updated price to `$599`

---

## 5. Duplicate Check

| Validation Area | Result | Details |
| :--- | :---: | :--- |
| **Course IDs & Slugs** | **PASS** | 0 duplicate IDs found across all 84 items. |
| **Course Titles** | **PASS** | 0 duplicate titles found across all 84 items. |
| **MongoDB Atlas Records** | **PASS** | 84 total documents in database. 43 legacy duplicate entries pruned. |

---

## 6. Price Validation

| Check Criteria | Result | Notes |
| :--- | :---: | :--- |
| **Exact Price Format** | **PASS** | Strictly matches supplied USD prices: `$499`, `$549`, `$599`, `$699`, `$799`, `$899`. |
| **No Currency Conversions** | **PASS** | Displayed in exact USD; no INR conversions. |
| **Zero Fake Discounts** | **PASS** | No artificial strikethrough original prices, no fake savings/percentage claims. |
| **Vendor Exam Claims** | **PASS** | Explicitly presented as platform course/training program prices, not official vendor exam fee claims. |

---

## 7. Search & Filter Validation

| Feature Area | Result | Notes |
| :--- | :---: | :--- |
| **Category Filters** | **PASS** | UI tabs and API queries for `"Cloud & Cloud Architecture"`, `"AI, Machine Learning & GenAI"`, `"Cybersecurity"`, and `"Networking"` return exact subsets. |
| **Search Functionality** | **PASS** | Keywords (`AWS`, `Azure`, `CompTIA`, `Cisco`, `Fortinet`, `Databricks`, `Google`) filter matching courses across titles and categories accurately. |
| **Course Detail Routing** | **PASS** | Dynamic `/courses/:id` routes functional with verified slug patterns (`/courses/aws-certified-cloud-practitioner`, `/courses/cisco-ccna`, etc.). |
| **Admin Course Management** | **PASS** | Admin category options and Course model schema support editing and management of all 4 domains. |

---

## 8. Build Result

- **Command:** `npm run build`
- **Result:** **PASS** (Exit code `0`)
- **Build Duration:** 5.12 seconds
- **Errors:** 0 errors
- **TypeScript Checking:** 0 type errors

---

## 9. Missing / Incomplete Data

| Item ID | Supplied Title | Status | Notes |
| :--- | :--- | :---: | :--- |
| `google-professional-cl` | **Google Professional Cl…** | **NEEDS TITLE CONFIRMATION** | The source title was intentionally incomplete. Preserved verbatim as `"Google Professional Cl…"` without guessing or fabricating certification names. Flagged for administrative title confirmation. |

---

## 10. Policy & Brand Safety Verification

- **Company Name:** KR GLOBAL LEARNING PRIVATE LIMITED
- **Tagline:** Learn. Build. Grow. Globally.
- **Placement & Job Guarantee Content:** **0 occurrences** (Audited for placement, job guarantee, hiring, CTC, LPA, recruiters, and salary claims).
- **Course Descriptions Focus:** Training, certification preparation, hands-on labs, 1:1 mentorship, and practical projects.

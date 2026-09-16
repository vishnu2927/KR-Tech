# KR Tech — 1:1 Live Coding Academy & Mentorship Platform (v9.0 Production Edition)

[![React 19](https://img.shields.io/badge/React-19.0.0-61dafb.svg)](https://react.dev/)
[![Vite 8](https://img.shields.io/badge/Vite-8.0.5-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS v4](https://img.shields.io/badge/TailwindCSS-v4.0.0-38bdf8.svg)](https://tailwindcss.com/)
[![Node.js Express](https://img.shields.io/badge/Node.js-Express%204.21-339933.svg)](https://expressjs.com/)
[![MongoDB Atlas](https://img.shields.io/badge/Database-MongoDB%20Atlas-47a248.svg)](https://www.mongodb.com/)
[![TypeScript 5.7](https://img.shields.io/badge/TypeScript-5.7.0-3178c6.svg)](https://www.typescriptlang.org/)

KR Tech is an enterprise-grade full-stack EdTech web platform offering personalized one-on-one live coding training, vendor certification tracks, real-time lead/CRM management, student learning portals, and interactive mentor directory with zero-latency caching failovers.

---

## 🚀 Key Features

* **55+ Technical Courses**: Deep curriculums across Java Backend (Spring Boot 3.x), MERN Stack (React 19 & Next.js 15), AWS Solutions Architect, Azure (AZ-104), Cyber Security (CEH), Cisco CCNA, Power BI, SAP S/4HANA, and Salesforce.
* **1:1 Live Demo Booking Engine**: Global modal and dedicated booking flows with timezone selector, validation, and real-time backend synchronization.
* **Dual-Role Authentication**: Seamless JWT authentication for Students and Operations Leads with persistent session storage.
* **Student Dashboard**: 7 active widgets including Today's Live Class (with countdown), Video Lecture Player, Notes library, Assignment tracker, and 1:1 Doubt Solving Box.
* **Admin CRM Portal**: Real-time KPI counters, demo lead status mutation (`New` ➔ `Contacted` ➔ `Scheduled` ➔ `Completed`), registered student rosters, and quick course/mentor managers.
* **Dual-Engine Architecture**: Full API connection to Node.js / MongoDB Atlas with resilient localStorage and in-memory fallback for offline or standalone operation.
* **Production Security**: Express backend armored with Helmet, strict rate limiters, CORS whitelisting, and JWT Bearer route protection.

---

## 🛠️ Tech Stack

### Frontend
* **Core**: React 19, TypeScript 5.7, Vite 8
* **Styling**: Tailwind CSS v4, Glassmorphism, Google Fonts (`Poppins` & `Inter`)
* **Routing**: React Router v7 (`BrowserRouter` with `React.lazy` route code-splitting)
* **Icons**: Custom SVG Icon system (45+ hand-crafted icons)
* **SEO**: Dynamic metadata injector, Canonical links, Open Graph, Twitter Cards

### Backend
* **Runtime**: Node.js & Express 4.21
* **Database**: MongoDB Atlas via Mongoose 8.9
* **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing
* **Security**: Helmet, `express-rate-limit`, CORS configuration

---

## 📦 Quick Start & Local Development

### 1. Clone & Install Dependencies
```bash
# Clone the repository
git clone https://github.com/your-username/kr-tech.git
cd kr-tech

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment Variables
Create `.env` in the root directory:
```env
VITE_API_URL=http://localhost:5000/api
```

Create `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.krtech.mongodb.net/krtech_db?retryWrites=true&w=majority
JWT_SECRET=krtech_super_secure_jwt_key_2026
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

### 3. Run Development Servers
```bash
# Terminal 1: Run Frontend (Port 5173 / 8443)
npm run dev

# Terminal 2: Run Backend (Port 5000)
cd backend
npm run dev
```

---

## 🧪 Production Build & Validation

```bash
# Typecheck TypeScript
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 📄 License
Released under the MIT License. Copyright © 2026 KR Tech Academy.

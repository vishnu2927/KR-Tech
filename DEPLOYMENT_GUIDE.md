# KR Tech Production Deployment Guide

This guide provides step-by-step instructions for deploying KR Tech to Vercel (Frontend), Render (Backend), and MongoDB Atlas (Database).

---

## 1. MongoDB Atlas Setup (Database)

1. Create a free M0 cluster or dedicated cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a Database User (e.g. `krtech_admin` with Read and Write permissions).
3. Whitelist Network Access: Add `0.0.0.0/0` (Allow Access from Anywhere) or specify Render static IP addresses.
4. Copy your Connection String URI:
   ```text
   mongodb+srv://<username>:<password>@cluster0.krtech.mongodb.net/krtech_db?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment on Render

1. Sign in to [Render](https://render.com/).
2. Click **New +** ➔ **Web Service** and connect your GitHub repository.
3. Configure the following settings:
   - **Name**: `krtech-backend-api`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Plan**: `Free` or `Starter`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: `<Your MongoDB Atlas Connection String>`
   - `JWT_SECRET`: `<A strong 64-character random string>`
   - `CLIENT_URL`: `https://krtech.in` (or your Vercel URL)
5. Click **Deploy Web Service**.
6. Copy your deployed Render backend URL (e.g. `https://krtech-backend-api.onrender.com`).

---

## 3. Frontend Deployment on Vercel

1. Sign in to [Vercel](https://vercel.com/).
2. Click **Add New...** ➔ **Project** and import your KR Tech repository.
3. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (Root)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add Environment Variables:
   - `VITE_API_URL`: `https://krtech-backend-api.onrender.com/api`
   - `VITE_GA_TRACKING_ID`: `G-XXXXXXXXXX` (Optional)
5. Click **Deploy**.
6. Vercel automatically applies routing rewrites and security headers from `vercel.json`.

---

## 4. Custom Domain & SSL Verification

1. In Vercel Project Settings ➔ **Domains**, add your custom domain: `krtech.in` and `www.krtech.in`.
2. Configure DNS records at your registrar:
   - `A Record`: `@` ➔ `76.76.21.21`
   - `CNAME Record`: `www` ➔ `cname.vercel-dns.com`
3. In Render Web Service ➔ Update `CLIENT_URL` to `https://krtech.in`.

---

## 5. Post-Deployment Verification

* [ ] `GET https://<your-backend>/api/health` returns `200 OK` with `status: "online"`.
* [ ] Register a new student at `https://krtech.in/signup`.
* [ ] Book a free 1:1 Live Demo at `https://krtech.in/free-demo`.
* [ ] Log in as Admin (`admin@krtech.com` / `admin123`) at `https://krtech.in/login` and verify lead appears in the CRM table.

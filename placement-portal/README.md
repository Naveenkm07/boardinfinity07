# 🎓 College Placement Portal

A production-ready, enterprise-grade full-stack placement management platform designed for scale (10,000+ users). Features email OTP authentication, role-based access control, and a modern responsive UI.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Express](https://img.shields.io/badge/Express-4.21-green?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)

---

## ✨ Features

### Authentication & Security
- 📧 **Email OTP Login** — Passwordless authentication via one-time passcodes
- 🔐 **JWT-based Auth** — Signed tokens with 7-day expiry
- 👥 **Role-Based Access** — Student and Admin roles with route protection
- 🛡️ **Security Hardened** — Helmet, CORS, rate limiting, bcrypt-hashed OTPs
- ✅ **Input Validation** — Zod schemas on every API endpoint

### Architecture
- 🏗️ **Clean Architecture** — Separated controllers, services, routes, middleware
- 📁 **Scalable Structure** — Enterprise SaaS-level folder organization
- 🔄 **API Service Layer** — Axios instance with interceptors
- 📊 **Structured Logging** — Winston (app) + Morgan (HTTP)
- ⚡ **Type Safety** — TypeScript end-to-end

### Frontend
- 🎨 **Modern UI** — Tailwind CSS with glassmorphism and gradient animations
- 📱 **Responsive** — Mobile-first design
- 🔒 **Protected Routes** — Client-side auth guards via Next.js App Router layouts
- 🧩 **Reusable Components** — Button, Input, Card, Spinner, OTP form

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT, bcryptjs, Nodemailer (OTP) |
| **Security** | Helmet, CORS, express-rate-limit, Zod |
| **Deployment** | Vercel (frontend), Render (backend), MongoDB Atlas (database) |

---

## 📁 Project Structure

```
placement-portal/
├── frontend/                 # Next.js App Router
│   ├── src/
│   │   ├── app/              # App Router pages & layouts
│   │   │   ├── (auth)/       # Auth pages (login)
│   │   │   └── (dashboard)/  # Protected pages (student, admin)
│   │   ├── components/       # UI and layout components
│   │   ├── contexts/         # React Context (AuthContext)
│   │   ├── hooks/            # Custom hooks (useAuth, useApi)
│   │   ├── services/         # API service layer (Axios)
│   │   ├── types/            # TypeScript interfaces
│   │   └── lib/              # Utility functions
│   └── package.json
│
├── backend/                  # Express.js API Server
│   ├── src/
│   │   ├── config/           # DB, CORS, env config
│   │   ├── controllers/      # Request handlers
│   │   ├── middleware/       # Auth, role, error, validation, rate limit
│   │   ├── models/           # Mongoose schemas (User, OTP)
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic layer
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # ApiError, ApiResponse, logger
│   │   ├── validators/       # Zod validation schemas
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Server entry point
│   └── package.json
│
├── .env.example              # Environment variables reference
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **MongoDB Atlas** account ([create free cluster](https://www.mongodb.com/atlas))
- **Gmail App Password** ([generate here](https://myaccount.google.com/apppasswords))

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/placement-portal.git
cd placement-portal
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Edit .env with your actual values (MongoDB URI, SMTP credentials, JWT secret)
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install

# Create environment file
cp .env.local.example .env.local
# Edit .env.local with your backend API URL
```

### 4. Start Development Servers

**Backend** (runs on port 5000):
```bash
cd backend
npm run dev
```

**Frontend** (runs on port 3000):
```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `development` |
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (min 16 chars) | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | Token expiry duration | `7d` |
| `SMTP_HOST` | Email server host | `smtp.gmail.com` |
| `SMTP_PORT` | Email server port | `587` |
| `SMTP_EMAIL` | Sender email address | `you@gmail.com` |
| `SMTP_PASS` | Email app password | `xxxx-xxxx-xxxx` |
| `CLIENT_URL` | Frontend URL (CORS whitelist) | `http://localhost:3000` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Overview

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/send-otp` | Send OTP to email | ❌ |
| POST | `/api/auth/verify-otp` | Verify OTP, get JWT | ❌ |
| GET | `/api/auth/me` | Get current user | ✅ |

### Users

| Method | Endpoint | Description | Auth | Role |
|--------|----------|-------------|------|------|
| GET | `/api/users/profile` | Get own profile | ✅ | Any |
| PATCH | `/api/users/profile` | Update own profile | ✅ | Any |
| GET | `/api/users` | List all users | ✅ | Admin |
| DELETE | `/api/users/:id` | Delete a user | ✅ | Admin |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | API status check |

---

## 🔒 Security Implementation

| Feature | Implementation |
|---------|---------------|
| **OTP Storage** | bcrypt-hashed — never stored in plaintext |
| **OTP Expiry** | MongoDB TTL index auto-deletes after 10 minutes |
| **Brute Force Protection** | Max 5 OTP verification attempts + IP rate limiting |
| **Rate Limiting** | 100 req/15min global, 5 req/15min on OTP endpoints |
| **JWT Tokens** | HMAC-signed, 7-day expiry |
| **CORS** | Whitelist only `CLIENT_URL` |
| **Headers** | Helmet for CSP, HSTS, X-Frame-Options, etc. |
| **Input Validation** | Zod schemas on every request body |
| **Error Handling** | Global middleware catches all errors, sanitizes in production |
| **Logging** | Winston structured logs, Morgan HTTP access logs |

---

## 🚢 Deployment Guide

### Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) → Import project
3. Set root directory to `frontend`
4. Add environment variable: `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com/api`
5. Deploy

### Backend → Render

1. Go to [render.com](https://render.com) → New Web Service
2. Connect your GitHub repo
3. Set root directory to `backend`
4. Build command: `npm install && npm run build`
5. Start command: `npm start`
6. Add all environment variables from `backend/.env`

### Database → MongoDB Atlas

1. Go to [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free M0 cluster
3. Create a database user
4. Whitelist IPs (or use `0.0.0.0/0` for Render)
5. Copy the connection string to `MONGO_URI`

---

## 📝 Scripts Reference

### Backend

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start with nodemon (hot reload) |
| `build` | `npm run build` | Compile TypeScript to `dist/` |
| `start` | `npm start` | Run compiled production code |
| `lint` | `npm run lint` | Run ESLint |
| `format` | `npm run format` | Format with Prettier |

### Frontend

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server |
| `build` | `npm run build` | Build for production |
| `start` | `npm start` | Serve production build |
| `lint` | `npm run lint` | Run Next.js ESLint |
| `format` | `npm run format` | Format with Prettier |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for streamlining campus placements
</p>

# 🎓 College Placement Portal

A comprehensive, state-of-the-art full-stack placement management platform. Beyond standard job tracking, it integrates **Generative AI**, **Real-Time Collaboration**, and **WebRTC Video** to provide a complete career preparation ecosystem for students and a robust management suite for administrators.

![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue?logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![Express](https://img.shields.io/badge/Express-4.21-green?logo=express)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)
![Google Gemini](https://img.shields.io/badge/AI-Google_Gemini-blue?logo=google-gemini)
![Socket.io](https://img.shields.io/badge/Real--time-Socket.io-black?logo=socket.io)

---

## ✨ Key Features

### 🤖 AI-Powered Career Tools
- **Smart ATS Resume Scorer** — Leverages Google Gemini to analyze resumes against job descriptions, providing match scores, strength analysis, and missing skill detection.
- **AI Coding Assistant** — Integrated with the Monaco Editor to provide conceptual logic hints during technical assessments without giving away the full solution.
- **AI Mock Interviewer** — A full-featured text-based interview environment where an AI recruiter asks technical/HR questions and provides a detailed performance report.

### ⚡ Real-Time & Interactive
- **Peer-to-Peer Video Mock Interviews** — Direct browser-to-browser video streaming via **WebRTC** (PeerJS) for secure, zero-cost mock interview sessions.
- **Multiplayer Collaborative Coding** — Real-time code synchronization using **Yjs**, allowing two students to type in the same editor simultaneously.
- **Instant Notifications** — **Socket.io** integration for real-time alerts on job application status updates, mentorship bookings, and system announcements.

### 💼 Placement & Academic Management
- **Job & Application Workflow** — Full CRUD system for job postings with status tracking (Applied, Shortlisted, Interview, Offered).
- **Company Prep Tracks** — Curated learning paths (Courses, Assessments, Resources) designed for specific companies like Amazon, Google, or TCS.
- **Automated Certificates** — Dynamic PDF certificate generation via `pdf-lib` upon 100% course completion.
- **Public Portfolios** — Auto-generated, shareable student portfolios showcasing platform rank, badges, skills, and GitHub highlights.

### 🏆 Community & Gamification
- **Interview Experience Forum** — A peer-to-peer forum for sharing detailed interview rounds, questions, and tips.
- **Hall of Fame (Leaderboard)** — Gamified ranking system where students earn points and badges for platform activity.
- **Alumni Mentorship** — 1-on-1 booking system connecting current students with placed alumni for guidance.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 14 (App Router), React 18, TypeScript, Tailwind CSS, Axios |
| **Backend** | Node.js, Express.js, TypeScript, pdf-lib |
| **Real-Time** | Socket.io, PeerJS (WebRTC), Yjs (CRDT) |
| **AI Engine** | Google Gemini 1.5 Flash (via `@google/genai`) |
| **Code Editor** | Monaco Editor (`@monaco-editor/react`) |
| **Database** | MongoDB Atlas (Mongoose ODM) |
| **Auth** | JWT, bcryptjs, Nodemailer (OTP) |

---

## 📁 Project Structure

```
placement-portal/
├── frontend/                 # Next.js App Router
│   ├── src/
│   │   ├── app/              # (auth), (dashboard), portfolio/, etc.
│   │   ├── components/       # UI (Card, Button, Input) & Layout
│   │   ├── contexts/         # AuthContext, NotificationContext
│   │   ├── services/         # API Layer (Job, AI, Interview, etc.)
│   │   └── types/            # Shared TypeScript interfaces
│   └── package.json
│
├── backend/                  # Express.js API Server
│   ├── src/
│   │   ├── controllers/      # Job, Interview, Experience, etc.
│   │   ├── models/           # Mongoose schemas
│   │   ├── routes/           # API route definitions
│   │   ├── services/         # Business logic (AI, Certificate, etc.)
│   │   └── utils/            # Socket.io, pdfParser, logger
│   └── package.json
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.0.0
- **npm** ≥ 9.0.0
- **MongoDB Atlas** account
- **Google AI Studio API Key** ([get one for free](https://aistudio.google.com/))
- **Gmail App Password**

### Setup

1. **Clone & Install:**
   ```bash
   git clone https://github.com/your-username/placement-portal.git
   cd placement-portal/backend && npm install
   cd ../frontend && npm install
   ```

2. **Environment Variables:**
   - Configure `backend/.env` (see table below).
   - Configure `frontend/.env.local` with `NEXT_PUBLIC_API_URL`.

3. **Run:**
   - Backend: `npm run dev` (Port 5000)
   - Frontend: `npm run dev` (Port 3000)

---

## 🔐 Environment Variables (Backend)

| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB Connection String |
| `JWT_SECRET` | Secret for signed tokens |
| `GEMINI_API_KEY` | API Key from Google AI Studio |
| `SMTP_EMAIL/PASS` | Credentials for OTP emails |
| `FRONTEND_URL` | URL of your frontend (for CORS/Socket) |

---

## 📡 Key API Endpoints

| Category | Endpoint | Description |
|----------|----------|-------------|
| **Jobs** | `/api/jobs` | List, Post, Apply, Manage status |
| **AI** | `/api/users/score-resume` | Scan resume against job desc |
| **Interview** | `/api/interview/start` | Start AI mock session |
| **Peer** | `/api/interview/peer` | Signaling for WebRTC rooms |
| **Forum** | `/api/experiences` | Interview forum CRUD |
| **Social** | `/api/mentorship/book` | Book session with Alumni |

---

## 🚢 Deployment Guide

- **Frontend:** Deploy to **Vercel** or **Netlify**. Ensure `NEXT_PUBLIC_API_URL` is set.
- **Backend:** Deploy to **Render**, **Railway**, or **Railway**. Use a persistent disk if not using S3 for resumes.
- **Database:** **MongoDB Atlas** (M0 Free Tier).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with ❤️ for streamlining campus placements
</p>

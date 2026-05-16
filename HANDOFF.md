# 🤖 AI Agent Handoff & Project Roadmap

## 🎯 Project Overview
**College Placement Portal** - A comprehensive platform for students, admins, and recruiters. Built with a **Node.js/Express/MongoDB backend** and a **Next.js 14/React/Tailwind frontend**.

This file serves as a **Strategic Handoff Document** for future AI agents to understand the project trajectory, planned features, and the constraints (specifically: using **100% free/open-source tools**).

---

## 🚀 1. Core Platform Features (To Be Implemented)

### 🧑‍💻 Coding Assessment Environment (Monaco Editor)
*   **Goal:** Allow students to take technical tests directly on the platform.
*   **Frontend Implementation:** 
    *   Use `@monaco-editor/react` (Free, open-source IDE built by Microsoft).
    *   Features: Syntax highlighting, auto-completion, dark/light themes.
*   **Code Execution Engine (Backend):**
    *   Use **Judge0 CE (Community Edition)** via their free public API or hosted locally via Docker. 
    *   *Alternative:* Use `Piston` (Free open-source code execution API).

### 📄 Resume Management & Parsing
*   **Goal:** Students upload resumes, and the system extracts skills.
*   **Implementation:** 
    *   **Storage:** Local filesystem or Cloudinary (Free tier) / Firebase Storage.
    *   **Parsing:** `pdf-parse` (Node.js library) to extract raw text for free.

### 🏢 Job Postings & Applications
*   **Goal:** Admins/Recruiters can post jobs; students can apply.
*   **Implementation:** Standard CRUD operations in MongoDB. Include application tracking status (Applied, Shortlisted, Interview, Offered).

---

## 🧠 2. AI Features (100% Free / Generative AI)

Future AI agents should implement these using free tiers of major AI providers (e.g., Google Gemini Free API, HuggingFace free inference, Groq).

### 🤖 A. Smart ATS Resume Scorer
*   **What it does:** Compares a student's resume against a job description and gives a match percentage.
*   **Free Implementation:**
    *   Extract resume text using `pdf-parse`.
    *   Send text + Job Description to **Google Gemini Free API** (`@google/genai`) with a prompt to return a JSON containing a match score and missing skills.

### 💡 B. AI Coding Assistant (Integrated with Monaco Editor)
*   **What it does:** Acts like a mentor during coding assessments. If a student is stuck, they can click "Get AI Hint".
*   **Free Implementation:**
    *   Send the current Monaco editor code + the problem statement to **Gemini API**.
    *   Prompt constraint: *“Do NOT give the exact code solution. Give a conceptual hint to guide the student.”*

### 🗣️ C. AI Mock Interview Chatbot
*   **What it does:** A text-based chat interface where students practice technical or HR interview questions.
*   **Free Implementation:**
    *   Use **Gemini API** or **Groq API** (Llama 3 - super fast, free tier).
    *   System Prompt: *"You are an expert technical recruiter at a top tech company. Ask the user one interview question at a time. Evaluate their answer before asking the next."*

### 📊 D. Intelligent Job Recommendations
*   **What it does:** Recommends jobs on the student dashboard based on their profile.
*   **Free Implementation:**
    *   No expensive databases needed. Use traditional TF-IDF (Text Frequency) matching using natural Node.js NLP libraries (`natural`), OR
    *   Use Google Gemini to generate embeddings, and store them in MongoDB (MongoDB Atlas allows vector search on the free tier!).

---

## 📈 3. Value-Add Community & Analytics Features (100% Free / Open Source)

These features enhance engagement and provide actionable insights without relying on paid third-party services.

### 🏆 Gamification & Leaderboard
*   **What it does:** Students earn points and badges for completing coding assessments, mock interviews, and applying for jobs.
*   **Implementation:** Store a `points` field in the User schema. Build a leaderboard UI using Tailwind CSS to rank students by score.

### 🤝 Alumni Mentorship Booking
*   **What it does:** Connects current students with placed alumni for 1-on-1 guidance.
*   **Implementation:** 
    *   Add an `isAlumni` flag to the User model.
    *   Build a custom booking calendar using `react-big-calendar` or `react-calendar` (free libraries).
    *   Send automated email invites using `nodemailer`.

### 📊 Admin Analytics Dashboard
*   **What it does:** Gives admins visual insights into placement rates, top skills, and active companies.
*   **Implementation:** Use **Recharts** or **Chart.js** (both free, open-source React libraries) to render beautiful bar charts and pie charts based on MongoDB aggregations.

### 🌐 Auto-Generated Student Portfolios
*   **What it does:** Automatically generates a public portfolio link for a student based on their portal profile, resume, and coding scores.
*   **Implementation:** Create a dynamic Next.js route (e.g., `/portfolio/[username]`) that renders their data in a polished, shareable template. No extra hosting needed; it runs within the Next.js app.

### 💬 Interview Experience Forum
*   **What it does:** A mini-forum where placed students can post their interview experiences and typical questions asked by specific companies.
*   **Implementation:** A simple CRUD feature in MongoDB (Posts, Comments, Upvotes) styled like Reddit or StackOverflow.

---

## ⚡ 4. Advanced Interactive & Utility Features (100% Free / Open Source)

These features push the platform to the next level by introducing real-time interaction and automated utilities.

### 🔔 Real-Time Notifications & Alerts
*   **What it does:** Students get instant pop-up notifications when a new job is posted, an interview is scheduled, or an assessment is graded.
*   **Implementation:** Use **Socket.io** (free open-source WebSocket library). The Node.js backend pushes events to the Next.js frontend instantly without requiring page reloads.

### 📜 Automated Certificate Generation
*   **What it does:** Automatically generates and emails downloadable PDF certificates when a student completes a specific coding track or course.
*   **Implementation:** Use `pdf-lib` or `html-pdf-node` to dynamically overlay student names and dates onto a pre-designed certificate template.

### 📹 Peer-to-Peer Video Mock Interviews
*   **What it does:** Allows students to pair up and conduct video mock interviews with each other directly in the browser.
*   **Implementation:** Use **WebRTC** via the `peerjs` library. This allows direct browser-to-browser video streaming completely free of cost, with no need for expensive video hosting servers like Twilio or Zoom APIs.

### 🤝 Live Collaborative Coding (Multiplayer)
*   **What it does:** Two students (or a student and a mentor) can type in the same Monaco Editor at the same time, similar to Google Docs or Replit.
*   **Implementation:** Combine the **Monaco Editor** with **Yjs** (a framework for collaborative editing) and **Socket.io** to sync keystrokes in real-time.

### 🏢 Company-Specific Preparation Tracks
*   **What it does:** Curated study paths (e.g., "TCS Ninja Prep", "Amazon SDE Prep") that bundle specific coding questions, past interview experiences, and required skills.
*   **Implementation:** Relational data modeling in MongoDB. Create a `Tracks` collection that links specific `Assessments` and `Resources` together, unlocked sequentially by the student.

---

## 🛠️ Implementation Guidelines for Future AI Agents

1.  **Framework Adherence:** 
    *   Backend routes MUST follow the `express.Router()` pattern in `routes/`.
    *   Controllers MUST handle `req, res, next` and return data using the `ApiResponse.success()` wrapper.
    *   Frontend components MUST be built with Next.js App Router and Tailwind CSS.
2.  **Authentication:** 
    *   All protected backend routes must use the `authenticate` middleware.
    *   Frontend API calls must use the `useApi()` hook which automatically injects the JWT token.
3.  **Cost Constraints:** 
    *   **DO NOT** introduce paid services (like AWS, OpenAI Paid Tier, SendGrid Paid).
    *   Rely on `nodemailer` for emails, local/MongoDB for storage, and Gemini Free API / HuggingFace for AI.

---
**End of Handoff**
*AI Agent: Read this file when initiating new feature development to ensure alignment with the product vision.*
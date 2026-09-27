# ResumeMatch 🚀

> **Production-Quality Resume Optimization & Job-Matching SaaS Platform**

ResumeMatch is a modern full-stack web application designed for developers and job seekers to analyze, optimize, and engineer their resumes against specific target Job Descriptions (JDs).

Unlike black-box ATS scorers, ResumeMatch provides **explainable multi-signal matching**, detailed skill gap matrices with explicit resume evidence, anti-hallucination AI bullet suggestions, live interactive resume editing, and version control comparison.

---

## ⭐️ Key Features

1. **Dual Ingestion Studio**: Drag & drop support for PDF, DOCX, and TXT resumes along with rich Job Description text parsing.
2. **Deterministic & Multi-Signal Scoring Engine**: Weighted multi-signal formula (Required Skills 30%, Preferred Skills 10%, Experience Alignment 20%, Responsibilities 15%, Keyword Coverage 10%, Project Evidence 10%, Education 5%).
3. **Skill Normalization Layer**: Synonym mapping dictionary (`Postgres` $\leftrightarrow$ `PostgreSQL`, `Spring` $\leftrightarrow$ `Spring Boot`, `ReactJS` $\leftrightarrow$ `React`).
4. **Interactive Skill Matrix**: Filterable table mapping required vs preferred skills, match percentages, exact resume text evidence, confidence flags, and action recommendations.
5. **Categorized Skill Gaps**: Distinguishes Critical, Important, and Nice-to-Have gaps without encouraging fake skills or hallucinated metrics.
6. **Built-in Resume Editor**: Notion-style structured editor with inline section controls and "Improve with AI" bullet enhancer.
7. **Live Score Delta & Version History**: Real-time re-analysis tracking score progression (v1 $\rightarrow$ v2) with side-by-side text diff highlighting.
8. **Instant Demo Mode**: Pre-populated backend engineer data allowing immediate zero-configuration testing out of the box.

---

## 🛠 Tech Stack

* **Frontend**: Next.js 14+ (App Router), React, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion.
* **Document Extraction**: Node.js pipeline with `pdf-parse` (PDF) and `mammoth` (DOCX).
* **AI Provider Strategy Pattern**: Abstracted `AIProvider` interface supporting OpenAI, Google Gemini, and `MockAIProvider` for local offline dev.
* **Database & ORM**: PostgreSQL & Prisma ORM.

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
cd resumematch
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License
MIT License

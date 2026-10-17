# RankFirst AI

> **Autonomous Search Intelligence & Generative Engine Optimization (GEO) SaaS**  
> Accelerate organic search queries into Rank #1 and optimize content for AI Overviews, Perplexity, and ChatGPT Search at zero hosting cost ($0 stack).

---

## ?? Tech Stack & Architecture

- **Framework**: Next.js 14+ (App Router with `src/` directory, React 19)
- **Styling**: Tailwind CSS v4 + Lucide React
- **Database**: Turso (libSQL Edge SQLite)
- **AI & Embeddings**: Google Gemini 2.0/1.5 Flash + Google `text-embedding-004`
- **Security Vault**: AES-256-GCM Token & Key Encryption at Rest
- **Auth**: NextAuth.js (Auth.js v5) with Google OAuth 2.0
- **Validation**: Strict Zod Schemas

---

## ?? Environment Variables Setup

All secrets must be stored locally in `.env.local`. **Never commit `.env.local` to GitHub.**

### 1. Copy the Template
```bash
cp .env.example .env.local
```

### 2. Environment Variables Reference

| Variable | Description | How to Obtain / Generate |
| :--- | :--- | :--- |
| `NEXTAUTH_URL` | Base canonical URL of the app | `http://localhost:3000` for local dev |
| `NEXTAUTH_SECRET` | Session cookie encryption secret | Generate via terminal: `openssl rand -base64 32` or `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"` |
| `ENCRYPTION_MASTER_KEY` | 32-byte hex key for AES-256-GCM vault | Generate via terminal: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` (must be exactly 64 hex characters) |
| `TURSO_DATABASE_URL` | Turso edge database connection URL | From Turso CLI or dashboard (`turso db show <db-name> --url`) |
| `TURSO_AUTH_TOKEN` | Turso authentication token | From Turso CLI: `turso db tokens create <db-name>` |
| `GEMINI_API_KEY` | Google AI Studio API key | Free tier key from [Google AI Studio](https://aistudio.google.com/) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | Google Cloud Console -> APIs & Services -> Credentials |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | Google Cloud Console -> APIs & Services -> Credentials |

---

## ?? Dual-Developer Collaboration Protocol

This project follows a **50/50 Vertical-Slice Engineering Model**. Both developers work across the full stack (Frontend, Backend, and AI) without stepping on each other's code.

### ?? Branch Strategy

```
main (protected baseline)
  +-- dev/slice-1a-gsc-oauth         <-- DEV 1 (Slice 1A)
  +-- dev/slice-1b-bing-ingestion    <-- DEV 2 (Slice 1B)
```

---

## ?? Dev 1: Quickstart & Onboarding Guide

Welcome, **Dev 1**! Here is how to set up your local development environment and start building your feature slice.

### Step 1: Clone & Install
```bash
git clone https://github.com/<REPO_OWNER>/rankfirst-ai.git
cd rankfirst-ai
npm install
```

### Step 2: Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your local secrets. Generate your own `ENCRYPTION_MASTER_KEY` and `NEXTAUTH_SECRET` using the commands in the table above.

### Step 3: Switch to Your Feature Branch
```bash
git checkout -b dev/slice-1a-gsc-oauth
```

### Step 4: Your Phase 1 Scope (Slice 1A)
You own the **Google Search Console (GSC) Integration** slice:
1. **Backend**:
   - Implement the Google Search Console OAuth2 flow requesting `webmasters.readonly` scope.
   - Set up the token refresh cycle.
   - Use `src/lib/crypto.ts` to encrypt OAuth refresh tokens with AES-256-GCM before saving to Turso.
2. **Frontend**:
   - Build the GSC Connection Wizard card and OAuth callback status screen in `src/app/settings/page.tsx` or `src/components/settings/`.

### Step 5: Golden Rules for Dev 1 & Dev 2
- ? **Always import from `@/*`**: Use path aliases like `@/components/...` and `@/lib/...`.
- ? **Shared Types First**: Put all shared database models, API response types, and schemas inside `src/types/index.ts`.
- ? **Zod Validation**: Always validate incoming payloads and external API responses with Zod.
- ? **Never push directly to `main`**: Always submit a Pull Request (`dev/slice-1a-gsc-oauth` -> `main`) for review.
- ? **Never commit secrets**: Verify `.env.local` is listed in `.gitignore` before pushing.

---

## ?? Available Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack at `http://localhost:3000`
- `npm run build`: Compiles production build and runs TypeScript verification
- `npm run start`: Starts production server
- `npm run lint`: Runs ESLint checks

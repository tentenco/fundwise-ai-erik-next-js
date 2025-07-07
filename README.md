# FundWise AI 🚀

**AI-Powered VC Screening Platform**

FundWise AI automates the first-round founder interview and screening process for venture capital teams. VCs can intake pitch emails, conduct AI-driven interviews, and generate structured investment memos, saving 30-40 hours per partner per month.

## ✨ Features

- **🎯 Automated Screening**: AI conducts dynamic interviews based on founder pitches
- **📊 Smart Scoring**: Instant investment memos with structured analysis and 0-100 scoring
- **⚡ Pipeline Management**: Kanban board to manage deals from intake to decision in <24h
- **🤖 AI Interview Agent**: GPT-4o powered dynamic Q&A with real-time adaptation
- **📧 Email Intake**: Automatic parsing and founder record creation
- **📋 Investment Memos**: AI-generated summaries with strengths, weaknesses, and recommendations

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Clerk Authentication
- **Database**: Neon PostgreSQL, Drizzle ORM
- **AI**: OpenAI GPT-4o, LangChain
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn
- Neon PostgreSQL database
- Clerk account
- OpenAI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/tentenco/fundwise-ai-erik-next-js.git
   cd fundwise-ai-erik-next-js
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your keys to `.env.local`:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

   # Neon Database
   DATABASE_URL=your_neon_database_url

   # OpenAI
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

## 🚀 Deployment

### Deploy to Vercel

1. **Push to GitHub** (this repository)

2. **Connect to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Import project from GitHub
   - Select this repository

3. **Add Environment Variables** in Vercel dashboard:
   ```
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
   CLERK_SECRET_KEY
   DATABASE_URL
   OPENAI_API_KEY
   ```

4. **Deploy!** 🎉

---

**🤖 Generated with [Claude Code](https://claude.ai/code)**
# Life OS

The central dashboard/operating system for tracking daily metrics, habits, journal logs, and expenses.

## Project Foundation (Build A)

This project has been set up with Next.js 16 (App Router), TypeScript, and Tailwind CSS.

### Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Database configuration:**
   Copy `.env.example` to `.env.local` and fill in your Supabase connection credentials:
   ```bash
   cp .env.example .env.local
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

4. **Verify environment and build:**
   ```bash
   npx tsc --noEmit
   npm run build
   ```

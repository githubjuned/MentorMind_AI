# MentorMind AI 🧠🚀

**MentorMind AI** is a multi-agent AI personalized learning platform built with Next.js, TypeScript, Tailwind CSS, and Drizzle ORM. It provides students with a centralized ecosystem to solve doubts, generate structured notes, attempt adaptive quizzes, plan study schedules, track academic mastery, revise weak topics via spaced repetition, and receive personalized learning recommendations.

---

## 🌟 Key Features

### 1. Central AI Coordinator
- Intelligently classifies student requests and intent.
- Retrieves student learning telemetry (weak topics, repeated mistakes, goals, preferred explanation styles).
- Automatically routes prompts to the specialized agent and coordinates the response.

### 2. Seven Specialized AI Agents
1. **AI Doubt Solver Agent**: Step-by-step conceptual explanations, worked examples, key takeaways, and follow-ups.
2. **Notes Generation Agent**: Generates short, detailed, bullet-point, exam-prep, revision sheets, and chapter summaries with export to Markdown and printable PDF.
3. **Quiz Generation Agent**: Creates quizzes across MCQ, True/False, Fill-in-the-blank, and Short Answer formats with timers, instant grading, and in-depth explanations.
4. **Smart Study Planner Agent**: Builds schedules based on exam dates, daily available hours, and weekly availability; includes calendar integration and daily routine focus timers.
5. **Progress Tracking Agent**: Analyzes learning hours, study streaks, subject-wise mastery, and quiz performance trends.
6. **Revision Assistant Agent**: Spaced repetition queue ranked by urgency; includes interactive flashcards, practice questions, and mistake review.
7. **Learning Resource Recommendation Agent**: Recommends curated videos, articles, documentation, and practice materials with canonical, verified URLs.

### 3. Personalized Learning Memory
- Differentiates between stored (user-provided) preferences and inferred (system-derived) learning patterns.
- Keeps track of recurring mistakes, weak topics, and study habits.
- Gives students full sovereignty over their data with options to pause personalisation, edit preferences, clear history, or export to JSON.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (App Router, React 19)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Database & ORM**: Drizzle ORM, PostgreSQL (`pg`) with automatic local-first fallback
- **AI Orchestration**: Modular AI service layer with Gemini API integration & intelligent fallback engine

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/githubjuned/MentorMind_AI.git
cd MentorMind_AI
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup (Optional)
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Configure environment variables if you want to connect a live PostgreSQL database or Gemini API key:
```env
# Optional: Live PostgreSQL database
DATABASE_URL=postgresql://user:password@localhost:5432/mentormind

# Optional: Live Gemini AI Model
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for production
```bash
npm run build
npm run start
```

---

## 📄 License
MIT License.


"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { AlertCircle, CheckCircle, GraduationCap } from "lucide-react";

export default function DisclaimerPage() {
  return (
    <PublicPageLayout
      eyebrow="Academic Notice"
      title="Disclaimer & Academic Guidelines"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Disclaimer" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-xs text-amber-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <AlertCircle className="h-5 w-5 text-amber-600" />
            Important Notice on Generative AI Study Assistance
          </div>
          <p className="mt-2 leading-relaxed">
            MentorMind AI utilizes advanced Large Language Models (LLMs) including Google Gemini to generate practice problems, explanations, and study schedules. Artificial intelligence outputs may occasionally contain factual errors, outdated syllabus conventions, or imperfect reasoning (&quot;hallucinations&quot;).
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Educational Supplement Only</h2>
          <p>
            The materials, solutions, quizzes, and agent advice provided by MentorMind AI are meant strictly as an educational supplement for conceptual reinforcement and revision. They do NOT constitute official curriculum materials, accredited academic advice, or a guarantee of examination performance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Independent Verification Required</h2>
          <p>
            Students are strongly advised to cross-reference AI-generated explanations, formulas, historical dates, and scientific equations with prescribed textbooks, school syllabi, official board materials (e.g., NCERT, ICSE, Cambridge), and verified teacher guidance.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Academic Integrity & Anti-Cheating</h2>
          <p>
            MentorMind AI is engineered to promote deep comprehension through active recall and the Socratic method. It must NOT be used:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>To submit AI responses verbatim as original student homework or school assignments.</li>
            <li>During invigilated, closed-book, or proctored school/university exams.</li>
            <li>In violation of any institutional honor code or examination regulations.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. No Professional Advice</h2>
          <p>
            Content generated across STEM, medical, legal, or financial subjects is strictly for educational practice and does not constitute professional medical, legal, or financial advice. <strong>[LEGAL COMPANY NAME]</strong> disclaims all liability for decisions made in reliance on platform outputs.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

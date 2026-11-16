import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  Brain,
  CheckCircle2,
  Layers,
  Network,
  RotateCcw,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Card } from "@/components/common/ui";

export const metadata: Metadata = {
  title: "How It Works · MentorMind AI",
  description:
    "See how MentorMind AI turns study materials and doubts into structured notes, adaptive quizzes, and high-retention revision.",
};

const STEPS = [
  {
    number: "01",
    title: "Ask a Doubt or Upload Materials",
    description:
      "Interact naturally. Type an open-ended concept query or upload lecture slides, PDF manuals, or course notes in PDF, DOCX, or text format.",
    details: [
      "Select your preferred explanation style (Practical, Code-First, Step-by-Step)",
      "Direct document extraction with automated summarization",
      "No prompt engineering required",
    ],
    icon: Sparkles,
    color: "#8b7bff",
  },
  {
    number: "02",
    title: "Central Coordinator Analyzes & Routes",
    description:
      "Our central coordinator interprets your intent, pulls your existing learning history, and hands the task to the specialized domain agent.",
    details: [
      "Real-time intent classification with Gemini AI",
      "Injects your existing mastery telemetry as context",
      "Ensures you aren't overwhelmed with repetitive basics",
    ],
    icon: Network,
    color: "#22d3ee",
  },
  {
    number: "03",
    title: "Specialized Agent Generates Learning Artifacts",
    description:
      "Receive rich, formatted outputs: interactive code walkthroughs, exportable markdown notes, or timed multiple-choice practice quizzes.",
    details: [
      "Download notes as PDF or clean Markdown",
      "Take interactive quizzes with immediate grading and rationale",
      "Generate customizable study plans ahead of your exam date",
    ],
    icon: Layers,
    color: "#fbbf24",
  },
  {
    number: "04",
    title: "Telemetry Refines Your Personal Memory",
    description:
      "Every answer and study minute updates your dashboard telemetry. Mistake patterns trigger spaced-repetition revision schedules automatically.",
    details: [
      "Strict per-user data isolation in Firebase Realtime Database",
      "Forgetting-curve calculations schedule revision before you forget",
      "Transparent learning memory: stored facts vs. inferred telemetry",
    ],
    icon: TrendingUp,
    color: "#34d399",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicPageLayout
      eyebrow="Workflow"
      title={
        <>
          From Question to Concept Mastery in <span className="gradient-text">Four Steps</span>
        </>
      }
      subtitle="Understand the end-to-end orchestration that powers your personal AI learning ecosystem."
      breadcrumbs={[{ label: "How It Works" }]}
    >
      <div className="space-y-12">
        {/* Step Flow List */}
        <div className="grid gap-8">
          {STEPS.map((step, idx) => (
            <Card key={step.number} className="p-6 sm:p-8 relative overflow-hidden border-line">
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div
                  className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl font-display text-2xl font-black"
                  style={{ background: `${step.color}22`, color: step.color }}
                >
                  {step.number}
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <step.icon className="h-5 w-5" style={{ color: step.color }} />
                    <h2 className="font-display text-xl font-bold text-ink sm:text-2xl">
                      {step.title}
                    </h2>
                  </div>

                  <p className="text-sm leading-relaxed text-muted max-w-3xl">
                    {step.description}
                  </p>

                  <ul className="grid gap-2 sm:grid-cols-2 pt-2 text-xs text-muted">
                    {step.details.map((detail, dIdx) => (
                      <li key={dIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Closed Loop Learning Diagram */}
        <Card className="p-8 border-brand/30 bg-brand/5 text-center space-y-4">
          <p className="eyebrow">The Continuous Feedback Loop</p>
          <h2 className="font-display text-2xl font-bold">
            Learning That Adapts With You Every Day
          </h2>
          <p className="max-w-xl mx-auto text-sm text-muted">
            The more you study, quiz, and summarize with MentorMind, the sharper its recommendations become.
            Zero random dummy data. 100% genuine academic progress.
          </p>
          <div className="pt-2">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Start Free Learning Now
            </Link>
          </div>
        </Card>
      </div>
    </PublicPageLayout>
  );
}

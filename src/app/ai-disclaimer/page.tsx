"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Sparkles, BrainCircuit, ShieldAlert, Cpu } from "lucide-react";

export default function AIDisclaimerPage() {
  return (
    <PublicPageLayout
      eyebrow="Responsible AI"
      title="AI Usage & Generative Model Disclaimer"
      subtitle="Transparency on multi-agent routing, prompt synthesis, and generative boundaries in education."
      breadcrumbs={[{ label: "Legal" }, { label: "AI Usage Disclaimer" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 text-xs text-indigo-950">
          <div className="flex items-center gap-2 font-bold text-sm text-indigo-900">
            <Sparkles className="h-5 w-5 text-indigo-600" />
            Educational Multi-Agent System Architecture
          </div>
          <p className="mt-2 leading-relaxed">
            MentorMind AI employs a multi-agent cognitive architecture orchestrating specialist agents: Socratic Coach, Concept Explainer, Exam Crammer, Formula Assistant, and Memory Tracker. These agents operate using Google Gemini LLM backends augmented with deterministic academic guardrails.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Nature of Generative Outputs</h2>
          <p>
            Generative AI produces responses probabilistically based on pattern matching across immense academic corpora. While our prompts enforce factual rigor, citations, and grade-appropriate language, outputs can occasionally reflect:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted">
            <li><strong>Hallucinations:</strong> Invented citations, misattributed theorems, or incorrect numerical arithmetic.</li>
            <li><strong>Syllabus Mismatches:</strong> Differences between state, national (CBSE/ICSE), and international (IB/Cambridge) conventions.</li>
            <li><strong>Context Misinterpretation:</strong> An agent may occasionally misinterpret ambiguous problem statements.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Socratic Scaffolding vs. Direct Cheating</h2>
          <p>
            Our core pedagogical design discourages homework dumping. Whenever possible, our agents will respond with guiding questions, partial hints, and step-by-step Socratic breakdown rather than complete, copy-paste essay or code answers. This is by design to ensure genuine student learning.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Human Review & Reporting Feedback</h2>
          <p>
            Every AI response in the classroom interface includes feedback controls (&quot;Explain Differently&quot;, &quot;Report Error&quot;). When an error is flagged, our team inspects the prompt routing logic and refines system boundaries.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

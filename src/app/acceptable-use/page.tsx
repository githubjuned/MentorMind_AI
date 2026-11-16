"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { CheckCircle2, XCircle, ShieldCheck } from "lucide-react";

export default function AcceptableUsePage() {
  return (
    <PublicPageLayout
      eyebrow="Community Standard"
      title="Acceptable Use Policy (AUP)"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Acceptable Use Policy" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            This Acceptable Use Policy defines the permitted and prohibited uses of <strong>MentorMind AI</strong>, operated by <strong>[LEGAL COMPANY NAME]</strong>. Compliance with this policy is mandatory for all students, educators, and administrators.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">1. Permitted Uses</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Engaging in Socratic inquiry to master difficult syllabus concepts.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Generating practice quiz questions, flashcards, and summary revision sheets for personal academic review.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Tracking study timers, learning streaks, and syllabus completion.</span>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">2. Strictly Prohibited Activities</h2>
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2.5">
              <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Malicious Prompts & Jailbreaking:</strong> Attempting prompt injection, adversarial attacks, or extracting system prompts and backend API keys.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Hate Speech & Harassment:</strong> Submitting content that promotes violence, discrimination, self-harm, sexual exploitation of minors, or harassment.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Infrastructure Abuse:</strong> High-frequency automated scraping, denial of service (DoS), or stress-testing platform endpoints without written consent.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <XCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
              <span><strong>Commercial Reselling:</strong> Reselling platform access, white-labeling agent responses, or bulk syndication without an enterprise agreement.</span>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Enforcement & Remediation</h2>
          <p>
            Violations of this policy will result in immediate corrective action, including rate-limiting, temporary account suspension, permanent termination, and in severe circumstances involving illegal conduct, referral to appropriate law enforcement authorities in accordance with CERT-In and Indian IT Rules.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

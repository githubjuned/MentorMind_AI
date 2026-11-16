"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Users, HeartHandshake, ShieldCheck, MessageSquare } from "lucide-react";

export default function CommunityGuidelinesPage() {
  return (
    <PublicPageLayout
      eyebrow="Student Conduct"
      title="Community Guidelines"
      subtitle="Fostering a supportive, respectful, and academically constructive learning environment."
      breadcrumbs={[{ label: "Legal" }, { label: "Community Guidelines" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            At <strong>MentorMind AI</strong>, we believe every student deserves a safe, motivating, and harassment-free space to explore challenging topics, make mistakes, and cultivate mastery.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">1. Core Community Principles</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="font-bold text-ink text-xs uppercase tracking-wider">Intellectual Curiosity</div>
              <p className="mt-2 text-xs text-muted">Ask questions fearlessly. The AI agents are patient and non-judgmental; use them to unpack difficult doubts.</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="font-bold text-ink text-xs uppercase tracking-wider">Mutual Respect</div>
              <p className="mt-2 text-xs text-muted">Treat peers, educators, and support staff with courtesy. Zero tolerance for bullying or derogatory language.</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="font-bold text-ink text-xs uppercase tracking-wider">Academic Integrity</div>
              <p className="mt-2 text-xs text-muted">Value the process of learning. Strive to understand concepts rather than seeking automated shortcuts.</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Zero Tolerance Violations</h2>
          <ul className="list-disc pl-5 space-y-2 text-xs text-muted">
            <li><strong>Harassment & Hate Speech:</strong> Targeted hate speech based on caste, religion, race, gender, nationality, or disability will result in permanent ban without notice.</li>
            <li><strong>Obscene & Exploitative Content:</strong> Any attempt to generate or distribute illicit, abusive, or sexually explicit material.</li>
            <li><strong>Doxxing:</strong> Sharing another student&apos;s personal phone numbers, physical addresses, or private credentials.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Reporting Violations</h2>
          <p className="text-xs text-muted">
            If you encounter content or conduct violating these guidelines, report it immediately to our safety team at <strong>[SUPPORT EMAIL]</strong>.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

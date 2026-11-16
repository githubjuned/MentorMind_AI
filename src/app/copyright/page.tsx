"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { ShieldCheck, FileText, Mail } from "lucide-react";

export default function CopyrightPage() {
  return (
    <PublicPageLayout
      eyebrow="Intellectual Property"
      title="IP & Copyright Policy"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Copyright Policy" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            This policy outlines the intellectual property rights governing <strong>MentorMind AI</strong>, the software assets owned by <strong>[LEGAL COMPANY NAME]</strong>, and the procedures for copyright infringement notices.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Platform Ownership</h2>
          <p>
            All source code, user interfaces, illustrations, audio cues, system prompts, agent orchestration routines, trade dress, and trademarks (&quot;MentorMind AI&quot;, logos, and emblems) are the proprietary property of <strong>[LEGAL COMPANY NAME]</strong> or its licensors, protected by Indian Copyright Act, 1957 and international copyright treaties.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. User-Created Notes & Prompt Submissions</h2>
          <p>
            You retain all intellectual property rights in the original study prompts, personal notes, and questions you input into MentorMind AI. You grant <strong>[LEGAL COMPANY NAME]</strong> a limited, worldwide, royalty-free license solely to host, process, and display that content to operate your personalized student dashboard.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. AI-Generated Outputs</h2>
          <p>
            Under prevailing legal standards, the AI-generated responses (quizzes, explanations, summaries) are provided to you for non-exclusive, personal academic use. You are permitted to download, print, and study from these outputs freely.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. DMCA / Indian Copyright Takedown Procedure</h2>
          <p>
            If you believe your copyrighted work has been reproduced or made accessible on MentorMind AI in a way that constitutes infringement, please submit a formal notice to our designated Copyright Agent:
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 text-xs font-mono space-y-1">
            <div><strong>Designated Agent:</strong> Copyright & Compliance Officer</div>
            <div><strong>Company:</strong> [LEGAL COMPANY NAME]</div>
            <div><strong>Address:</strong> [REGISTERED BUSINESS ADDRESS]</div>
            <div><strong>Email:</strong> [SUPPORT EMAIL]</div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}

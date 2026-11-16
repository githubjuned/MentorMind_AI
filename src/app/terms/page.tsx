"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import Link from "next/link";
import { FileCheck, Shield, AlertTriangle } from "lucide-react";

export default function TermsPage() {
  return (
    <PublicPageLayout
      eyebrow="Contractual Agreement"
      title="Terms and Conditions"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Terms and Conditions" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p className="font-medium">
            Please read these Terms and Conditions (&quot;Terms&quot;) carefully before accessing or using MentorMind AI (&quot;Platform&quot;), operated by <strong>[LEGAL COMPANY NAME]</strong> (&quot;Company&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;).
          </p>
          <p className="mt-2 text-xs text-muted">
            By registering an account, accessing, or using the Platform, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Eligibility and User Accounts</h2>
          <p>
            You must be at least 18 years of age, or have reached the legal age of majority in your jurisdiction, or have express verifiable permission from a parent or legal guardian to create an account. You agree to provide accurate, current, and complete registration information and to safeguard your credentials. You remain solely responsible for all activities occurring under your account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Permitted Academic Use</h2>
          <p>
            MentorMind AI provides artificial intelligence assisted tutoring, Socratic dialogue, note generation, and study evaluation. The platform is designed solely to supplement, not replace, formal academic instruction, school curricula, or accredited examinations.
          </p>
          <p className="text-xs text-muted">
            Users agree NOT to use the platform for academic dishonesty, unauthorized cheating on live examinations, plagiarized essay submissions, or violating any academic honor code.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Intellectual Property Rights</h2>
          <p>
            All platform interfaces, proprietary algorithms, agent orchestration rules, branding, visual graphics, and code are the exclusive intellectual property of <strong>[LEGAL COMPANY NAME]</strong>. You retain ownership of your original notes and study questions, and grant us a limited, non-exclusive license solely to process and display that content for your learning account.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable Indian and international law, <strong>[LEGAL COMPANY NAME]</strong> shall not be liable for any indirect, incidental, punitive, or consequential damages resulting from the use or inability to use the Platform, AI inaccuracies, or server downtime.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">5. Governing Law and Dispute Resolution</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any dispute arising out of or related to these Terms shall be subject to the exclusive jurisdiction of the competent courts at [REGISTERED BUSINESS ADDRESS / JURISDICTION CITY].
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">6. Contact Information</h2>
          <p>
            If you have questions regarding these Terms, contact our legal counsel at:
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 text-xs font-mono space-y-1">
            <div><strong>Company:</strong> [LEGAL COMPANY NAME]</div>
            <div><strong>Address:</strong> [REGISTERED BUSINESS ADDRESS]</div>
            <div><strong>Email:</strong> [SUPPORT EMAIL]</div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}

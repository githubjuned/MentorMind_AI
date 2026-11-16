"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import Link from "next/link";
import { Scale, CheckCircle2, AlertOctagon } from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <PublicPageLayout
      eyebrow="Service Terms"
      title="Terms of Service"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Terms of Service" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            These Terms of Service (&quot;ToS&quot;) outline the operational rules, service-level commitments, and user code of conduct governing your access to <strong>MentorMind AI</strong>, provided by <strong>[LEGAL COMPANY NAME]</strong>.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Service Provision and Availability</h2>
          <p>
            We strive to maintain high service availability (99.9% target uptime). However, scheduled maintenance, critical security patches, third-party model inference latency, or network anomalies may cause temporary unavailability. We reserve the right to modify, suspend, or enhance features with reasonable advance notice.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. User Account Security</h2>
          <p>
            Users are required to maintain strict confidentiality of their authentication credentials. You must immediately notify <strong>[SUPPORT EMAIL]</strong> of any unauthorized access or breach of security. We implement automatic session timeouts and rate limiting to protect student accounts.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Prohibited Misuse and Abuse</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Reverse engineer, decompile, or extract proprietary prompt architectures and agent weights.</li>
            <li>Use automated scrapers, bots, or crawlers without explicit written authorization.</li>
            <li>Submit abusive, defamatory, obscene, sexually explicit, or unlawful queries to the AI agents.</li>
            <li>Attempt to bypass or exploit Firebase database security rules or API rate limits.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Termination and Suspension</h2>
          <p>
            We reserve the right to suspend or terminate accounts that repeatedly violate these Terms, engage in security tampering, or abuse generative AI tokens. Suspended users receive an email notification detailing the grounds and have the right to appeal via <strong>[GRIEVANCE OFFICER CONTACT]</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">5. Modifications to Terms</h2>
          <p>
            We may update these Terms of Service periodically. Continued usage of the Platform following published modifications constitutes full acceptance of the updated terms. Material changes will be communicated via your registered email or prominent platform banners.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

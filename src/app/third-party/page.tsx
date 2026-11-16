"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Server, Cpu, Shield, Globe } from "lucide-react";

export default function ThirdPartyPage() {
  return (
    <PublicPageLayout
      eyebrow="Architecture Transparency"
      title="Third-Party Services Disclosure"
      subtitle="Complete list of sub-processors, cloud infrastructure, and AI providers integrated into MentorMind AI."
      breadcrumbs={[{ label: "Legal" }, { label: "Third-Party Disclosure" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            In accordance with global privacy principles and the Digital Personal Data Protection Act, 2023, <strong>[LEGAL COMPANY NAME]</strong> discloses all external service providers and sub-processors that process user data to power MentorMind AI.
          </p>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-line bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                <Server className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-ink">Google Firebase</h2>
                <div className="text-xs text-muted">Authentication & Realtime Database</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div><strong className="text-muted">Entity:</strong> Google LLC</div>
              <div><strong className="text-muted">Purpose:</strong> User Auth & Encrypted RTDB</div>
              <div><strong className="text-muted">Data Shared:</strong> UID, email, quiz state</div>
            </div>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Firebase hosts our production database under strict security rules requiring authentic token authentication and per-user UID separation. Data is encrypted in transit (TLS 1.3) and at rest (AES-256).
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-ink">Google Cloud Vertex / Gemini API</h2>
                <div className="text-xs text-muted">Generative LLM Inference Engine</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div><strong className="text-muted">Entity:</strong> Google LLC</div>
              <div><strong className="text-muted">Purpose:</strong> Socratic tutoring & quiz generation</div>
              <div><strong className="text-muted">Data Shared:</strong> Academic prompt & study question</div>
            </div>
            <p className="mt-3 text-xs text-muted leading-relaxed">
              Student prompts are forwarded via secure API solely to generate educational explanations. User submissions are not utilized to train public foundation models without explicit agreement.
            </p>
          </div>

          <div className="rounded-2xl border border-line bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-700">
                <Globe className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-ink">Vercel & Firebase Hosting</h2>
                <div className="text-xs text-muted">Global CDN & Edge Routing</div>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <div><strong className="text-muted">Entity:</strong> Vercel Inc. / Google LLC</div>
              <div><strong className="text-muted">Purpose:</strong> High-performance static web assets</div>
              <div><strong className="text-muted">Data Shared:</strong> Anonymized HTTP request headers</div>
            </div>
          </div>
        </div>

        <section className="space-y-3 pt-4 border-t border-line">
          <h2 className="font-display text-base font-bold text-ink">Sub-Processor Obligations</h2>
          <p className="text-xs text-muted leading-relaxed">
            All sub-processors have undergone cybersecurity assessment and maintain industry certifications, including ISO/IEC 27001, SOC 2 Type II, and PCI-DSS compliance where applicable.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

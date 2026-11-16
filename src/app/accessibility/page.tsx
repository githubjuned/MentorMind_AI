"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Eye, Keyboard, Sparkles, CheckCircle2 } from "lucide-react";

export default function AccessibilityPage() {
  return (
    <PublicPageLayout
      eyebrow="Inclusive Learning"
      title="Accessibility Statement"
      subtitle="Commitment to Digital Accessibility & WCAG 2.2 Level AA Standards"
      breadcrumbs={[{ label: "Legal" }, { label: "Accessibility" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            <strong>[LEGAL COMPANY NAME]</strong> is committed to ensuring digital accessibility for students and educators with disabilities. We continually improve the user experience for everyone and apply the relevant accessibility standards across MentorMind AI.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Conformance Status</h2>
          <p>
            The Web Content Accessibility Guidelines (WCAG) defines requirements for designers and developers to improve accessibility for people with disabilities. MentorMind AI conforms with <strong>WCAG 2.2 Level AA</strong> standards.
          </p>
        </section>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">2. Implemented Accessibility Features</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2 font-bold text-ink text-xs uppercase tracking-wider">
                <Keyboard className="h-4 w-4 text-indigo-600" />
                Keyboard Navigation
              </div>
              <p className="mt-2 text-xs text-muted">
                All navigation links, quiz option selectors, modals, and AI prompt fields can be fully focused and operated using standard Tab, Enter, and Space keys.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2 font-bold text-ink text-xs uppercase tracking-wider">
                <Eye className="h-4 w-4 text-emerald-600" />
                High Contrast & Theming
              </div>
              <p className="mt-2 text-xs text-muted">
                Supports dark and light themes with strict contrast ratios exceeding 4.5:1 for standard text and 3:1 for large graphical interface components.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2 font-bold text-ink text-xs uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-amber-600" />
                Screen Reader Compatibility
              </div>
              <p className="mt-2 text-xs text-muted">
                Semantic HTML elements (nav, main, article, section), ARIA live regions for streaming AI responses, and descriptive alt attributes on all non-decorative illustrations.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2 font-bold text-ink text-xs uppercase tracking-wider">
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                Reduced Motion Support
              </div>
              <p className="mt-2 text-xs text-muted">
                Respects user operating system <code className="bg-surface px-1 py-0.5 rounded">prefers-reduced-motion</code> settings to prevent disorientation from aurora animations.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Feedback and Contact</h2>
          <p>
            We welcome your feedback on the accessibility of MentorMind AI. If you encounter accessibility barriers, please let us know:
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 text-xs font-mono space-y-1">
            <div><strong>Email:</strong> <a href="mailto:[SUPPORT EMAIL]" className="text-indigo-600 underline">[SUPPORT EMAIL]</a></div>
            <div><strong>Subject:</strong> Accessibility Feedback / Barrier Report</div>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}

"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import Link from "next/link";
import { Cookie, Settings, CheckCircle2 } from "lucide-react";

export default function CookiePolicyPage() {
  return (
    <PublicPageLayout
      eyebrow="Storage & Tracking"
      title="Cookie & Local Storage Policy"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Cookie Policy" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            This Cookie Policy explains how <strong>[LEGAL COMPANY NAME]</strong> uses cookies, local browser storage, and related web technologies on <strong>MentorMind AI</strong> (&quot;[WEBSITE DOMAIN]&quot;).
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <Link
              href="/cookie-preferences"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition"
            >
              <Settings className="h-3.5 w-3.5" />
              Manage Cookie Preferences
            </Link>
          </div>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. What are Cookies and Local Storage?</h2>
          <p>
            Cookies are small text files placed on your device by websites you visit. LocalStorage and SessionStorage are modern HTML5 browser capabilities that allow websites to store data locally without transmitting it with every HTTP request, minimizing network latency and enhancing privacy.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Categories of Storage We Use</h2>
          <div className="space-y-4">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Essential / Strictly Necessary (Always Active)</span>
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700">Required</span>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Essential for core website operation, maintaining your authenticated session via Firebase Auth, security token validation, CSRF defense, and preserving your cookie preferences. These cannot be switched off without disabling the app.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Functional & Personalization Storage</span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">Optional</span>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Remembers user interface preferences such as active dark/light theme, font readability scaling, and whether the interactive onboarding tour has been viewed.
              </p>
            </div>

            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold text-ink">Analytics & Performance</span>
                <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">Optional</span>
              </div>
              <p className="mt-2 text-xs text-muted leading-relaxed">
                Measures aggregated, pseudonymized usage statistics (e.g., page load times, AI response latencies) to improve stability. We do not use third-party behavioral advertising trackers.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. How Can You Control Cookies?</h2>
          <p>
            You can modify your preferences at any time through our dedicated{" "}
            <Link href="/cookie-preferences" className="font-semibold text-indigo-600 hover:underline">
              Cookie Preferences Center
            </Link>
            . In addition, all modern web browsers permit you to block, inspect, or delete cookies via browser settings. Note that disabling essential cookies will prevent authentication.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Policy Inquiries</h2>
          <p>
            For questions about our storage technologies, email our privacy team at <strong>[PRIVACY CONTACT EMAIL]</strong>.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { CreditCard, CheckCircle2, RotateCcw, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function RefundsPage() {
  return (
    <PublicPageLayout
      eyebrow="Consumer Protection"
      title="Refund and Cancellation Policy"
      subtitle="In compliance with the Consumer Protection (E-Commerce) Rules, 2020"
      breadcrumbs={[{ label: "Legal" }, { label: "Refund Policy" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            At <strong>[LEGAL COMPANY NAME]</strong>, we are committed to transparent, fair, and frictionless commercial practices for all MentorMind AI subscriptions and digital educational products.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Free Tier Commitment</h2>
          <p>
            MentorMind AI offers a robust Free Student Plan providing core access to the AI Socratic Tutor, adaptive quizzes, and revision notes. We strongly encourage students to test and evaluate the platform using our free tier before purchasing paid upgrades.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. 7-Day Money-Back Guarantee</h2>
          <p>
            If you upgrade to our Pro Student Plan or Semester Pass and are not completely satisfied with our AI agents or study tools, you are entitled to a full refund within <strong>7 calendar days</strong> of your initial purchase date. No questions asked.
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 text-xs space-y-2">
            <div className="font-bold text-ink">How to claim your refund:</div>
            <p className="text-muted">
              Email <strong>[SUPPORT EMAIL]</strong> with your registered account email and transaction ID within 7 days of purchase. Refunds are approved within 2 business days and credited to the original payment method within 5 to 7 banking days.
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Subscription Cancellation</h2>
          <p>
            You can cancel your subscription at any time with a single click from your <strong>Account Settings</strong>. Upon cancellation, auto-renewal will be disabled immediately, and you will retain full access to all paid features until the end of your prepaid billing period.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Exceptions and Non-Refundable Situations</h2>
          <p className="text-xs text-muted">
            Refunds will not be granted after the 7-day guarantee window has expired, nor in instances where an account has been terminated due to serious violations of our Acceptable Use Policy (such as abusive API scraping, hate speech, or automated DDoS attacks).
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { RefreshCw, CreditCard, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function SubscriptionTermsPage() {
  return (
    <PublicPageLayout
      eyebrow="Billing Policy"
      title="Subscription & Auto-Renewal Terms"
      subtitle="In compliance with RBI e-mandate regulations and consumer fair-billing directives"
      breadcrumbs={[{ label: "Legal" }, { label: "Subscription Terms" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            These Subscription Terms govern recurring billing, auto-renewal, pricing transparency, and cancellation rights for premium plans on <strong>MentorMind AI</strong>, operated by <strong>[LEGAL COMPANY NAME]</strong>.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Transparent Pricing & Taxes</h2>
          <p>
            All plan prices are displayed in Indian Rupees (INR) or applicable local currency. Any applicable taxes (including 18% GST in India) are itemized explicitly before final checkout. We never charge hidden processing fees or unannounced surcharges.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Auto-Renewal & Pre-Debit Notifications</h2>
          <p>
            Subscriptions renew automatically at the end of each billing cycle (monthly, semester, or annual) unless cancelled. In compliance with the Reserve Bank of India (RBI) e-mandate framework for recurring card payments:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted">
            <li>A pre-debit electronic notification (via SMS or email) will be dispatched at least 24 to 48 hours prior to any scheduled recurring debit.</li>
            <li>You have the explicit right to opt out or cancel before the charge executes.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Easy Self-Service Cancellation</h2>
          <p>
            We adhere strictly to the principle of <em>&quot;as easy to cancel as it was to subscribe.&quot;</em> You do not need to call a representative or justify your decision. You can cancel auto-renewal anytime in 1 click from your <strong>Account Settings</strong>.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Price Changes</h2>
          <p>
            If plan pricing changes, existing subscribers will be notified at least 30 calendar days in advance via email. Price changes will never apply retroactively or take effect without your affirmative authorization.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Zap, Laptop, CheckCircle2 } from "lucide-react";

export default function ShippingPage() {
  return (
    <PublicPageLayout
      eyebrow="Delivery Model"
      title="Shipping & Delivery Policy"
      subtitle="Applicable to 100% Digital SaaS & Educational Services"
      breadcrumbs={[{ label: "Legal" }, { label: "Shipping Policy" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 text-xs text-indigo-950">
          <div className="flex items-center gap-2 font-bold text-sm text-indigo-900">
            <Zap className="h-5 w-5 text-indigo-600" />
            100% Digital Electronic Delivery
          </div>
          <p className="mt-2 leading-relaxed">
            <strong>MentorMind AI</strong> is an entirely web-based software-as-a-service (SaaS) educational application. We do NOT ship physical products, paper textbooks, hardware tokens, or packaged media.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Instant Service Fulfillment</h2>
          <p>
            Upon successful registration or subscription payment completion:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-xs text-muted">
            <li><strong>Immediate Access:</strong> Your account is provisioned instantly. You receive real-time access to the student dashboard, AI tutoring agents, and adaptive quiz generators.</li>
            <li><strong>Email Confirmation:</strong> A purchase invoice and account confirmation are dispatched immediately to your registered email address.</li>
            <li><strong>No Shipping Charges:</strong> Because all services are fulfilled electronically over the internet, no shipping, handling, packaging, or courier fees apply to any order.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Technical Delivery Issues</h2>
          <p>
            In the rare event of a network glitch or if your plan features are not active within 15 minutes of completing payment, please email <strong>[SUPPORT EMAIL]</strong> with your order confirmation number. Our engineering team will manually verify and provision your access within 4 business hours.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

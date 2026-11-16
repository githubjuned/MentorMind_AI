import type { Metadata } from "next";
import Link from "next/link";
import { Check, HelpCircle, Shield, Sparkles, X } from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Badge, Button, Card } from "@/components/common/ui";

export const metadata: Metadata = {
  title: "Pricing & Plans · MentorMind AI",
  description:
    "Transparent, student-first pricing for MentorMind AI. Free starter tier with full access to 7 specialist agents.",
};

const PLANS = [
  {
    name: "Student Starter",
    badge: "Always Free",
    price: "₹0",
    period: "forever",
    description: "Everything you need to master concepts, generate notes, and track your daily learning.",
    features: [
      "Access to all 7 Specialized AI Agents",
      "Central AI Coordinator orchestration",
      "Unlimited doubt questions & concept explanations",
      "Interactive quiz generation & instant scoring",
      "Smart study planner & exam schedules",
      "Spaced repetition revision assistant",
      "Personal learning memory with strict UID privacy",
      "Export notes as Markdown & clean PDF",
    ],
    limitations: [
      "Standard document upload limit (up to 5 MB per file)",
      "Standard AI model response speed",
    ],
    ctaText: "Start Free Now",
    ctaHref: "/signup",
    popular: false,
  },
  {
    name: "Scholar Pro",
    badge: "Most Comprehensive",
    price: "₹299",
    period: "/ month",
    description: "Designed for intensive university examination prep, deep literature synthesis, and priority AI latency.",
    features: [
      "Everything in Student Starter",
      "Priority Gemini model allocation for complex reasoning",
      "Heavy document processing (up to 50 MB PDFs & lecture decks)",
      "Extended multi-step synthesis for comprehensive exam guides",
      "Deep literature and academic paper cross-referencing",
      "Priority customer & technical support (< 12 hr response)",
      "Cancel anytime with 1-click in Account Settings",
    ],
    limitations: [],
    ctaText: "Get Scholar Pro",
    ctaHref: "/signup",
    popular: true,
  },
];

export default function PricingPage() {
  return (
    <PublicPageLayout
      eyebrow="Transparent Value"
      title={
        <>
          Student-First Pricing. <span className="gradient-text">Zero Hidden Surprises.</span>
        </>
      }
      subtitle="Free for everyday learning, with an optional scholar tier for heavy document research and priority compute."
      breadcrumbs={[{ label: "Pricing" }]}
    >
      <div className="space-y-12">
        {/* Pricing Cards */}
        <div className="grid gap-8 lg:grid-cols-2 max-w-4xl mx-auto">
          {PLANS.map((plan) => (
            <Card
              key={plan.name}
              className={`p-8 relative flex flex-col justify-between ${
                plan.popular ? "border-brand/60 shadow-xl shadow-brand/10 bg-brand/5" : "border-line"
              }`}
            >
              {plan.popular && (
                <div className="absolute right-6 top-6">
                  <Badge tone="brand">{plan.badge}</Badge>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h2 className="font-display text-2xl font-bold text-ink">{plan.name}</h2>
                  <p className="mt-1 text-xs text-muted leading-relaxed">{plan.description}</p>
                </div>

                <div className="flex items-baseline gap-1 py-2">
                  <span className="font-display text-4xl font-extrabold text-ink sm:text-5xl">
                    {plan.price}
                  </span>
                  <span className="text-xs text-muted">{plan.period}</span>
                </div>

                <div className="border-t border-line pt-4 space-y-2.5">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted">What&apos;s Included:</p>
                  <ul className="space-y-2 text-xs">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2.5 text-ink">
                        <Check className="h-4 w-4 text-ok shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                    {plan.limitations.map((lim) => (
                      <li key={lim} className="flex items-center gap-2.5 text-muted/80">
                        <X className="h-4 w-4 text-muted/60 shrink-0" />
                        <span>{lim}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-line">
                <Link
                  href={plan.ctaHref}
                  className={`btn w-full justify-center ${
                    plan.popular ? "btn-primary" : "btn-secondary"
                  }`}
                >
                  {plan.ctaText}
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Consumer Protection Disclosures */}
        <div className="rounded-2xl border border-line bg-surface2/50 p-6 text-xs text-muted max-w-4xl mx-auto space-y-3">
          <div className="flex items-center gap-2 font-semibold text-ink text-sm">
            <Shield className="h-4 w-4 text-brand" />
            <span>Consumer Transparency & Tax Disclosures</span>
          </div>
          <p>
            • <b>Applicable Taxes:</b> Stated prices are exclusive of statutory Goods and Services Tax (GST 18%) where applicable under Indian law.
          </p>
          <p>
            • <b>Auto-Renewal & Cancellation:</b> Paid subscriptions auto-renew on a monthly cycle. You can cancel with a single click inside your Account Settings at any time before the renewal date.
          </p>
          <p>
            • <b>Refund Policy:</b> We offer a 7-day refund guarantee for first-time subscriptions. Review our full{" "}
            <Link href="/refunds" className="text-brand hover:underline font-semibold">
              Refund and Cancellation Policy
            </Link>{" "}
            for grievance contacts and resolution timeframes.
          </p>
        </div>
      </div>
    </PublicPageLayout>
  );
}

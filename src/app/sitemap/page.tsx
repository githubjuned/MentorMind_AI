"use client";

import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Compass, Shield, UserCheck, BookOpen, LifeBuoy } from "lucide-react";

const SITEMAP_GROUPS = [
  {
    title: "Public & Marketing",
    icon: Compass,
    links: [
      { href: "/", label: "Home / Landing" },
      { href: "/about", label: "About Us" },
      { href: "/features", label: "Features & AI Agents" },
      { href: "/how-it-works", label: "How It Works" },
      { href: "/pricing", label: "Student Pricing & Plans" },
      { href: "/faq", label: "Frequently Asked Questions" },
      { href: "/blog", label: "Blog & Academic Insights" },
    ],
  },
  {
    title: "Student Application & Learning",
    icon: BookOpen,
    links: [
      { href: "/app", label: "Student Dashboard Overview" },
      { href: "/chat", label: "Multi-Agent AI Classroom" },
      { href: "/quiz", label: "Adaptive Quizzes & Drills" },
      { href: "/notes", label: "Smart Study Notes & Sheets" },
      { href: "/memory", label: "Knowledge Vault & Mastery" },
      { href: "/settings", label: "Account & Data Settings" },
    ],
  },
  {
    title: "Authentication & Account Security",
    icon: UserCheck,
    links: [
      { href: "/login", label: "Sign In" },
      { href: "/signup", label: "Register Account" },
      { href: "/email-verification", label: "Email Verification Status" },
      { href: "/session-expired", label: "Session Timeout Recovery" },
      { href: "/account-suspended", label: "Account Suspension Notice" },
      { href: "/account-deletion", label: "Public Account Deletion Request" },
    ],
  },
  {
    title: "Support, Contact & Operations",
    icon: LifeBuoy,
    links: [
      { href: "/contact", label: "Contact Us" },
      { href: "/help-center", label: "Help Centre & Guides" },
      { href: "/maintenance", label: "System Maintenance Status" },
      { href: "/500", label: "Server Error Screen (500)" },
    ],
  },
  {
    title: "Legal, Privacy & Regulatory Compliance",
    icon: Shield,
    links: [
      { href: "/privacy", label: "Privacy Policy (DPDP Act 2023)" },
      { href: "/terms", label: "Terms and Conditions" },
      { href: "/tos", label: "Terms of Service" },
      { href: "/cookies", label: "Cookie Policy" },
      { href: "/cookie-preferences", label: "Interactive Cookie Preferences" },
      { href: "/disclaimer", label: "Academic Disclaimer" },
      { href: "/acceptable-use", label: "Acceptable Use Policy" },
      { href: "/copyright", label: "Intellectual Property & Copyright" },
      { href: "/data-retention", label: "Data Retention & Deletion Policy" },
      { href: "/account-deletion", label: "Account Deletion Policy" },
      { href: "/grievance", label: "Grievance Redressal Policy" },
      { href: "/accessibility", label: "Accessibility Statement (WCAG 2.2)" },
      { href: "/third-party", label: "Third-Party Services Disclosure" },
      { href: "/ai-disclaimer", label: "AI Usage & Model Disclaimer" },
      { href: "/community-guidelines", label: "Community Guidelines" },
      { href: "/refunds", label: "Refund and Cancellation Policy" },
      { href: "/shipping", label: "Shipping & Delivery Disclosure" },
      { href: "/subscription-terms", label: "Subscription & Auto-Renewal Terms" },
    ],
  },
];

export default function SitemapPage() {
  return (
    <PublicPageLayout
      eyebrow="Navigation Index"
      title="Complete HTML Sitemap"
      subtitle="Direct directory of all public pages, learning tools, support guides, and statutory legal policies."
      breadcrumbs={[{ label: "Sitemap" }]}
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {SITEMAP_GROUPS.map((group, idx) => {
          const Icon = group.icon;
          return (
            <div key={idx} className="rounded-2xl border border-line bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Icon className="h-4 w-4" />
                </div>
                <h2 className="font-display text-base font-bold text-ink">{group.title}</h2>
              </div>

              <ul className="mt-4 space-y-2 text-xs">
                {group.links.map((link, lIdx) => (
                  <li key={lIdx}>
                    <Link
                      href={link.href}
                      className="text-muted hover:text-indigo-600 hover:underline transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </PublicPageLayout>
  );
}

"use client";
import Link from "next/link";
import {
  Brain,
  ExternalLink,
  GraduationCap,
  Heart,
  Mail,
  Scale,
  Shield,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { SocialShareBar } from "./SocialShareBar";

export function PublicFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-line bg-surface text-ink transition-colors">
      {/* Upper Main Footer Grid */}
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          {/* Column 1: Brand & Identity */}
          <div className="lg:col-span-2 space-y-4">
            <Logo href="/" />
            <p className="max-w-sm text-sm leading-relaxed text-muted">
              MentorMind AI is a centralized multi-agent personalized learning platform. Powered by
              intelligent agent orchestration, adaptive memory telemetry, and real-time concept remediation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com/githubjuned/MentorMind_AI"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface2 text-muted transition hover:border-brand hover:text-brand"
                aria-label="GitHub Repository"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface2 text-muted transition hover:border-brand hover:text-brand"
                aria-label="Twitter / X"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface2 text-muted transition hover:border-brand hover:text-brand"
                aria-label="LinkedIn"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-line bg-surface2 text-muted transition hover:border-brand hover:text-brand"
                aria-label="YouTube"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
            </div>

            {/* Security & Privacy Badge */}
            <div className="inline-flex items-center gap-2 rounded-2xl border border-ok/30 bg-ok/5 px-3 py-1.5 text-xs text-ok">
              <ShieldCheck className="h-4 w-4" />
              <span>Strict Per-User UID Privacy & DPDP Ready</span>
            </div>
          </div>

          {/* Column 2: Platform Features */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink font-display">
              Platform & AI
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/features" className="hover:text-ink transition">
                  All Features
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-ink transition">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-ink transition">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-ink transition">
                  About the Project
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-ink transition">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-ink transition">
                  Academic Blog & Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal & Policies */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink font-display">
              Legal & Privacy
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/privacy" className="hover:text-ink transition">
                  Privacy Policy (DPDP 2023)
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-ink transition">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/tos" className="hover:text-ink transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="hover:text-ink transition">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link href="/cookie-preferences" className="hover:text-ink transition">
                  Cookie Preferences
                </Link>
              </li>
              <li>
                <Link href="/data-retention" className="hover:text-ink transition">
                  Data Retention & Deletion
                </Link>
              </li>
              <li>
                <Link href="/account-deletion" className="hover:text-ink transition text-bad/90 font-medium">
                  Account Deletion Request
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-ink transition">
                  Academic Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Compliance & Support */}
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-ink font-display">
              Compliance & Support
            </p>
            <ul className="space-y-2 text-sm text-muted">
              <li>
                <Link href="/grievance" className="hover:text-ink transition font-medium text-brand">
                  Grievance Redressal
                </Link>
              </li>
              <li>
                <Link href="/accessibility" className="hover:text-ink transition">
                  Accessibility Statement
                </Link>
              </li>
              <li>
                <Link href="/third-party" className="hover:text-ink transition">
                  Third-Party Disclosures
                </Link>
              </li>
              <li>
                <Link href="/ai-disclaimer" className="hover:text-ink transition">
                  AI Usage Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/community-guidelines" className="hover:text-ink transition">
                  Community Guidelines
                </Link>
              </li>
              <li>
                <Link href="/refunds" className="hover:text-ink transition">
                  Refund & Cancellation
                </Link>
              </li>
              <li>
                <Link href="/subscription-terms" className="hover:text-ink transition">
                  Subscription Terms
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-ink transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/sitemap" className="hover:text-ink transition">
                  HTML Sitemap
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Entity Compliance Strip */}
        <div className="mt-12 rounded-2xl border border-line bg-surface2/50 p-4 text-xs text-muted">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <p>
              <b className="text-ink">Entity:</b> [LEGAL COMPANY NAME] · Registered Office: [REGISTERED BUSINESS ADDRESS]
            </p>
            <p>
              <b className="text-ink">Support Contact:</b>{" "}
              <a href="mailto:support@mentormind.app" className="text-brand hover:underline">
                [SUPPORT EMAIL]
              </a>
            </p>
          </div>
          <p className="mt-2 text-[11px] text-muted/80 leading-relaxed">
            <b>Grievance Officer:</b> [GRIEVANCE OFFICER NAME], Email:{" "}
            <span className="text-brand">[GRIEVANCE OFFICER CONTACT]</span>. Designated under the Information
            Technology Act, 2000 and the Digital Personal Data Protection Act, 2023. Acknowledged within 48 hours;
            resolved within 15 working days.
          </p>
        </div>

        {/* Social Share Bar */}
        <div className="mt-8 flex justify-center sm:justify-start">
          <SocialShareBar />
        </div>

        {/* Bottom Bar: Copyright & Attribution */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-line pt-6 text-xs text-muted sm:flex-row">
          <p>© {currentYear} MentorMind AI. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for genuine student learning and rigorous academic growth.
          </p>
        </div>
      </div>
    </footer>
  );
}

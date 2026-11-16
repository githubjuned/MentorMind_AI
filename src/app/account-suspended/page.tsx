"use client";

import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { ShieldAlert, Mail, ArrowRight } from "lucide-react";

export default function AccountSuspendedPage() {
  return (
    <PublicPageLayout
      breadcrumbs={[{ label: "Account Notice" }]}
      maxWidth="max-w-2xl"
    >
      <div className="py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-200">
          <ShieldAlert className="h-10 w-10" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-rose-600">Access Restricted</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Account Suspended
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted leading-relaxed">
          This account has been temporarily suspended due to a detected violation of our Acceptable Use Policy (such as abusive automated traffic, repeated policy breaches, or compromised credential activity).
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line bg-card p-6 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-ink">Right to Appeal & Clarification</h2>
          <p className="mt-2 text-xs text-muted leading-relaxed">
            In accordance with IT Rules 2021 and fair procedure, you may file an appeal with our Grievance Officer detailing your explanation.
          </p>
          <div className="mt-4 pt-3 border-t border-line text-xs font-mono">
            <div><strong>Contact:</strong> [GRIEVANCE OFFICER CONTACT]</div>
            <div><strong>Subject:</strong> Account Suspension Appeal - [Your Registered Email]</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            <Mail className="h-4 w-4" />
            Contact Support
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-semibold text-ink hover:bg-card transition"
          >
            Return Home
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}

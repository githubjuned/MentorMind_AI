"use client";

import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { MailCheck, RefreshCw, ArrowRight, ShieldCheck } from "lucide-react";
import { useState } from "react";

export default function EmailVerificationPage() {
  const [sent, setSent] = useState(false);

  return (
    <PublicPageLayout
      breadcrumbs={[{ label: "Email Verification" }]}
      maxWidth="max-w-2xl"
    >
      <div className="py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50 text-indigo-600 border border-indigo-200">
          <MailCheck className="h-10 w-10" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-indigo-600">Account Verification</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Check Your Inbox
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted leading-relaxed">
          We have sent a verification link to your registered email address. Please click the link inside to verify your student account and activate full AI agent access.
        </p>

        {sent && (
          <div className="mx-auto mt-6 max-w-sm rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-800">
            A new verification email has been dispatched. Please check your spam or promotions tab.
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => setSent(true)}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-semibold text-ink hover:bg-card transition"
          >
            <RefreshCw className="h-4 w-4" />
            Resend Verification Email
          </button>
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            Proceed to Login <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="mt-12 rounded-xl border border-line bg-surface/40 p-4 text-xs text-muted max-w-md mx-auto flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
          <span>Verification links expire after 24 hours for security.</span>
        </div>
      </div>
    </PublicPageLayout>
  );
}

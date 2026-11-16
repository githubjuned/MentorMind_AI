"use client";

import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { LockKeyhole, ArrowRight, ShieldAlert } from "lucide-react";

export default function SessionExpiredPage() {
  return (
    <PublicPageLayout
      breadcrumbs={[{ label: "Session Expired" }]}
      maxWidth="max-w-2xl"
    >
      <div className="py-12 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200">
          <LockKeyhole className="h-10 w-10" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-amber-600">Security Safeguard</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Your Session Has Expired
        </h1>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted leading-relaxed">
          To protect your academic notes, quiz scores, and student privacy, sessions automatically lock after prolonged inactivity. Please sign in again to continue studying.
        </p>

        <div className="mt-8 flex justify-center">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Sign In Again <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}

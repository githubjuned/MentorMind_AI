"use client";

import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Wrench, CheckCircle2, Clock, ShieldCheck } from "lucide-react";

export default function MaintenancePage() {
  return (
    <PublicPageLayout
      breadcrumbs={[{ label: "System Status" }]}
      maxWidth="max-w-4xl"
    >
      <div className="py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-amber-50 text-amber-600 border border-amber-200">
          <Wrench className="h-10 w-10" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-amber-600">Scheduled Maintenance</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Upgrading the MentorMind AI Engine
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted leading-relaxed">
          We are currently performing routine infrastructure scaling, database indexing, and AI model latency optimizations. Normal operations will resume shortly.
        </p>

        <div className="mx-auto mt-8 max-w-md rounded-2xl border border-line bg-card p-6 text-left">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">Maintenance Details</h2>
          <div className="mt-4 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-amber-500" /> Estimated Duration:
              </span>
              <span className="font-semibold text-ink">~ 30 Minutes</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Data Safety:
              </span>
              <span className="font-semibold text-emerald-700">100% Secure & Intact</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-indigo-500" /> Service Status:
              </span>
              <span className="font-semibold text-amber-600">Database Optimization Active</span>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            Check Status Again
          </button>
          <Link
            href="/contact"
            className="rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-semibold text-ink hover:bg-card transition"
          >
            Emergency Contact
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}

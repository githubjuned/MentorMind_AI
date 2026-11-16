"use client";

import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { AlertOctagon, RotateCw, Home, LifeBuoy } from "lucide-react";

export default function Error500Page() {
  return (
    <PublicPageLayout
      breadcrumbs={[{ label: "Server Error" }]}
      maxWidth="max-w-4xl"
    >
      <div className="py-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-rose-50 text-rose-600 border border-rose-200">
          <AlertOctagon className="h-10 w-10" />
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-widest text-rose-600">500 Server Error</p>
        <h1 className="mt-2 font-display text-3xl font-extrabold text-ink sm:text-4xl">
          Unexpected Processing Exception
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm text-muted leading-relaxed">
          Our servers encountered a temporary issue while handling this request. No student study data or progress has been lost.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            <RotateCw className="h-4 w-4" />
            Reload Page
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-semibold text-ink hover:bg-card transition"
          >
            <Home className="h-4 w-4" />
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-semibold text-muted hover:text-ink transition"
          >
            <LifeBuoy className="h-4 w-4" />
            Report Issue
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}

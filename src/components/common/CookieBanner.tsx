"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, Shield, X } from "lucide-react";

export function CookieBanner() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const stored = localStorage.getItem("mentormind_cookie_consent");
      if (!stored) {
        setVisible(true);
      }
    } catch {
      // LocalStorage unavailable
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem(
        "mentormind_cookie_consent",
        JSON.stringify({
          essential: true,
          functional: true,
          analytics: true,
          timestamp: new Date().toISOString(),
          version: "v1.0",
        })
      );
    } catch {}
    setVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem(
        "mentormind_cookie_consent",
        JSON.stringify({
          essential: true,
          functional: false,
          analytics: false,
          timestamp: new Date().toISOString(),
          version: "v1.0",
        })
      );
    } catch {}
    setVisible(false);
  };

  if (!mounted || !visible) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-4xl rounded-2xl border border-line bg-card/95 p-5 shadow-2xl backdrop-blur-md sm:p-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <Cookie className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold text-ink">
              Your Privacy & Cookie Preferences
            </h4>
            <p className="mt-1 text-xs text-muted leading-relaxed max-w-2xl">
              We use essential cookies to maintain your authenticated session and secure your data. We also use optional functional cookies to remember your theme and study preferences in accordance with the DPDP Act 2023.
            </p>
            <div className="mt-2 flex flex-wrap gap-3 text-[11px]">
              <Link href="/cookies" className="text-indigo-600 font-semibold hover:underline">
                Read Cookie Policy
              </Link>
              <span className="text-muted/40">·</span>
              <Link href="/cookie-preferences" className="text-muted hover:text-ink hover:underline">
                Customize Preferences
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          <button
            onClick={handleRejectNonEssential}
            className="rounded-xl border border-line bg-surface px-4 py-2 text-xs font-semibold text-ink hover:bg-card transition"
          >
            Reject Non-Essential
          </button>
          <button
            onClick={handleAcceptAll}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Accept All
          </button>
        </div>
      </div>
    </div>
  );
}

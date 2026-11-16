"use client";

import { useState, useEffect } from "react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { CheckCircle2, Shield, Sliders, Save, RotateCcw } from "lucide-react";

export default function CookiePreferencesPage() {
  const [preferences, setPreferences] = useState({
    essential: true,
    functional: true,
    analytics: false,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("mentormind_cookie_consent");
      if (stored) {
        const parsed = JSON.parse(stored);
        setPreferences({
          essential: true,
          functional: !!parsed.functional,
          analytics: !!parsed.analytics,
        });
      }
    } catch {
      // Fallback
    }
  }, []);

  const handleSave = () => {
    try {
      localStorage.setItem(
        "mentormind_cookie_consent",
        JSON.stringify({
          ...preferences,
          timestamp: new Date().toISOString(),
          version: "v1.0",
        })
      );
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // Storage error
    }
  };

  const handleReset = () => {
    const defaults = { essential: true, functional: true, analytics: false };
    setPreferences(defaults);
    localStorage.setItem(
      "mentormind_cookie_consent",
      JSON.stringify({ ...defaults, timestamp: new Date().toISOString(), version: "v1.0" })
    );
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <PublicPageLayout
      eyebrow="Privacy Controls"
      title="Cookie Preferences Center"
      subtitle="Customize and manage your consent for local storage, session state, and diagnostic cookies."
      breadcrumbs={[{ label: "Legal" }, { label: "Cookie Preferences" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-6">
        {saved && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-xs font-semibold text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            Your cookie preferences have been saved and applied to this browser session.
          </div>
        )}

        {/* Essential */}
        <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-indigo-600" />
                <h3 className="font-display text-base font-bold text-ink">Essential & Security Cookies</h3>
              </div>
              <p className="mt-1.5 text-xs text-muted max-w-xl">
                Required for core authentication, Firebase session tokens, CSRF protection, and strictly necessary app operations. These cannot be disabled.
              </p>
            </div>
            <span className="rounded-full bg-indigo-50 border border-indigo-200 px-3 py-1 text-xs font-bold text-indigo-700 shrink-0">
              Always Active
            </span>
          </div>
        </div>

        {/* Functional */}
        <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-emerald-600" />
                <h3 className="font-display text-base font-bold text-ink">Functional & Personalization</h3>
              </div>
              <p className="mt-1.5 text-xs text-muted max-w-xl">
                Stores your theme choices (dark/light mode), interface zoom, active subject filter shortcuts, and tour progress. Disabling this may reset your theme on page reload.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences({ ...preferences, functional: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface border border-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </label>
          </div>
        </div>

        {/* Analytics */}
        <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Sliders className="h-5 w-5 text-amber-600" />
                <h3 className="font-display text-base font-bold text-ink">Diagnostic & Performance Analytics</h3>
              </div>
              <p className="mt-1.5 text-xs text-muted max-w-xl">
                Allows us to aggregate anonymous latency metrics and error logs to debug AI response bottlenecks. No marketing or cross-site tracking profiles are created.
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences({ ...preferences, analytics: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-surface border border-line peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-line">
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 rounded-xl border border-line bg-surface px-4 py-2.5 text-xs font-semibold text-muted hover:text-ink transition"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset to Recommended Defaults
          </button>

          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            <Save className="h-3.5 w-3.5" />
            Save Cookie Preferences
          </button>
        </div>
      </div>
    </PublicPageLayout>
  );
}

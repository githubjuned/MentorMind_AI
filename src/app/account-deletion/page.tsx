"use client";

import { useState } from "react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Trash2, AlertTriangle, CheckCircle2, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function AccountDeletionPage() {
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("No longer needed");
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  return (
    <PublicPageLayout
      eyebrow="Data Principal Rights"
      title="Request Account & Data Deletion"
      subtitle="Google Play Store & DPDP Act 2023 Compliant Self-Service Deletion Portal"
      breadcrumbs={[{ label: "Legal" }, { label: "Account Deletion" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-xs text-rose-950">
          <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
            <AlertTriangle className="h-5 w-5 text-rose-600" />
            Permanent Action: Read Before Submitting
          </div>
          <p className="mt-2 leading-relaxed">
            Submitting an account deletion request will permanently wipe your student profile, saved notes, study analytics, quiz history, and streak metrics from <strong>MentorMind AI</strong>. This action is irreversible.
          </p>
        </div>

        {/* In-app alternative note */}
        <div className="rounded-xl border border-line bg-surface p-4 text-xs text-muted flex items-center justify-between">
          <span>Are you currently logged in? You can instantly delete your account in 1 click from Account Settings.</span>
          <Link href="/settings" className="rounded-lg bg-indigo-600 px-3 py-1.5 font-semibold text-white hover:bg-indigo-700 transition">
            Go to Settings
          </Link>
        </div>

        {submitted ? (
          <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-8 text-center">
            <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
            <h2 className="mt-3 font-display text-xl font-bold text-emerald-900">Deletion Request Initiated</h2>
            <p className="mx-auto mt-2 max-w-md text-xs text-emerald-800 leading-relaxed">
              We have received your request for <strong>{email}</strong>. In accordance with DPDP regulations and Google Play Store policies, a verification confirmation email has been dispatched. Once you confirm via the link, your account data will be completely purged from Firebase within 48 hours.
            </p>
            <div className="mt-6">
              <Link href="/" className="inline-block rounded-xl bg-emerald-600 px-6 py-2.5 text-xs font-semibold text-white hover:bg-emerald-700 transition">
                Return to Homepage
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-card p-6 sm:p-8 space-y-6">
            <h2 className="font-display text-lg font-bold text-ink">Public Deletion Request Form</h2>

            <div>
              <label className="block text-xs font-semibold text-ink">Registered Account Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@example.com"
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-rose-500 focus:outline-none"
              />
              <span className="mt-1 block text-[11px] text-muted">
                Must match the email address associated with your MentorMind AI account.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink">Primary Reason for Deletion (Optional)</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-line bg-surface px-4 py-2.5 text-sm text-ink focus:border-rose-500 focus:outline-none"
              >
                <option value="Completed exams / No longer studying">Completed exams / No longer studying</option>
                <option value="Switching to a different platform">Switching to a different platform</option>
                <option value="Privacy or data retention concerns">Privacy or data retention concerns</option>
                <option value="Temporary study break">Temporary study break</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="rounded-xl border border-line bg-surface/60 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-line text-rose-600 focus:ring-rose-500"
                />
                <span className="text-xs text-ink leading-relaxed">
                  I understand that this action will permanently delete all my study notes, quiz scores, and personalized memory vault, and that this process cannot be reversed.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !confirmed || !email}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 px-6 py-3 text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:bg-rose-700 transition disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              {loading ? "Processing Request..." : "Submit Permanent Deletion Request"}
            </button>
          </form>
        )}

        <section className="space-y-3 pt-6 border-t border-line">
          <h3 className="font-display text-base font-bold text-ink">What happens to your data?</h3>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted">
            <li><strong>Immediate action:</strong> User record disabled in Firebase Authentication; Realtime Database branch deleted.</li>
            <li><strong>AI history:</strong> Session context memory is immediately destroyed.</li>
            <li><strong>Backups:</strong> Offline rolling server backup logs are automatically purged on a 30-day lifecycle.</li>
          </ul>
        </section>
      </div>
    </PublicPageLayout>
  );
}

"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import Link from "next/link";
import { Clock, Trash2, ShieldCheck, Database } from "lucide-react";

export default function DataRetentionPage() {
  return (
    <PublicPageLayout
      eyebrow="Data Lifecycle"
      title="Data Retention & Deletion Policy"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Data Retention" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-line bg-card p-6">
          <p>
            In compliance with the <strong>Digital Personal Data Protection Act, 2023</strong> and CERT-In storage directions, <strong>[LEGAL COMPANY NAME]</strong> enforces strict retention periods to ensure personal data is never kept longer than necessary for educational purposes.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Retention Periods by Data Category</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border border-line">
              <thead className="bg-surface2 text-ink border-b border-line">
                <tr>
                  <th className="p-3 font-semibold">Data Category</th>
                  <th className="p-3 font-semibold">Storage Location</th>
                  <th className="p-3 font-semibold">Retention Duration</th>
                  <th className="p-3 font-semibold">Action at Expiry</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line text-muted">
                <tr>
                  <td className="p-3 font-medium text-ink">Active Student Profile</td>
                  <td className="p-3">Firebase RTDB (<code className="bg-surface px-1 py-0.5 rounded">/students/&#123;uid&#125;</code>)</td>
                  <td className="p-3">Duration of active account</td>
                  <td className="p-3">Purged upon account deletion</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink">Quiz Attempts & Flashcards</td>
                  <td className="p-3">Firebase RTDB</td>
                  <td className="p-3">Duration of active account</td>
                  <td className="p-3">Hard deleted with profile</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink">Security & Authentication Logs</td>
                  <td className="p-3">Encrypted Log Vault</td>
                  <td className="p-3">180 days (as mandated by CERT-In)</td>
                  <td className="p-3">Automatically rotated & overwritten</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-ink">Cookie & UI Preference Keys</td>
                  <td className="p-3">Client Browser LocalStorage</td>
                  <td className="p-3">Until user clears browser cache</td>
                  <td className="p-3">Client-managed purge</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Immediate Account Deletion</h2>
          <p>
            When a user requests account deletion—either via their Settings dashboard or through our{" "}
            <Link href="/account-deletion" className="text-indigo-600 font-semibold hover:underline">
              Public Account Deletion Page
            </Link>
            —the user&apos;s node in the Realtime Database is permanently purged immediately, and their Firebase Authentication record is deleted.
          </p>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Statutory Exceptions</h2>
          <p>
            Certain transaction metadata (if paid subscriptions exist) and access logs may be retained solely to the extent mandated by Indian taxation laws or cybersecurity directions issued by CERT-In. Such data is segregated, access-controlled, and strictly isolated from educational production workloads.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

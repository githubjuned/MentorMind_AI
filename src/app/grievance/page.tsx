"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { ShieldCheck, Mail, Clock, CheckCircle2, AlertOctagon } from "lucide-react";
import Link from "next/link";

export default function GrievancePage() {
  return (
    <PublicPageLayout
      eyebrow="Statutory Escalation"
      title="Grievance Redressal Mechanism"
      subtitle="In compliance with Rule 3(2) of the Information Technology (Intermediary Guidelines) Rules, 2021 and Section 12 of the DPDP Act, 2023"
      breadcrumbs={[{ label: "Legal" }, { label: "Grievance Redressal" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        <div className="rounded-2xl border border-amber-200 bg-amber-50/50 p-6 text-xs text-amber-950">
          <p className="font-bold text-sm text-amber-900">
            Mandatory Disclosure of Grievance Redressal Officer
          </p>
          <p className="mt-2 leading-relaxed">
            If you have any grievance or concern regarding content, security, data processing, or services offered on <strong>MentorMind AI</strong>, you may escalate your complaint directly to our designated Grievance Officer in writing.
          </p>
        </div>

        <section className="space-y-4">
          <h2 className="font-display text-xl font-bold text-ink">1. Designated Grievance Officer</h2>
          <div className="rounded-2xl border border-line bg-card p-6 space-y-3 font-mono text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><span className="text-muted">Name:</span> <strong className="text-ink">[GRIEVANCE OFFICER NAME]</strong></div>
              <div><span className="text-muted">Designation:</span> <strong className="text-ink">Grievance & Privacy Officer</strong></div>
              <div><span className="text-muted">Entity:</span> <strong className="text-ink">[LEGAL COMPANY NAME]</strong></div>
              <div><span className="text-muted">Direct Email:</span> <a href="mailto:[GRIEVANCE OFFICER CONTACT]" className="text-indigo-600 underline font-bold">[GRIEVANCE OFFICER CONTACT]</a></div>
            </div>
            <div className="pt-2 border-t border-line">
              <span className="text-muted">Physical Mailing Address:</span>
              <p className="mt-1 text-ink">[REGISTERED BUSINESS ADDRESS]</p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. How to File a Grievance</h2>
          <p>Your communication must include:</p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted">
            <li>Your full name, registered email address, and student ID (if registered).</li>
            <li>A detailed description of the complaint or objectionable content/processing.</li>
            <li>Specific URL or screen screenshot where the issue occurred.</li>
            <li>A declaration that the information provided in the notice is accurate.</li>
          </ul>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Statutory Timelines</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2 font-bold text-ink">
                <Clock className="h-4 w-4 text-indigo-600" />
                48-Hour Acknowledgment
              </div>
              <p className="mt-1 text-xs text-muted">
                Every grievance filed with complete details will be acknowledged via email with a unique tracking ticket within 48 hours.
              </p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="flex items-center gap-2 font-bold text-ink">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                15-Day Final Disposal
              </div>
              <p className="mt-1 text-xs text-muted">
                The grievance shall be formally investigated and resolved within 15 calendar days from the date of receipt.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Escalation to Appellate Tribunal</h2>
          <p>
            If you are not satisfied with the resolution provided by our Grievance Officer, you retain the statutory right to appeal before the Grievance Appellate Committee (GAC) or the Data Protection Board of India.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

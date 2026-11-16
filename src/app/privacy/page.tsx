"use client";

import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import Link from "next/link";
import { Shield, Lock, FileText, CheckCircle2 } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <PublicPageLayout
      eyebrow="Legal & Data Protection"
      title="Privacy Policy"
      subtitle="Effective Date: [POLICY EFFECTIVE DATE] · Last Updated: November 2026"
      breadcrumbs={[{ label: "Legal" }, { label: "Privacy Policy" }]}
      maxWidth="max-w-4xl"
    >
      <div className="space-y-8 text-sm leading-relaxed text-ink/90">
        {/* Compliance Notice */}
        <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 text-xs text-indigo-900">
          <div className="flex items-center gap-2 font-bold text-sm">
            <Shield className="h-5 w-5 text-indigo-600" />
            Statutory Notice under Digital Personal Data Protection Act (DPDP), 2023
          </div>
          <p className="mt-2 leading-relaxed">
            This Privacy Policy governs the processing of digital personal data by <strong>[LEGAL COMPANY NAME]</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) through <strong>MentorMind AI</strong> (&quot;Application&quot;, &quot;[WEBSITE DOMAIN]&quot;). We adhere strictly to the principles of purpose limitation, data minimization, storage limitation, and robust security safeguards under the Digital Personal Data Protection Act, 2023, the Information Technology Act, 2000, and applicable global data protection norms.
          </p>
        </div>

        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">1. Identity of the Data Fiduciary</h2>
          <p>
            The Data Fiduciary responsible for your personal data is:
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 text-xs font-mono space-y-1">
            <div><strong>Entity:</strong> [LEGAL COMPANY NAME]</div>
            <div><strong>Registered Address:</strong> [REGISTERED BUSINESS ADDRESS]</div>
            <div><strong>Contact Email:</strong> [SUPPORT EMAIL]</div>
            <div><strong>Privacy & Grievance Contact:</strong> [PRIVACY CONTACT EMAIL]</div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">2. Categories of Personal Data Collected</h2>
          <p>
            We collect only data necessary to deliver personalized academic mentoring and adaptive quizzes:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Authentication Data:</strong> Full Name, Email Address, securely hashed passwords managed via Firebase Authentication (or OAuth profile metadata if you sign in with Google).</li>
            <li><strong>Academic Profile Data:</strong> Grade level, academic curriculum (e.g., CBSE, ICSE, State Board, University), subject interests, and study goals.</li>
            <li><strong>Learning Activity & Telemetry:</strong> Quiz responses, correctness rates, study timer sessions, generated revision notes, and memory vault preferences.</li>
            <li><strong>Technical & Session Data:</strong> IP address, device operating system, browser user agent, login timestamps, and essential session identifiers.</li>
          </ul>
          <p className="text-xs text-muted">
            We do NOT collect biometric data, sensitive financial records, or government-issued national identity numbers.
          </p>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">3. Purpose and Legal Grounds for Processing</h2>
          <p>Your data is processed strictly under clear legal bases:</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="font-bold text-xs uppercase tracking-wider text-indigo-600">Educational Delivery</div>
              <p className="mt-1 text-xs text-muted">Routing prompts to the correct AI Specialist Agent, calculating spaced repetition intervals, and providing targeted learning insights.</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="font-bold text-xs uppercase tracking-wider text-emerald-600">Explicit Consent</div>
              <p className="mt-1 text-xs text-muted">Obtained at sign-up for account creation, optional updates, and adaptive curriculum personalization.</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="font-bold text-xs uppercase tracking-wider text-amber-600">Platform Security</div>
              <p className="mt-1 text-xs text-muted">Enforcing strict per-user UID database security rules, brute force protection, and rate limiting.</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-4">
              <div className="font-bold text-xs uppercase tracking-wider text-rose-600">Legal Compliance</div>
              <p className="mt-1 text-xs text-muted">Maintaining mandatory audit logs in accordance with CERT-In directions and IT Act guidelines.</p>
            </div>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">4. Processing by Third-Party Sub-Processors</h2>
          <p>
            MentorMind AI utilizes reputable cloud infrastructure providers bound by rigorous data protection agreements:
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Google Firebase:</strong> Cloud authentication, token issuance, and isolated Realtime Database storage (<code className="text-xs bg-surface px-1.5 py-0.5 rounded">/students/&#123;uid&#125;</code>).</li>
            <li><strong>Google Gemini AI API:</strong> Educational inference for academic questions. Student queries are transmitted via secure HTTPS and are not retained to train public baseline models.</li>
            <li><strong>Hosting:</strong> Distributed CDN and edge delivery through Firebase Hosting and Vercel.</li>
          </ul>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">5. Minor and Student Protection</h2>
          <p>
            In compliance with Section 9 of the DPDP Act 2023, we do not engage in targeted advertising directed at children, nor do we track behavior for profiling outside the explicit academic learning objectives. If a student is under the age of 18 (or applicable age of majority), registration must be undertaken with verifiable parental or lawful guardian consent.
          </p>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">6. Your Rights under DPDP Act 2023</h2>
          <p>As a Data Principal, you are entitled to the following enforceable statutory rights:</p>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Right to Access:</strong> Download your entire personal data file in structured JSON format directly from your Settings dashboard.</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Right to Correction & Erasure:</strong> Edit profile details or permanently delete your account and associated database records instantly.</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Right of Grievance Redressal:</strong> Submit a complaint directly to our appointed Grievance Officer, with guaranteed acknowledgment within 48 hours.</span>
            </div>
            <div className="flex items-start gap-2 text-xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>Right to Nominate:</strong> Nominate an individual to exercise your data rights in the event of death or incapacity.</span>
            </div>
          </div>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="font-display text-xl font-bold text-ink">7. Grievance Officer Details</h2>
          <p>
            For any concerns, notices, or privacy complaints:
          </p>
          <div className="rounded-xl border border-line bg-surface p-4 text-xs font-mono space-y-1">
            <div><strong>Grievance Officer:</strong> [GRIEVANCE OFFICER NAME]</div>
            <div><strong>Email:</strong> [GRIEVANCE OFFICER CONTACT]</div>
            <div><strong>Postal Address:</strong> [REGISTERED BUSINESS ADDRESS]</div>
            <div><strong>Resolution Timeline:</strong> Acknowledged in 48 hours; resolved within 15 business days.</div>
          </div>
          <p className="text-xs text-muted">
            You may also escalate unresolved grievances to the Data Protection Board of India once constituted under the DPDP Act 2023.
          </p>
        </section>
      </div>
    </PublicPageLayout>
  );
}

"use client";

import { useState } from "react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Mail, Clock, ShieldCheck, Send, CheckCircle2, AlertCircle } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <PublicPageLayout
      eyebrow="Get In Touch"
      title="Contact MentorMind AI Support"
      subtitle="Have questions about our academic agents, school integration, or privacy? Our student support and technical team are here to help."
      breadcrumbs={[{ label: "Contact Us" }]}
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
        {/* Contact Info & Grievance */}
        <div className="space-y-6 lg:col-span-5">
          <div className="rounded-2xl border border-line bg-card p-6 shadow-sm">
            <h2 className="font-display text-xl font-bold text-ink">Support Channels</h2>
            <p className="mt-1 text-sm text-muted">
              Choose the dedicated channel matching your inquiry for fastest resolution.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                <Mail className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-ink">General Support</div>
                  <div className="text-xs text-muted">Student queries & feature feedback</div>
                  <a
                    href="mailto:[SUPPORT EMAIL]"
                    className="mt-1 inline-block text-xs font-semibold text-indigo-600 hover:underline"
                  >
                    [SUPPORT EMAIL]
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-ink">Privacy & DPDP Officer</div>
                  <div className="text-xs text-muted">Data access, correction & deletion requests</div>
                  <a
                    href="mailto:[PRIVACY CONTACT EMAIL]"
                    className="mt-1 inline-block text-xs font-semibold text-emerald-600 hover:underline"
                  >
                    [PRIVACY CONTACT EMAIL]
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-line bg-surface p-4">
                <Clock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <div className="text-sm font-semibold text-ink">Operating Hours & Response Time</div>
                  <div className="text-xs text-muted">Monday – Friday: 9:00 AM – 6:00 PM IST</div>
                  <div className="mt-1 text-xs font-medium text-amber-700">
                    Typical response within 24 to 48 hours
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Grievance Redressal Card */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-amber-900">
              Statutory Grievance Redressal
            </h3>
            <p className="mt-2 text-xs text-amber-800 leading-relaxed">
              In accordance with the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023, you can escalate grievances directly to our appointed officer:
            </p>
            <div className="mt-3 text-xs text-amber-900 font-mono space-y-1">
              <div><strong>Officer:</strong> [GRIEVANCE OFFICER NAME]</div>
              <div><strong>Designation:</strong> Data Protection & Grievance Officer</div>
              <div><strong>Address:</strong> [REGISTERED BUSINESS ADDRESS]</div>
              <div><strong>Email:</strong> [GRIEVANCE OFFICER CONTACT]</div>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <div className="rounded-2xl border border-line bg-card p-8 shadow-sm">
            <h2 className="font-display text-xl font-bold text-ink">Send Us a Direct Message</h2>
            <p className="mt-1 text-sm text-muted">
              Fill in your details below and our team will get back to your registered email address.
            </p>

            {submitted ? (
              <div className="mt-8 rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-emerald-600" />
                <h3 className="mt-3 text-lg font-bold text-emerald-900">Message Received</h3>
                <p className="mt-2 text-sm text-emerald-800">
                  Thank you, <strong>{formData.name}</strong>. Your ticket has been logged and assigned. You will receive an acknowledgment at <strong>{formData.email}</strong> within 24 hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
                  }}
                  className="mt-5 rounded-lg bg-emerald-600 px-5 py-2 text-xs font-semibold text-white hover:bg-emerald-700 transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-ink">Your Full Name</label>
                    <input
                      type="text"
                      required
                      maxLength={50}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Alex Johnson"
                      className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-ink">Your Email Address</label>
                    <input
                      type="email"
                      required
                      maxLength={60}
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="student@example.com"
                      className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Inquiry Category</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="General Inquiry">General Product Inquiry</option>
                    <option value="Account & Login Issue">Account & Login Assistance</option>
                    <option value="AI Agent Feedback">AI Agent Feedback / Report Error</option>
                    <option value="Privacy / DPDP Request">DPDP Personal Data Request (Correction / Erasure)</option>
                    <option value="Billing & Subscription">Billing, Invoices & Subscriptions</option>
                    <option value="Institutional & School Inquiries">School / College Bulk Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-ink">Detailed Message</label>
                  <textarea
                    rows={5}
                    required
                    maxLength={1000}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your question or issue in detail..."
                    className="mt-1.5 w-full rounded-lg border border-line bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-muted focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <div className="mt-1 text-right text-xs text-muted">
                    {formData.message.length} / 1000 characters
                  </div>
                </div>

                <div className="rounded-lg border border-line bg-surface/50 p-3 text-xs text-muted flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                  <span>
                    By submitting this form, you acknowledge that your contact details will only be used to respond to your specific request in accordance with our Privacy Policy.
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition disabled:opacity-50"
                >
                  <Send className="h-4 w-4" />
                  {loading ? "Sending Message..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </PublicPageLayout>
  );
}

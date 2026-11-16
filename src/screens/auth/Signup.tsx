"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/forms/AuthShell";
import { Button, Field, useToast } from "@/components/common/ui";
import { GoogleIcon } from "@/components/common/GoogleIcon";
import { useApp } from "@/hooks/useApp";
import { cn } from "@/utils";

export const DEPARTMENTS = ["AI & DS", "Computer Science", "Information Technology", "Electronics & Communication", "Mechanical", "Civil", "Business", "Other"];
export const YEARS = ["First Year", "Second Year", "Third Year", "Fourth Year", "Postgraduate"];
const strength = (p: string) => [p.length >= 6, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;

const NAME_MAX = 15;
const EMAIL_MAX = 25;
const PASSWORD_MAX = 8;
const INSTITUTION_MAX = 60;
const GOALS_MAX = 200;

export default function Signup() {
  const { signup, loginGoogle } = useApp();
  const router = useRouter();
  const toast = useToast();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", department: "", year: "", institution: "", goals: "" });
  const [consent, setConsent] = useState({ terms: false, age: false, marketing: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [limitAlert, setLimitAlert] = useState<string | null>(null);

  const triggerLimitAlert = (fieldName: string) => {
    setLimitAlert(fieldName);
    setTimeout(() => {
      setLimitAlert((cur) => (cur === fieldName ? null : cur));
    }, 2500);
  };

  const handleFieldChange = (
    key: keyof typeof f,
    val: string,
    max: number
  ) => {
    if (val.length > max) {
      setF((p) => ({ ...p, [key]: val.slice(0, max) }));
      triggerLimitAlert(key);
    } else {
      setF((p) => ({ ...p, [key]: val }));
      if (val.length === max) {
        triggerLimitAlert(key);
      } else if (limitAlert === key) {
        setLimitAlert(null);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>,
    currentVal: string,
    max: number,
    fieldName: string
  ) => {
    if (
      currentVal.length >= max &&
      e.key.length === 1 &&
      !e.ctrlKey &&
      !e.metaKey &&
      !e.altKey
    ) {
      e.preventDefault();
      triggerLimitAlert(fieldName);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) e.name = "Enter your full name.";
    else if (f.name.length > NAME_MAX) e.name = `Name cannot exceed ${NAME_MAX} characters.`;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
    else if (f.email.length > EMAIL_MAX) e.email = `Email cannot exceed ${EMAIL_MAX} characters.`;
    if (f.password.length < 6) e.password = "Password must be 6 to 8 characters.";
    else if (f.password.length > PASSWORD_MAX) e.password = `Password cannot exceed ${PASSWORD_MAX} characters.`;
    if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
    if (!f.department) e.department = "Select your department.";
    if (!f.year) e.year = "Select your academic year.";
    if (f.institution.trim().length < 2) e.institution = "Enter your institution.";
    if (f.goals.trim().length < 5) e.goals = "Tell us a little about your learning goals.";
    if (!consent.terms) e.terms = "You must agree to the Terms & Conditions and acknowledge the Privacy Policy.";
    if (!consent.age) e.age = "You must confirm you are 18+ or have parental/guardian consent.";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const r = await signup({
      name: f.name,
      email: f.email,
      password: f.password,
      department: f.department,
      year: f.year,
      institution: f.institution,
      goals: f.goals,
      termsAccepted: consent.terms,
      ageConfirmed: consent.age,
      marketing: consent.marketing,
    });
    setBusy(false);
    if (!r.ok) return setErrors({ form: r.error ?? "Could not create account." });
    toast("Account created! Let's personalise your experience.");
    router.push("/onboarding");
  };

  const handleGoogle = async () => {
    setGoogleBusy(true);
    setErrors({});
    const r = await loginGoogle();
    setGoogleBusy(false);
    if (!r.ok) {
      setErrors({ form: r.error || "Google sign-up could not be completed." });
      return;
    }
    toast("Welcome to MentorMind!");
    router.push("/onboarding");
  };

  const s = strength(f.password);

  return (
    <AuthShell wide title="Create your account" subtitle="Takes a minute. Next you'll personalise MentorMind to how you learn.">
      {errors.form && (
        <div role="alert" className="mb-5 rounded-xl border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">
          {errors.form}
        </div>
      )}

      {/* Google Quick Sign Up */}
      <div className="mb-6">
        <button
          type="button"
          onClick={handleGoogle}
          disabled={busy || googleBusy}
          className="btn btn-secondary btn-lg flex w-full items-center justify-center gap-3 border border-line bg-surface hover:bg-surface2 transition"
        >
          {googleBusy ? <Loader2 className="h-4 w-4 animate-spin text-muted" /> : <GoogleIcon className="h-4 w-4" />}
          <span className="font-semibold">Sign up with Google</span>
        </button>

        <div className="my-5 flex items-center gap-3 text-xs text-muted">
          <span className="h-px flex-1 bg-line" />
          or register with email
          <span className="h-px flex-1 bg-line" />
        </div>
      </div>

      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
        {/* Full Name / Username */}
        <Field
          label="Full name / Username"
          error={errors.name}
          count={f.name.length}
          maxCount={NAME_MAX}
          limitReached={f.name.length >= NAME_MAX}
          limitMessage={limitAlert === "name" ? `Maximum ${NAME_MAX} characters allowed.` : undefined}
        >
          <input
            className={cn(
              "input transition-all",
              f.name.length >= NAME_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
            )}
            autoComplete="name"
            maxLength={NAME_MAX}
            value={f.name}
            onKeyDown={(e) => handleKeyDown(e, f.name, NAME_MAX, "name")}
            onChange={(e) => handleFieldChange("name", e.target.value, NAME_MAX)}
            placeholder="Alex Morgan"
          />
        </Field>

        {/* Email */}
        <Field
          label="Email"
          error={errors.email}
          count={f.email.length}
          maxCount={EMAIL_MAX}
          limitReached={f.email.length >= EMAIL_MAX}
          limitMessage={limitAlert === "email" ? `Maximum ${EMAIL_MAX} characters allowed.` : undefined}
        >
          <input
            className={cn(
              "input transition-all",
              f.email.length >= EMAIL_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
            )}
            type="email"
            autoComplete="email"
            maxLength={EMAIL_MAX}
            value={f.email}
            onKeyDown={(e) => handleKeyDown(e, f.email, EMAIL_MAX, "email")}
            onChange={(e) => handleFieldChange("email", e.target.value, EMAIL_MAX)}
            placeholder="you@university.edu"
          />
        </Field>

        {/* Password */}
        <Field
          label="Password"
          error={errors.password}
          count={f.password.length}
          maxCount={PASSWORD_MAX}
          limitReached={f.password.length >= PASSWORD_MAX}
          limitMessage={limitAlert === "password" ? `Maximum ${PASSWORD_MAX} characters allowed.` : undefined}
        >
          <input
            className={cn(
              "input transition-all",
              f.password.length >= PASSWORD_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
            )}
            type="password"
            autoComplete="new-password"
            maxLength={PASSWORD_MAX}
            value={f.password}
            onKeyDown={(e) => handleKeyDown(e, f.password, PASSWORD_MAX, "password")}
            onChange={(e) => handleFieldChange("password", e.target.value, PASSWORD_MAX)}
          />
          <div className="mt-2 flex gap-1" aria-hidden>
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i < s ? ["#fb7185", "#fbbf24", "#38d6ff", "#34d399"][s - 1] : "var(--line)" }} />
            ))}
          </div>
        </Field>

        {/* Confirm password */}
        <Field
          label="Confirm password"
          error={errors.confirm}
          count={f.confirm.length}
          maxCount={PASSWORD_MAX}
          limitReached={f.confirm.length >= PASSWORD_MAX}
          limitMessage={limitAlert === "confirm" ? `Maximum ${PASSWORD_MAX} characters allowed.` : undefined}
        >
          <input
            className={cn(
              "input transition-all",
              f.confirm.length >= PASSWORD_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
            )}
            type="password"
            autoComplete="new-password"
            maxLength={PASSWORD_MAX}
            value={f.confirm}
            onKeyDown={(e) => handleKeyDown(e, f.confirm, PASSWORD_MAX, "confirm")}
            onChange={(e) => handleFieldChange("confirm", e.target.value, PASSWORD_MAX)}
          />
        </Field>

        {/* Department */}
        <Field label="Department" error={errors.department}>
          <select className="input" value={f.department} onChange={(e) => setF((p) => ({ ...p, department: e.target.value }))}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>

        {/* Academic year */}
        <Field label="Academic year" error={errors.year}>
          <select className="input" value={f.year} onChange={(e) => setF((p) => ({ ...p, year: e.target.value }))}>
            <option value="">Select year</option>
            {YEARS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </Field>

        {/* Institution */}
        <Field
          label="Institution"
          error={errors.institution}
          className="sm:col-span-2"
          count={f.institution.length}
          maxCount={INSTITUTION_MAX}
          limitReached={f.institution.length >= INSTITUTION_MAX}
          limitMessage={limitAlert === "institution" ? `Maximum ${INSTITUTION_MAX} characters allowed.` : undefined}
        >
          <input
            className={cn(
              "input transition-all",
              f.institution.length >= INSTITUTION_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
            )}
            maxLength={INSTITUTION_MAX}
            value={f.institution}
            onKeyDown={(e) => handleKeyDown(e, f.institution, INSTITUTION_MAX, "institution")}
            onChange={(e) => handleFieldChange("institution", e.target.value, INSTITUTION_MAX)}
            placeholder="Your university or college"
          />
        </Field>

        {/* Learning goals */}
        <Field
          label="Learning goals"
          error={errors.goals}
          className="sm:col-span-2"
          count={f.goals.length}
          maxCount={GOALS_MAX}
          limitReached={f.goals.length >= GOALS_MAX}
          limitMessage={limitAlert === "goals" ? `Maximum ${GOALS_MAX} characters allowed.` : undefined}
        >
          <textarea
            className={cn(
              "input min-h-24 transition-all",
              f.goals.length >= GOALS_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
            )}
            maxLength={GOALS_MAX}
            value={f.goals}
            onKeyDown={(e) => handleKeyDown(e, f.goals, GOALS_MAX, "goals")}
            onChange={(e) => handleFieldChange("goals", e.target.value, GOALS_MAX)}
            placeholder="e.g. Pass my DBMS exam with 80%+ and learn machine learning basics."
          />
        </Field>

        {/* DPDP & Statutory Consent Checkboxes */}
        <div className="sm:col-span-2 space-y-3 rounded-2xl border border-line bg-surface/40 p-4">
          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.terms}
              onChange={(e) => setConsent({ ...consent, terms: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-line text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-ink leading-relaxed">
              I agree to the{" "}
              <Link href="/terms" target="_blank" className="font-semibold text-indigo-600 hover:underline">
                Terms & Conditions
              </Link>{" "}
              and acknowledge the{" "}
              <Link href="/privacy" target="_blank" className="font-semibold text-indigo-600 hover:underline">
                Privacy Policy
              </Link>
              . <span className="text-bad">*</span>
            </span>
          </label>
          {errors.terms && <p className="text-[11px] font-medium text-bad pl-6">{errors.terms}</p>}

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.age}
              onChange={(e) => setConsent({ ...consent, age: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-line text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-ink leading-relaxed">
              I confirm that I am at least 18 years of age, or have obtained verifiable parental/guardian consent to use this academic platform under the DPDP Act 2023. <span className="text-bad">*</span>
            </span>
          </label>
          {errors.age && <p className="text-[11px] font-medium text-bad pl-6">{errors.age}</p>}

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={consent.marketing}
              onChange={(e) => setConsent({ ...consent, marketing: e.target.checked })}
              className="mt-0.5 h-4 w-4 rounded border-line text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs text-muted leading-relaxed">
              (Optional) Send me periodic academic study guides, exam preparation tips, and platform updates.
            </span>
          </label>
        </div>

        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full" disabled={busy || googleBusy}>
            {busy && <Loader2 className="h-4 w-4 animate-spin" />}Create account
          </Button>
          <p className="mt-4 text-center text-sm text-muted">
            Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link>
          </p>
        </div>
      </form>
    </AuthShell>
  );
}

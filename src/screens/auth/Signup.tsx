"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AuthShell } from "@/components/forms/AuthShell";
import { Button, Field, useToast } from "@/components/common/ui";
import { useApp } from "@/hooks/useApp";

export const DEPARTMENTS = ["AI & DS", "Computer Science", "Information Technology", "Electronics & Communication", "Mechanical", "Civil", "Business", "Other"];
export const YEARS = ["First Year", "Second Year", "Third Year", "Fourth Year", "Postgraduate"];
const strength = (p: string) => [p.length >= 8, /[A-Z]/.test(p), /[0-9]/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;

export default function Signup() {
  const { signup } = useApp();
  const router = useRouter();
  const toast = useToast();
  const [f, setF] = useState({ name: "", email: "", password: "", confirm: "", department: "", year: "", institution: "", goals: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF((p) => ({ ...p, [k]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (f.name.trim().length < 2) e.name = "Enter your full name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) e.email = "Enter a valid email address.";
    if (f.password.length < 8) e.password = "Use at least 8 characters.";
    else if (!/[0-9]/.test(f.password) || !/[A-Za-z]/.test(f.password)) e.password = "Include both letters and numbers.";
    if (f.confirm !== f.password) e.confirm = "Passwords do not match.";
    if (!f.department) e.department = "Select your department.";
    if (!f.year) e.year = "Select your academic year.";
    if (f.institution.trim().length < 2) e.institution = "Enter your institution.";
    if (f.goals.trim().length < 5) e.goals = "Tell us a little about your learning goals.";
    setErrors(e);
    return !Object.keys(e).length;
  };
  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setBusy(true);
    const r = await signup({ name: f.name, email: f.email, password: f.password, department: f.department, year: f.year, institution: f.institution, goals: f.goals });
    setBusy(false);
    if (!r.ok) return setErrors({ email: r.error ?? "Could not create account." });
    toast("Account created. Let's personalise your experience.");
    router.push("/onboarding");
  };
  const s = strength(f.password);

  return (
    <AuthShell wide title="Create your account" subtitle="Takes a minute. Next you'll personalise MentorMind to how you learn.">
      <form onSubmit={submit} className="grid gap-5 sm:grid-cols-2" noValidate>
        <Field label="Full name" error={errors.name}><input className="input" autoComplete="name" value={f.name} onChange={set("name")} placeholder="Alex Morgan" /></Field>
        <Field label="Email" error={errors.email}><input className="input" type="email" autoComplete="email" value={f.email} onChange={set("email")} placeholder="you@university.edu" /></Field>
        <Field label="Password" error={errors.password}>
          <input className="input" type="password" autoComplete="new-password" value={f.password} onChange={set("password")} />
          <div className="mt-2 flex gap-1" aria-hidden>{[0, 1, 2, 3].map((i) => <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i < s ? ["#fb7185", "#fbbf24", "#38d6ff", "#34d399"][s - 1] : "var(--line)" }} />)}</div>
        </Field>
        <Field label="Confirm password" error={errors.confirm}><input className="input" type="password" autoComplete="new-password" value={f.confirm} onChange={set("confirm")} /></Field>
        <Field label="Department" error={errors.department}>
          <select className="input" value={f.department} onChange={set("department")}><option value="">Select department</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select>
        </Field>
        <Field label="Academic year" error={errors.year}>
          <select className="input" value={f.year} onChange={set("year")}><option value="">Select year</option>{YEARS.map((d) => <option key={d}>{d}</option>)}</select>
        </Field>
        <Field label="Institution" error={errors.institution} className="sm:col-span-2"><input className="input" value={f.institution} onChange={set("institution")} placeholder="Your university or college" /></Field>
        <Field label="Learning goals" error={errors.goals} className="sm:col-span-2"><textarea className="input min-h-24" value={f.goals} onChange={set("goals")} placeholder="e.g. Pass my DBMS exam with 80%+ and learn machine learning basics." /></Field>
        <div className="sm:col-span-2">
          <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Create account</Button>
          <p className="mt-3 text-center text-xs text-muted">Demo build: your account and learning data are stored only in this browser. New accounts start with clearly-marked sample data you can clear later.</p>
          <p className="mt-4 text-center text-sm text-muted">Already have an account? <Link href="/login" className="font-semibold text-brand hover:underline">Log in</Link></p>
        </div>
      </form>
    </AuthShell>
  );
}

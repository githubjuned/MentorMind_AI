"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, Mail, PlayCircle } from "lucide-react";
import { AuthShell } from "@/components/forms/AuthShell";
import { Button, Field, Modal, useToast } from "@/components/common/ui";
import { useApp } from "@/hooks/useApp";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/data/seed";

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

export default function Login() {
  const { login, loginDemo, resetPassword } = useApp();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [forgot, setForgot] = useState(false);
  const [fEmail, setFEmail] = useState("");
  const [fPass, setFPass] = useState("");
  const [fErr, setFErr] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const er: typeof errors = {};
    if (!emailOk(email)) er.email = "Enter a valid email address.";
    if (!password) er.password = "Enter your password.";
    setErrors(er);
    if (Object.keys(er).length) return;
    setBusy(true);
    const r = await login(email, password, remember);
    setBusy(false);
    if (!r.ok) return setErrors({ form: r.error });
    toast("Welcome back!");
    router.push("/dashboard");
  };
  const demo = () => { loginDemo(); toast("Signed in as the sample student Alex Morgan"); router.push("/dashboard"); };
  const doReset = async () => {
    if (!emailOk(fEmail)) return setFErr("Enter a valid email.");
    if (fPass.length < 8) return setFErr("New password must be at least 8 characters.");
    const r = await resetPassword(fEmail, fPass);
    if (!r.ok) return setFErr(r.error ?? "Could not reset.");
    setForgot(false); setFErr(""); toast("Password updated. You can log in now.");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue your learning journey.">
      <form onSubmit={submit} className="space-y-5" noValidate>
        {errors.form && <div role="alert" className="rounded-xl border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">{errors.form}</div>}
        <Field label="Email" error={errors.email}>
          <div className="relative"><Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input className="input pl-10" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@university.edu" /></div>
        </Field>
        <Field label="Password" error={errors.password}>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
            <input className="input px-10" type={show ? "text" : "password"} autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Your password" />
            <button type="button" onClick={() => setShow((s) => !s)} className="absolute right-3 top-2.5 text-muted hover:text-ink" aria-label={show ? "Hide password" : "Show password"}>{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
          </div>
        </Field>
        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted"><input type="checkbox" className="h-4 w-4 accent-[var(--brand)]" checked={remember} onChange={(e) => setRemember(e.target.checked)} />Remember me</label>
          <button type="button" className="font-semibold text-brand hover:underline" onClick={() => { setFEmail(email); setForgot(true); }}>Forgot password?</button>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={busy}>{busy && <Loader2 className="h-4 w-4 animate-spin" />}Log in</Button>
      </form>
      <div className="my-6 flex items-center gap-3 text-xs text-muted"><span className="h-px flex-1 bg-line" />or<span className="h-px flex-1 bg-line" /></div>
      <Button variant="secondary" size="lg" icon={PlayCircle} className="w-full" onClick={demo}>Explore with the demo account</Button>
      <p className="mt-3 text-center text-xs text-muted">Demo login: <code className="rounded bg-surface2 px-1.5 py-0.5">{DEMO_EMAIL}</code> / <code className="rounded bg-surface2 px-1.5 py-0.5">{DEMO_PASSWORD}</code>. Third-party sign-in (e.g. Google) isn&apos;t available in this demo.</p>
      <p className="mt-6 text-center text-sm text-muted">New to MentorMind? <Link href="/signup" className="font-semibold text-brand hover:underline">Create an account</Link></p>

      <Modal open={forgot} onClose={() => setForgot(false)} title="Reset your password" size="sm"
        footer={<><Button variant="ghost" onClick={() => setForgot(false)}>Cancel</Button><Button onClick={doReset}>Update password</Button></>}>
        <p className="mb-4 text-sm text-muted">Demo build: no email is sent. Accounts exist only in this browser, so you can set a new password directly.</p>
        <div className="space-y-4">
          <Field label="Account email"><input className="input" type="email" value={fEmail} onChange={(e) => setFEmail(e.target.value)} /></Field>
          <Field label="New password" error={fErr}><input className="input" type="password" value={fPass} onChange={(e) => setFPass(e.target.value)} /></Field>
        </div>
      </Modal>
    </AuthShell>
  );
}

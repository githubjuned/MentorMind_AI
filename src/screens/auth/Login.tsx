"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, Mail, PlayCircle } from "lucide-react";
import { AuthShell } from "@/components/forms/AuthShell";
import { Button, Field, Modal, useToast } from "@/components/common/ui";
import { GoogleIcon } from "@/components/common/GoogleIcon";
import { useApp } from "@/hooks/useApp";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/data/seed";
import { cn } from "@/utils";

const emailOk = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const EMAIL_MAX = 25;
const PASSWORD_MAX = 8;

export default function Login() {
  const { login, loginGoogle, loginDemo, resetPassword } = useApp();
  const router = useRouter();
  const toast = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [googleBusy, setGoogleBusy] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [limitAlert, setLimitAlert] = useState<string | null>(null);

  // Forgot password state
  const [forgot, setForgot] = useState(false);
  const [fEmail, setFEmail] = useState("");
  const [fBusy, setFBusy] = useState(false);
  const [fErr, setFErr] = useState("");
  const [fSuccess, setFSuccess] = useState(false);

  const triggerLimitAlert = (fieldName: string) => {
    setLimitAlert(fieldName);
    setTimeout(() => {
      setLimitAlert((cur) => (cur === fieldName ? null : cur));
    }, 2500);
  };

  const handleTextChange = (
    val: string,
    max: number,
    setter: (s: string) => void,
    fieldName: string
  ) => {
    if (val.length > max) {
      setter(val.slice(0, max));
      triggerLimitAlert(fieldName);
    } else {
      setter(val);
      if (val.length === max) {
        triggerLimitAlert(fieldName);
      } else if (limitAlert === fieldName) {
        setLimitAlert(null);
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
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

  const handleGoogle = async () => {
    setGoogleBusy(true);
    setErrors({});
    const r = await loginGoogle();
    setGoogleBusy(false);
    if (!r.ok) {
      setErrors({ form: r.error || "Google sign-in could not be completed." });
      return;
    }
    toast("Signed in with Google!");
    router.push("/dashboard");
  };

  const demo = () => {
    loginDemo();
    toast("Signed in as the sample student Alex Morgan");
    router.push("/dashboard");
  };

  const doReset = async () => {
    if (!emailOk(fEmail)) return setFErr("Enter a valid email address.");
    setFBusy(true);
    setFErr("");
    const r = await resetPassword(fEmail);
    setFBusy(false);
    if (!r.ok) return setFErr(r.error ?? "Could not send reset email.");
    setFSuccess(true);
    toast("Password reset email sent!");
  };

  return (
    <AuthShell title="Welcome back" subtitle="Log in to continue your learning journey.">
      {errors.form && (
        <div role="alert" className="mb-5 rounded-xl border border-bad/40 bg-bad/10 px-4 py-3 text-sm text-bad">
          {errors.form}
        </div>
      )}

      {/* Google Sign In */}
      <button
        type="button"
        onClick={handleGoogle}
        disabled={busy || googleBusy}
        className="btn btn-secondary btn-lg flex w-full items-center justify-center gap-3 border border-line bg-surface hover:bg-surface2 transition"
      >
        {googleBusy ? <Loader2 className="h-4 w-4 animate-spin text-muted" /> : <GoogleIcon className="h-4 w-4" />}
        <span className="font-semibold">Continue with Google</span>
      </button>

      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or sign in with email
        <span className="h-px flex-1 bg-line" />
      </div>

      <form onSubmit={submit} className="space-y-4" noValidate>
        {/* Username / Email with live limit indicator */}
        <Field
          label="Email / Username"
          error={errors.email}
          count={email.length}
          maxCount={EMAIL_MAX}
          limitReached={email.length >= EMAIL_MAX}
          limitMessage={limitAlert === "email" ? `Maximum character limit of ${EMAIL_MAX} reached.` : undefined}
        >
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
            <input
              className={cn(
                "input pl-10 transition-all",
                email.length >= EMAIL_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
              )}
              type="email"
              autoComplete="email"
              maxLength={EMAIL_MAX}
              value={email}
              onKeyDown={(e) => handleKeyDown(e, email, EMAIL_MAX, "email")}
              onChange={(e) => handleTextChange(e.target.value, EMAIL_MAX, setEmail, "email")}
              placeholder="you@university.edu"
            />
          </div>
        </Field>

        {/* Password with live limit indicator */}
        <Field
          label="Password"
          error={errors.password}
          count={password.length}
          maxCount={PASSWORD_MAX}
          limitReached={password.length >= PASSWORD_MAX}
          limitMessage={limitAlert === "password" ? `Maximum character limit of ${PASSWORD_MAX} reached.` : undefined}
        >
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" />
            <input
              className={cn(
                "input px-10 transition-all",
                password.length >= PASSWORD_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
              )}
              type={show ? "text" : "password"}
              autoComplete="current-password"
              maxLength={PASSWORD_MAX}
              value={password}
              onKeyDown={(e) => handleKeyDown(e, password, PASSWORD_MAX, "password")}
              onChange={(e) => handleTextChange(e.target.value, PASSWORD_MAX, setPassword, "password")}
              placeholder="Your password"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-2.5 text-muted hover:text-ink"
              aria-label={show ? "Hide password" : "Show password"}
            >
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </Field>

        <div className="flex items-center justify-between text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-muted">
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--brand)]"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
            />
            Remember me
          </label>
          <button
            type="button"
            className="font-semibold text-brand hover:underline"
            onClick={() => {
              setFEmail(email.slice(0, EMAIL_MAX));
              setFErr("");
              setFSuccess(false);
              setForgot(true);
            }}
          >
            Forgot password?
          </button>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={busy || googleBusy}>
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}Log in
        </Button>
      </form>

      <div className="my-5 flex items-center gap-3 text-xs text-muted">
        <span className="h-px flex-1 bg-line" />
        or explore
        <span className="h-px flex-1 bg-line" />
      </div>

      <Button variant="secondary" size="lg" icon={PlayCircle} className="w-full" onClick={demo} disabled={busy || googleBusy}>
        Explore with the demo account
      </Button>
      <p className="mt-3 text-center text-xs text-muted">
        Demo login: <code className="rounded bg-surface2 px-1.5 py-0.5">{DEMO_EMAIL}</code> / <code className="rounded bg-surface2 px-1.5 py-0.5">{DEMO_PASSWORD}</code>
      </p>
      <p className="mt-6 text-center text-sm text-muted">
        New to MentorMind? <Link href="/signup" className="font-semibold text-brand hover:underline">Create an account</Link>
      </p>

      {/* Forgot Password Modal */}
      <Modal
        open={forgot}
        onClose={() => setForgot(false)}
        title="Reset your password"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setForgot(false)}>Cancel</Button>
            {!fSuccess && (
              <Button onClick={doReset} disabled={fBusy}>
                {fBusy && <Loader2 className="h-4 w-4 animate-spin" />}Send reset link
              </Button>
            )}
          </>
        }
      >
        {fSuccess ? (
          <div className="py-2 text-center">
            <p className="font-semibold text-ok">Reset link sent!</p>
            <p className="mt-2 text-sm text-muted">
              We&apos;ve sent a password reset email to <strong>{fEmail}</strong>. Follow the instructions in the email to set a new password.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted">
              Enter your registered email address and we&apos;ll send you a link to reset your password.
            </p>
            <Field
              label="Account email"
              error={fErr}
              count={fEmail.length}
              maxCount={EMAIL_MAX}
              limitReached={fEmail.length >= EMAIL_MAX}
              limitMessage={fEmail.length >= EMAIL_MAX ? `Maximum character limit of ${EMAIL_MAX} reached.` : undefined}
            >
              <input
                className={cn(
                  "input transition-all",
                  fEmail.length >= EMAIL_MAX && "border-bad/60 focus:border-bad focus:ring-bad/30"
                )}
                type="email"
                autoComplete="email"
                maxLength={EMAIL_MAX}
                value={fEmail}
                onChange={(e) => setFEmail(e.target.value.slice(0, EMAIL_MAX))}
                placeholder="you@university.edu"
              />
            </Field>
          </div>
        )}
      </Modal>
    </AuthShell>
  );
}

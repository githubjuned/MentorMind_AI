"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LockKeyhole, LogIn, PlayCircle, ShieldAlert, Settings } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button } from "@/components/common/ui";
import { useApp } from "@/hooks/useApp";

export function AccessDeniedView({ variant = "auth" }: { variant?: "auth" | "educator" }) {
  const educator = variant === "educator";
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center py-16 text-center anim-fade-up">
      <div className="relative mb-6"><span className="anim-pulse-ring absolute inset-0 rounded-3xl bg-bad/40" /><div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-bad/15 text-bad">{educator ? <ShieldAlert className="h-10 w-10" /> : <LockKeyhole className="h-10 w-10" />}</div></div>
      <p className="eyebrow !text-bad">Error 403 · Access denied</p>
      <h1 className="mt-2 font-display text-3xl font-bold">{educator ? "Educator portal is off" : "You need to log in first"}</h1>
      <p className="mt-3 text-sm text-muted">{educator ? "The educator portal shows anonymous, class-level data and is disabled until you consent in Privacy settings. Individual learning memory is never visible to educators." : "This page is only available to signed-in students. Log in or try the demo account to continue."}</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">{educator ? <Button href="/settings" icon={Settings}>Open privacy settings</Button> : <AuthButtons />}<Button href={educator ? "/dashboard" : "/"} variant="secondary">{educator ? "Back to dashboard" : "Back to website"}</Button></div>
    </div>
  );
}
function AuthButtons() {
  const { loginDemo } = useApp();
  const router = useRouter();
  return (<><Button href="/login" icon={LogIn}>Log in</Button><Button variant="secondary" icon={PlayCircle} onClick={() => { loginDemo(); router.push("/dashboard"); }}>Try demo account</Button></>);
}
export default function AccessDenied() {
  return (
    <div className="bg-aurora flex min-h-screen flex-col px-6 py-6">
      <Logo />
      <div className="flex flex-1 items-center justify-center"><AccessDeniedView /></div>
      <p className="text-center text-xs text-muted">Need an account? <Link href="/signup" className="font-semibold text-brand hover:underline">Sign up free</Link></p>
    </div>
  );
}

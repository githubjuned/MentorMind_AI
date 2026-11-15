"use client";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, PartyPopper, Plus } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Button, ChipSelect, Field, Progress } from "@/components/common/ui";
import { cn } from "@/utils";
import { useApp } from "@/hooks/useApp";
import { LEARNING_STYLES, SUBJECT_COLORS, WEEKDAYS } from "@/data/seed";
import { KB } from "@/data/knowledge";
import { DEPARTMENTS, YEARS } from "@/screens/auth/Signup";
import { slug } from "@/utils";
import { minsLabel } from "@/utils";

const STEPS = ["Personal", "Academic", "Goals", "Learning style", "Subjects", "Study time", "Assessment"];
const SUGGESTED_SUBJECTS = ["Python Programming", "Database Management Systems", "Mathematics", "Data Structures", "Artificial Intelligence", "General Science (Elective)", "Operating Systems", "Computer Networks", "Statistics", "Web Development"];
const GOAL_IDEAS = ["Score higher in exams", "Understand concepts deeply", "Build consistent study habits", "Prepare for placements", "Learn machine learning", "Reduce last-minute cramming"];

export default function Onboarding() {
  const { state, ready, update, addMemory } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const p = state.profile;
  const [name, setName] = useState(p.name);
  const [phone, setPhone] = useState(p.phone);
  const [color, setColor] = useState(p.avatarColor);
  const [dept, setDept] = useState(p.department);
  const [year, setYear] = useState(p.year);
  const [inst, setInst] = useState(p.institution);
  const [goals, setGoals] = useState(p.goals);
  const [styles, setStyles] = useState<string[]>(p.styles);
  const [subs, setSubs] = useState<string[]>(state.subjects.slice(0, 5).map((s) => s.name));
  const [custom, setCustom] = useState("");
  const [minutes, setMinutes] = useState(p.dailyMinutes);
  const [avail, setAvail] = useState(p.availability);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [err, setErr] = useState("");

  useEffect(() => { if (ready && !state.session) router.replace("/access-denied"); }, [ready, state.session, router]);
  const quiz = useMemo(() => ["py-loops", "dbms-normalization", "math-probability", "ds-stacks-queues", "ai-ml-basics"].map((id) => KB.find((k) => k.id === id)!.questions[0]), []);
  const score = quiz.filter((q) => answers[q.id] === q.answer).length;

  const next = () => {
    setErr("");
    if (step === 0 && name.trim().length < 2) return setErr("Please enter your name.");
    if (step === 1 && (!dept || !year || inst.trim().length < 2)) return setErr("Please complete all academic fields.");
    if (step === 2 && goals.trim().length < 5) return setErr("Add at least one learning goal.");
    if (step === 3 && !styles.length) return setErr("Pick at least one preference. You can change this any time.");
    if (step === 4 && !subs.length) return setErr("Select at least one subject.");
    if (step === 5 && !Object.values(avail).some(Boolean)) return setErr("Choose at least one study day.");
    if (step === 6) return finish();
    setStep(step + 1);
  };
  const finish = () => {
    update((s) => {
      const subjects = [...s.subjects];
      subs.forEach((n) => { if (!subjects.some((x) => x.name === n)) subjects.push({ id: slug(n) || n, name: n, color: SUBJECT_COLORS[subjects.length % SUBJECT_COLORS.length], targetHours: 4 }); });
      return { ...s, onboarded: true, subjects, profile: { ...s.profile, name: name.trim(), phone, avatarColor: color, department: dept, year, institution: inst, goals, styles, dailyMinutes: minutes, availability: avail } };
    });
    addMemory("edited", "Learning preferences chosen", `Preferred styles: ${styles.join(", ")}. These are starting points and will be refined from your activity.`);
    addMemory("stored", "Subjects of interest saved", subs.join(", "));
    addMemory("inferred", `Baseline assessment: ${score}/${quiz.length}`, "A quick five-question check used only as a starting point, not a measure of ability.");
    setDone(true);
  };

  if (done) {
    return (
      <div className="bg-aurora flex min-h-screen items-center justify-center p-6">
        <div className="card anim-fade-up w-full max-w-xl p-8 text-center sm:p-10">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/15 text-brand"><PartyPopper className="h-8 w-8" /></div>
          <h1 className="font-display text-3xl font-bold">Welcome, <span className="gradient-text">{name.split(" ")[0]}</span>!</h1>
          <p className="mx-auto mt-3 max-w-md text-sm text-muted">Your MentorMind workspace is ready. Here&apos;s how we&apos;ll start — everything can be edited later in Learning Memory and Settings.</p>
          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left text-sm">
            {[`Explanations tuned to: ${styles.slice(0, 2).join(" & ")}${styles.length > 2 ? ` +${styles.length - 2}` : ""}`, `${subs.length} subjects tracked`, `${minsLabel(minutes)} daily study target on ${Object.values(avail).filter(Boolean).length} days`, `Baseline check: ${score} of ${quiz.length} correct`].map((t) => (
              <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" />{t}</li>
            ))}
          </ul>
          <Button size="lg" className="mt-8 w-full" onClick={() => router.push("/dashboard")}>Go to my dashboard<ArrowRight className="h-4 w-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-aurora min-h-screen px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-2xl">
        <div className="mb-6 flex items-center justify-between"><Logo /><button className="text-xs font-semibold text-muted hover:text-ink" onClick={() => { update((s) => ({ ...s, onboarded: true })); router.push("/dashboard"); }}>Skip for now</button></div>
        <div className="mb-2 flex items-center justify-between text-xs font-semibold text-muted"><span>Step {step + 1} of {STEPS.length} · {STEPS[step]}</span><span>{Math.round(((step + 1) / STEPS.length) * 100)}%</span></div>
        <Progress value={((step + 1) / STEPS.length) * 100} label="Onboarding progress" />
        <div className="card anim-fade-up mt-6 p-6 sm:p-8" key={step}>
          {step === 0 && (<div className="space-y-5">
            <Header t="Tell us about you" s="This helps personalise your workspace." />
            <Field label="Full name"><input className="input" value={name} onChange={(e) => setName(e.target.value)} /></Field>
            <Field label="Email" hint="Taken from your account."><input className="input opacity-70" value={p.email} readOnly /></Field>
            <Field label="Phone (optional)"><input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 0100" /></Field>
            <Field label="Profile colour"><div className="flex gap-2">{SUBJECT_COLORS.concat("#8b7bff").map((c) => <button key={c} aria-label={`Colour ${c}`} aria-pressed={color === c} onClick={() => setColor(c)} className={cn("h-8 w-8 rounded-full border-2", color === c ? "border-ink" : "border-transparent")} style={{ background: c }} />)}</div></Field>
          </div>)}
          {step === 1 && (<div className="space-y-5">
            <Header t="Academic information" s="So plans and recommendations fit your course." />
            <Field label="Department"><select className="input" value={dept} onChange={(e) => setDept(e.target.value)}><option value="">Select</option>{DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Academic year"><select className="input" value={year} onChange={(e) => setYear(e.target.value)}><option value="">Select</option>{YEARS.map((d) => <option key={d}>{d}</option>)}</select></Field>
            <Field label="Institution"><input className="input" value={inst} onChange={(e) => setInst(e.target.value)} /></Field>
          </div>)}
          {step === 2 && (<div className="space-y-5">
            <Header t="What do you want to achieve?" s="Your goals guide study plans and suggestions." />
            <textarea className="input min-h-28" value={goals} onChange={(e) => setGoals(e.target.value)} aria-label="Learning goals" />
            <div><p className="label">Quick ideas</p><div className="flex flex-wrap gap-2">{GOAL_IDEAS.map((g) => <button key={g} className="chip" onClick={() => setGoals((v) => (v.includes(g) ? v : (v ? v.replace(/\.?\s*$/, ". ") : "") + g + "."))}><Plus className="h-3 w-3" />{g}</button>)}</div></div>
          </div>)}
          {step === 3 && (<div className="space-y-5">
            <Header t="How do you like to learn?" s="Select all that apply. These are starting points — MentorMind refines them from your activity, and you can edit them any time." />
            <ChipSelect options={LEARNING_STYLES} value={styles} onChange={setStyles} />
          </div>)}
          {step === 4 && (<div className="space-y-5">
            <Header t="Subjects of interest" s="Choose what you're studying. You can add more later." />
            <ChipSelect options={[...new Set([...SUGGESTED_SUBJECTS, ...subs])]} value={subs} onChange={setSubs} />
            <div className="flex gap-2"><input className="input" placeholder="Add another subject" value={custom} onChange={(e) => setCustom(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && custom.trim()) { setSubs([...subs, custom.trim()]); setCustom(""); } }} /><Button variant="secondary" icon={Plus} onClick={() => { if (custom.trim()) { setSubs([...subs, custom.trim()]); setCustom(""); } }}>Add</Button></div>
          </div>)}
          {step === 5 && (<div className="space-y-6">
            <Header t="Daily study time" s="Be realistic — consistency beats long sessions." />
            <div><div className="mb-2 flex justify-between text-sm"><span className="text-muted">Per study day</span><span className="font-display font-bold text-brand">{minsLabel(minutes)}</span></div><input type="range" min={30} max={360} step={15} value={minutes} onChange={(e) => setMinutes(+e.target.value)} className="w-full accent-[var(--brand)]" aria-label="Daily study minutes" /></div>
            <div><p className="label">Study days</p><div className="flex flex-wrap gap-2">{WEEKDAYS.map((d) => <button key={d} aria-pressed={avail[d]} onClick={() => setAvail({ ...avail, [d]: !avail[d] })} className={cn("chip w-14 justify-center", avail[d] && "chip-on")}>{d}</button>)}</div></div>
          </div>)}
          {step === 6 && (<div className="space-y-5">
            <Header t="Quick starting assessment" s="Five short questions to set a baseline. It isn't graded and doesn't define you." />
            {quiz.map((q, i) => (
              <div key={q.id}>
                <p className="mb-2 text-sm font-semibold">{i + 1}. {q.q}</p>
                <div className="grid gap-2 sm:grid-cols-2">{q.options?.map((o) => <button key={o} onClick={() => setAnswers({ ...answers, [q.id]: o })} aria-pressed={answers[q.id] === o} className={cn("rounded-xl border px-3 py-2 text-left text-sm transition", answers[q.id] === o ? "border-brand bg-brand/15" : "border-line bg-surface2 hover:border-brand/50")}>{o}</button>)}</div>
              </div>
            ))}
          </div>)}
          {err && <p role="alert" className="mt-4 text-sm font-medium text-bad">{err}</p>}
          <div className="mt-8 flex items-center justify-between">
            <Button variant="ghost" icon={ArrowLeft} disabled={step === 0} onClick={() => setStep(step - 1)}>Back</Button>
            <Button onClick={next}>{step === 6 ? "Finish" : "Continue"}<ArrowRight className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
const Header = ({ t, s }: { t: string; s: string }) => (<div><h1 className="font-display text-2xl font-bold">{t}</h1><p className="mt-1 text-sm text-muted">{s}</p></div>);

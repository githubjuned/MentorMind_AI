"use client";
import { useState } from "react";
import { BookOpen, CalendarClock, ChevronDown, CircleHelp, LifeBuoy, ListChecks, Mail, NotebookPen, Search, Sparkles } from "lucide-react";
import { Button, Card, EmptyState, Field, PageHeader, Tabs, cn, useToast } from "@/components/common/ui";
import { useApp } from "@/hooks/useApp";

export const FAQS = [
  ["Is MentorMind connected to live AI?", "Yes. MentorMind uses Google Gemini AI for real-time Socratic explanation, adaptive practice quiz generation, structured notes synthesis, and intelligent curriculum planning."],
  ["How are the AI agents coordinated?", "The AI Coordinator analyzes your prompt, determines the pedagogical intent, and routes it to the specialized agent (Socratic Coach, Concept Explainer, Exam Crammer, or Formula Assistant)."],
  ["Where is my data stored?", "In your secure Firebase Realtime Database with strict per-user UID isolation rules, synced directly with your authenticated Google or Email account."],
  ["How does my learning history start?", "Every new account starts completely fresh with zero recorded dummy data. As you study, take quizzes, and log sessions, your real performance metrics are recorded live."],
  ["Can I change my learning style?", "Yes, any time in Learning Memory or Settings. Your preferences dynamically guide how the AI models format explanations and examples."],
  ["Who can see my learning memory?", "Only you. All personal memory, topics mastery, and quiz attempts are strictly protected under your authenticated user ID."],
] as const;

const GUIDES = {
  agents: { icon: Sparkles, title: "How to use AI agents", steps: ["Open the AI Assistant and type what you need in plain language.", "Watch the activity strip: the coordinator picks a specialist agent and shows its name on the reply.", "Use the buttons on the reply — start a quiz, save notes, add a plan to your planner.", "Prefer a specific tool? Launch any agent from the Agent Hub.", "Use the thumbs and regenerate options to refine answers."] },
  plan: { icon: CalendarClock, title: "How to create a study plan", steps: ["Go to Study Planner and add your exams (Add exam).", "In Generate a plan, choose subjects, topics, difficulty and priority.", "Set the exam date, hours per day and the days you can study.", "Press Generate schedule, review the draft, then Add to planner.", "Tick tasks off, edit or reschedule them, and run sessions from Daily routine."] },
  notes: { icon: NotebookPen, title: "How to generate notes", steps: ["Open Smart Notes and pick a source: topic, pasted text or an uploaded file.", "Choose the subject and a notes type — short, detailed, bullets, exam, revision or chapter summary.", "Press Generate notes and edit the result if you like.", "Save, copy, download as Markdown or export to PDF.", "Find everything later under Saved notes with search and filters."] },
  quiz: { icon: ListChecks, title: "How to take quizzes", steps: ["Open Quizzes, choose subject, topic, difficulty, number and question format.", "Optionally set a timer, then generate and start the quiz.", "Use the navigator to jump around and mark questions for review.", "Submit to see your score, explanations, weak areas and suggested topics.", "Retry any quiz, or review old attempts in History."] },
} as const;

export default function Help() {
  const { state } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<"faq" | keyof typeof GUIDES | "contact">("faq");
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<number | null>(0);
  const [form, setForm] = useState({ topic: "Question", message: "" });
  const [err, setErr] = useState("");
  const [sent, setSent] = useState(false);
  const faqs = FAQS.filter(([a, b]) => !q || (a + b).toLowerCase().includes(q.toLowerCase()));
  const guide = tab !== "faq" && tab !== "contact" ? GUIDES[tab] : null;

  return (
    <>
      <PageHeader title="Help & support" subtitle="Answers, how-to guides and a way to contact us." icon={LifeBuoy} color="#8b7bff" eyebrow="Account" />
      <div className="mb-6 overflow-x-auto"><Tabs value={tab} onChange={setTab} tabs={[{ id: "faq", label: "FAQ", icon: CircleHelp }, { id: "agents", label: "AI agents", icon: Sparkles }, { id: "plan", label: "Study plan", icon: CalendarClock }, { id: "notes", label: "Notes", icon: NotebookPen }, { id: "quiz", label: "Quizzes", icon: ListChecks }, { id: "contact", label: "Contact support", icon: Mail }]} /></div>
      <div className="max-w-3xl">
        {tab === "faq" && (<>
          <div className="relative mb-4"><Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input className="input pl-10" placeholder="Search frequently asked questions…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search FAQ" /></div>
          {faqs.length ? <ul className="space-y-2">{faqs.map(([a, b], i) => <li key={a}><Card className="overflow-hidden"><button className="flex w-full items-center gap-3 p-4 text-left" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}><span className="flex-1 text-sm font-semibold">{a}</span><ChevronDown className={cn("h-4 w-4 text-muted transition", open === i && "rotate-180")} /></button>{open === i && <p className="border-t border-line px-4 py-3 text-sm text-muted">{b}</p>}</Card></li>)}</ul> : <EmptyState icon={CircleHelp} title="No matching questions" body="Try different words or contact support." action={<Button onClick={() => setTab("contact")}>Contact support</Button>} />}
        </>)}
        {guide && <Card className="p-6"><h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold"><guide.icon className="h-5 w-5 text-brand" />{guide.title}</h2><ol className="space-y-3">{guide.steps.map((s, i) => <li key={s} className="flex gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand/15 text-xs font-bold text-brand">{i + 1}</span><span className="pt-0.5">{s}</span></li>)}</ol><div className="mt-5 flex gap-2"><Button href={tab === "agents" ? "/assistant" : tab === "plan" ? "/planner" : tab === "notes" ? "/notes" : "/quizzes"} icon={BookOpen}>Try it now</Button></div></Card>}
        {tab === "contact" && (
          <Card className="p-6">{sent ? <div className="py-6 text-center"><Mail className="mx-auto mb-3 h-10 w-10 text-ok" /><h2 className="font-display text-lg font-semibold">Message recorded</h2><p className="mx-auto mt-1 max-w-sm text-sm text-muted">Demo build: no email is sent and nobody will read this. In a live deployment it would reach the support team.</p><Button className="mt-4" variant="secondary" onClick={() => { setSent(false); setForm({ topic: "Question", message: "" }); }}>Send another</Button></div> : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (form.message.trim().length < 10) return setErr("Please describe your issue in at least 10 characters."); setErr(""); setSent(true); toast("Support request recorded (demo)", "info"); }}>
              <div className="grid gap-4 sm:grid-cols-2"><Field label="Name"><input className="input opacity-70" readOnly value={state.profile.name} /></Field><Field label="Email"><input className="input opacity-70" readOnly value={state.profile.email} /></Field></div>
              <Field label="Topic"><select className="input" value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}>{["Question", "Bug report", "Feature request", "Account or privacy"].map((t) => <option key={t}>{t}</option>)}</select></Field>
              <Field label="Message" error={err}><textarea className="input min-h-36" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help?" /></Field>
              <Button type="submit" icon={Mail}>Send message</Button>
            </form>)}</Card>
        )}
      </div>
    </>
  );
}

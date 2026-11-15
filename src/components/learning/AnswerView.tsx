"use client";
import { ArrowRight, BookMarked, CheckCircle2, HelpCircle, Layers, Lightbulb, ListOrdered, Sparkles } from "lucide-react";
import type { DoubtAnswer } from "@/types";
import { Markdown } from "@/components/common/Markdown";
import { Badge } from "@/components/common/ui";

const FORMAT_LABEL = { simple: "Simple explanation", detailed: "Detailed explanation", steps: "Step-by-step", examples: "Practical example first", visual: "Visual explanation" };

function Section({ icon: Icon, title, children, color = "#22d3ee" }: { icon: typeof Lightbulb; title: string; children: React.ReactNode; color?: string }) {
  return (
    <section className="rounded-2xl border border-line bg-surface2/60 p-4">
      <h3 className="mb-2 flex items-center gap-2 font-display text-sm font-semibold"><span className="flex h-6 w-6 items-center justify-center rounded-lg" style={{ background: `${color}22`, color }}><Icon className="h-3.5 w-3.5" /></span>{title}</h3>
      {children}
    </section>
  );
}

export function AnswerView({ answer, onFollowup }: { answer: DoubtAnswer; onFollowup?: (q: string) => void }) {
  const f = answer.format;
  const steps = (
    <Section key="steps" icon={ListOrdered} title="Step-by-step breakdown" color="#34d399"><Markdown text={answer.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")} /></Section>
  );
  const example = (
    <Section key="example" icon={Layers} title="Practical example" color="#fbbf24"><Markdown text={answer.example} /></Section>
  );
  const visual = (
    <Section key="visual" icon={Sparkles} title="Visual flow" color="#a78bfa">
      <ol className="flex flex-wrap items-stretch gap-2">
        {answer.steps.map((s, i) => (
          <li key={i} className="flex items-center gap-2">
            <div className="max-w-[11rem] rounded-xl border border-brand/40 bg-brand/10 px-3 py-2 text-xs"><span className="mb-1 block font-display text-[10px] font-bold text-brand">STEP {i + 1}</span>{s.replace(/`/g, "")}</div>
            {i < answer.steps.length - 1 && <ArrowRight className="h-4 w-4 shrink-0 text-muted" aria-hidden />}
          </li>
        ))}
      </ol>
    </Section>
  );
  const concept = <Section key="concept" icon={Lightbulb} title="Concept explanation"><Markdown text={answer.concept} /></Section>;
  const takeaways = (
    <Section key="take" icon={CheckCircle2} title="Key takeaways" color="#34d399">
      <ul className="space-y-1.5 text-sm">{answer.takeaways.map((t) => <li key={t} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-ok" />{t}</li>)}</ul>
    </Section>
  );
  const related = (
    <Section key="rel" icon={BookMarked} title="Related topics" color="#60a5fa"><div className="flex flex-wrap gap-2">{answer.related.map((r) => <Badge key={r} tone="info">{r}</Badge>)}</div></Section>
  );
  const follow = (
    <Section key="fu" icon={HelpCircle} title="Follow-up questions" color="#fb7185">
      <div className="flex flex-wrap gap-2">{answer.followups.map((q) => <button key={q} onClick={() => onFollowup?.(q)} disabled={!onFollowup} className="chip text-left disabled:cursor-default">{q}</button>)}</div>
    </Section>
  );
  const order = f === "simple" ? [takeaways, follow] : f === "steps" ? [steps, concept, example, takeaways, related, follow] : f === "examples" ? [example, concept, steps, takeaways, related, follow] : f === "visual" ? [visual, concept, example, takeaways, related, follow] : [concept, steps, example, takeaways, related, follow];
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2"><h2 className="font-display text-lg font-bold">{answer.topicTitle}</h2><Badge tone="brand">{FORMAT_LABEL[f]}</Badge>{answer.generic && <Badge tone="warn">Generic scaffold</Badge>}</div>
      <div className="rounded-2xl border border-brand/40 bg-brand/10 p-4"><p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-brand">Direct answer</p><Markdown text={answer.direct} /></div>
      {order}
    </div>
  );
}

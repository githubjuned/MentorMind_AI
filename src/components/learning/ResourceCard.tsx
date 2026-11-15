"use client";
import { useState } from "react";
import { BookOpen, Bookmark, BookmarkCheck, Clock, ExternalLink, FileText, Film, GraduationCap, HelpCircle, Library } from "lucide-react";
import type { ResourceItem } from "@/types";
import { Badge, Button, Modal } from "@/components/common/ui";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";

const TYPE = { video: Film, article: FileText, documentation: Library, tutorial: GraduationCap, practice: HelpCircle, reference: BookOpen } as const;

export function ResourceCard({ r, compact }: { r: ResourceItem; compact?: boolean }) {
  const { state, update } = useApp();
  const [open, setOpen] = useState(false);
  const saved = state.savedResources.includes(r.id);
  const Icon = TYPE[r.type];
  const color = subjectColor(state, r.subjectId);
  const toggle = () => update((s) => ({ ...s, savedResources: saved ? s.savedResources.filter((x) => x !== r.id) : [...s.savedResources, r.id] }));
  return (
    <article className="card card-hover flex flex-col p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: `${color}22`, color }}><Icon className="h-5 w-5" /></span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold leading-snug">{r.title}</h3>
          <p className="mt-0.5 text-xs text-muted">{r.provider}</p>
        </div>
        <button onClick={toggle} aria-label={saved ? "Remove from saved" : "Save resource"} aria-pressed={saved} className="text-muted hover:text-brand">{saved ? <BookmarkCheck className="h-5 w-5 text-brand" /> : <Bookmark className="h-5 w-5" />}</button>
      </div>
      {!compact && <p className="mt-3 text-sm text-muted">{r.description}</p>}
      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        <Badge color={color}>{subjectName(state, r.subjectId).replace(" (Elective)", "")}</Badge><Badge tone="muted">{r.type}</Badge>
        <Badge tone={r.difficulty === "easy" ? "ok" : r.difficulty === "medium" ? "warn" : "bad"}>{r.difficulty}</Badge>
        <span className="ml-auto flex items-center gap-1 text-xs text-muted"><Clock className="h-3.5 w-3.5" />{r.minutes} min</span>
      </div>
      <div className="mt-4">
        {r.url ? (
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm w-full"><ExternalLink className="h-3.5 w-3.5" />Open resource</a>
        ) : (
          <Button size="sm" variant="secondary" className="w-full" onClick={() => setOpen(true)}>Open resource</Button>
        )}
      </div>
      <Modal open={open} onClose={() => setOpen(false)} title={r.title} size="sm" footer={<Button onClick={() => setOpen(false)}>Close</Button>}>
        <p className="text-sm">{r.description}</p>
        <p className="mt-3 rounded-xl bg-warn/10 p-3 text-xs text-warn">This is a sample resource in the demo catalogue and has no external link. A connected backend would link to the real material.</p>
      </Modal>
    </article>
  );
}

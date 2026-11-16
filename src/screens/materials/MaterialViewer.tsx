"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Bookmark, BookmarkCheck, FileText, ListChecks, MessageSquare, NotebookPen, Sparkles, X } from "lucide-react";
import { Badge, Button, Card, EmptyState, useToast } from "@/components/common/ui";
import { findTopic } from "@/data/knowledge";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { useStartQuiz } from "@/hooks/useStartQuiz";
import { buildNotes, buildQuiz, summarizeText } from "@/services/ai/demo";
import { cn, fmtDate, setHandoff, timeAgo, uid } from "@/utils";

export default function MaterialViewer({ id }: { id: string }) {
  const { state, update, addActivity } = useApp();
  const toast = useToast();
  const router = useRouter();
  const startQuiz = useStartQuiz();
  const mat = state.materials.find((m) => m.id === id);
  const [summary, setSummary] = useState<ReturnType<typeof summarizeText> | null>(null);

  useEffect(() => { if (mat) update((s) => ({ ...s, materials: s.materials.map((m) => (m.id === id ? { ...m, lastUsedAt: new Date().toISOString() } : m)) })); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id, !!mat]);

  const kb = mat ? findTopic(`${mat.name.replace(/[_.-]/g, " ")} ${mat.content.slice(0, 600)}`, mat.subjectId) : undefined;
  const paragraphs = useMemo(() => (mat?.content ? mat.content.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : []), [mat?.content]);
  const fallbackText = kb ? `${kb.direct}\n\n${kb.concept}\n\n${kb.example}` : "";
  const text = mat?.content || fallbackText;

  if (!mat) return <EmptyState icon={FileText} title="Document not found" body="It may have been deleted from this device." action={<Button href="/materials">Back to materials</Button>} />;
  const bookmarked = (p: string) => mat.bookmarks.some((b) => b.text === p);
  const toggleBm = (p: string) => update((s) => ({ ...s, materials: s.materials.map((m) => (m.id === id ? { ...m, bookmarks: bookmarked(p) ? m.bookmarks.filter((b) => b.text !== p) : [...m.bookmarks, { id: uid(), text: p }] } : m)) }));
  const demoState = !mat.extracted;
  const genNotes = () => {
    const n = buildNotes({ topicId: kb?.id, topicText: mat.name.replace(/[_.-]/g, " "), subjectId: mat.subjectId, type: "short", sourceText: text.length > 80 ? text : undefined, sourceName: mat.name });
    const now = new Date().toISOString();
    update((s) => ({ ...s, notes: [{ id: uid(), title: n.title, subjectId: mat.subjectId, type: "short", content: n.markdown, source: `File: ${mat.name}`, createdAt: now, updatedAt: now }, ...s.notes] }));
    addActivity("notes", `Generated notes from ${mat.name}`, "Saved to notes", "/notes");
    toast("Notes generated and saved"); router.push("/notes");
  };
  const genQuiz = () => {
    const r = buildQuiz({ subjectId: mat.subjectId, topicId: kb?.id, difficulty: "medium", count: 5, format: "mixed" });
    if (!r.questions.length) return toast("No questions available for this document in the demo bank.", "error");
    startQuiz({ subjectId: r.subjectId || mat.subjectId, topic: kb?.title ?? mat.name, difficulty: "medium", questions: r.questions });
  };

  return (
    <>
      <Link href="/materials" className="mb-4 inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"><ArrowLeft className="h-4 w-4" />All materials</Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_21rem]">
        <Card className="min-w-0 p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-center gap-3 border-b border-line pb-5"><span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand"><FileText className="h-6 w-6" /></span><div className="min-w-0 flex-1"><h1 className="truncate font-display text-xl font-bold">{mat.name}</h1><p className="text-xs text-muted">{mat.kind.toUpperCase()} · {mat.sizeKB} KB · {subjectName(state, mat.subjectId)}</p></div></div>
          {demoState && <div className="mb-5 rounded-xl border border-brand/40 bg-brand/10 p-4 text-sm"><p className="font-semibold text-brand">Document Reader</p><p className="mt-1 text-muted">Reading document content. {!mat.content && kb && "Below is related study content for this document's topic."}</p></div>}
          {text ? (
            <article className="space-y-4">
              {(paragraphs.length ? paragraphs : text.split(/\n\s*\n/)).map((p, i) => (
                <div key={i} className={cn("group relative rounded-xl p-3 pr-12 transition", bookmarked(p) ? "bg-warn/10 ring-1 ring-warn/40" : "hover:bg-surface2/60")}>
                  {i === 0 && paragraphs.length > 1 ? <h2 className="font-display text-lg font-semibold">{p}</h2> : <p className="text-sm leading-relaxed">{p}</p>}
                  <button onClick={() => toggleBm(p)} aria-label={bookmarked(p) ? "Remove bookmark" : "Bookmark this section"} aria-pressed={bookmarked(p)} className="absolute right-3 top-3 text-muted hover:text-warn">{bookmarked(p) ? <BookmarkCheck className="h-5 w-5 text-warn" /> : <Bookmark className="h-5 w-5" />}</button>
                </div>
              ))}
            </article>
          ) : <EmptyState icon={FileText} title="No preview available" body="This file type can't be read in the demo. You can still generate notes or a quiz from its subject." />}
        </Card>
        <div className="space-y-5">
          <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">Study with this document</h2>
            <div className="grid gap-2">
              <Button variant="secondary" icon={MessageSquare} onClick={() => { setHandoff("assistant", `Explain ${kb?.title ?? mat.name.replace(/\.[a-z]+$/i, "").replace(/[_-]/g, " ")} from my study material`); router.push("/assistant"); }}>Ask AI about this document</Button>
              <Button variant="secondary" icon={Sparkles} onClick={() => text.length > 60 ? setSummary(summarizeText(text)) : toast("Not enough readable text to summarise.", "error")}>Summarize document</Button>
              <Button variant="secondary" icon={NotebookPen} onClick={genNotes}>Generate notes</Button>
              <Button variant="secondary" icon={ListChecks} onClick={genQuiz}>Generate quiz</Button>
            </div></Card>
          {summary && <Card className="anim-fade-up p-5"><div className="mb-2 flex items-center justify-between"><h2 className="font-display text-base font-semibold">Summary</h2><button aria-label="Close summary" onClick={() => setSummary(null)}><X className="h-4 w-4" /></button></div><p className="text-sm text-muted">{summary.summary}</p>{summary.points.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">{summary.points.slice(0, 4).map((p) => <li key={p}>{p.length > 140 ? p.slice(0, 140) + "…" : p}</li>)}</ul>}<p className="mt-2 text-[11px] text-muted">Heuristic summary (sentence ranking), not a language model.</p></Card>}
          <Card className="p-5"><h2 className="mb-3 font-display text-base font-semibold">File information</h2><dl className="space-y-2 text-sm"><div className="flex justify-between"><dt className="text-muted">Type</dt><dd>{mat.kind.toUpperCase()}</dd></div><div className="flex justify-between"><dt className="text-muted">Size</dt><dd>{mat.sizeKB} KB</dd></div><div className="flex justify-between"><dt className="text-muted">Subject</dt><dd className="text-right"><Badge color={subjectColor(state, mat.subjectId)}>{subjectName(state, mat.subjectId).split(" ")[0]}</Badge></dd></div><div className="flex justify-between"><dt className="text-muted">Uploaded</dt><dd>{fmtDate(mat.uploadedAt.slice(0, 10), true)}</dd></div><div className="flex justify-between"><dt className="text-muted">Last opened</dt><dd>{timeAgo(mat.lastUsedAt)}</dd></div></dl></Card>
          <Card className="p-5"><h2 className="mb-3 flex items-center gap-2 font-display text-base font-semibold"><Bookmark className="h-4 w-4 text-warn" />Bookmarks ({mat.bookmarks.length})</h2><ul className="space-y-2">{mat.bookmarks.map((b) => <li key={b.id} className="flex gap-2 rounded-lg bg-surface2 p-2.5 text-xs"><span className="line-clamp-3 flex-1">{b.text}</span><button aria-label="Remove bookmark" onClick={() => toggleBm(b.text)}><X className="h-3.5 w-3.5 text-muted" /></button></li>)}{!mat.bookmarks.length && <li className="text-xs text-muted">Click the bookmark icon next to any section to save it here.</li>}</ul></Card>
        </div>
      </div>
    </>
  );
}

"use client";
import { useMemo, useRef, useState } from "react";
import { Copy, Download, FileDown, FileText, Loader2, NotebookPen, Pencil, Save, Search, Sparkles, Trash2, Upload, Wand2, X } from "lucide-react";
import { Markdown } from "@/components/common/Markdown";
import { Badge, Button, Card, Confirm, EmptyState, Field, PageHeader, Pagination, Tabs, cn, useToast } from "@/components/common/ui";
import { KB } from "@/data/knowledge";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import { NOTE_TYPES, buildNotes, noteTypeLabel } from "@/services/ai/demo";
import type { Note, NoteType } from "@/types";
import { copyText, download, fmtDate, uid } from "@/utils";

type Source = "topic" | "text" | "file";
const PER_PAGE = 6;

export default function Notes() {
  const { state, update, addActivity, addSession } = useApp();
  const toast = useToast();
  const [tab, setTab] = useState<"generate" | "saved">("generate");
  const [source, setSource] = useState<Source>("topic");
  const [subjectId, setSubjectId] = useState(state.subjects[0]?.id ?? "");
  const [topicId, setTopicId] = useState("");
  const [topicText, setTopicText] = useState("");
  const [pasted, setPasted] = useState("");
  const [file, setFile] = useState<{ name: string; text?: string; kind: string } | null>(null);
  const [type, setType] = useState<NoteType>("short");
  const [busy, setBusy] = useState(false);
  const [draft, setDraft] = useState<{ title: string; markdown: string; subjectId: string; source: string } | null>(null);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const [q, setQ] = useState("");
  const [fSubject, setFSubject] = useState("all");
  const [sort, setSort] = useState<"new" | "old" | "az">("new");
  const [page, setPage] = useState(1);
  const [openId, setOpenId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState<Note | null>(null);
  const [del, setDel] = useState<Note | null>(null);

  const topics = KB.filter((k) => k.subjectId === subjectId);

  const generate = async () => {
    setError("");
    if (source === "topic" && !topicId && topicText.trim().length < 3) return setError("Choose a topic or type one.");
    if (source === "text" && pasted.trim().length < 60) return setError("Paste at least a few sentences (60+ characters).");
    if (source === "file" && !file) return setError("Upload a file first.");
    setBusy(true);
    await new Promise((r) => setTimeout(r, 900));
    const srcText = source === "text" ? pasted : file?.text;
    const r = buildNotes({ topicId: source === "topic" ? topicId || undefined : undefined, topicText: source === "topic" ? topicText || topics.find((t) => t.id === topicId)?.title : file && !file.text ? file.name.replace(/[_.-]/g, " ") : undefined, subjectId, type, sourceText: srcText, sourceName: file?.name });
    setDraft({ ...r, source: source === "topic" ? `Topic: ${topicText || topics.find((t) => t.id === topicId)?.title || ""}` : source === "text" ? "Pasted text" : `File: ${file?.name}` });
    setEditing(false); setBusy(false);
    addSession({ subjectId: r.subjectId || subjectId, topic: r.title, minutes: 5, kind: "notes" });
  };
  const save = () => {
    if (!draft) return;
    const now = new Date().toISOString();
    update((s) => ({ ...s, notes: [{ id: uid(), title: draft.title, subjectId: draft.subjectId || subjectId, type, content: draft.markdown, source: draft.source, createdAt: now, updatedAt: now }, ...s.notes] }));
    addActivity("notes", `Generated notes: ${draft.title}`, `${noteTypeLabel(type)} saved`, "/notes");
    toast("Notes saved to your library"); setDraft(null); setTab("saved");
  };
  const onFile = async (f?: File) => {
    if (!f) return;
    const kind = f.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "docx", "txt", "md"].includes(kind)) return toast("Upload a PDF, DOCX or TXT file.", "error");
    if (kind === "txt" || kind === "md") {
      const r = new FileReader();
      r.onload = () => setFile({ name: f.name, text: String(r.result).slice(0, 80000), kind });
      r.readAsText(f);
    } else {
      try {
        const formData = new FormData();
        formData.append("file", f);
        const res = await fetch("/api/materials/extract", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          setFile({ name: f.name, text: data.content, kind });
          toast(`Extracted text from ${f.name}`, "info");
          return;
        }
      } catch (e) {
        console.warn("Notes file extraction failed:", e);
      }
      setFile({ name: f.name, kind });
    }
  };
  const exportPdf = (title: string, md: string) => {
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return toast("Allow pop-ups to export to PDF.", "error");
    const html = md.split("\n").map((l) => l.startsWith("# ") ? `<h1>${l.slice(2)}</h1>` : l.startsWith("## ") ? `<h2>${l.slice(3)}</h2>` : l.startsWith("> ") ? `<blockquote>${l.slice(2)}</blockquote>` : /^[-*] /.test(l) ? `<li>${l.slice(2)}</li>` : l.trim() ? `<p>${l}</p>` : "").join("").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>").replace(/`([^`]+)`/g, "<code>$1</code>");
    w.document.write(`<html><head><title>${title}</title><style>body{font-family:system-ui;max-width:720px;margin:32px auto;line-height:1.6;color:#111}h1{font-size:24px}h2{font-size:18px;margin-top:24px}blockquote{border-left:4px solid #6c5ce7;background:#f3f1ff;margin:12px 0;padding:8px 14px}code{background:#eee;padding:1px 5px;border-radius:4px}</style></head><body>${html}<script>window.onload=()=>window.print()<\/script></body></html>`);
    w.document.close();
  };

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    const list = state.notes.filter((n) => (fSubject === "all" || n.subjectId === fSubject) && (!t || n.title.toLowerCase().includes(t) || n.content.toLowerCase().includes(t)));
    return list.sort((a, b) => (sort === "az" ? a.title.localeCompare(b.title) : sort === "old" ? a.updatedAt.localeCompare(b.updatedAt) : b.updatedAt.localeCompare(a.updatedAt)));
  }, [state.notes, q, fSubject, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const view = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const opened = state.notes.find((n) => n.id === openId);

  return (
    <>
      <PageHeader title="Smart Notes Generator" subtitle="Turn a topic, pasted text or a file into structured study notes you can edit, save and export." icon={NotebookPen} color="#fbbf24" eyebrow="Agent 2 · Notes"
        actions={<Tabs value={tab} onChange={setTab} tabs={[{ id: "generate", label: "Generate", icon: Wand2 }, { id: "saved", label: "Saved notes", icon: FileText, count: state.notes.length }]} />} />

      {tab === "generate" && (
        <div className="grid gap-6 xl:grid-cols-[26rem_1fr]">
          <Card data-tour="notes-panel" className="h-fit space-y-5 p-5">
            <Field label="Source"><Tabs value={source} onChange={setSource} tabs={[{ id: "topic", label: "Topic" }, { id: "text", label: "Paste text" }, { id: "file", label: "Upload" }]} /></Field>
            <Field label="Subject"><select className="input" value={subjectId} onChange={(e) => { setSubjectId(e.target.value); setTopicId(""); }}>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
            {source === "topic" && (<>
              <Field label="Topic"><select className="input" value={topicId} onChange={(e) => setTopicId(e.target.value)}><option value="">Type my own below…</option>{topics.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}</select></Field>
              {!topicId && <Field label="Enter topic manually" hint="Topics outside the demo knowledge base produce an editable outline."><input className="input" value={topicText} onChange={(e) => setTopicText(e.target.value)} placeholder="e.g. Hash tables" /></Field>}
            </>)}
            {source === "text" && <Field label="Paste your text" hint={`${pasted.length} characters`}><textarea className="input min-h-40" value={pasted} onChange={(e) => setPasted(e.target.value)} placeholder="Paste a lecture passage or textbook section…" /></Field>}
            {source === "file" && (
              <Field label="PDF, DOCX or text file" hint="TXT files are read in your browser. PDF/DOCX text extraction needs a backend, so the demo uses the file name as the topic.">
                <input ref={fileRef} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => { onFile(e.target.files?.[0]); e.target.value = ""; }} />
                {file ? <div className="flex items-center gap-2 rounded-xl border border-line bg-surface2 px-3 py-2.5 text-sm"><FileText className="h-4 w-4 text-warn" /><span className="flex-1 truncate">{file.name}</span><button aria-label="Remove file" onClick={() => setFile(null)}><X className="h-4 w-4" /></button></div>
                  : <button onClick={() => fileRef.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-line p-6 text-sm text-muted transition hover:border-brand hover:text-ink"><Upload className="h-6 w-6" />Choose a file</button>}
              </Field>
            )}
            <Field label="Notes type">
              <div className="grid grid-cols-2 gap-2">{NOTE_TYPES.map((n) => <button key={n.value} onClick={() => setType(n.value)} aria-pressed={type === n.value} title={n.hint} className={cn("rounded-xl border px-3 py-2 text-left text-xs transition", type === n.value ? "border-brand bg-brand/15" : "border-line bg-surface2 hover:border-brand/50")}><span className="block font-semibold">{n.label}</span><span className="text-[11px] text-muted">{n.hint}</span></button>)}</div>
            </Field>
            {error && <p role="alert" className="text-sm font-medium text-bad">{error}</p>}
            <Button className="w-full" icon={busy ? Loader2 : Sparkles} onClick={generate} disabled={busy}>{busy ? "Generating…" : "Generate notes"}</Button>
          </Card>

          <div className="min-w-0">
            {busy && <Card className="space-y-3 p-6"><div className="skeleton h-8 w-2/3" /><div className="skeleton h-5" /><div className="skeleton h-5 w-5/6" /><div className="skeleton h-32" /></Card>}
            {!busy && draft && (
              <Card className="anim-fade-up p-5 sm:p-6">
                <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-line pb-4">
                  <Badge tone="warn">{noteTypeLabel(type)}</Badge><Badge color={subjectColor(state, draft.subjectId)}>{subjectName(state, draft.subjectId)}</Badge>
                  <div className="ml-auto flex flex-wrap gap-2">
                    <Button size="sm" variant="secondary" icon={editing ? Save : Pencil} onClick={() => setEditing((e) => !e)}>{editing ? "Done" : "Edit"}</Button>
                    <Button size="sm" variant="secondary" icon={Copy} onClick={async () => toast((await copyText(draft.markdown)) ? "Copied" : "Copy failed", "info")}>Copy</Button>
                    <Button size="sm" variant="secondary" icon={Download} onClick={() => download(`${draft.title}.md`, draft.markdown, "text/markdown")}>Download</Button>
                    <Button size="sm" variant="secondary" icon={FileDown} onClick={() => exportPdf(draft.title, draft.markdown)}>PDF</Button>
                    <Button size="sm" icon={Save} onClick={save}>Save notes</Button>
                  </div>
                </div>
                {editing ? <textarea className="input min-h-96 font-mono text-xs" value={draft.markdown} onChange={(e) => setDraft({ ...draft, markdown: e.target.value })} aria-label="Edit notes" /> : <Markdown text={draft.markdown} />}
              </Card>
            )}
            {!busy && !draft && <EmptyState icon={NotebookPen} title="Your notes will appear here" body="Pick a source and a notes type, then generate. You can edit before saving." />}
          </div>
        </div>
      )}

      {tab === "saved" && (
        <div>
          <div className="mb-5 flex flex-wrap gap-3">
            <div className="relative min-w-52 flex-1"><Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input className="input pl-10" placeholder="Search saved notes…" value={q} onChange={(e) => { setQ(e.target.value); setPage(1); }} aria-label="Search notes" /></div>
            <select className="input w-auto" value={fSubject} onChange={(e) => { setFSubject(e.target.value); setPage(1); }} aria-label="Filter by subject"><option value="all">All subjects</option>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
            <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value as typeof sort)} aria-label="Sort"><option value="new">Newest first</option><option value="old">Oldest first</option><option value="az">A → Z</option></select>
          </div>
          {view.length ? (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {view.map((n) => (
                <Card key={n.id} className="card-hover flex flex-col p-5">
                  <div className="mb-2 flex flex-wrap gap-1.5"><Badge color={subjectColor(state, n.subjectId)}>{subjectName(state, n.subjectId).split(" ")[0]}</Badge><Badge tone="warn">{noteTypeLabel(n.type)}</Badge>{n.sample && <Badge>Sample</Badge>}</div>
                  <h3 className="font-display text-base font-semibold leading-snug">{n.title}</h3>
                  <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted">{n.content.replace(/[#>*`\-]/g, "").replace(/\s+/g, " ").slice(0, 160)}…</p>
                  <p className="mt-3 text-xs text-muted">{n.source} · updated {fmtDate(n.updatedAt.slice(0, 10))}</p>
                  <div className="mt-3 flex gap-2"><Button size="sm" variant="secondary" className="flex-1" onClick={() => setOpenId(n.id)}>Open</Button><Button size="sm" variant="ghost" icon={Pencil} aria-label="Edit note" onClick={() => setEditNote(n)} /><Button size="sm" variant="ghost" icon={Trash2} aria-label="Delete note" onClick={() => setDel(n)} /></div>
                </Card>
              ))}
            </div>
          ) : <EmptyState icon={FileText} title={state.notes.length ? "No notes match your filters" : "No saved notes yet"} body={state.notes.length ? "Try a different search or subject." : "Generate notes and save them to build your library."} action={<Button onClick={() => setTab("generate")}>Generate notes</Button>} />}
          <Pagination page={page} pages={pages} onChange={setPage} />
        </div>
      )}

      {opened && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label={opened.title}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpenId(null)} />
          <div className="card anim-fade-up relative flex max-h-[90vh] w-full max-w-3xl flex-col">
            <div className="flex flex-wrap items-center gap-2 border-b border-line p-4"><h2 className="mr-auto font-display text-lg font-semibold">{opened.title}</h2>
              <Button size="sm" variant="secondary" icon={Copy} onClick={async () => toast((await copyText(opened.content)) ? "Copied" : "Copy failed", "info")}>Copy</Button>
              <Button size="sm" variant="secondary" icon={Download} onClick={() => download(`${opened.title}.md`, opened.content, "text/markdown")}>Download</Button>
              <Button size="sm" variant="secondary" icon={FileDown} onClick={() => exportPdf(opened.title, opened.content)}>PDF</Button>
              <button aria-label="Close" className="rounded-lg p-1.5 hover:bg-surface2" onClick={() => setOpenId(null)}><X className="h-5 w-5" /></button></div>
            <div className="overflow-y-auto p-5"><Markdown text={opened.content} /></div>
          </div>
        </div>
      )}
      {editNote && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="Edit note">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setEditNote(null)} />
          <div className="card anim-fade-up relative flex max-h-[90vh] w-full max-w-3xl flex-col gap-3 p-5">
            <h2 className="font-display text-lg font-semibold">Edit note</h2>
            <input className="input" value={editNote.title} onChange={(e) => setEditNote({ ...editNote, title: e.target.value })} aria-label="Title" />
            <textarea className="input min-h-80 flex-1 font-mono text-xs" value={editNote.content} onChange={(e) => setEditNote({ ...editNote, content: e.target.value })} aria-label="Content" />
            <div className="flex justify-end gap-2"><Button variant="ghost" onClick={() => setEditNote(null)}>Cancel</Button><Button icon={Save} onClick={() => { update((s) => ({ ...s, notes: s.notes.map((n) => (n.id === editNote.id ? { ...editNote, updatedAt: new Date().toISOString() } : n)) })); setEditNote(null); toast("Note updated"); }}>Save changes</Button></div>
          </div>
        </div>
      )}
      <Confirm open={!!del} onClose={() => setDel(null)} danger title="Delete this note?" body={<>“{del?.title}” will be permanently removed from this device.</>} confirmLabel="Delete" onConfirm={() => { update((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== del?.id) })); toast("Note deleted", "info"); }} />
    </>
  );
}

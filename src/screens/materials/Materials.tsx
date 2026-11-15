"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Clock, File, FileText, Folder, Search, Trash2, Upload, X } from "lucide-react";
import { Badge, Button, Card, Confirm, EmptyState, Field, Modal, PageHeader, Tabs, useToast } from "@/components/common/ui";
import { useApp, subjectColor, subjectName } from "@/hooks/useApp";
import type { Material } from "@/types";
import { fmtDate, takeHandoff, timeAgo, uid } from "@/utils";

const KIND_COLOR = { pdf: "#fb7185", docx: "#60a5fa", txt: "#a3e635" } as const;

export default function Materials() {
  const { state, update, addActivity } = useApp();
  const toast = useToast();
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [kind, setKind] = useState("all");
  const [tab, setTab] = useState<"all" | "uploaded" | "used">("all");
  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [upSubject, setUpSubject] = useState(state.subjects[0]?.id ?? "");
  const [err, setErr] = useState("");
  const [drag, setDrag] = useState(false);
  const [del, setDel] = useState<Material | null>(null);
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (takeHandoff("upload")) setUpload(true); }, []);

  const list = useMemo(() => {
    const l = state.materials.filter((m) => (subject === "all" || m.subjectId === subject) && (kind === "all" || m.kind === kind) && (!q || m.name.toLowerCase().includes(q.toLowerCase())));
    return [...l].sort((a, b) => (tab === "used" ? b.lastUsedAt.localeCompare(a.lastUsedAt) : b.uploadedAt.localeCompare(a.uploadedAt)));
  }, [state.materials, q, subject, kind, tab]);
  const choose = (f?: File) => {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "docx", "txt", "md"].includes(ext)) return setErr("Only PDF, DOCX and TXT files are supported.");
    if (f.size > 5 * 1024 * 1024) return setErr("File is larger than 5 MB.");
    setErr(""); setFile(f);
  };
  const save = async () => {
    if (!file) return setErr("Choose a file first.");
    const ext = file.name.split(".").pop()!.toLowerCase();
    const k: Material["kind"] = ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : "txt";
    const finish = (content: string, extracted: boolean) => {
      const now = new Date().toISOString();
      const mat: Material = { id: uid(), name: file.name, kind: k, sizeKB: Math.max(1, Math.round(file.size / 1024)), subjectId: upSubject, uploadedAt: now, lastUsedAt: now, content, extracted, bookmarks: [] };
      update((s) => ({ ...s, materials: [mat, ...s.materials] }));
      addActivity("notes", `Uploaded ${file.name}`, subjectName(state, upSubject), `/materials/${mat.id}`);
      toast("Material uploaded"); setUpload(false); setFile(null);
    };
    if (k === "txt") {
      const r = new FileReader();
      r.onload = () => finish(String(r.result).slice(0, 200000), true);
      r.onerror = () => setErr("Could not read this file.");
      r.readAsText(file);
    } else {
      try {
        const formData = new FormData();
        formData.append("file", file);
        const res = await fetch("/api/materials/extract", { method: "POST", body: formData });
        if (res.ok) {
          const data = await res.json();
          finish(data.content || "", true);
          return;
        }
      } catch (e) {
        console.warn("Backend document extraction failed, using fallback:", e);
      }
      finish("", false);
    }
  };

  return (
    <>
      <PageHeader title="My study materials" subtitle="Your document library. Open a file to ask questions, summarise it, generate notes or a quiz." icon={Folder} color="#22d3ee" eyebrow="Library" actions={<Button icon={Upload} onClick={() => setUpload(true)}>Upload material</Button>} />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs value={tab} onChange={setTab} tabs={[{ id: "all", label: "All" }, { id: "uploaded", label: "Recently uploaded" }, { id: "used", label: "Recently used" }]} />
        <div className="relative min-w-52 flex-1"><Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input className="input pl-10" placeholder="Search files…" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search files" /></div>
        <select className="input w-auto" value={subject} onChange={(e) => setSubject(e.target.value)} aria-label="Subject"><option value="all">All subjects</option>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select className="input w-auto" value={kind} onChange={(e) => setKind(e.target.value)} aria-label="File type"><option value="all">All types</option><option value="pdf">PDF</option><option value="docx">DOCX</option><option value="txt">Text</option></select>
      </div>
      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => (
            <Card key={m.id} className="card-hover flex flex-col p-5">
              <div className="flex items-start gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl" style={{ background: `${KIND_COLOR[m.kind]}22`, color: KIND_COLOR[m.kind] }}><FileText className="h-6 w-6" /></span><div className="min-w-0 flex-1"><h3 className="truncate text-sm font-semibold" title={m.name}>{m.name}</h3><p className="text-xs text-muted">{m.kind.toUpperCase()} · {m.sizeKB >= 1024 ? `${(m.sizeKB / 1024).toFixed(1)} MB` : `${m.sizeKB} KB`}</p></div></div>
              <div className="mt-3 flex flex-wrap gap-1.5"><Badge color={subjectColor(state, m.subjectId)}>{subjectName(state, m.subjectId).split(" ")[0]}</Badge>{m.sample && <Badge>Sample</Badge>}{m.bookmarks.length > 0 && <Badge tone="warn">{m.bookmarks.length} bookmarks</Badge>}</div>
              <p className="mt-3 flex items-center gap-1.5 text-xs text-muted"><Clock className="h-3.5 w-3.5" />Uploaded {fmtDate(m.uploadedAt.slice(0, 10))} · used {timeAgo(m.lastUsedAt)}</p>
              <div className="mt-4 flex gap-2"><Link href={`/materials/${m.id}`} className="btn btn-secondary btn-sm flex-1"><File className="h-3.5 w-3.5" />Open</Link><Button size="sm" variant="ghost" icon={Trash2} aria-label={`Delete ${m.name}`} onClick={() => setDel(m)} /></div>
            </Card>
          ))}
        </div>
      ) : <EmptyState icon={Folder} title={state.materials.length ? "No files match your filters" : "Your library is empty"} body={state.materials.length ? "Try clearing the search or filters." : "Upload a PDF, DOCX or text file to get started."} action={<Button icon={Upload} onClick={() => setUpload(true)}>Upload material</Button>} />}
      <Modal open={upload} onClose={() => { setUpload(false); setFile(null); setErr(""); }} title="Upload study material" footer={<><Button variant="ghost" onClick={() => { setUpload(false); setFile(null); setErr(""); }}>Cancel</Button><Button onClick={save}>Upload</Button></>}>
        <input ref={ref} type="file" accept=".pdf,.docx,.txt,.md" className="hidden" onChange={(e) => { choose(e.target.files?.[0]); e.target.value = ""; }} />
        <div className="space-y-4">
          {file ? <div className="flex items-center gap-3 rounded-xl border border-line bg-surface2 px-4 py-3 text-sm"><FileText className="h-5 w-5 text-brand" /><span className="min-w-0 flex-1 truncate">{file.name}</span><span className="text-xs text-muted">{Math.round(file.size / 1024)} KB</span><button aria-label="Remove file" onClick={() => setFile(null)}><X className="h-4 w-4" /></button></div>
            : <button onClick={() => ref.current?.click()} onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={(e) => { e.preventDefault(); setDrag(false); choose(e.dataTransfer.files[0]); }} className={`flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed p-10 text-sm transition ${drag ? "border-brand bg-brand/10" : "border-line text-muted hover:border-brand"}`}><Upload className="h-8 w-8" /><span className="font-semibold text-ink">Drop a file or click to browse</span><span className="text-xs">PDF, DOCX or TXT · up to 5 MB</span></button>}
          <Field label="Subject"><select className="input" value={upSubject} onChange={(e) => setUpSubject(e.target.value)}>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select></Field>
          {err && <p role="alert" className="text-sm font-medium text-bad">{err}</p>}
          <p className="rounded-xl bg-warn/10 p-3 text-xs text-warn">Demo build: files stay in your browser. Text files are read in full; PDF/DOCX text extraction needs a backend, so those open in a clearly-labelled demo state.</p>
        </div>
      </Modal>
      <Confirm open={!!del} onClose={() => setDel(null)} danger title="Delete this material?" body={<>“{del?.name}” and its bookmarks will be removed from this device.</>} confirmLabel="Delete" onConfirm={() => { update((s) => ({ ...s, materials: s.materials.filter((m) => m.id !== del?.id) })); toast("Material deleted", "info"); }} />
    </>
  );
}

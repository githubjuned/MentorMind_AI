"use client";
import { useMemo, useState } from "react";
import { Bookmark, Compass, Info, Search, Sparkles } from "lucide-react";
import { Badge, Button, Card, EmptyState, PageHeader, Pagination, Tabs } from "@/components/common/ui";
import { ResourceCard } from "@/components/learning/ResourceCard";
import { RESOURCES } from "@/data/resources";
import { useApp } from "@/hooks/useApp";
import { recommendResources } from "@/services/ai/demo";

const TYPES = ["video", "article", "documentation", "tutorial", "practice", "reference"] as const;
const PREF_TYPE: Record<string, string[]> = { "Visual learning": ["video"], "Practice-based learning": ["practice"], "Detailed notes": ["documentation", "article"], "Short notes": ["reference"], "Step-by-step explanations": ["tutorial"], "Practical examples": ["tutorial", "practice"] };
const PER = 9;

export default function Resources() {
  const { state } = useApp();
  const [tab, setTab] = useState<"for-you" | "all" | "saved">("for-you");
  const [q, setQ] = useState("");
  const [subject, setSubject] = useState("all");
  const [type, setType] = useState("all");
  const [diff, setDiff] = useState("all");
  const [sort, setSort] = useState("rel");
  const [page, setPage] = useState(1);

  const weak = state.topics.filter((t) => t.status !== "not_started" && t.mastery < 60);
  const prefTypes = state.profile.styles.flatMap((s) => PREF_TYPE[s] ?? []);
  const forYou = useMemo(() => {
    const base = recommendResources(state, { limit: 40 });
    return base.map((r) => {
      const reasons: string[] = [];
      const w = weak.find((t) => r.topicIds.includes(t.id));
      if (w) reasons.push(`Matches a weak topic: ${w.name} (${w.mastery}% mastery)`);
      if (prefTypes.includes(r.type)) reasons.push(`Fits your preferred learning style (${r.type})`);
      const ex = state.exams.find((e) => e.subjectId === r.subjectId);
      if (ex) reasons.push(`Supports your upcoming ${ex.title}`);
      return { r, reasons };
    }).sort((a, b) => b.reasons.length - a.reasons.length);
  }, [state]); // eslint-disable-line react-hooks/exhaustive-deps

  const base = tab === "for-you" ? forYou.map((x) => x.r) : tab === "saved" ? RESOURCES.filter((r) => state.savedResources.includes(r.id)) : RESOURCES;
  const filtered = base.filter((r) => (subject === "all" || r.subjectId === subject) && (type === "all" || r.type === type) && (diff === "all" || r.difficulty === diff) && (!q || (r.title + r.description).toLowerCase().includes(q.toLowerCase())));
  const sorted = sort === "time" ? [...filtered].sort((a, b) => a.minutes - b.minutes) : sort === "az" ? [...filtered].sort((a, b) => a.title.localeCompare(b.title)) : filtered;
  const pages = Math.max(1, Math.ceil(sorted.length / PER));
  const view = sorted.slice((page - 1) * PER, page * PER);
  const reasonOf = (id: string) => forYou.find((x) => x.r.id === id)?.reasons ?? [];
  const reset = (fn: () => void) => { fn(); setPage(1); };

  return (
    <>
      <PageHeader title="Resource discovery" subtitle="Videos, articles, documentation, tutorials and practice material matched to your goals, performance and preferences." icon={Compass} color="#a3e635" eyebrow="Agent 7 · Resources" />
      <Card className="mb-6 flex gap-3 border-brand2/30 bg-brand2/5 p-4 text-sm"><Info className="mt-0.5 h-5 w-5 shrink-0 text-brand2" /><div className="text-muted"><p><b className="text-ink">How these are chosen:</b> {weak.length ? `weak topics (${weak.slice(0, 3).map((t) => t.name).join(", ")}), ` : ""}your subjects, upcoming exams{state.profile.styles.length ? ` and learning preferences (${state.profile.styles.slice(0, 3).join(", ")})` : ""}.</p><p className="mt-1">The catalogue is a small curated demo list. External links point only to well-known public sites; items marked “MentorMind sample” have no link and open an in-app note.</p></div></Card>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs value={tab} onChange={(v) => reset(() => setTab(v))} tabs={[{ id: "for-you", label: "For you", icon: Sparkles }, { id: "all", label: "All resources" }, { id: "saved", label: "Saved", icon: Bookmark, count: state.savedResources.length }]} />
        <div className="relative min-w-52 flex-1"><Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" /><input className="input pl-10" placeholder="Search resources…" value={q} onChange={(e) => reset(() => setQ(e.target.value))} aria-label="Search resources" /></div>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <select className="input w-auto" value={subject} onChange={(e) => reset(() => setSubject(e.target.value))} aria-label="Subject"><option value="all">All subjects</option>{state.subjects.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}</select>
        <select className="input w-auto" value={type} onChange={(e) => reset(() => setType(e.target.value))} aria-label="Type"><option value="all">All types</option>{TYPES.map((t) => <option key={t} value={t}>{t[0].toUpperCase() + t.slice(1)}</option>)}</select>
        <select className="input w-auto" value={diff} onChange={(e) => reset(() => setDiff(e.target.value))} aria-label="Difficulty"><option value="all">Any difficulty</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option></select>
        <select className="input w-auto" value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort"><option value="rel">Most relevant</option><option value="time">Shortest first</option><option value="az">A → Z</option></select>
        {(subject !== "all" || type !== "all" || diff !== "all" || q) && <Button variant="ghost" size="sm" onClick={() => { setSubject("all"); setType("all"); setDiff("all"); setQ(""); }}>Clear filters</Button>}
      </div>
      {view.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {view.map((r) => (
            <div key={r.id} className="flex flex-col gap-2"><ResourceCard r={r} />{tab === "for-you" && reasonOf(r.id).slice(0, 2).map((x) => <Badge key={x} tone="brand" className="!whitespace-normal !rounded-xl !py-1.5 text-left">✦ {x}</Badge>)}</div>
          ))}
        </div>
      ) : <EmptyState icon={Compass} title={tab === "saved" ? "No saved resources" : "No resources match"} body={tab === "saved" ? "Use the bookmark icon on a resource to save it here." : "Try removing a filter or searching for something else."} />}
      <Pagination page={page} pages={pages} onChange={setPage} />
    </>
  );
}

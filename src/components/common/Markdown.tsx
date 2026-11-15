import type { ReactNode } from "react";

function inline(s: string): ReactNode[] {
  return s.split(/(\*\*[^*]+\*\*|`[^`]+`|_[^_]+_)/g).filter(Boolean).map((p, i) => {
    if (p.startsWith("**")) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (p.startsWith("`")) return <code key={i}>{p.slice(1, -1)}</code>;
    if (p.startsWith("_") && p.endsWith("_") && p.length > 2) return <em key={i}>{p.slice(1, -1)}</em>;
    return p;
  });
}

export function Markdown({ text, className = "" }: { text: string; className?: string }) {
  const out: ReactNode[] = [];
  let list: { ordered: boolean; items: string[] } | null = null;
  const flush = () => {
    if (!list) return;
    const Tag = list.ordered ? "ol" : "ul";
    out.push(<Tag key={out.length}>{list.items.map((it, i) => <li key={i}>{inline(it)}</li>)}</Tag>);
    list = null;
  };
  text.split("\n").forEach((line) => {
    const l = line.trimEnd();
    let m: RegExpMatchArray | null;
    if ((m = l.match(/^(#{1,3})\s+(.*)/))) {
      flush();
      const Tag = (["h1", "h2", "h3"] as const)[m[1].length - 1];
      out.push(<Tag key={out.length}>{inline(m[2])}</Tag>);
    } else if (l.startsWith("> ")) {
      flush();
      out.push(<blockquote key={out.length}>{inline(l.slice(2))}</blockquote>);
    } else if ((m = l.match(/^[-*]\s+(.*)/))) {
      if (!list || list.ordered) { flush(); list = { ordered: false, items: [] }; }
      list.items.push(m[1].replace(/^\[ \]\s*/, "☐ ").replace(/^\[x\]\s*/i, "☑ "));
    } else if ((m = l.match(/^\d+\.\s+(.*)/))) {
      if (!list || !list.ordered) { flush(); list = { ordered: true, items: [] }; }
      list.items.push(m[1]);
    } else if (!l.trim()) {
      flush();
    } else {
      flush();
      out.push(<p key={out.length}>{inline(l)}</p>);
    }
  });
  flush();
  return <div className={`prose-mm ${className}`}>{out}</div>;
}

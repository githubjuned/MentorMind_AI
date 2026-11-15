export const cn = (...a: (string | false | null | undefined)[]) => a.filter(Boolean).join(" ");
export const uid = () => Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
export const pad = (n: number) => String(n).padStart(2, "0");
export const clamp = (n: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, n));
export const toDateStr = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayStr = () => toDateStr(new Date());
export const parseDate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
};
export const addDays = (s: string, n: number) => {
  const d = parseDate(s);
  d.setDate(d.getDate() + n);
  return toDateStr(d);
};
export const daysBetween = (a: string, b: string) =>
  Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / 86400000);
export const fmtDate = (s: string, withYear = false) =>
  parseDate(s).toLocaleDateString("en-US", { month: "short", day: "numeric", ...(withYear ? { year: "numeric" } : {}) });
export const fmtWeekday = (s: string) => parseDate(s).toLocaleDateString("en-US", { weekday: "short" });
export const fmtTime = (t: string) => {
  const [h, m] = t.split(":").map(Number);
  return `${((h + 11) % 12) + 1}:${pad(m)} ${h >= 12 ? "PM" : "AM"}`;
};
export const addMinutes = (t: string, mins: number) => {
  const [h, m] = t.split(":").map(Number);
  const total = h * 60 + m + mins;
  return `${pad(Math.floor(total / 60) % 24)}:${pad(total % 60)}`;
};
export const timeAgo = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return d < 7 ? `${d}d ago` : fmtDate(iso.slice(0, 10));
};
export const isoDaysAgo = (days: number, hour = 10) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, 0, 0, 0);
  return d.toISOString();
};
export const minsLabel = (min: number) => {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return h ? (m ? `${h}h ${m}m` : `${h}h`) : `${m}m`;
};
export const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
};
export const startOfWeek = (s: string) => {
  const d = parseDate(s);
  const diff = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - diff);
  return toDateStr(d);
};
export const download = (filename: string, text: string, mime = "text/plain") => {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};
export const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const initials = (name: string) =>
  name.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]?.toUpperCase()).join("") || "?";
export const sha256 = async (text: string) => {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
};
export const copyText = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
export const setHandoff = (key: string, value: string) => { try { sessionStorage.setItem("mm-h-" + key, value); } catch { /* ignore */ } };
export const takeHandoff = (key: string) => {
  try {
    const v = sessionStorage.getItem("mm-h-" + key);
    if (v !== null) sessionStorage.removeItem("mm-h-" + key);
    return v;
  } catch { return null; }
};

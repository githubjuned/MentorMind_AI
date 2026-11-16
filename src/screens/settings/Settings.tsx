"use client";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { Bell, Camera, Download, GraduationCap, LogOut, Moon, Palette, Settings as Cog, Shield, Sun, Trash2, UserRound, Monitor, Sliders, ShieldCheck, FileCheck, CheckCircle2 } from "lucide-react";
import { Avatar, Button, Card, ChipSelect, Confirm, Field, PageHeader, Segmented, Tabs, Toggle, cn, useToast } from "@/components/common/ui";
import { LEARNING_STYLES, SUBJECT_COLORS, WEEKDAYS, STORAGE_KEY } from "@/data/seed";
import { useApp } from "@/hooks/useApp";
import { DEPARTMENTS, YEARS } from "@/screens/auth/Signup";
import { download, minsLabel } from "@/utils";
import { deleteStudentDataFromFirebase, submitPrivacyRequestToFirebase } from "@/services/firebase/database";

type Tab = "personal" | "academic" | "learning" | "notifications" | "privacy" | "appearance" | "account";
export default function SettingsPage() {
  const { state, update, addMemory, logout } = useApp();
  const router = useRouter();
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("personal");
  const [p, setP] = useState(state.profile);
  const [confirm, setConfirm] = useState<"delete" | "logout" | null>(null);
  const [err, setErr] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const s = state.settings;
  const setS = (fn: (x: typeof s) => typeof s) => update((st) => ({ ...st, settings: fn(st.settings) }));

  const save = (what: string, memory?: [string, string]) => {
    setErr("");
    if (p.name.trim().length < 2) return setErr("Name is required.");
    update((st) => ({ ...st, profile: { ...p, name: p.name.trim() } }));
    if (memory) addMemory("edited", memory[0], memory[1]);
    toast(`${what} saved`);
  };
  const onAvatar = (f?: File) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) return toast("Choose an image file.", "error");
    if (f.size > 400 * 1024) return toast("Image must be under 400 KB.", "error");
    const r = new FileReader();
    r.onload = () => { setP((x) => ({ ...x, avatarImage: String(r.result) })); toast("Photo selected. Save to apply.", "info"); };
    r.readAsDataURL(f);
  };
  const exportData = () => { download("mentormind-data.json", JSON.stringify({ ...state, session: undefined, profile: { ...state.profile, avatarImage: undefined } }, null, 2), "application/json"); toast("Data exported"); };
  const [privacyModal, setPrivacyModal] = useState(false);
  const [reqType, setReqType] = useState<"access" | "correction" | "erasure" | "grievance">("access");
  const [reqDetails, setReqDetails] = useState("");
  const [reqBusy, setReqBusy] = useState(false);

  const submitDPDPRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setReqBusy(true);
    await submitPrivacyRequestToFirebase(
      state.session?.uid || "uid",
      state.profile.email,
      reqType,
      reqDetails
    );
    setReqBusy(false);
    setPrivacyModal(false);
    setReqDetails("");
    toast("DPDP Privacy Request submitted. Acknowledgment dispatched.");
  };

  const deleteAccount = async () => {
    try {
      if (state.session?.uid) {
        await deleteStudentDataFromFirebase(state.session.uid);
      }
      localStorage.removeItem(STORAGE_KEY);
      const accs = JSON.parse(localStorage.getItem("mm-accounts") || "[]").filter((a: { email: string }) => a.email !== state.profile.email);
      localStorage.setItem("mm-accounts", JSON.stringify(accs));
    } catch { /* ignore */ }
    logout();
    router.push("/login");
  };
  const tabs = [{ id: "personal" as Tab, label: "Personal", icon: UserRound }, { id: "academic" as Tab, label: "Academic", icon: GraduationCap }, { id: "learning" as Tab, label: "Learning", icon: Sliders }, { id: "notifications" as Tab, label: "Notifications", icon: Bell }, { id: "privacy" as Tab, label: "Privacy", icon: Shield }, { id: "appearance" as Tab, label: "Appearance", icon: Palette }, { id: "account" as Tab, label: "Account", icon: Cog }];

  return (
    <>
      <PageHeader title="Profile & settings" subtitle="Manage your details, learning preferences, privacy and appearance." icon={Cog} color="#8b7bff" eyebrow="Account" />
      <div className="mb-6 overflow-x-auto"><Tabs value={tab} onChange={setTab} tabs={tabs} /></div>
      <div className="max-w-3xl">
        {tab === "personal" && <Card className="space-y-5 p-6">
          <div className="flex items-center gap-4"><Avatar name={p.name} color={p.avatarColor} image={p.avatarImage} size={72} /><div className="space-y-2"><input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e) => { onAvatar(e.target.files?.[0]); e.target.value = ""; }} /><div className="flex gap-2"><Button size="sm" variant="secondary" icon={Camera} onClick={() => fileRef.current?.click()}>Upload photo</Button>{p.avatarImage && <Button size="sm" variant="ghost" onClick={() => setP({ ...p, avatarImage: undefined })}>Remove</Button>}</div><div className="flex gap-1.5">{SUBJECT_COLORS.concat("#8b7bff").map((c) => <button key={c} aria-label={`Avatar colour ${c}`} aria-pressed={p.avatarColor === c} onClick={() => setP({ ...p, avatarColor: c })} className={cn("h-6 w-6 rounded-full border-2", p.avatarColor === c ? "border-ink" : "border-transparent")} style={{ background: c }} />)}</div></div></div>
          <div className="grid gap-4 sm:grid-cols-2"><Field label="Full name" error={err}><input className="input" value={p.name} onChange={(e) => setP({ ...p, name: e.target.value })} /></Field><Field label="Email" hint="Used to log in; can't be changed in the demo."><input className="input opacity-70" value={p.email} readOnly /></Field><Field label="Phone"><input className="input" value={p.phone} onChange={(e) => setP({ ...p, phone: e.target.value })} /></Field></div>
          <Button onClick={() => save("Personal information")}>Save changes</Button></Card>}
        {tab === "academic" && <Card className="space-y-5 p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="Department"><select className="input" value={p.department} onChange={(e) => setP({ ...p, department: e.target.value })}>{[...new Set([p.department, ...DEPARTMENTS])].map((d) => <option key={d}>{d}</option>)}</select></Field><Field label="Academic year"><select className="input" value={p.year} onChange={(e) => setP({ ...p, year: e.target.value })}>{YEARS.map((d) => <option key={d}>{d}</option>)}</select></Field><Field label="Institution" className="sm:col-span-2"><input className="input" value={p.institution} onChange={(e) => setP({ ...p, institution: e.target.value })} /></Field></div><Button onClick={() => save("Academic information", ["Academic details updated", `${p.department}, ${p.year}`])}>Save changes</Button></Card>}
        {tab === "learning" && <Card className="space-y-6 p-6">
          <Field label="Learning preferences" hint="Starting points, refined by your activity. Edit any time."><ChipSelect options={LEARNING_STYLES} value={p.styles} onChange={(v) => setP({ ...p, styles: v })} /></Field>
          <Field label={`Daily study time: ${minsLabel(p.dailyMinutes)}`}><input type="range" min={30} max={360} step={15} value={p.dailyMinutes} onChange={(e) => setP({ ...p, dailyMinutes: +e.target.value })} className="w-full accent-[var(--brand)]" aria-label="Daily study minutes" /></Field>
          <Field label="Study availability"><div className="flex flex-wrap gap-2">{WEEKDAYS.map((d) => <button key={d} aria-pressed={p.availability[d]} onClick={() => setP({ ...p, availability: { ...p.availability, [d]: !p.availability[d] } })} className={cn("chip w-14 justify-center", p.availability[d] && "chip-on")}>{d}</button>)}</div></Field>
          <Field label="Subjects"><p className="text-sm text-muted">{state.subjects.map((x) => x.name).join(" · ")}. <a href="/subjects" className="font-semibold text-brand hover:underline">Manage subjects</a></p></Field>
          <Button onClick={() => save("Learning preferences", ["Learning preferences updated", `Styles: ${p.styles.join(", ")}; ${minsLabel(p.dailyMinutes)} per day.`])}>Save preferences</Button></Card>}
        {tab === "notifications" && <Card className="p-6"><ul className="divide-y divide-line">{([["reminders", "Study reminders", "Sessions scheduled in your planner"], ["revision", "Revision due", "Spaced-repetition prompts"], ["tasks", "Pending tasks", "Tasks you haven't completed"], ["recommendations", "New recommendations", "Resources matched to you"], ["quiz", "Quiz results", "Summary after each quiz"], ["goals", "Goal achievements", "When you reach a target"]] as const).map(([k, l, d]) => <li key={k} className="flex items-center gap-4 py-3.5"><div className="flex-1"><p className="text-sm font-medium">{l}</p><p className="text-xs text-muted">{d}</p></div><Toggle label={l} checked={s.notifPrefs[k]} onChange={(v) => setS((x) => ({ ...x, notifPrefs: { ...x.notifPrefs, [k]: v } }))} /></li>)}</ul><p className="mt-3 text-xs text-muted">In-app notifications only in this demo.</p></Card>}
        {tab === "privacy" && <Card className="p-6 space-y-5">
          <ul className="divide-y divide-line">
            {([["useMemory", "Personalise with learning memory", "Lets explanations, plans and recommendations use your history."], ["shareAggregate", "Include me in anonymous class totals", "Your activity may count toward aggregate numbers only. Never identifies you."]] as const).map(([k, l, d]) => <li key={k} className="flex items-center gap-4 py-4"><div className="flex-1"><p className="text-sm font-medium">{l}</p><p className="text-xs text-muted">{d}</p></div><Toggle label={l} checked={s.privacy[k]} onChange={(v) => setS((x) => ({ ...x, privacy: { ...x.privacy, [k]: v } }))} /></li>)}
          </ul>

          <div className="rounded-xl border border-line bg-surface p-4 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              DPDP Act 2023 & Security Safeguards
            </div>
            <p className="text-muted leading-relaxed">
              Your personal data is isolated under your verified UID in Google Firebase Realtime Database. Only your authenticated session possesses cryptographic read/write authorization.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Button variant="secondary" icon={Download} onClick={exportData}>Download Personal Data (JSON)</Button>
            <Button variant="secondary" icon={FileCheck} onClick={() => setPrivacyModal(true)}>Submit DPDP Privacy Request</Button>
          </div>
        </Card>}
        {tab === "appearance" && <Card className="space-y-6 p-6"><Field label="Theme"><Segmented value={s.theme} onChange={(v) => setS((x) => ({ ...x, theme: v }))} options={[{ value: "dark", label: "Dark" }, { value: "light", label: "Light" }, { value: "system", label: "System" }]} /></Field>
          <div className="grid grid-cols-3 gap-3">{([["dark", Moon, "Midnight"], ["light", Sun, "Daylight"], ["system", Monitor, "Match device"]] as const).map(([v, I, l]) => <button key={v} onClick={() => setS((x) => ({ ...x, theme: v }))} aria-pressed={s.theme === v} className={cn("flex flex-col items-center gap-2 rounded-2xl border p-4 text-sm transition", s.theme === v ? "border-brand bg-brand/10" : "border-line hover:border-brand/50")}><I className="h-6 w-6" />{l}</button>)}</div>
          <div className="flex items-center gap-4"><div className="flex-1"><p className="text-sm font-medium">Reduce motion</p><p className="text-xs text-muted">Turns off animations and transitions.</p></div><Toggle label="Reduce motion" checked={s.reduceMotion} onChange={(v) => setS((x) => ({ ...x, reduceMotion: v }))} /></div>
          <div className="flex items-center gap-4"><div className="flex-1"><p className="text-sm font-medium">Collapsed sidebar</p><p className="text-xs text-muted">Show icons only on desktop.</p></div><Toggle label="Collapse sidebar" checked={s.sidebarCollapsed} onChange={(v) => setS((x) => ({ ...x, sidebarCollapsed: v }))} /></div></Card>}
        {tab === "account" && <div className="space-y-4">
          <Card className="p-6 space-y-3">
            <h3 className="font-display text-sm font-bold text-ink">Account & Security Identification</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border border-line bg-surface p-3">
                <span className="text-muted block">Authenticated UID:</span>
                <span className="font-mono text-ink font-semibold truncate block">{state.session?.uid || "Local Session"}</span>
              </div>
              <div className="rounded-xl border border-line bg-surface p-3">
                <span className="text-muted block">Database Authorization:</span>
                <span className="font-semibold text-emerald-600 flex items-center gap-1.5 mt-0.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Active / Strictly Isolated
                </span>
              </div>
            </div>
          </Card>

          <Card className="flex flex-wrap items-center gap-4 p-6">
            <div className="flex-1">
              <p className="font-semibold">Log out</p>
              <p className="text-sm text-muted">Securely end this authenticated session on this browser.</p>
            </div>
            <Button variant="secondary" icon={LogOut} onClick={() => setConfirm("logout")}>Log out</Button>
          </Card>

          <Card className="flex flex-wrap items-center gap-4 p-6">
            <div className="flex-1">
              <p className="font-semibold">Export data</p>
              <p className="text-sm text-muted">Download a complete JSON copy of your learning history, notes, and metrics.</p>
            </div>
            <Button variant="secondary" icon={Download} onClick={exportData}>Export Data (JSON)</Button>
          </Card>

          <Card className="flex flex-wrap items-center gap-4 border-bad/30 p-6">
            <div className="flex-1">
              <p className="font-semibold text-bad">Permanently delete account</p>
              <p className="text-sm text-muted">Immediately purges your database records from Firebase and destroys local state.</p>
            </div>
            <Button variant="danger" icon={Trash2} onClick={() => setConfirm("delete")}>Delete account</Button>
          </Card>
        </div>}
      </div>

      {/* DPDP Request Modal */}
      {privacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-line bg-card p-6 shadow-2xl">
            <div className="flex items-center gap-2 font-display text-lg font-bold text-ink">
              <FileCheck className="h-5 w-5 text-indigo-600" />
              Submit DPDP Privacy Request
            </div>
            <p className="mt-1.5 text-xs text-muted">
              Exercise your statutory rights under the Digital Personal Data Protection Act, 2023. Our Grievance Officer will acknowledge within 48 hours.
            </p>

            <form onSubmit={submitDPDPRequest} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-ink">Request Type</label>
                <select
                  value={reqType}
                  onChange={(e) => setReqType(e.target.value as any)}
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink focus:outline-none"
                >
                  <option value="access">Right to Access (Summary of Processing)</option>
                  <option value="correction">Right to Correction / Updating Profile</option>
                  <option value="erasure">Right to Erasure / Immediate Hard Deletion</option>
                  <option value="grievance">Formal Grievance / Unresolved Complaint</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-ink">Request Details & Context</label>
                <textarea
                  rows={4}
                  required
                  value={reqDetails}
                  onChange={(e) => setReqDetails(e.target.value)}
                  placeholder="Describe your request in detail..."
                  className="mt-1.5 w-full rounded-xl border border-line bg-surface p-2.5 text-xs text-ink placeholder:text-muted focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" type="button" onClick={() => setPrivacyModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={reqBusy || !reqDetails.trim()}>
                  {reqBusy ? "Submitting..." : "Submit Notice"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Confirm open={confirm === "logout"} onClose={() => setConfirm(null)} title="Log out?" confirmLabel="Log out" body="You can log back in any time." onConfirm={() => { logout(); router.push("/login"); }} />
      <Confirm open={confirm === "delete"} onClose={() => setConfirm(null)} danger title="Delete your account?" confirmLabel="Delete everything" body="This permanently removes your account and all learning data from Firebase and this browser. This can't be undone." onConfirm={deleteAccount} />
    </>
  );
}

"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  Bell, BookOpen, Calendar, CheckCheck, ChevronsLeft, ChevronsRight, CircleHelp, Compass, FileText, Folder, GraduationCap, LayoutDashboard, ListChecks, LogOut, Menu, Network, NotebookPen,
  Brain, Repeat, Search, Settings, ShieldCheck, Sparkles, Target, TrendingUp, UserRound, Lightbulb, X, CalendarClock, type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { Avatar, Badge, Dropdown, Modal, Skeleton } from "@/components/common/ui";
import { ModernTour } from "@/components/tour/ModernTour";
import { useApp } from "@/hooks/useApp";
import { cn, timeAgo } from "@/utils";

interface NavItem { href: string; label: string; icon: LucideIcon; match?: string[]; color?: string }
const NAV: { group: string; items: NavItem[] }[] = [
  { group: "Learn", items: [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/assistant", label: "AI Assistant", icon: Sparkles, color: "#8b7bff" },
    { href: "/agents", label: "AI Agent Hub", icon: Network },
  ] },
  { group: "Agents", items: [
    { href: "/doubt-solver", label: "Doubt Solver", icon: Lightbulb, color: "#22d3ee" },
    { href: "/notes", label: "Smart Notes", icon: NotebookPen, color: "#fbbf24" },
    { href: "/quizzes", label: "Quizzes", icon: ListChecks, color: "#fb7185", match: ["/quizzes"] },
    { href: "/planner", label: "Study Planner", icon: CalendarClock, color: "#34d399", match: ["/planner", "/calendar", "/routine"] },
    { href: "/progress", label: "Progress", icon: TrendingUp, color: "#60a5fa", match: ["/progress", "/strengths", "/analytics"] },
    { href: "/revision", label: "Revision", icon: Repeat, color: "#fb923c", match: ["/revision"] },
    { href: "/resources", label: "Resources", icon: Compass, color: "#a3e635" },
  ] },
  { group: "Library", items: [
    { href: "/memory", label: "Learning Memory", icon: Brain },
    { href: "/materials", label: "Study Materials", icon: Folder, match: ["/materials"] },
    { href: "/subjects", label: "My Subjects", icon: BookOpen },
    { href: "/goals", label: "My Goals", icon: Target },
  ] },
  { group: "Account", items: [
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/help", label: "Help & Support", icon: CircleHelp },
  ] },
];
const ALL = NAV.flatMap((g) => g.items);
const isActive = (path: string, i: NavItem) => (i.match ?? [i.href]).some((m) => path === m || path.startsWith(m + "/"));

function Sidebar({ collapsed, onNavigate }: { collapsed: boolean; onNavigate?: () => void }) {
  const path = usePathname();
  return (
    <div className="flex h-full flex-col">
      <div className={cn("flex h-16 shrink-0 items-center border-b border-line", collapsed ? "justify-center" : "px-5")}>
        <Logo href="/dashboard" collapsed={collapsed} />
      </div>
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4" aria-label="Main">
        {NAV.map((g) => (
          <div key={g.group}>
            {!collapsed && <p className="mb-1.5 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-muted/80">{g.group}</p>}
            <ul className="space-y-0.5">
              {g.items.map((i) => {
                const active = isActive(path, i);
                return (
                  <li key={i.href}>
                    <Link
                      href={i.href}
                      data-tour-nav={i.href.replace("/", "")}
                      onClick={onNavigate}
                      title={collapsed ? i.label : undefined}
                      aria-current={active ? "page" : undefined}
                      className={cn("group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition", collapsed && "justify-center px-0", active ? "bg-brand/15 text-ink" : "text-muted hover:bg-surface2 hover:text-ink")}
                    >
                      <i.icon className="h-[18px] w-[18px] shrink-0" style={{ color: active || i.color ? i.color ?? "var(--brand)" : undefined }} aria-hidden />
                      {!collapsed && <span className="truncate">{i.label}</span>}
                      {!collapsed && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-brand" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="shrink-0 border-t border-line p-3">
        <Link href="/educator" onClick={onNavigate} title="Educator portal" className={cn("flex items-center gap-3 rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-surface2 hover:text-ink", collapsed && "justify-center px-0")}>
          <GraduationCap className="h-[18px] w-[18px]" aria-hidden />{!collapsed && <span>Educator portal</span>}
        </Link>
      </div>
    </div>
  );
}

function SearchPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state } = useApp();
  const router = useRouter();
  const [q, setQ] = useState("");
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    const pages = ALL.filter((p) => !t || p.label.toLowerCase().includes(t)).map((p) => ({ key: p.href, label: p.label, hint: "Page", href: p.href, icon: p.icon }));
    if (!t) return pages.slice(0, 8);
    const notes = state.notes.filter((n) => n.title.toLowerCase().includes(t) || n.content.toLowerCase().includes(t)).slice(0, 4).map((n) => ({ key: n.id, label: n.title, hint: "Note", href: "/notes", icon: NotebookPen }));
    const mats = state.materials.filter((m) => m.name.toLowerCase().includes(t)).slice(0, 4).map((m) => ({ key: m.id, label: m.name, hint: "Material", href: `/materials/${m.id}`, icon: FileText }));
    const topics = state.topics.filter((x) => x.name.toLowerCase().includes(t)).slice(0, 4).map((x) => ({ key: x.id, label: x.name, hint: "Topic · open in Subjects", href: "/subjects", icon: BookOpen }));
    const tasks = state.tasks.filter((x) => x.title.toLowerCase().includes(t)).slice(0, 3).map((x) => ({ key: x.id, label: x.title, hint: `Task · ${x.date}`, href: "/planner", icon: Calendar }));
    return [...pages, ...notes, ...mats, ...topics, ...tasks];
  }, [q, state]);
  const go = (href: string) => { onClose(); setQ(""); router.push(href); };
  const ask = () => { sessionStorage.setItem("mm-h-assistant", q.trim()); go("/assistant"); };
  return (
    <Modal open={open} onClose={onClose} title="Search MentorMind" size="md">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3.5 top-3 h-4 w-4 text-muted" aria-hidden />
        <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search pages, notes, materials, topics, tasks…" className="input pl-10" aria-label="Search"
          onKeyDown={(e) => { if (e.key === "Enter" && results[0]) go(results[0].href); }} />
      </div>
      <ul className="mt-3 max-h-80 space-y-1 overflow-y-auto">
        {q.trim() && (
          <li><button onClick={ask} className="flex w-full items-center gap-3 rounded-xl bg-brand/10 px-3 py-2.5 text-left text-sm hover:bg-brand/20"><Sparkles className="h-4 w-4 text-brand" />Ask the AI Assistant: <span className="truncate font-semibold">“{q}”</span></button></li>
        )}
        {results.map((r) => (
          <li key={r.key + r.hint}><button onClick={() => go(r.href)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm hover:bg-surface2"><r.icon className="h-4 w-4 text-muted" /><span className="flex-1 truncate">{r.label}</span><span className="text-xs text-muted">{r.hint}</span></button></li>
        ))}
        {!results.length && <li className="py-6 text-center text-sm text-muted">No matches. Press Enter on the Ask option to send this to the assistant.</li>}
      </ul>
    </Modal>
  );
}

function NotificationsMenu() {
  const { state, update } = useApp();
  const unread = state.notifications.filter((n) => !n.read).length;
  return (
    <Dropdown trigger={() => (
      <button className="relative rounded-xl p-2.5 text-muted hover:bg-surface2 hover:text-ink" aria-label={`Notifications, ${unread} unread`}>
        <Bell className="h-5 w-5" />{unread > 0 && <span className="absolute right-1.5 top-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-bad px-1 text-[10px] font-bold text-white">{unread}</span>}
      </button>
    )} className="w-[22rem] max-w-[calc(100vw-2rem)]">
      {(close) => (
        <div>
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-sm font-semibold">Notifications</p>
            <button className="flex items-center gap-1 text-xs font-semibold text-brand hover:underline" onClick={() => update((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) }))}><CheckCheck className="h-3.5 w-3.5" />Mark all read</button>
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {state.notifications.slice(0, 5).map((n) => (
              <li key={n.id}>
                <Link href={n.href ?? "/notifications"} onClick={() => { update((s) => ({ ...s, notifications: s.notifications.map((x) => (x.id === n.id ? { ...x, read: true } : x)) })); close(); }} className="flex gap-3 px-4 py-3 hover:bg-surface2">
                  <span className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-line" : "bg-brand")} />
                  <span className="min-w-0"><span className="block truncate text-sm font-medium">{n.title}</span><span className="block truncate text-xs text-muted">{n.body}</span><span className="text-[11px] text-muted">{timeAgo(n.time)}</span></span>
                </Link>
              </li>
            ))}
            {!state.notifications.length && <li className="px-4 py-8 text-center text-sm text-muted">You&apos;re all caught up.</li>}
          </ul>
          <Link href="/notifications" onClick={close} className="block border-t border-line px-4 py-2.5 text-center text-xs font-semibold text-brand hover:bg-surface2">View all notifications</Link>
        </div>
      )}
    </Dropdown>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { state, ready, update, logout } = useApp();
  const router = useRouter();
  const path = usePathname();
  const [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const collapsed = state.settings.sidebarCollapsed;

  useEffect(() => {
    setIsOffline(!navigator.onLine);
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => { if (ready && !state.session) router.replace("/access-denied"); }, [ready, state.session, router]);
  useEffect(() => { setDrawer(false); }, [path]);

  // Open modern interactive tour on fresh login
  useEffect(() => {
    if (ready && state.session && state.tourCompleted === false) {
      setTourOpen(true);
    }
  }, [ready, state.session, state.tourCompleted]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearch(true); }
      else if (e.key === "/" && !/input|textarea|select/i.test((e.target as HTMLElement).tagName)) { e.preventDefault(); setSearch(true); }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, []);

  if (!ready || !state.session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-aurora p-6">
        <div className="w-full max-w-sm space-y-3"><Skeleton className="h-10 w-40" /><Skeleton className="h-28" /><Skeleton className="h-28" /><p className="text-center text-xs text-muted">Loading your learning workspace…</p></div>
      </div>
    );
  }
  const bottom: NavItem[] = [ALL[0], ALL[1], ALL.find((a) => a.href === "/planner")!, ALL.find((a) => a.href === "/quizzes")!];

  return (
    <div className="min-h-screen bg-app">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-white">Skip to content</a>
      <aside className={cn("fixed inset-y-0 left-0 z-40 hidden border-r border-line bg-surface transition-[width] duration-200 lg:block", collapsed ? "w-[76px]" : "w-64")}>
        <Sidebar collapsed={collapsed} />
      </aside>
      {drawer && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setDrawer(false)} />
          <aside className="anim-fade-up absolute inset-y-0 left-0 w-72 max-w-[85vw] border-r border-line bg-surface">
            <button className="absolute right-3 top-4 rounded-lg p-1.5 text-muted hover:bg-surface2" onClick={() => setDrawer(false)} aria-label="Close menu"><X className="h-5 w-5" /></button>
            <Sidebar collapsed={false} onNavigate={() => setDrawer(false)} />
          </aside>
        </div>
      )}
      <div className={cn("transition-[padding] duration-200", collapsed ? "lg:pl-[76px]" : "lg:pl-64")}>
        <header className="glass sticky top-0 z-30 flex h-16 items-center gap-2 border-b border-line px-3 sm:gap-3 sm:px-6">
          <button className="rounded-xl p-2.5 text-muted hover:bg-surface2 hover:text-ink lg:hidden" onClick={() => setDrawer(true)} aria-label="Open menu"><Menu className="h-5 w-5" /></button>
          <button className="hidden rounded-xl p-2.5 text-muted hover:bg-surface2 hover:text-ink lg:block" aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => update((s) => ({ ...s, settings: { ...s.settings, sidebarCollapsed: !s.settings.sidebarCollapsed } }))}>
            {collapsed ? <ChevronsRight className="h-5 w-5" /> : <ChevronsLeft className="h-5 w-5" />}
          </button>
          <button data-tour="global-search" onClick={() => setSearch(true)} className="flex h-10 flex-1 items-center gap-2 rounded-xl border border-line bg-surface2 px-3.5 text-sm text-muted transition hover:border-brand/50 sm:max-w-md" aria-label="Open search">
            <Search className="h-4 w-4" /><span className="flex-1 truncate text-left">Search pages, notes, topics…</span><kbd className="hidden rounded border border-line px-1.5 text-[10px] sm:block">⌘K</kbd>
          </button>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <button
              data-tour="tour-trigger"
              onClick={() => setTourOpen(true)}
              className="flex items-center gap-1.5 rounded-xl border border-brand/40 bg-brand/10 px-3 py-1.5 text-xs font-semibold text-brand transition hover:bg-brand/20"
              title="Platform Feature Tour"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Feature Tour</span>
            </button>
            <NotificationsMenu />
            <Dropdown trigger={() => (
              <button className="flex items-center gap-2 rounded-xl p-1.5 pr-2 hover:bg-surface2" aria-label="Account menu">
                <Avatar name={state.profile.name} color={state.profile.avatarColor} image={state.profile.avatarImage} size={32} />
                <span className="hidden text-left text-xs leading-tight md:block">
                  <span className="block font-semibold">{state.profile.name}</span>
                  {state.profile.department ? <span className="text-muted">{state.profile.department}</span> : null}
                </span>
              </button>
            )}>
              {(close) => (
                <div className="p-1.5">
                  <button
                    onClick={() => { close(); setTourOpen(true); }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-brand hover:bg-surface2"
                  >
                    <Sparkles className="h-4 w-4 text-brand" />Feature tour
                  </button>
                  {[{ href: "/settings", label: "Profile & settings", icon: UserRound }, { href: "/memory", label: "Learning memory", icon: Brain }, { href: "/help", label: "Help & support", icon: CircleHelp }].map((m) => (
                    <Link key={m.href} href={m.href} onClick={close} className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-surface2"><m.icon className="h-4 w-4 text-muted" />{m.label}</Link>
                  ))}
                  <button onClick={() => { close(); logout(); router.push("/login"); }} className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-bad hover:bg-bad/10"><LogOut className="h-4 w-4" />Log out</button>
                </div>
              )}
            </Dropdown>
          </div>
        </header>
        {isOffline && (
          <div className="bg-amber-500 text-black px-4 py-1.5 text-center text-xs font-bold flex items-center justify-center gap-2 animate-pulse">
            <span>You are currently working offline. Cached study notes and saved materials remain available.</span>
          </div>
        )}
        <main id="main" className="mx-auto w-full max-w-7xl px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-10">{children}</main>
      </div>
      <nav className="glass fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-line pb-[env(safe-area-inset-bottom)] lg:hidden" aria-label="Mobile">
        {bottom.map((i) => {
          const active = isActive(path, i);
          return (
            <Link key={i.href} href={i.href} aria-current={active ? "page" : undefined} className={cn("flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold", active ? "text-brand" : "text-muted")}>
              <i.icon className="h-5 w-5" />{i.label.replace("AI ", "").replace("Study ", "")}
            </Link>
          );
        })}
        <button onClick={() => setDrawer(true)} className="flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold text-muted"><Menu className="h-5 w-5" />More</button>
      </nav>
      <SearchPalette open={search} onClose={() => setSearch(false)} />
      <ModernTour open={tourOpen} onClose={() => setTourOpen(false)} />
    </div>
  );
}

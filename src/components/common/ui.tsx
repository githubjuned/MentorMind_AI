"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ButtonHTMLAttributes, type MouseEventHandler, type ReactNode } from "react";
import { AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Info, X, type LucideIcon } from "lucide-react";
import { cn, initials, uid } from "@/utils";

/* ------------------------------------------------------------------ Button */
type BtnProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "soft";
  size?: "sm" | "md" | "lg";
  icon?: LucideIcon;
  href?: string;
};
export function Button({ variant = "primary", size = "md", icon: Icon, href, className, children, ...rest }: BtnProps) {
  const cls = cn("btn", `btn-${variant}`, size === "sm" && "btn-sm", size === "lg" && "btn-lg", className);
  const content = (<>{Icon && <Icon className={size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"} aria-hidden />}{children}</>);
  if (href) return <Link href={href} className={cls} onClick={rest.onClick as unknown as MouseEventHandler<HTMLAnchorElement>}>{content}</Link>;
  return <button type="button" className={cls} {...rest}>{content}</button>;
}

export function Card({ className, children, ...rest }: { className?: string; children: ReactNode } & React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("card", className)} {...rest}>{children}</div>;
}

type Tone = "brand" | "ok" | "warn" | "bad" | "muted" | "info";
const toneCls: Record<Tone, string> = {
  brand: "bg-brand/15 text-brand", ok: "bg-ok/15 text-ok", warn: "bg-warn/15 text-warn", bad: "bg-bad/15 text-bad",
  muted: "bg-surface2 text-muted border border-line", info: "bg-brand2/15 text-brand2",
};
export function Badge({ tone = "muted", color, children, className }: { tone?: Tone; color?: string; children: ReactNode; className?: string }) {
  return (
    <span className={cn("badge", !color && toneCls[tone], className)} style={color ? { background: `${color}26`, color } : undefined}>
      {children}
    </span>
  );
}

/* ------------------------------------------------------------------ Progress */
export function Progress({ value, color = "var(--brand)", height = 8, label }: { value: number; color?: string; height?: number; label?: string }) {
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="w-full overflow-hidden rounded-full bg-surface2" style={{ height }} role="progressbar" aria-valuenow={Math.round(v)} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${v}%`, background: color }} />
    </div>
  );
}
export function Ring({ value, size = 96, stroke = 9, color = "var(--brand)", children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90" aria-hidden>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface2)" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c - (c * v) / 100} style={{ transition: "stroke-dashoffset 0.8s ease" }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-center">{children ?? <span className="font-display text-lg font-bold">{Math.round(v)}%</span>}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ Layout bits */
export function PageHeader({ title, subtitle, icon: Icon, color = "var(--brand)", actions, eyebrow }: { title: string; subtitle?: string; icon?: LucideIcon; color?: string; actions?: ReactNode; eyebrow?: string }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex min-w-0 items-center gap-4">
        {Icon && (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}>
            <Icon className="h-6 w-6" aria-hidden />
          </div>
        )}
        <div className="min-w-0">
          {eyebrow && <p className="eyebrow mb-0.5" style={{ color }}>{eyebrow}</p>}
          <h1 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
          {subtitle && <p className="mt-1 max-w-2xl text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
export function SectionTabs({ items }: { items: { href: string; label: string; icon?: LucideIcon }[] }) {
  const path = usePathname();
  return (
    <nav className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-line bg-surface p-1" aria-label="Section">
      {items.map((i) => {
        const active = path === i.href;
        return (
          <Link key={i.href} href={i.href} aria-current={active ? "page" : undefined}
            className={cn("flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2 text-sm font-semibold transition", active ? "bg-brand/15 text-brand" : "text-muted hover:bg-surface2 hover:text-ink")}>
            {i.icon && <i.icon className="h-4 w-4" aria-hidden />}{i.label}
          </Link>
        );
      })}
    </nav>
  );
}
export function Tabs<T extends string>({ tabs, value, onChange }: { tabs: { id: T; label: string; icon?: LucideIcon; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div role="tablist" className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface2 p-1">
      {tabs.map((t) => (
        <button key={t.id} role="tab" aria-selected={value === t.id} onClick={() => onChange(t.id)}
          className={cn("flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-semibold transition", value === t.id ? "bg-surface text-ink shadow" : "text-muted hover:text-ink")}>
          {t.icon && <t.icon className="h-4 w-4" aria-hidden />}{t.label}
          {t.count !== undefined && <span className="rounded-full bg-brand/15 px-1.5 text-[10px] text-brand">{t.count}</span>}
        </button>
      ))}
    </div>
  );
}
export function EmptyState({ icon: Icon, title, body, action }: { icon: LucideIcon; title: string; body?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand"><Icon className="h-6 w-6" aria-hidden /></div>
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      {body && <p className="mt-1 max-w-sm text-sm text-muted">{body}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
export function Stat({ label, value, sub, icon: Icon, color = "var(--brand)", children }: { label: string; value: ReactNode; sub?: ReactNode; icon: LucideIcon; color?: string; children?: ReactNode }) {
  return (
    <div className="card relative overflow-hidden p-5">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-20 blur-2xl" style={{ background: color }} aria-hidden />
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
          <p className="mt-2 font-display text-3xl font-bold tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-muted">{sub}</p>}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `color-mix(in srgb, ${color} 18%, transparent)`, color }}><Icon className="h-5 w-5" aria-hidden /></div>
      </div>
      {children}
    </div>
  );
}
export function Avatar({ name, color = "#8b7bff", image, size = 36 }: { name: string; color?: string; image?: string; size?: number }) {
  return image ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={image} alt={name} width={size} height={size} className="rounded-full object-cover" style={{ width: size, height: size }} />
  ) : (
    <div className="flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white" style={{ width: size, height: size, background: `linear-gradient(135deg, ${color}, color-mix(in srgb, ${color} 50%, #38d6ff))`, fontSize: size * 0.38 }} aria-label={name}>
      {initials(name)}
    </div>
  );
}
export const Skeleton = ({ className }: { className?: string }) => <div className={cn("skeleton", className)} />;

/* ------------------------------------------------------------------ Form pieces */
export function Field({
  label,
  hint,
  error,
  count,
  maxCount,
  limitReached,
  limitMessage,
  children,
  className,
}: {
  label?: string;
  hint?: string;
  error?: string;
  count?: number;
  maxCount?: number;
  limitReached?: boolean;
  limitMessage?: string;
  children: ReactNode;
  className?: string;
}) {
  const atLimit = (maxCount != null && count != null && count >= maxCount) || limitReached;
  const nearLimit = maxCount != null && count != null && !atLimit && count >= maxCount * 0.8;

  return (
    <div className={className}>
      {label && (
        <div className="mb-1.5 flex items-center justify-between">
          <label className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</label>
          {maxCount != null && count != null && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  "font-mono text-[11px] font-semibold transition-colors duration-150",
                  atLimit ? "text-bad font-bold" : nearLimit ? "text-warn" : "text-muted/70"
                )}
              >
                {count}/{maxCount}
              </span>
              {atLimit && (
                <span className="rounded-md border border-bad/30 bg-bad/15 px-1.5 py-0.5 text-[10px] font-semibold text-bad transition-all">
                  Limit reached
                </span>
              )}
            </div>
          )}
        </div>
      )}
      {children}
      {limitMessage && atLimit ? (
        <p role="status" className="mt-1.5 flex items-center gap-1 text-xs font-medium text-bad transition-all">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-bad animate-ping" />
          {limitMessage}
        </p>
      ) : error ? (
        <p role="alert" className="mt-1.5 text-xs font-medium text-bad">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}
export function ChipSelect({ options, value, onChange, multiple = true }: { options: string[]; value: string[]; onChange: (v: string[]) => void; multiple?: boolean }) {
  return (
    <div className="flex flex-wrap gap-2" role="group">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button key={o} type="button" aria-pressed={on} className={cn("chip", on && "chip-on")}
            onClick={() => onChange(multiple ? (on ? value.filter((v) => v !== o) : [...value, o]) : [o])}>
            {on && <CheckCircle2 className="h-3.5 w-3.5 text-brand" aria-hidden />}{o}
          </button>
        );
      })}
    </div>
  );
}
export function Segmented<T extends string>({ options, value, onChange, className }: { options: { value: T; label: string }[]; value: T; onChange: (v: T) => void; className?: string }) {
  return (
    <div className={cn("inline-flex rounded-xl border border-line bg-surface2 p-1", className)} role="radiogroup">
      {options.map((o) => (
        <button key={o.value} role="radio" aria-checked={value === o.value} onClick={() => onChange(o.value)}
          className={cn("rounded-lg px-3 py-1.5 text-xs font-semibold transition", value === o.value ? "bg-brand text-white shadow" : "text-muted hover:text-ink")}>
          {o.label}
        </button>
      ))}
    </div>
  );
}
export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={checked} aria-label={label} onClick={() => onChange(!checked)}
      className={cn("relative h-6 w-11 shrink-0 rounded-full transition", checked ? "bg-brand" : "bg-line")}>
      <span className={cn("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
    </button>
  );
}
export function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="mt-4 flex items-center justify-between gap-3 text-sm">
      <span className="text-muted">Page {page} of {pages}</span>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" icon={ChevronLeft} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous page">Prev</Button>
        <Button variant="secondary" size="sm" disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next page">Next<ChevronRight className="h-3.5 w-3.5" /></Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ Overlays */
export function Modal({ open, onClose, title, children, footer, size = "md" }: { open: boolean; onClose: () => void; title: string; children: ReactNode; footer?: ReactNode; size?: "sm" | "md" | "lg" | "xl" }) {
  useEffect(() => {
    if (!open) return;
    const h = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    document.body.style.overflow = "hidden";
    return () => { window.removeEventListener("keydown", h); document.body.style.overflow = ""; };
  }, [open, onClose]);
  if (!open) return null;
  const w = { sm: "max-w-md", md: "max-w-xl", lg: "max-w-3xl", xl: "max-w-5xl" }[size];
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center p-0 sm:items-center sm:p-4" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className={cn("card anim-fade-up relative flex max-h-[92vh] w-full flex-col rounded-b-none shadow-2xl sm:rounded-2xl", w)}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="font-display text-lg font-semibold">{title}</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-surface2 hover:text-ink" aria-label="Close dialog"><X className="h-5 w-5" /></button>
        </div>
        <div className="overflow-y-auto p-5">{children}</div>
        {footer && <div className="flex flex-wrap justify-end gap-2 border-t border-line px-5 py-4">{footer}</div>}
      </div>
    </div>
  );
}
export function Confirm({ open, onClose, onConfirm, title, body, confirmLabel = "Confirm", danger }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; body: ReactNode; confirmLabel?: string; danger?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button variant={danger ? "danger" : "primary"} onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</Button></>}>
      <div className="flex gap-3 text-sm text-muted">
        <AlertTriangle className={cn("mt-0.5 h-5 w-5 shrink-0", danger ? "text-bad" : "text-warn")} aria-hidden />
        <div>{body}</div>
      </div>
    </Modal>
  );
}
export function Dropdown({ trigger, children, align = "right", className }: { trigger: (open: boolean) => ReactNode; children: (close: () => void) => ReactNode; align?: "left" | "right"; className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const click = (e: MouseEvent) => ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    const key = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", click);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("mousedown", click); document.removeEventListener("keydown", key); };
  }, [open]);
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="menu">{trigger(open)}</div>
      {open && (
        <div className={cn("card glass absolute top-full z-50 mt-2 min-w-56 shadow-2xl anim-fade-up", align === "right" ? "right-0" : "left-0", className)} role="menu">
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ Toasts */
type ToastKind = "success" | "error" | "info";
const ToastCtx = createContext<(msg: string, kind?: ToastKind) => void>(() => {});
export const useToast = () => useContext(ToastCtx);
export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<{ id: string; msg: string; kind: ToastKind }[]>([]);
  const toast = useCallback((msg: string, kind: ToastKind = "success") => {
    const id = uid();
    setItems((i) => [...i.slice(-3), { id, msg, kind }]);
    setTimeout(() => setItems((i) => i.filter((x) => x.id !== id)), 3800);
  }, []);
  return (
    <ToastCtx.Provider value={toast}>
      {children}
      <div className="pointer-events-none fixed bottom-20 right-4 z-[100] flex flex-col gap-2 lg:bottom-6" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className="card glass anim-fade-up pointer-events-auto flex max-w-sm items-center gap-3 px-4 py-3 text-sm shadow-xl">
            {t.kind === "success" ? <CheckCircle2 className="h-5 w-5 shrink-0 text-ok" /> : t.kind === "error" ? <AlertTriangle className="h-5 w-5 shrink-0 text-bad" /> : <Info className="h-5 w-5 shrink-0 text-brand2" />}
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
export { cn };

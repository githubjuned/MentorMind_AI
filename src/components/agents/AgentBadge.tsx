import type { AgentId } from "@/types";
import { agentById } from "@/data/agents";

export function AgentBadge({ id, size = "sm" }: { id: AgentId; size?: "sm" | "md" }) {
  const a = agentById(id);
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs"}`} style={{ background: `${a.color}22`, color: a.color }}>
      <a.icon className={size === "sm" ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />{a.name}
    </span>
  );
}
export function AgentIcon({ id, size = 40 }: { id: AgentId; size?: number }) {
  const a = agentById(id);
  return (
    <span className="flex shrink-0 items-center justify-center rounded-xl" style={{ width: size, height: size, background: `linear-gradient(135deg, ${a.color}33, ${a.color}11)`, color: a.color, boxShadow: `inset 0 0 0 1px ${a.color}40` }}>
      <a.icon style={{ width: size * 0.5, height: size * 0.5 }} aria-hidden />
    </span>
  );
}

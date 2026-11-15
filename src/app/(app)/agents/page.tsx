import type { Metadata } from "next";
import AgentHub from "@/screens/agents/AgentHub";

export const metadata: Metadata = { title: "AI Agent Hub" };
export default function Page() {
  return <AgentHub />;
}

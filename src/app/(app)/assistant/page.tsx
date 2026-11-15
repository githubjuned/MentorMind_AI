import type { Metadata } from "next";
import Assistant from "@/screens/assistant/Assistant";

export const metadata: Metadata = { title: "AI Assistant" };
export default function Page() {
  return <Assistant />;
}

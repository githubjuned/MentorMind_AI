import type { Metadata } from "next";
import Analytics from "@/screens/progress/Analytics";

export const metadata: Metadata = { title: "Learning Analytics" };
export default function Page() {
  return <Analytics />;
}

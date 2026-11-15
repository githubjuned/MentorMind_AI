import type { Metadata } from "next";
import Goals from "@/screens/settings/Goals";

export const metadata: Metadata = { title: "My Goals" };
export default function Page() {
  return <Goals />;
}

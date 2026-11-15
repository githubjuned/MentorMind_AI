import type { Metadata } from "next";
import Materials from "@/screens/materials/Materials";

export const metadata: Metadata = { title: "Study Materials" };
export default function Page() {
  return <Materials />;
}

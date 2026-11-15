import type { Metadata } from "next";
import RevisionCentre from "@/screens/revision/RevisionCentre";

export const metadata: Metadata = { title: "Revision Centre" };
export default function Page() {
  return <RevisionCentre />;
}

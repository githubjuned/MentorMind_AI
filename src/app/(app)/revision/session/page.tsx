import type { Metadata } from "next";
import RevisionSession from "@/screens/revision/RevisionSession";

export const metadata: Metadata = { title: "Revision session" };
export default function Page() {
  return <RevisionSession />;
}

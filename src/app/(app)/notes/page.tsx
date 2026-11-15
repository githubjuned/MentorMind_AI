import type { Metadata } from "next";
import Notes from "@/screens/notes/Notes";

export const metadata: Metadata = { title: "Smart Notes" };
export default function Page() {
  return <Notes />;
}

import type { Metadata } from "next";
import Memory from "@/screens/memory/Memory";

export const metadata: Metadata = { title: "My Learning Memory" };
export default function Page() {
  return <Memory />;
}

import type { Metadata } from "next";
import Subjects from "@/screens/settings/Subjects";

export const metadata: Metadata = { title: "My Subjects" };
export default function Page() {
  return <Subjects />;
}

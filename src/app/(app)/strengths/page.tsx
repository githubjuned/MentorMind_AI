import type { Metadata } from "next";
import Strengths from "@/screens/progress/Strengths";

export const metadata: Metadata = { title: "Strengths & Weaknesses" };
export default function Page() {
  return <Strengths />;
}

import type { Metadata } from "next";
import Routine from "@/screens/planner/Routine";

export const metadata: Metadata = { title: "Daily Routine" };
export default function Page() {
  return <Routine />;
}

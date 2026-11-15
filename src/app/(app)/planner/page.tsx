import type { Metadata } from "next";
import Planner from "@/screens/planner/Planner";

export const metadata: Metadata = { title: "Study Planner" };
export default function Page() {
  return <Planner />;
}

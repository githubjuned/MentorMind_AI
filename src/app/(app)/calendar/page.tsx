import type { Metadata } from "next";
import Calendar from "@/screens/planner/Calendar";

export const metadata: Metadata = { title: "Study Calendar" };
export default function Page() {
  return <Calendar />;
}

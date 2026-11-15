import type { Metadata } from "next";
import Progress from "@/screens/progress/Progress";

export const metadata: Metadata = { title: "Learning Progress" };
export default function Page() {
  return <Progress />;
}

import type { Metadata } from "next";
import Landing from "@/screens/public/Landing";

export const metadata: Metadata = { title: "Your Personal AI Learning Companion" };
export default function Page() {
  return <Landing />;
}

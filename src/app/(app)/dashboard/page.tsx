import type { Metadata } from "next";
import Dashboard from "@/screens/dashboard/Dashboard";

export const metadata: Metadata = { title: "Dashboard" };
export default function Page() {
  return <Dashboard />;
}

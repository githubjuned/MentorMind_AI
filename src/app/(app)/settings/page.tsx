import type { Metadata } from "next";
import Settings from "@/screens/settings/Settings";

export const metadata: Metadata = { title: "Profile & Settings" };
export default function Page() {
  return <Settings />;
}

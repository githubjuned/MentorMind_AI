import type { Metadata } from "next";
import Help from "@/screens/settings/Help";

export const metadata: Metadata = { title: "Help & Support" };
export default function Page() {
  return <Help />;
}

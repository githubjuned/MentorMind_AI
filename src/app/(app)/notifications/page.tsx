import type { Metadata } from "next";
import Notifications from "@/screens/settings/Notifications";

export const metadata: Metadata = { title: "Notifications" };
export default function Page() {
  return <Notifications />;
}

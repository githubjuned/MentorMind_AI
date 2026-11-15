import type { Metadata } from "next";
import Resources from "@/screens/resources/Resources";

export const metadata: Metadata = { title: "Resource Discovery" };
export default function Page() {
  return <Resources />;
}

import type { Metadata } from "next";
import AccessDenied from "@/screens/public/AccessDenied";

export const metadata: Metadata = { title: "Access denied" };
export default function Page() {
  return <AccessDenied />;
}

import type { Metadata } from "next";
import Educator from "@/screens/educator/Educator";

export const metadata: Metadata = { title: "Educator Portal" };
export default function Page() {
  return <Educator />;
}

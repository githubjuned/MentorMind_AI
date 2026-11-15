import type { Metadata } from "next";
import Signup from "@/screens/auth/Signup";

export const metadata: Metadata = { title: "Create account" };
export default function Page() {
  return <Signup />;
}

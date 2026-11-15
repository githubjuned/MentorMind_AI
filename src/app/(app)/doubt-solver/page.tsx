import type { Metadata } from "next";
import DoubtSolver from "@/screens/doubt-solver/DoubtSolver";

export const metadata: Metadata = { title: "Doubt Solver" };
export default function Page() {
  return <DoubtSolver />;
}

import type { Metadata } from "next";
import QuizGenerator from "@/screens/quizzes/QuizGenerator";

export const metadata: Metadata = { title: "Quiz Generator" };
export default function Page() {
  return <QuizGenerator />;
}

import type { Metadata } from "next";
import QuizHistory from "@/screens/quizzes/QuizHistory";

export const metadata: Metadata = { title: "Quiz history" };
export default function Page() {
  return <QuizHistory />;
}

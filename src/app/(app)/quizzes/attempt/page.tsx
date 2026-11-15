import type { Metadata } from "next";
import QuizAttempt from "@/screens/quizzes/QuizAttempt";

export const metadata: Metadata = { title: "Take quiz" };
export default function Page() {
  return <QuizAttempt />;
}

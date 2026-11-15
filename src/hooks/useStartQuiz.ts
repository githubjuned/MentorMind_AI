"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import type { Difficulty, Question } from "@/types";
import { useApp } from "@/hooks/useApp";
import { uid } from "@/utils";

export function useStartQuiz() {
  const { update } = useApp();
  const router = useRouter();
  return useCallback((q: { subjectId: string; topic: string; difficulty: Difficulty; questions: Question[]; timeLimit?: number | null }) => {
    update((s) => ({ ...s, activeQuiz: { id: uid(), subjectId: q.subjectId, topic: q.topic, difficulty: q.difficulty, questions: q.questions, timeLimit: q.timeLimit ?? null, createdAt: new Date().toISOString() } }));
    router.push("/quizzes/attempt");
  }, [update, router]);
}

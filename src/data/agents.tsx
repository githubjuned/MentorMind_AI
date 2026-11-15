import { BrainCircuit, CalendarClock, Compass, Lightbulb, ListChecks, Network, NotebookPen, Repeat, TrendingUp, type LucideIcon } from "lucide-react";
import type { AgentId } from "@/types";

export interface AgentDef {
  id: AgentId;
  name: string;
  short: string;
  description: string;
  purpose: string;
  examples: string[];
  color: string;
  icon: LucideIcon;
  href: string;
  launch: string;
}

export const AGENTS: AgentDef[] = [
  {
    id: "coordinator", name: "MentorMind Coordinator", short: "Coordinator", color: "#8b7bff", icon: Network, href: "/assistant", launch: "Open assistant",
    description: "Reads each request, decides which specialist should handle it, passes along your learning context and assembles the result.",
    purpose: "Single entry point that routes every request to the right specialist.",
    examples: ["Explain photosynthesis with a practical example", "Make short notes on SQL joins", "Plan my week before the DBMS exam"],
  },
  {
    id: "doubt", name: "AI Doubt Solver", short: "Doubt Solver", color: "#22d3ee", icon: Lightbulb, href: "/doubt-solver", launch: "Ask a doubt",
    description: "Answers questions with a direct answer, concept explanation, steps, a practical example, takeaways and follow-ups.",
    purpose: "Clear up concepts at the level and format you prefer.",
    examples: ["Why does a BST inorder traversal come out sorted?", "Explain backpropagation step by step", "What is a transitive dependency?"],
  },
  {
    id: "notes", name: "Notes Generation Agent", short: "Notes", color: "#fbbf24", icon: NotebookPen, href: "/notes", launch: "Generate notes",
    description: "Turns a topic, pasted text or study material into structured notes in six formats you can edit, save and export.",
    purpose: "Build exam-ready study notes in seconds.",
    examples: ["Detailed notes on Normalization", "Revision notes for Sorting Algorithms", "Summarise this pasted chapter"],
  },
  {
    id: "quiz", name: "Quiz Generation Agent", short: "Quiz", color: "#fb7185", icon: ListChecks, href: "/quizzes", launch: "Create a quiz",
    description: "Creates MCQ, true/false, fill-in-the-blank, short-answer or mixed quizzes with explanations and scoring.",
    purpose: "Test understanding and expose weak spots with practice.",
    examples: ["Create a 10-question quiz on Python loops", "Test me on database normalization", "Hard mixed quiz on trees"],
  },
  {
    id: "planner", name: "Smart Study Planner", short: "Planner", color: "#34d399", icon: CalendarClock, href: "/planner", launch: "Plan my study",
    description: "Builds a schedule from your subjects, exam dates, difficulty and available hours, with revision blocks and breaks.",
    purpose: "Turn goals and deadlines into a realistic daily plan.",
    examples: ["Plan 2 hours a day for my DBMS exam", "Reschedule my pending tasks", "Add revision sessions before exams"],
  },
  {
    id: "progress", name: "Progress Tracking Agent", short: "Progress", color: "#60a5fa", icon: TrendingUp, href: "/progress", launch: "View progress",
    description: "Summarises study time, quiz accuracy and topic mastery, and explains the evidence behind strengths and weaknesses.",
    purpose: "Show where you are improving and where you need attention.",
    examples: ["How am I doing this week?", "Which topics are my weakest?", "Show my study streak"],
  },
  {
    id: "revision", name: "Revision Assistant", short: "Revision", color: "#fb923c", icon: Repeat, href: "/revision", launch: "Start revising",
    description: "Schedules spaced revision, collects weak topics and past mistakes, and runs summaries, flashcards and quick quizzes.",
    purpose: "Move knowledge into long-term memory.",
    examples: ["I keep getting normalization questions wrong", "What should I revise today?", "Quick flashcards on stacks and queues"],
  },
  {
    id: "resources", name: "Resource Recommender", short: "Resources", color: "#a3e635", icon: Compass, href: "/resources", launch: "Find resources",
    description: "Recommends videos, articles, documentation, tutorials and practice material matched to your goals and weak topics.",
    purpose: "Find the right material to learn from next.",
    examples: ["Recommend resources for neural networks", "Any tutorials on SQL joins?", "Practice material for derivatives"],
  },
];
export const agentById = (id: AgentId) => AGENTS.find((a) => a.id === id) ?? AGENTS[0];
export const SPECIALISTS = AGENTS.filter((a) => a.id !== "coordinator");
export { BrainCircuit };

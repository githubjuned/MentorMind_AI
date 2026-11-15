import { Activity, AlertTriangle, BarChart3, CalendarClock, CalendarDays, Gauge, History, ListChecks, PlayCircle, Repeat, Sun, Sparkles } from "lucide-react";

export const QUIZ_TABS = [
  { href: "/quizzes", label: "Generator", icon: Sparkles },
  { href: "/quizzes/attempt", label: "Take quiz", icon: PlayCircle },
  { href: "/quizzes/history", label: "History", icon: History },
];
export const PLANNER_TABS = [
  { href: "/planner", label: "Planner", icon: CalendarClock },
  { href: "/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/routine", label: "Daily routine", icon: Sun },
];
export const PROGRESS_TABS = [
  { href: "/progress", label: "Progress", icon: Gauge },
  { href: "/strengths", label: "Strengths & weaknesses", icon: AlertTriangle },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
];
export const REVISION_TABS = [
  { href: "/revision", label: "Revision centre", icon: Repeat },
  { href: "/revision/session", label: "Revision session", icon: Activity },
];
export { ListChecks };

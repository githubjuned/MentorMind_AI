"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Brain,
  CalendarClock,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Lightbulb,
  ListChecks,
  NotebookPen,
  Play,
  RotateCcw,
  Sparkles,
  X,
  Zap,
} from "lucide-react";
import { Badge, Button, Modal, Ring, cn } from "@/components/common/ui";
import { useApp } from "@/hooks/useApp";

interface ModernTourProps {
  open: boolean;
  onClose: () => void;
}

export function ModernTour({ open, onClose }: ModernTourProps) {
  const { state, update } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Interactive state for mini-demos
  const [selectedAgentChip, setSelectedAgentChip] = useState("Explain Python Loops");
  const [selectedStyle, setSelectedStyle] = useState<"step" | "example" | "concept">("example");
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);

  if (!open) return null;

  const handleFinish = (targetHref?: string) => {
    update((s) => ({ ...s, tourCompleted: true }));
    onClose();
    if (targetHref) {
      router.push(targetHref);
    }
  };

  const steps = [
    {
      id: "coordinator",
      tag: "Central Intelligence",
      title: "Meet Your AI Coordinator",
      subtitle:
        "The central coordinator understands your plain-English requests and routes them to 7 specialized agents.",
      icon: Sparkles,
      color: "#8b7bff",
      renderInteractive: () => (
        <div className="space-y-3 rounded-2xl border border-line bg-surface2/60 p-4">
          <p className="text-xs font-semibold text-muted">Tap an example request to see dynamic agent routing:</p>
          <div className="flex flex-wrap gap-2">
            {[
              { text: "Explain Python Loops", agent: "AI Doubt Solver", color: "#22d3ee" },
              { text: "Create DBMS Quiz", agent: "Quiz Generator", color: "#fb7185" },
              { text: "Draft Exam Schedule", agent: "Study Planner", color: "#34d399" },
              { text: "Summarize Lecture PDF", agent: "Smart Notes", color: "#fbbf24" },
            ].map((chip) => (
              <button
                key={chip.text}
                type="button"
                onClick={() => setSelectedAgentChip(chip.text)}
                className={cn(
                  "chip transition-all",
                  selectedAgentChip === chip.text ? "chip-on font-bold" : ""
                )}
              >
                {chip.text}
              </button>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-line bg-surface p-3 text-xs">
            <span className="text-muted">Detected Intent:</span>
            <span className="font-semibold text-ink">
              {selectedAgentChip.includes("Quiz")
                ? "Quiz Generation"
                : selectedAgentChip.includes("Schedule")
                ? "Study Schedule Planning"
                : selectedAgentChip.includes("PDF")
                ? "Document Note Extraction"
                : "Conceptual Doubt Solving"}
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-brand/10 p-2.5 text-xs text-brand">
            <Sparkles className="h-4 w-4 shrink-0" />
            <span>
              Routed to:{" "}
              <b>
                {selectedAgentChip.includes("Quiz")
                  ? "Quiz Generation Agent"
                  : selectedAgentChip.includes("Schedule")
                  ? "Smart Study Planner Agent"
                  : selectedAgentChip.includes("PDF")
                  ? "Notes Generation Agent"
                  : "AI Doubt Solver Agent"}
              </b>
            </span>
          </div>
        </div>
      ),
    },
    {
      id: "doubt",
      tag: "Deep Understanding",
      title: "AI Doubt Solver",
      subtitle:
        "Instant, step-by-step explanations tailored to your preferred learning format and difficulty level.",
      icon: Lightbulb,
      color: "#22d3ee",
      renderInteractive: () => (
        <div className="space-y-3 rounded-2xl border border-line bg-surface2/60 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted">Try explanation format:</span>
            <div className="flex gap-1.5">
              {[
                { id: "example", label: "Practical" },
                { id: "step", label: "Step-by-Step" },
                { id: "concept", label: "Conceptual" },
              ].map((fmt) => (
                <button
                  key={fmt.id}
                  type="button"
                  onClick={() => setSelectedStyle(fmt.id as "step" | "example" | "concept")}
                  className={cn(
                    "rounded-lg px-2.5 py-1 text-xs font-medium transition",
                    selectedStyle === fmt.id
                      ? "bg-brand2 text-black font-bold"
                      : "bg-surface text-muted hover:text-ink"
                  )}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-line bg-surface p-3 text-xs text-muted">
            {selectedStyle === "example" && (
              <p>
                <b className="text-ink">Real-world Analogy:</b> Think of a loop like an assembly line
                inspection. For each parcel on the conveyor belt, inspect and stamp it until no parcels remain.
              </p>
            )}
            {selectedStyle === "step" && (
              <ol className="list-decimal space-y-1 pl-4 text-ink">
                <li>Initialize loop variable counter.</li>
                <li>Evaluate condition: true or false?</li>
                <li>Execute statement block.</li>
                <li>Update iterator and repeat.</li>
              </ol>
            )}
            {selectedStyle === "concept" && (
              <p>
                <b className="text-ink">Core Definition:</b> Loops provide program control flow to repeat a
                block of statements deterministically or conditionally, reducing boilerplate repetition.
              </p>
            )}
          </div>
        </div>
      ),
    },
    {
      id: "notes",
      tag: "Knowledge Synthesis",
      title: "Smart Notes Generator",
      subtitle:
        "Upload PDF/DOCX course materials or type topics to extract organized notes, bullet points, and flashcards.",
      icon: NotebookPen,
      color: "#fbbf24",
      renderInteractive: () => (
        <div className="space-y-3 rounded-2xl border border-line bg-surface2/60 p-4">
          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5">
              <span className="font-semibold text-amber-400">Concise</span>
              <p className="mt-1 text-[11px] text-muted">Key takeaways</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-2.5">
              <span className="font-semibold text-ink">Detailed</span>
              <p className="mt-1 text-[11px] text-muted">Full outlines</p>
            </div>
            <div className="rounded-xl border border-line bg-surface p-2.5">
              <span className="font-semibold text-ink">Flashcards</span>
              <p className="mt-1 text-[11px] text-muted">Spaced practice</p>
            </div>
          </div>
          <p className="text-xs text-muted">
            Every generated note can be edited inline, downloaded as Markdown, or exported to clean PDF.
          </p>
        </div>
      ),
    },
    {
      id: "quizzes",
      tag: "Active Recall",
      title: "Adaptive Quiz Generator",
      subtitle:
        "Test your mastery with instant scoring, step-by-step explanations, and automated mistake tracking.",
      icon: ListChecks,
      color: "#fb7185",
      renderInteractive: () => (
        <div className="space-y-3 rounded-2xl border border-line bg-surface2/60 p-4">
          <p className="text-xs font-semibold text-ink">
            Quick Check: Which normal form removes partial functional dependencies on a composite primary key?
          </p>
          <div className="grid gap-2">
            {[
              { id: "1nf", label: "1NF (First Normal Form)", correct: false },
              { id: "2nf", label: "2NF (Second Normal Form)", correct: true },
              { id: "3nf", label: "3NF (Third Normal Form)", correct: false },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setQuizAnswer(opt.id)}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-3 py-2 text-left text-xs transition",
                  quizAnswer === opt.id
                    ? opt.correct
                      ? "border-ok bg-ok/15 text-ok font-semibold"
                      : "border-bad bg-bad/15 text-bad font-semibold"
                    : "border-line bg-surface hover:border-brand/40 text-muted hover:text-ink"
                )}
              >
                <span>{opt.label}</span>
                {quizAnswer === opt.id && (
                  <span>{opt.correct ? "✓ Correct!" : "✗ Review 2NF"}</span>
                )}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted">
            Incorrect answers automatically enter your Revision queue so you master them before exams.
          </p>
        </div>
      ),
    },
    {
      id: "planner",
      tag: "Goal Oriented",
      title: "Smart Study Planner & Routine",
      subtitle:
        "Input your exam dates and available study hours. MentorMind schedules balanced daily timetables and breaks.",
      icon: CalendarClock,
      color: "#34d399",
      renderInteractive: () => (
        <div className="space-y-3 rounded-2xl border border-line bg-surface2/60 p-4 text-xs">
          <div className="flex items-center justify-between rounded-xl bg-surface p-3">
            <div>
              <p className="font-semibold text-ink">Daily Study Target</p>
              <p className="text-[11px] text-muted">Configured in Profile</p>
            </div>
            <Badge tone="brand">{state.profile.dailyMinutes} mins / day</Badge>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
            <span>Interactive daily routine with Pomodoro-friendly breaks</span>
          </div>
          <div className="flex items-center gap-2 text-muted">
            <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
            <span>Spaced-repetition revision schedules based on forgetting curves</span>
          </div>
        </div>
      ),
    },
    {
      id: "telemetry",
      tag: "Real Learning Telemetry",
      title: "Real Progress, Zero Dummy Data",
      subtitle:
        "MentorMind tracks your real learning sessions, quizzes, notes, and habits directly in your private Firebase database.",
      icon: Brain,
      color: "#a78bfa",
      renderInteractive: () => (
        <div className="space-y-3 rounded-2xl border border-brand/30 bg-brand/5 p-4 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/20 text-brand">
            <Zap className="h-6 w-6" />
          </div>
          <h4 className="font-display font-semibold text-ink">You are starting with a clean slate</h4>
          <p className="text-xs text-muted max-w-sm mx-auto">
            No pre-baked dummy scores or fictional history. As you ask questions, take quizzes, and study,
            your genuine mastery curve will be rendered in real-time.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-2">
            <Button size="sm" onClick={() => handleFinish("/doubt-solver")}>
              Ask a Doubt
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleFinish("/quizzes")}>
              Take a Quiz
            </Button>
            <Button size="sm" variant="secondary" onClick={() => handleFinish("/planner")}>
              Plan Studies
            </Button>
          </div>
        </div>
      ),
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => handleFinish()}
      />

      {/* Modal Dialog Card */}
      <div className="anim-fade-up relative z-10 w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-surface shadow-2xl">
        {/* Top Gradient Ribbon */}
        <div
          className="h-1.5 w-full transition-all duration-300"
          style={{ background: current.color }}
        />

        <div className="p-6 sm:p-8">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="flex h-12 w-12 items-center justify-center rounded-2xl transition-colors"
                style={{ background: `${current.color}22`, color: current.color }}
              >
                <Icon className="h-6 w-6" />
              </span>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted">
                  {current.tag}
                </span>
                <h3 className="font-display text-xl font-bold text-ink sm:text-2xl">
                  {current.title}
                </h3>
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleFinish()}
              className="rounded-xl p-1.5 text-muted transition hover:bg-surface2 hover:text-ink"
              aria-label="Close tour"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Subtitle */}
          <p className="mt-3 text-sm leading-relaxed text-muted">{current.subtitle}</p>

          {/* Interactive Demo Body */}
          <div className="mt-5">{current.renderInteractive()}</div>

          {/* Footer Navigation */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-5">
            {/* Step Indicators / Dots */}
            <div className="flex items-center gap-1.5">
              {steps.map((s, idx) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStep(idx)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    step === idx
                      ? "w-6 bg-brand"
                      : "w-2 bg-surface2 hover:bg-muted"
                  )}
                  aria-label={`Jump to step ${idx + 1}`}
                />
              ))}
              <span className="ml-2 text-xs text-muted">
                {step + 1} of {steps.length}
              </span>
            </div>

            {/* Prev / Next Buttons */}
            <div className="flex items-center gap-2">
              {step > 0 ? (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setStep((s) => s - 1)}
                  icon={ChevronLeft}
                >
                  Previous
                </Button>
              ) : (
                <Button size="sm" variant="ghost" onClick={() => handleFinish()}>
                  Skip tour
                </Button>
              )}

              {step < steps.length - 1 ? (
                <Button
                  size="sm"
                  onClick={() => setStep((s) => s + 1)}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button size="sm" onClick={() => handleFinish("/dashboard")}>
                  Start Learning
                  <Play className="h-3.5 w-3.5 ml-1.5" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

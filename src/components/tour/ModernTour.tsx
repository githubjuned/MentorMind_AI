"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  CheckCircle2,
  Circle,
  HelpCircle,
  ExternalLink,
  Layers,
  ArrowRight,
  Minus,
  Maximize2,
} from "lucide-react";
import { useApp } from "@/hooks/useApp";

interface TourStep {
  id: string;
  number: number;
  title: string;
  checklistLabel: string;
  route: string;
  primarySelector: string;
  fallbackSelector: string;
  description: string;
  benefitBadge: string;
}

const TOUR_STEPS: TourStep[] = [
  {
    id: "dashboard",
    number: 1,
    title: "AI Command Center & Quick Ask",
    checklistLabel: "Home Dashboard & Ask AI",
    route: "/dashboard",
    primarySelector: '[data-tour="dashboard-ask"]',
    fallbackSelector: '[data-tour-nav="dashboard"]',
    description:
      "Type any concept, equation, or syllabus doubt right here. The central coordinator analyzes your prompt and instantly routes it to the most qualified specialist AI agent.",
    benefitBadge: "Step 1 of 6 · Quick AI Input",
  },
  {
    id: "assistant",
    number: 2,
    title: "The AI Multi-Agent Classroom",
    checklistLabel: "AI Multi-Agent Classroom",
    route: "/assistant",
    primarySelector: '[data-tour="assistant-input"]',
    fallbackSelector: '[data-tour-nav="assistant"]',
    description:
      "You are now in the live AI Classroom! Socratic Coach, Concept Explainer, Exam Crammer, and Formula Assistant collaborate to break down difficult topics with guided hints.",
    benefitBadge: "Step 2 of 6 · Socratic Tutoring",
  },
  {
    id: "notes",
    number: 3,
    title: "Smart Study Notes & Summaries",
    checklistLabel: "Smart Notes & Summaries",
    route: "/notes",
    primarySelector: '[data-tour="notes-panel"]',
    fallbackSelector: '[data-tour-nav="notes"]',
    description:
      "Convert lecture transcripts, textbook passages, or syllabus units into structured revision sheets, key takeaways, and flashcards with instant Markdown and PDF exports.",
    benefitBadge: "Step 3 of 6 · Knowledge Synthesis",
  },
  {
    id: "quizzes",
    number: 4,
    title: "Adaptive Practice Quizzes",
    checklistLabel: "Adaptive Quiz Drills",
    route: "/quizzes",
    primarySelector: '[data-tour="quiz-start"]',
    fallbackSelector: '[data-tour-nav="quizzes"]',
    description:
      "Generate instant self-grading practice quizzes in multiple choice, true/false, fill-in-the-blank, or short answer formats. Questions adapt to your target difficulty level.",
    benefitBadge: "Step 4 of 6 · Active Recall",
  },
  {
    id: "planner",
    number: 5,
    title: "Spaced Repetition Study Planner",
    checklistLabel: "Study Planner & Calendar",
    route: "/planner",
    primarySelector: '[data-tour="planner-view"]',
    fallbackSelector: '[data-tour-nav="planner"]',
    description:
      "Never cram last minute again. Set your exam dates and daily study hours, and let MentorMind build an optimized spaced repetition schedule that resurfaces weak topics.",
    benefitBadge: "Step 5 of 6 · Spaced Planning",
  },
  {
    id: "memory",
    number: 6,
    title: "Your Transparent Memory Vault",
    checklistLabel: "Transparent Memory Vault",
    route: "/memory",
    primarySelector: '[data-tour="memory-vault"]',
    fallbackSelector: '[data-tour-nav="memory"]',
    description:
      "You have 100% control over what AI remembers. Inspect inferred topic mastery, review stored preferences, edit learning goals, or purge your memory records at any time.",
    benefitBadge: "Step 6 of 6 · Complete Privacy",
  },
];

interface ModernTourProps {
  open: boolean;
  onClose: () => void;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

export function ModernTour({ open, onClose }: ModernTourProps) {
  const { update } = useApp();
  const router = useRouter();
  const pathname = usePathname();

  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<TargetRect | null>(null);
  const [checklistMinimized, setChecklistMinimized] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  const currentStep = TOUR_STEPS[stepIndex];

  // Complete tour handler
  const handleFinish = useCallback(() => {
    update((s) => ({ ...s, tourCompleted: true }));
    onClose();
  }, [update, onClose]);

  // Measure element location on live screen
  const updateTargetPosition = useCallback(() => {
    if (!open) return;

    const step = TOUR_STEPS[stepIndex];
    if (!step) return;

    let el = document.querySelector(step.primarySelector) as HTMLElement | null;
    if (!el) {
      el = document.querySelector(step.fallbackSelector) as HTMLElement | null;
    }

    if (el) {
      const rect = el.getBoundingClientRect();
      // Ensure element is visible in viewport
      if (rect.width > 0 && rect.height > 0) {
        setTargetRect({
          top: Math.max(0, rect.top),
          left: Math.max(0, rect.left),
          width: rect.width,
          height: rect.height,
        });
        return;
      }
    }

    // Fallback: If not found yet, default to center of viewport
    const fallbackWidth = Math.min(window.innerWidth * 0.7, 500);
    const fallbackHeight = 160;
    setTargetRect({
      top: (window.innerHeight - fallbackHeight) / 2,
      left: (window.innerWidth - fallbackWidth) / 2,
      width: fallbackWidth,
      height: fallbackHeight,
    });
  }, [open, stepIndex]);

  // Navigate & shift live screen when step changes
  const goToStep = useCallback(
    (index: number) => {
      if (index < 0 || index >= TOUR_STEPS.length) return;
      const targetStep = TOUR_STEPS[index];
      setStepIndex(index);

      // Check if we need to shift to another live page
      if (pathname !== targetStep.route) {
        setIsNavigating(true);
        router.push(targetStep.route);

        // Allow route transition to settle and measure new element
        setTimeout(() => {
          setIsNavigating(false);
          let attempts = 0;
          const poll = setInterval(() => {
            attempts++;
            const el =
              document.querySelector(targetStep.primarySelector) ||
              document.querySelector(targetStep.fallbackSelector);
            if (el || attempts > 12) {
              clearInterval(poll);
              if (el) {
                (el as HTMLElement).scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                });
              }
              setTimeout(updateTargetPosition, 150);
            }
          }, 80);
        }, 120);
      } else {
        // Already on page, scroll element into view
        const el =
          document.querySelector(targetStep.primarySelector) ||
          document.querySelector(targetStep.fallbackSelector);
        if (el) {
          (el as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
        setTimeout(updateTargetPosition, 100);
      }
    },
    [pathname, router, updateTargetPosition]
  );

  // Initialize or step change positioning
  useEffect(() => {
    if (!open) return;
    goToStep(stepIndex);
  }, [open]);

  // Window resize & scroll listeners to keep spotlight glued to element
  useEffect(() => {
    if (!open) return;
    const handleScrollResize = () => {
      requestAnimationFrame(updateTargetPosition);
    };

    window.addEventListener("resize", handleScrollResize);
    window.addEventListener("scroll", handleScrollResize, true);
    return () => {
      window.removeEventListener("resize", handleScrollResize);
      window.removeEventListener("scroll", handleScrollResize, true);
    };
  }, [open, updateTargetPosition]);

  if (!open) return null;

  // Calculate Tooltip position and pointer beak orientation
  const PADDING = 8;
  const spotTop = (targetRect?.top ?? 200) - PADDING;
  const spotLeft = (targetRect?.left ?? 200) - PADDING;
  const spotWidth = (targetRect?.width ?? 300) + PADDING * 2;
  const spotHeight = (targetRect?.height ?? 100) + PADDING * 2;

  // Decide tooltip placement
  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
  const screenWidth = typeof window !== "undefined" ? window.innerWidth : 1200;
  const screenHeight = typeof window !== "undefined" ? window.innerHeight : 800;

  let tooltipStyle: React.CSSProperties = {};
  let arrowClass = "";

  if (isMobile) {
    // Docked at bottom for mobile clarity
    tooltipStyle = {
      bottom: 24,
      left: 16,
      right: 16,
      maxWidth: "calc(100vw - 32px)",
    };
  } else {
    // Desktop: position adjacent to spotlight box
    const spaceRight = screenWidth - (spotLeft + spotWidth);
    const spaceLeft = spotLeft;
    const spaceBottom = screenHeight - (spotTop + spotHeight);

    if (spaceRight >= 360) {
      // Place to the RIGHT of element, arrow points LEFT
      tooltipStyle = {
        top: Math.max(20, Math.min(spotTop, screenHeight - 260)),
        left: spotLeft + spotWidth + 18,
        maxWidth: 380,
      };
      arrowClass = "arrow-left";
    } else if (spaceLeft >= 360) {
      // Place to the LEFT of element, arrow points RIGHT
      tooltipStyle = {
        top: Math.max(20, Math.min(spotTop, screenHeight - 260)),
        left: Math.max(16, spotLeft - 398),
        maxWidth: 380,
      };
      arrowClass = "arrow-right";
    } else if (spaceBottom >= 220) {
      // Place BELOW element, arrow points UP
      tooltipStyle = {
        top: spotTop + spotHeight + 18,
        left: Math.max(20, Math.min(spotLeft, screenWidth - 400)),
        maxWidth: 380,
      };
      arrowClass = "arrow-up";
    } else {
      // Place ABOVE element, arrow points DOWN
      tooltipStyle = {
        top: Math.max(20, spotTop - 240),
        left: Math.max(20, Math.min(spotLeft, screenWidth - 400)),
        maxWidth: 380,
      };
      arrowClass = "arrow-down";
    }
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none select-none">
      {/* 1. Spotlight Cutout Box with 9999px Dark Overlay Backdrop */}
      <div
        className="fixed z-[10000] rounded-2xl pointer-events-none transition-all duration-400 ease-out"
        style={{
          top: `${spotTop}px`,
          left: `${spotLeft}px`,
          width: `${spotWidth}px`,
          height: `${spotHeight}px`,
          border: "2px dashed #c084fc", // Purple dashed border matching Mercury reference
          boxShadow:
            "0 0 0 9999px rgba(10, 12, 22, 0.78), 0 0 30px rgba(168, 85, 247, 0.75)",
        }}
      >
        {/* Pulsating Beacon Target Indicator in Spotlight Corner */}
        <div className="absolute -top-3.5 -left-3.5 flex items-center gap-1.5 rounded-full bg-violet-600 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-widest text-white shadow-lg border border-violet-300">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-300 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-white" />
          </span>
          Step {currentStep.number}
        </div>
      </div>

      {/* 2. Checklist Progress Drawer (Inspired by Reference Image 3) */}
      <div
        className={`fixed left-4 bottom-4 z-[10002] pointer-events-auto hidden md:block rounded-2xl border border-line bg-card/95 p-4 shadow-2xl backdrop-blur-md transition-all duration-300 ${
          checklistMinimized ? "w-64" : "w-80"
        }`}
      >
        <div className="flex items-center justify-between pb-2 border-b border-line">
          <div>
            <h4 className="font-display text-xs font-bold text-ink">
              Interactive Product Tour
            </h4>
            {!checklistMinimized && (
              <p className="text-[10px] text-muted">
                Shifting live screens & active buttons
              </p>
            )}
          </div>
          <button
            onClick={() => setChecklistMinimized(!checklistMinimized)}
            className="rounded-lg p-1 text-muted hover:bg-surface2 hover:text-ink transition"
            title={checklistMinimized ? "Expand Checklist" : "Minimize"}
          >
            {checklistMinimized ? (
              <Maximize2 className="h-3.5 w-3.5" />
            ) : (
              <Minus className="h-3.5 w-3.5" />
            )}
          </button>
        </div>

        {!checklistMinimized && (
          <ul className="mt-3 space-y-1.5 text-xs">
            {TOUR_STEPS.map((s, idx) => {
              const isPast = idx < stepIndex;
              const isCurrent = idx === stepIndex;
              return (
                <li key={s.id}>
                  <button
                    onClick={() => goToStep(idx)}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                      isCurrent
                        ? "bg-violet-600/15 text-violet-600 font-bold border border-violet-400/40"
                        : isPast
                        ? "text-muted hover:text-ink hover:bg-surface2"
                        : "text-muted/60 hover:text-ink hover:bg-surface2"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        isPast
                          ? "bg-emerald-500 text-white"
                          : isCurrent
                          ? "bg-violet-600 text-white animate-pulse"
                          : "bg-surface2 text-muted"
                      }`}
                    >
                      {isPast ? "✓" : s.number}
                    </span>
                    <span className="truncate flex-1">{s.checklistLabel}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* 3. The Purple Speech Bubble Tooltip (Matches Reference Image 1 & 2) */}
      <div
        className="fixed z-[10003] pointer-events-auto transition-all duration-300 ease-out"
        style={tooltipStyle}
      >
        <div className="relative rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-700 p-6 text-white shadow-2xl shadow-purple-950/70 border border-white/20">
          {/* Directional Pointer Arrow / Beak */}
          {arrowClass === "arrow-left" && (
            <div className="absolute top-7 -left-2.5 h-0 w-0 border-y-8 border-y-transparent border-r-8 border-r-violet-600" />
          )}
          {arrowClass === "arrow-right" && (
            <div className="absolute top-7 -right-2.5 h-0 w-0 border-y-8 border-y-transparent border-l-8 border-l-violet-600" />
          )}
          {arrowClass === "arrow-up" && (
            <div className="absolute -top-2.5 left-8 h-0 w-0 border-x-8 border-x-transparent border-b-8 border-b-violet-600" />
          )}
          {arrowClass === "arrow-down" && (
            <div className="absolute -bottom-2.5 left-8 h-0 w-0 border-x-8 border-x-transparent border-t-8 border-t-indigo-700" />
          )}

          {/* Top Bar: Badge & Close */}
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-white/20 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-white backdrop-blur">
              {currentStep.benefitBadge}
            </span>
            <button
              onClick={handleFinish}
              className="rounded-lg p-1 text-white/70 hover:bg-white/10 hover:text-white transition"
              aria-label="Skip tour"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Title */}
          <h3 className="mt-2.5 font-display text-base sm:text-lg font-bold text-white leading-snug">
            {currentStep.title}
          </h3>

          {/* Description */}
          <p className="mt-1.5 text-xs text-purple-100 leading-relaxed font-normal">
            {currentStep.description}
          </p>

          {/* Actions Bar */}
          <div className="mt-5 flex items-center justify-between pt-3 border-t border-white/15">
            {/* Prev Button */}
            <div>
              {stepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex - 1)}
                  className="flex items-center gap-1 text-xs font-semibold text-white/80 hover:text-white transition"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="text-[11px] text-white/70 hover:text-white transition underline"
                >
                  Skip Tour
                </button>
              )}
            </div>

            {/* Next / Finish Button (White pill button like in reference images) */}
            <div>
              {stepIndex < TOUR_STEPS.length - 1 ? (
                <button
                  type="button"
                  onClick={() => goToStep(stepIndex + 1)}
                  className="flex items-center gap-1 rounded-xl bg-white px-5 py-2 text-xs font-bold uppercase tracking-wider text-purple-700 shadow-lg hover:bg-purple-50 transition active:scale-95"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinish}
                  className="flex items-center gap-1.5 rounded-xl bg-emerald-400 px-5 py-2 text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg hover:bg-emerald-300 transition active:scale-95"
                >
                  Start Learning
                  <Sparkles className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

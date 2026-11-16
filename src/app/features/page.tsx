import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  CalendarClock,
  Compass,
  GraduationCap,
  Lightbulb,
  ListChecks,
  Network,
  NotebookPen,
  Repeat,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Badge, Button, Card } from "@/components/common/ui";
import { SPECIALISTS } from "@/data/agents";

export const metadata: Metadata = {
  title: "Features & Specialized Agents · MentorMind AI",
  description:
    "Explore the 7 specialized AI agents and central coordinator powering MentorMind AI's personalized learning ecosystem.",
};

export default function FeaturesPage() {
  return (
    <PublicPageLayout
      eyebrow="Capabilities"
      title={
        <>
          Seven Specialized Agents. <span className="gradient-text">One Unified Intelligence.</span>
        </>
      }
      subtitle="Discover how each purpose-built agent tackles a specific part of your academic journey — from instant doubt clarification to exam timetable planning."
      breadcrumbs={[{ label: "Features" }]}
    >
      <div className="space-y-14">
        {/* Central Coordinator Highlight */}
        <Card className="p-8 border-brand/40 bg-brand/5 relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 opacity-10 pointer-events-none">
            <Network className="h-64 w-64 text-brand" />
          </div>
          <div className="max-w-2xl space-y-4">
            <Badge tone="brand">The Core Engine</Badge>
            <h2 className="font-display text-2xl font-bold sm:text-3xl text-ink">
              Central AI Coordinator
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              You don&apos;t need to remember which agent does what. Simply ask a question in natural language:
              “Explain Python recursion with examples” or “Build a study schedule for my upcoming DBMS exam”.
              The Central Coordinator inspects the intent, extracts parameters, routes the request to the right
              specialist, and records the telemetry to your learning memory.
            </p>
            <div className="pt-2 flex flex-wrap gap-2 text-xs">
              <span className="rounded-lg bg-surface2 px-3 py-1.5 font-medium text-ink">
                Intent Extraction
              </span>
              <span className="rounded-lg bg-surface2 px-3 py-1.5 font-medium text-ink">
                Telemetry Synchronization
              </span>
              <span className="rounded-lg bg-surface2 px-3 py-1.5 font-medium text-ink">
                Gemini Multi-Model Fallback
              </span>
            </div>
          </div>
        </Card>

        {/* 7 Specialized Agents Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="eyebrow">The Specialist Team</p>
            <h2 className="font-display text-2xl font-bold">Purpose-Built for Every Learning Task</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {SPECIALISTS.map((agent) => (
              <Card
                key={agent.id}
                className="p-6 relative flex flex-col justify-between overflow-hidden hover:border-brand/40 transition"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ background: agent.color }}
                />
                <div className="space-y-3">
                  <span
                    className="flex h-12 w-12 items-center justify-center rounded-2xl"
                    style={{ background: `${agent.color}22`, color: agent.color }}
                  >
                    <agent.icon className="h-6 w-6" />
                  </span>
                  <h3 className="font-display text-lg font-bold text-ink">{agent.name}</h3>
                  <p className="text-xs text-muted leading-relaxed">{agent.description}</p>
                  <div className="rounded-xl bg-surface2 p-3 text-xs">
                    <p className="font-semibold text-ink">Core Purpose:</p>
                    <p className="text-muted mt-0.5">{agent.purpose}</p>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-line flex items-center justify-between text-xs text-muted">
                  <span>Input Format: Text & Materials</span>
                  <Link
                    href="/signup"
                    className="font-semibold text-brand hover:underline"
                  >
                    Try Agent →
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Learning Telemetry & Memory */}
        <section className="grid gap-8 lg:grid-cols-2 items-center rounded-3xl border border-line bg-surface p-6 sm:p-10">
          <div className="space-y-4">
            <Badge tone="warn">Zero Pre-Baked Data</Badge>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">
              Continuous Learning Memory
            </h2>
            <p className="text-sm leading-relaxed text-muted">
              Unlike generic assistants that reset every session, MentorMind records your active quiz mistakes,
              subject mastery percentage, and daily study minutes. As you practice, it adjusts future quizzes to
              target your verified weak areas and schedules spaced repetition reminders before forgetting sets in.
            </p>
            <ul className="space-y-2 text-xs text-muted">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span>Transparent explanation format: Stored vs. Inferred telemetry</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-brand" />
                <span>Full student control: Edit preferences, pause memory, or wipe data at any time</span>
              </li>
            </ul>
          </div>
          <div className="rounded-2xl border border-line bg-surface2 p-6 space-y-3 text-xs">
            <div className="flex justify-between items-center text-muted">
              <span>Current Mastery Status</span>
              <Badge tone="ok">Adaptive Telemetry</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-muted">
                <span>DBMS Normalization (2NF / 3NF)</span>
                <span className="font-semibold text-bad">Weak Topic (Needs Revision)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                <div className="h-full bg-bad w-[46%]" />
              </div>
            </div>
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-muted">
                <span>Python Functional Programming</span>
                <span className="font-semibold text-ok">Mastered (86%)</span>
              </div>
              <div className="h-2 w-full rounded-full bg-surface overflow-hidden">
                <div className="h-full bg-ok w-[86%]" />
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link href="/signup" className="btn btn-primary btn-lg">
            Experience All Features Free
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}

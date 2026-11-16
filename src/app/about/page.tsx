import type { Metadata } from "next";
import Link from "next/link";
import {
  Brain,
  CheckCircle2,
  GraduationCap,
  Heart,
  Network,
  Rocket,
  Shield,
  Sparkles,
  Target,
  Users,
} from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Card } from "@/components/common/ui";

export const metadata: Metadata = {
  title: "About Us · MentorMind AI",
  description:
    "Learn about the mission, architecture, and principles behind MentorMind AI — an intelligent multi-agent learning companion.",
};

export default function AboutPage() {
  return (
    <PublicPageLayout
      eyebrow="Our Mission"
      title={
        <>
          Empowering Every Student with <span className="gradient-text">Adaptive AI Intelligence</span>
        </>
      }
      subtitle="MentorMind AI was engineered to bridge the gap between fragmented study tools and deep, personalized comprehension."
      breadcrumbs={[{ label: "About Us" }]}
    >
      <div className="space-y-12">
        {/* Story Section */}
        <section className="grid gap-8 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <h2 className="font-display text-2xl font-bold sm:text-3xl">The Problem with Traditional EdTech</h2>
            <p className="text-sm leading-relaxed text-muted">
              Most online learning software provides static video lectures or single-threaded generic chatbots.
              They don&apos;t remember what formula you struggled with on Tuesday, they don&apos;t coordinate notes
              with your upcoming exam schedule, and they treat every student like an identical demographic average.
            </p>
            <p className="text-sm leading-relaxed text-muted">
              MentorMind AI was architected from the ground up as a <b>multi-agent ecosystem</b>. Instead of
              relying on a single generic model, our central AI coordinator delegates tasks to specialized domain
              agents — Doubt Solver, Smart Notes, Quiz Generator, Study Planner, Progress Tracker, and Revision
              Assistant.
            </p>
          </div>
          <Card className="p-6 bg-surface2/50 border-line space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/15 text-brand">
                <Brain className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display font-semibold text-ink">Autonomous Multi-Agent Architecture</h3>
                <p className="text-xs text-muted">7 Dedicated Specialists · 1 Central Coordinator</p>
              </div>
            </div>
            <ul className="space-y-2.5 text-xs text-muted">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
                <span>Zero pre-baked dummy data; genuine learning telemetry from session one</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
                <span>Spaced repetition curves tailored to each student&apos;s active recall mistakes</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-ok shrink-0" />
                <span>Privacy-first design with strict per-user UID isolation</span>
              </li>
            </ul>
          </Card>
        </section>

        {/* Core Principles */}
        <section className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <p className="eyebrow">Our Values</p>
            <h2 className="font-display text-2xl font-bold">Built On Four Pillars</h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Shield,
                title: "Student Data Privacy",
                desc: "Your learning history belongs to you. Fully aligned with India's DPDP Act 2023 with complete data erasure rights.",
                color: "#22d3ee",
              },
              {
                icon: Target,
                title: "Evidence-Based Mastery",
                desc: "Recommendations are backed by real telemetry: accuracy trends, mistake logs, and study interval calculations.",
                color: "#34d399",
              },
              {
                icon: Sparkles,
                title: "Adaptive Pedagogy",
                desc: "Switch between code-first examples, analogies, visual step-by-steps, or concise bullet points at will.",
                color: "#fbbf24",
              },
              {
                icon: GraduationCap,
                title: "Academic Integrity",
                desc: "Constructed to explain foundational principles rather than provide lazy shortcuts for homework evasion.",
                color: "#8b7bff",
              },
            ].map((pillar) => (
              <Card key={pillar.title} className="p-5 space-y-3">
                <span
                  className="flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: `${pillar.color}22`, color: pillar.color }}
                >
                  <pillar.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display font-semibold text-ink text-base">{pillar.title}</h3>
                <p className="text-xs text-muted leading-relaxed">{pillar.desc}</p>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to action */}
        <section className="rounded-3xl border border-line bg-aurora p-8 text-center sm:p-12">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">Start Your Learning Journey Today</h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
            Join students who have transformed disorganized cramming into structured, continuous academic mastery.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/signup" className="btn btn-primary btn-lg">
              Get Started Free
            </Link>
            <Link href="/contact" className="btn btn-secondary btn-lg">
              Contact Team
            </Link>
          </div>
        </section>
      </div>
    </PublicPageLayout>
  );
}

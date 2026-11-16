"use client";

import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Calendar, Clock, ArrowRight, Sparkles, BookOpen, BrainCircuit } from "lucide-react";

const POSTS = [
  {
    slug: "socratic-learning-vs-direct-answers",
    title: "Why Socratic Questioning Retains 3x More Knowledge than Passive AI Answers",
    excerpt: "Most students use generative AI as a shortcut calculator. Discover how structured questioning forces cognitive synthesis and long-term memory encoding.",
    date: "November 14, 2026",
    readTime: "5 min read",
    category: "Study Methodology",
    icon: BrainCircuit,
    tagColor: "bg-indigo-50 text-indigo-700 border-indigo-200",
  },
  {
    slug: "mastering-stem-quizzes-with-adaptive-ai",
    title: "How Adaptive Difficulty Closes Concept Gaps in High-Stakes STEM Exams",
    excerpt: "Static practice tests test what you already know. Here is how our multi-agent framework pinpoints the exact foundational premise you misinterpreted.",
    date: "November 08, 2026",
    readTime: "7 min read",
    category: "Exam Strategies",
    icon: Sparkles,
    tagColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    slug: "student-data-privacy-india-dpdp-act",
    title: "Understanding Your Rights Under India's Digital Personal Data Protection Act 2023",
    excerpt: "A plain-language breakdown of what educational technology platforms must do to protect minor data, consent logs, and immediate data erasure.",
    date: "October 29, 2026",
    readTime: "6 min read",
    category: "Privacy & Compliance",
    icon: BookOpen,
    tagColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
];

export default function BlogPage() {
  return (
    <PublicPageLayout
      eyebrow="Academic Insights"
      title="The MentorMind Learning Journal"
      subtitle="Research-backed study strategies, cognitive science, and responsible AI engineering for the modern student."
      breadcrumbs={[{ label: "Blog & Insights" }]}
      maxWidth="max-w-6xl"
    >
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {POSTS.map((post, idx) => {
          const Icon = post.icon;
          return (
            <article
              key={idx}
              className="group flex flex-col justify-between rounded-2xl border border-line bg-card p-6 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className={`inline-block rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${post.tagColor}`}>
                    {post.category}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted">
                    <Clock className="h-3 w-3" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                  <Calendar className="h-3 w-3" />
                  <span>{post.date}</span>
                </div>

                <h2 className="mt-3 font-display text-lg font-bold text-ink group-hover:text-indigo-600 transition">
                  {post.title}
                </h2>

                <p className="mt-2 text-xs text-muted leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-line flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600 inline-flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  Read Article <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* Newsletter subscribe */}
      <div className="mt-14 rounded-2xl border border-line bg-surface p-8 text-center max-w-2xl mx-auto">
        <Sparkles className="mx-auto h-8 w-8 text-indigo-600" />
        <h3 className="mt-3 font-display text-lg font-bold text-ink">Subscribe to Weekly Learning Notes</h3>
        <p className="mt-1 text-xs text-muted">
          Actionable exam tips and memory frameworks delivered every Sunday. Zero spam, unsubscribe anytime.
        </p>
        <form onSubmit={(e) => { e.preventDefault(); alert("Subscribed! Thank you for joining."); }} className="mt-5 flex flex-col sm:flex-row gap-2">
          <input
            type="email"
            required
            placeholder="Enter your student email..."
            className="flex-1 rounded-xl border border-line bg-card px-4 py-2.5 text-xs text-ink placeholder:text-muted focus:border-indigo-500 focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition shrink-0"
          >
            Join 12,000+ Readers
          </button>
        </form>
      </div>
    </PublicPageLayout>
  );
}

"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronDown, CircleHelp, Mail, Search } from "lucide-react";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Card, EmptyState } from "@/components/common/ui";
import { cn } from "@/utils";

const FAQ_CATEGORIES = [
  {
    category: "AI & Platform Intelligence",
    items: [
      {
        q: "What AI models power MentorMind AI?",
        a: "MentorMind AI is powered by Google's Gemini models (including Gemini Flash and Flash-Lite) coordinated through an intelligent multi-agent orchestrator. If network connectivity is interrupted, it falls back to a resilient built-in knowledge base.",
      },
      {
        q: "Are the 7 specialist agents really separate services?",
        a: "Yes. In MentorMind AI's architecture, each specialist agent (Doubt Solver, Smart Notes, Quiz Generator, Study Planner, Progress Tracker, Revision Assistant, Learning Resource Recommendation) is an isolated module with its own system prompt, parameter schema, and telemetry hooks.",
      },
      {
        q: "Can the AI hallucinate or generate incorrect answers?",
        a: "While advanced large language models are highly capable, they can occasionally make errors. MentorMind includes step-by-step rationales, source attributions, and active mistake correction. We encourage students to cross-reference primary academic textbooks.",
      },
    ],
  },
  {
    category: "Privacy, Data & Compliance",
    items: [
      {
        q: "How is my personal study data protected?",
        a: "All student data is stored using strict per-user UID isolation in Firebase Realtime Database (/students/{uid}). Only your authenticated credentials can read or write your learning records. We never sell your personal data or train public foundation models on your private notes.",
      },
      {
        q: "Is MentorMind compliant with India's DPDP Act 2023?",
        a: "Yes. MentorMind is designed around the Digital Personal Data Protection Act, 2023. You have complete rights to access, download a JSON copy of all personal telemetry, request corrections, or erase your account permanently.",
      },
      {
        q: "How can I permanently delete my account and data?",
        a: "You can delete your account instantly from Account Settings → Delete Account, or submit an external deletion request at our dedicated public Account Deletion page without needing to contact support.",
      },
    ],
  },
  {
    category: "Quizzes, Notes & Study Features",
    items: [
      {
        q: "Can I upload my own PDF or DOCX lecture slides?",
        a: "Yes! You can upload lecture slides, lab manuals, and syllabus files in PDF, DOCX, or text format in the Smart Notes and Study Materials sections. The platform extracts the text and builds tailored summaries or quizzes.",
      },
      {
        q: "How does the Spaced Repetition Revision Assistant work?",
        a: "When you miss questions during a quiz or rate a topic as difficult, MentorMind automatically schedules reminders at calculated intervals (2 days, 4 days, 7 days) to reinforce memory before the forgetting curve takes effect.",
      },
      {
        q: "Can I use MentorMind offline?",
        a: "The core interface is cached and works as a Progressive Web Application (PWA). If you lose internet access, your locally stored notes and offline knowledge base remain accessible.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({ "0-0": true });

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const filteredCategories = FAQ_CATEGORIES.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        item.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <PublicPageLayout
      eyebrow="Help & Answers"
      title={
        <>
          Frequently Asked <span className="gradient-text">Questions</span>
        </>
      }
      subtitle="Find direct answers about our multi-agent architecture, data privacy standards, and study features."
      breadcrumbs={[{ label: "FAQ" }]}
    >
      <div className="space-y-10 max-w-4xl mx-auto">
        {/* Search input */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-4 top-3.5 h-4 w-4 text-muted" />
          <input
            type="text"
            className="input pl-11"
            placeholder="Search questions (e.g. privacy, quizzes, models, deletion)…"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Categories & Accordions */}
        {filteredCategories.length > 0 ? (
          filteredCategories.map((cat, catIdx) => (
            <div key={cat.category} className="space-y-4">
              <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-brand" />
                {cat.category}
              </h2>
              <div className="space-y-3">
                {cat.items.map((item, itemIdx) => {
                  const itemKey = `${catIdx}-${itemIdx}`;
                  const isOpen = Boolean(openItems[itemKey]);

                  return (
                    <Card key={item.q} className="overflow-hidden border-line">
                      <button
                        type="button"
                        onClick={() => toggleItem(itemKey)}
                        className="flex w-full items-center justify-between gap-4 p-5 text-left transition hover:bg-surface2"
                        aria-expanded={isOpen}
                      >
                        <span className="font-display font-semibold text-sm sm:text-base text-ink">
                          {item.q}
                        </span>
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 text-muted shrink-0 transition-transform duration-200",
                            isOpen && "rotate-180"
                          )}
                        />
                      </button>
                      {isOpen && (
                        <div className="border-t border-line bg-surface2/30 px-5 py-4 text-xs sm:text-sm text-muted leading-relaxed">
                          {item.a}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          <EmptyState
            icon={CircleHelp}
            title="No matching questions found"
            body="Try using different search keywords, or submit an inquiry to our support team."
            action={
              <Link href="/contact" className="btn btn-primary btn-sm">
                Contact Support
              </Link>
            }
          />
        )}

        {/* Still have questions banner */}
        <Card className="p-8 border-line bg-surface2/50 text-center space-y-3">
          <Mail className="h-8 w-8 text-brand mx-auto" />
          <h3 className="font-display text-lg font-bold">Still have questions?</h3>
          <p className="text-xs text-muted max-w-md mx-auto">
            Our support and academic engineering team is available to assist you.
          </p>
          <div className="pt-2">
            <Link href="/contact" className="btn btn-secondary btn-sm">
              Send us an inquiry
            </Link>
          </div>
        </Card>
      </div>
    </PublicPageLayout>
  );
}

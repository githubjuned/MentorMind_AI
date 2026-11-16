"use client";

import { useState } from "react";
import Link from "next/link";
import { PublicPageLayout } from "@/components/public/PublicPageLayout";
import { Search, BookOpen, Sparkles, KeyRound, ShieldAlert, Laptop, ArrowRight, LifeBuoy } from "lucide-react";

const HELP_CATEGORIES = [
  {
    icon: Sparkles,
    title: "Getting Started with MentorMind",
    desc: "How to set up your subjects, take your first quiz, and select the best AI Agent for your curriculum.",
    articles: [
      { title: "Choosing between Socratic Coach, Concept Explainer & Exam Crammer", readTime: "3 min" },
      { title: "Configuring grade level, board (CBSE, ICSE, IB), and study goals", readTime: "2 min" },
      { title: "Using the Interactive Product Tour to master the dashboard", readTime: "2 min" },
    ],
  },
  {
    icon: BookOpen,
    title: "AI Note-Taking & Summaries",
    desc: "Generate concise revision sheets, formula compendiums, and active recall flashcards.",
    articles: [
      { title: "How to export study notes as clean markdown and PDFs", readTime: "4 min" },
      { title: "Fixing AI hallucinations: How our cross-verification engine works", readTime: "5 min" },
      { title: "Organizing notes by subject, unit, and exam priority", readTime: "3 min" },
    ],
  },
  {
    icon: KeyRound,
    title: "Account, Privacy & Passwords",
    desc: "Manage credentials, password resets, multi-device sessions, and privacy rights.",
    articles: [
      { title: "Resetting your password via verified email link", readTime: "2 min" },
      { title: "How to export your complete study history (DPDP compliance)", readTime: "3 min" },
      { title: "Permanent account deletion: What data is purged immediately", readTime: "2 min" },
    ],
  },
  {
    icon: Laptop,
    title: "Device & Offline Support",
    desc: "Optimizing MentorMind for mobile browsers, low-bandwidth networks, and PWA installs.",
    articles: [
      { title: "Installing MentorMind as an Android PWA or Web APK", readTime: "3 min" },
      { title: "Using offline study mode and local caching", readTime: "4 min" },
      { title: "Supported browsers and hardware acceleration recommendations", readTime: "2 min" },
    ],
  },
];

export default function HelpCenterPage() {
  const [search, setSearch] = useState("");

  const filteredCategories = HELP_CATEGORIES.map((cat) => ({
    ...cat,
    articles: cat.articles.filter(
      (a) =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        cat.title.toLowerCase().includes(search.toLowerCase()) ||
        cat.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((cat) => cat.articles.length > 0);

  return (
    <PublicPageLayout
      eyebrow="Knowledge Base"
      title="How can we help you learn today?"
      subtitle="Comprehensive guides, troubleshooting tutorials, and academic workflows for students, educators, and parents."
      breadcrumbs={[{ label: "Help Centre" }]}
      maxWidth="max-w-6xl"
    >
      {/* Search Bar */}
      <div className="relative mx-auto max-w-2xl">
        <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tutorials, error messages, or feature guides..."
          className="w-full rounded-2xl border border-line bg-card py-3.5 pl-12 pr-4 text-sm text-ink shadow-sm placeholder:text-muted focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {/* Categories Grid */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
        {filteredCategories.map((cat, idx) => {
          const Icon = cat.icon;
          return (
            <div key={idx} className="rounded-2xl border border-line bg-card p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg font-bold text-ink">{cat.title}</h2>
                  </div>
                </div>
                <p className="mt-2 text-xs text-muted leading-relaxed">{cat.desc}</p>

                <div className="mt-5 divide-y divide-line">
                  {cat.articles.map((art, aIdx) => (
                    <div key={aIdx} className="py-2.5 flex items-center justify-between text-xs group cursor-pointer">
                      <span className="text-ink group-hover:text-indigo-600 font-medium transition pr-2">
                        {art.title}
                      </span>
                      <span className="shrink-0 text-muted">{art.readTime}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-line">
                <Link
                  href="/faq"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View related FAQs <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Still need help banner */}
      <div className="mt-12 rounded-2xl border border-indigo-200 bg-indigo-50/60 p-8 text-center sm:flex sm:items-center sm:justify-between sm:text-left">
        <div>
          <div className="flex items-center justify-center sm:justify-start gap-2 text-indigo-900 font-bold text-base">
            <LifeBuoy className="h-5 w-5 text-indigo-600" />
            Cannot find what you are looking for?
          </div>
          <p className="mt-1 text-xs text-indigo-800">
            Our student academic support desk is open Monday to Friday, 9am - 6pm IST.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex gap-3 justify-center">
          <Link
            href="/contact"
            className="rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
          >
            Submit Support Ticket
          </Link>
          <Link
            href="/faq"
            className="rounded-xl border border-indigo-300 bg-white px-5 py-2.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-50 transition"
          >
            Browse All FAQs
          </Link>
        </div>
      </div>
    </PublicPageLayout>
  );
}

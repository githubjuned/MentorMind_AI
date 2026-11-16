"use client";

import { useState } from "react";
import { Share2, Link2, Check, MessageCircle } from "lucide-react";

export function SocialShareBar({ title = "MentorMind AI — Personal AI Learning Companion" }: { title?: string }) {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window !== "undefined" ? window.location.href : "https://mentormindai-137a0.web.app";

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareWhatsApp = () => {
    const text = encodeURIComponent(`${title}\nCheck it out here: ${shareUrl}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(title);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(shareUrl)}`, "_blank");
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-xs">
      <span className="font-semibold text-muted flex items-center gap-1.5 mr-1">
        <Share2 className="h-3.5 w-3.5 text-indigo-500" /> Share:
      </span>

      <button
        onClick={shareWhatsApp}
        className="rounded-lg border border-line bg-surface px-2.5 py-1 text-ink hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 transition"
      >
        WhatsApp
      </button>

      <button
        onClick={shareLinkedIn}
        className="rounded-lg border border-line bg-surface px-2.5 py-1 text-ink hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition"
      >
        LinkedIn
      </button>

      <button
        onClick={shareTwitter}
        className="rounded-lg border border-line bg-surface px-2.5 py-1 text-ink hover:bg-slate-100 hover:text-black hover:border-slate-300 transition"
      >
        X (Twitter)
      </button>

      <button
        onClick={handleCopy}
        className="flex items-center gap-1 rounded-lg border border-line bg-surface px-2.5 py-1 text-ink hover:bg-card transition"
      >
        {copied ? (
          <>
            <Check className="h-3 w-3 text-emerald-600" />
            <span className="text-emerald-600 font-semibold">Copied!</span>
          </>
        ) : (
          <>
            <Link2 className="h-3 w-3 text-muted" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}

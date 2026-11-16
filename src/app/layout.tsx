import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./globals.css";
import { AppProvider } from "@/hooks/useApp";
import { ToastProvider } from "@/components/common/ui";
import { CookieBanner } from "@/components/common/CookieBanner";

export const metadata: Metadata = {
  metadataBase: new URL("https://mentormindai-137a0.web.app"),
  title: { default: "MentorMind AI — Your Personal AI Learning Companion", template: "%s · MentorMind AI" },
  description: "A multi-agent AI learning platform: Socratic doubt solving, adaptive quizzes, revision notes, and study planning in one connected workspace.",
  applicationName: "MentorMind AI",
  manifest: "/manifest.json",
  authors: [{ name: "MentorMind AI" }],
  keywords: ["AI tutor", "Socratic learning", "adaptive quizzes", "study notes", "CBSE", "ICSE", "STEM learning", "study companion"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://mentormindai-137a0.web.app",
    siteName: "MentorMind AI",
    title: "MentorMind AI — Your Personal AI Learning Companion",
    description: "Learn smarter with multiple specialized AI agents tailored to your academic syllabus and goals.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MentorMind AI — Your Personal AI Learning Companion",
    description: "Learn smarter with multiple specialized AI agents tailored to your academic syllabus and goals.",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "MentorMind AI",
  },
};
export const viewport: Viewport = { themeColor: "#0a0c16", width: "device-width", initialScale: 1, maximumScale: 5 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppProvider>
          <ToastProvider>
            {children}
            <CookieBanner />
          </ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}

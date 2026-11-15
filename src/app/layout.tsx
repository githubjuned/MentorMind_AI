import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./globals.css";
import { AppProvider } from "@/hooks/useApp";
import { ToastProvider } from "@/components/common/ui";

export const metadata: Metadata = {
  title: { default: "MentorMind AI — Your Personal AI Learning Companion", template: "%s · MentorMind AI" },
  description: "A multi-agent AI learning platform: doubt solving, notes, quizzes, study planning, progress tracking, revision and resource recommendations in one place.",
};
export const viewport: Viewport = { themeColor: "#0a0c16", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <AppProvider>
          <ToastProvider>{children}</ToastProvider>
        </AppProvider>
      </body>
    </html>
  );
}

"use client";
import { type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PublicPageLayoutProps {
  children: ReactNode;
  title?: ReactNode;
  subtitle?: ReactNode;
  eyebrow?: string;
  breadcrumbs?: BreadcrumbItem[];
  maxWidth?: "max-w-2xl" | "max-w-4xl" | "max-w-5xl" | "max-w-6xl" | "max-w-7xl";
}

export function PublicPageLayout({
  children,
  title,
  subtitle,
  eyebrow,
  breadcrumbs,
  maxWidth = "max-w-5xl",
}: PublicPageLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-app">
      <PublicHeader />

      <main className="flex-1">
        {/* Page Hero Header Banner if title is present */}
        {title && (
          <section className="bg-aurora border-b border-line px-5 py-12 sm:px-8 sm:py-16">
            <div className={`mx-auto ${maxWidth}`}>
              {breadcrumbs && breadcrumbs.length > 0 && (
                <nav className="mb-4 flex items-center gap-2 text-xs text-muted" aria-label="Breadcrumb">
                  <Link href="/" className="hover:text-ink transition">
                    Home
                  </Link>
                  {breadcrumbs.map((b, i) => (
                    <span key={i} className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-muted/60" />
                      {b.href ? (
                        <Link href={b.href} className="hover:text-ink transition">
                          {b.label}
                        </Link>
                      ) : (
                        <span className="font-semibold text-ink">{b.label}</span>
                      )}
                    </span>
                  ))}
                </nav>
              )}

              {eyebrow && <p className="eyebrow">{eyebrow}</p>}
              <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                {title}
              </h1>
              {subtitle && <p className="mt-4 max-w-2xl text-base text-muted leading-relaxed">{subtitle}</p>}
            </div>
          </section>
        )}

        {/* Content Container */}
        <div className={`mx-auto ${maxWidth} px-5 py-10 sm:px-8 sm:py-14`}>
          {children}
        </div>
      </main>

      <PublicFooter />
    </div>
  );
}

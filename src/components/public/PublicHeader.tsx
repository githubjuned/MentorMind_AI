"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ArrowRight, LayoutDashboard, Menu, Sparkles, X } from "lucide-react";
import { Logo } from "@/components/common/Logo";
import { useApp } from "@/hooks/useApp";
import { cn } from "@/utils";

const NAV_LINKS = [
  { label: "Features", href: "/features" },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
  { label: "FAQ", href: "/faq" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export function PublicHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { state } = useApp();
  const isLoggedIn = Boolean(state?.session);

  return (
    <header className="glass sticky top-0 z-50 border-b border-line">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        {/* Brand Logo */}
        <Logo href="/" />

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-brand/15 text-ink font-semibold"
                    : "text-muted hover:bg-surface2 hover:text-ink"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="hidden items-center gap-3 lg:flex">
          {isLoggedIn ? (
            <Link href="/dashboard" className="btn btn-primary btn-sm">
              <LayoutDashboard className="h-4 w-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className="btn btn-ghost btn-sm">
                Sign In
              </Link>
              <Link href="/signup" className="btn btn-primary btn-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="rounded-xl p-2 text-muted hover:bg-surface2 hover:text-ink lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="anim-fade-up border-t border-line bg-surface/95 px-5 py-5 backdrop-blur-xl lg:hidden">
          <nav className="grid gap-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={cn(
                "rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface2",
                pathname === "/" ? "bg-brand/15 text-ink font-semibold" : "text-muted"
              )}
            >
              Home
            </Link>
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-surface2",
                  pathname === link.href ? "bg-brand/15 text-ink font-semibold" : "text-muted"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="mt-5 border-t border-line pt-4 grid gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="btn btn-primary w-full justify-center"
              >
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Open Dashboard
              </Link>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-secondary w-full justify-center"
                >
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary w-full justify-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

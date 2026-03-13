"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

interface StickyHeaderProps {
  showAuth?: boolean;
  darkMode?: boolean;
  onToggleDark?: () => void;
  onMenuClick?: () => void;
  user?: { id: string; email: string; role: string } | null;
}

export function StickyHeader({
  showAuth = true,
  darkMode = false,
  onToggleDark,
  onMenuClick,
  user,
}: StickyHeaderProps) {
  const { signOut } = useAuth();
  const router = useRouter();
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="container flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="md:hidden p-2 -ml-2"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-semibold text-lg">
            Zeronova
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="/opportunities" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">
              Opportunities
            </Link>
            <Link href="/events" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">
              Events
            </Link>
            <Link href="/impact-lab" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">
              Impact Lab
            </Link>
            <Link href="/collaboration" className="text-[var(--foreground-secondary)] hover:text-[var(--foreground)]">
              Collaboration
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-2">
          {onToggleDark && (
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-[var(--background-secondary)]"
              onClick={onToggleDark}
              aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          {showAuth &&
            (user ? (
              <>
                <Button variant="ghost" asChild>
                  <Link
                    href={
                      user.role === "admin"
                        ? "/dashboard/admin"
                        : user.role === "ngo"
                        ? "/dashboard/ngo"
                        : "/dashboard/volunteer"
                    }
                  >
                    Dashboard
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={async () => {
                    await signOut();
                    router.push("/");
                    router.refresh();
                  }}
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link href="/login">Login</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ))}
        </div>
      </div>
    </header>
  );
}

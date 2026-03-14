"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Sun, Moon, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";
import { cn } from "@/lib/utils";

interface StickyHeaderProps {
  showAuth?: boolean;
  darkMode?: boolean;
  onToggleDark?: () => void;
  onMenuClick?: () => void;
  user?: { id: string; email: string; role: string } | null;
}

const CATEGORIES = [
  { href: "/", label: "Home" },
  { href: "/opportunities", label: "Opportunities" },
  { href: "/events", label: "Events" },
  { href: "/impact-lab", label: "Impact Lab" },
  { href: "/collaboration", label: "Collaboration" },
];

export function StickyHeader({
  showAuth = true,
  darkMode = false,
  onToggleDark,
  onMenuClick,
  user,
}: StickyHeaderProps) {
  const { signOut } = useAuth();
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full bg-[var(--nav-bg)] text-[var(--nav-foreground)] shadow-md">
      <div className="flex h-14 items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 -ml-1 rounded-lg hover:bg-white/10"
            onClick={onMenuClick}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" className="font-bold text-lg">
            Zeronova
          </Link>
        </div>
        <div className="flex items-center gap-2">
          {onToggleDark && (
            <button
              type="button"
              className="p-2 rounded-lg hover:bg-white/10"
              onClick={onToggleDark}
              aria-label={darkMode ? "Light mode" : "Dark mode"}
            >
              {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          )}
          {showAuth &&
            (user ? (
              <>
                <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 hover:text-white">
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
                <button
                  type="button"
                  className="p-2 rounded-lg hover:bg-white/10"
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild className="text-white hover:bg-white/10 hover:text-white">
                  <Link href="/login">Login</Link>
                </Button>
                <Button size="sm" asChild className="bg-white text-[var(--nav-bg)] hover:bg-white/90">
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ))}
        </div>
      </div>
      <div className="overflow-x-auto hide-scrollbar border-t border-white/10">
        <div className="flex gap-1 px-4 py-2 min-w-max">
          {CATEGORIES.map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                pathname === c.href || (c.href !== "/" && pathname.startsWith(c.href))
                  ? "bg-white text-[var(--nav-bg)]"
                  : "text-white/90 hover:bg-white/10"
              )}
            >
              {c.label}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}

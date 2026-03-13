"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Calendar, CalendarCheck, User, LayoutDashboard, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  role?: "volunteer" | "ngo" | "admin" | null;
}

const volunteerItems = [
  { href: "/opportunities", label: "Opportunities", icon: Heart },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/dashboard/volunteer/events", label: "My Events", icon: CalendarCheck },
  { href: "/dashboard/volunteer", label: "Profile", icon: User },
];

const ngoItems = [
  { href: "/dashboard/ngo", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ngo/opportunities", label: "Opportunities", icon: Heart },
  { href: "/dashboard/ngo/events", label: "Events", icon: Calendar },
  { href: "/dashboard/ngo/inbox", label: "Inbox", icon: MessageCircle },
  { href: "/dashboard/ngo", label: "Profile", icon: User },
];

export function BottomNav({ role }: BottomNavProps) {
  const pathname = usePathname();

  if (!role || role === "admin") return null;

  const items = role === "ngo" ? ngoItems : volunteerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80 md:hidden">
      <div className="flex items-center justify-around h-16 safe-area-pb">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/dashboard/ngo" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 gap-0.5 py-2 text-xs font-medium transition-colors min-w-0",
                isActive ? "text-[var(--accent)]" : "text-[var(--foreground-muted)]"
              )}
            >
              <Icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
              <span className="truncate max-w-full px-1">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Calendar, CalendarCheck, User, LayoutDashboard, MessageCircle, Home } from "lucide-react";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  role?: "volunteer" | "ngo" | "admin" | null;
}

const volunteerItems = [
  { href: "/", label: "Home", icon: Home },
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

  if (!role || role === "admin") {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bg)] text-[var(--nav-foreground)] border-t border-white/10 md:hidden">
        <div className="flex items-center justify-around h-16 safe-area-pb">
          <Link
            href="/"
            className={cn(
              "flex items-center justify-center flex-1 py-2 min-w-0",
              pathname === "/" ? "text-white" : "text-white/70"
            )}
            aria-label="Home"
          >
            <Home className={cn("h-6 w-6", pathname === "/" && "fill-current")} />
          </Link>
          <Link
            href="/opportunities"
            className={cn(
              "flex items-center justify-center flex-1 py-2 min-w-0",
              pathname.startsWith("/opportunities") ? "text-white" : "text-white/70"
            )}
            aria-label="Opportunities"
          >
            <Heart className={cn("h-6 w-6", pathname.startsWith("/opportunities") && "fill-current")} />
          </Link>
          <Link
            href="/events"
            className={cn(
              "flex items-center justify-center flex-1 py-2 min-w-0",
              pathname.startsWith("/events") ? "text-white" : "text-white/70"
            )}
            aria-label="Events"
          >
            <Calendar className={cn("h-6 w-6", pathname.startsWith("/events") && "fill-current")} />
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center flex-1 py-2 min-w-0 text-white/70"
            aria-label="Profile"
          >
            <User className="h-6 w-6" />
          </Link>
        </div>
      </nav>
    );
  }

  const items = role === "ngo" ? ngoItems : volunteerItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[var(--nav-bg)] text-[var(--nav-foreground)] border-t border-white/10 md:hidden">
      <div className="flex items-center justify-around h-16 safe-area-pb">
        {items.map(({ href, label, icon: Icon }) => {
          const isActive =
            pathname === href || (href !== "/dashboard/ngo" && pathname.startsWith(href + "/"));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center justify-center flex-1 py-2 transition-colors min-w-0",
                isActive ? "text-white" : "text-white/70"
              )}
              aria-label={label}
            >
              <Icon className={cn("h-6 w-6", isActive && "stroke-[2.5]")} />
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

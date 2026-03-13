"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, Home, Heart, Calendar, User, MessageCircle, Handshake, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

interface SlideOutSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  role?: "volunteer" | "ngo" | "admin" | null;
}

const volunteerLinks = [
  { href: "/opportunities", label: "Opportunities", icon: Heart },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/dashboard/volunteer/events", label: "My Events", icon: Calendar },
  { href: "/dashboard/volunteer/messages", label: "Messages", icon: MessageCircle },
  { href: "/dashboard/volunteer", label: "Profile", icon: User },
];

const ngoLinks = [
  { href: "/dashboard/ngo", label: "Dashboard", icon: Home },
  { href: "/dashboard/ngo/opportunities", label: "Opportunities", icon: Heart },
  { href: "/dashboard/ngo/events", label: "Events", icon: Calendar },
  { href: "/dashboard/ngo/collaboration", label: "Collaboration", icon: Handshake },
  { href: "/dashboard/ngo/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/ngo/inbox", label: "Inbox", icon: MessageCircle },
  { href: "/dashboard/ngo", label: "Profile", icon: User },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Dashboard", icon: Home },
  { href: "/dashboard/admin/ngos", label: "NGOs", icon: User },
  { href: "/dashboard/admin/events", label: "Events", icon: Calendar },
  { href: "/dashboard/admin/documents", label: "Documents", icon: FileText },
  { href: "/dashboard/admin/inquiries", label: "Inquiries", icon: MessageCircle },
  { href: "/dashboard/admin/ideas", label: "Ideas", icon: Heart },
];

export function SlideOutSidebar({ isOpen, onClose, role }: SlideOutSidebarProps) {
  const pathname = usePathname();

  const links =
    role === "admin" ? adminLinks : role === "ngo" ? ngoLinks : volunteerLinks;

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 transition-opacity md:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 h-full w-72 max-w-[85vw] border-l border-[var(--border)] bg-[var(--background)] shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-[var(--border)] px-4">
          <span className="font-semibold">Menu</span>
          <button
            type="button"
            className="p-2 -mr-2 rounded-lg hover:bg-[var(--background-secondary)]"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === href
                  ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                  : "text-[var(--foreground)] hover:bg-[var(--background-secondary)]"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <Link
              href="/opportunities"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
            >
              Opportunities
            </Link>
            <Link
              href="/events"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
            >
              Events
            </Link>
            <Link
              href="/impact-lab"
              onClick={onClose}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-[var(--foreground-secondary)] hover:bg-[var(--background-secondary)]"
            >
              Impact Lab
            </Link>
          </div>
        </nav>
      </aside>
    </>
  );
}

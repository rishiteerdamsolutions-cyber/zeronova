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
  { href: "/", label: "Home", icon: Home },
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

const publicLinks = [
  { href: "/", label: "Home", icon: Home },
  { href: "/opportunities", label: "Opportunities", icon: Heart },
  { href: "/events", label: "Events", icon: Calendar },
  { href: "/impact-lab", label: "Impact Lab", icon: Heart },
  { href: "/collaboration", label: "Collaboration", icon: Handshake },
];

export function SlideOutSidebar({ isOpen, onClose, role }: SlideOutSidebarProps) {
  const pathname = usePathname();

  const links =
    role === "admin"
      ? adminLinks
      : role === "ngo"
      ? ngoLinks
      : role
      ? volunteerLinks
      : publicLinks;

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
          "fixed top-0 left-0 z-50 h-full w-72 max-w-[85vw] bg-[var(--nav-bg)] text-[var(--nav-foreground)] shadow-xl transition-transform duration-300 ease-in-out md:hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
          <span className="font-bold text-lg">Zeronova</span>
          <button
            type="button"
            className="p-2 -mr-2 rounded-lg hover:bg-white/10"
            onClick={onClose}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex flex-col p-4 gap-1 overflow-y-auto">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === href || (href !== "/dashboard/ngo" && pathname.startsWith(href + "/"))
                  ? "bg-white/20 text-white"
                  : "text-white/90 hover:bg-white/10"
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
          {!role && (
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-white/90 hover:bg-white/10"
              >
                Login
              </Link>
              <Link
                href="/register"
                onClick={onClose}
                className="flex items-center justify-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium bg-white/20 text-white hover:bg-white/30"
              >
                Register
              </Link>
            </div>
          )}
          {role && (
            <div className="mt-4 pt-4 border-t border-white/10">
              <p className="px-3 py-2 text-xs font-semibold text-white/60 uppercase">Explore</p>
              <Link
                href="/opportunities"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/90 hover:bg-white/10"
              >
                Opportunities
              </Link>
              <Link
                href="/events"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/90 hover:bg-white/10"
              >
                Events
              </Link>
              <Link
                href="/impact-lab"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/90 hover:bg-white/10"
              >
                Impact Lab
              </Link>
              <Link
                href="/collaboration"
                onClick={onClose}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/90 hover:bg-white/10"
              >
                Collaboration
              </Link>
            </div>
          )}
        </nav>
      </aside>
    </>
  );
}

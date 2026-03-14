"use client";

import { useState } from "react";
import { StickyHeader } from "./StickyHeader";
import { SlideOutSidebar } from "./SlideOutSidebar";
import { BottomNav } from "./BottomNav";
import { Footer } from "./Footer";
import { QuotationFAB } from "../QuotationFAB";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/lib/auth-context";

interface AppLayoutProps {
  children: React.ReactNode;
  role?: "volunteer" | "ngo" | "admin" | null;
  showAuth?: boolean;
}

export function AppLayout({ children, role: propRole, showAuth = true }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const role = propRole ?? (user?.role as "volunteer" | "ngo" | "admin" | undefined) ?? null;

  return (
    <div className="min-h-screen flex flex-col">
      <StickyHeader
        showAuth={showAuth}
        darkMode={theme === "dark"}
        onToggleDark={toggleTheme}
        onMenuClick={() => setSidebarOpen(true)}
        user={user}
      />
      <SlideOutSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        role={role}
      />
      <main className="flex-1 container px-4 py-6 pb-24 md:pb-6">
        {children}
      </main>
      <Footer />
      <QuotationFAB />
      <BottomNav role={role} />
    </div>
  );
}

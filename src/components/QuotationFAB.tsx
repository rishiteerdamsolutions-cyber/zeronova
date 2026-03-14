"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";

export function QuotationFAB() {
  const pathname = usePathname();
  if (pathname === "/quotation") return null;

  return (
    <Link
      href="/quotation"
      className="fixed bottom-20 right-4 md:bottom-6 z-30 w-14 h-14 rounded-full bg-[var(--accent)] text-white shadow-lg hover:bg-[var(--accent-hover)] hover:scale-105 transition-all flex items-center justify-center"
      aria-label="View quotation"
    >
      <FileText className="h-6 w-6" />
    </Link>
  );
}

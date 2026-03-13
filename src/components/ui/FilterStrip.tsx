"use client";

import { cn } from "@/lib/utils";

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterStripProps {
  options: FilterOption[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
}

export function FilterStrip({ options, activeId, onSelect, className }: FilterStripProps) {
  return (
    <div
      className={cn(
        "flex gap-2 overflow-x-auto pb-2 hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0",
        className
      )}
    >
      {options.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onSelect(id)}
          className={cn(
            "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap",
            activeId === id
              ? "bg-[var(--accent)] text-[var(--accent-foreground)]"
              : "bg-[var(--background-secondary)] text-[var(--foreground-secondary)] hover:bg-[var(--border)]"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

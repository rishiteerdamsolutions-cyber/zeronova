import Link from "next/link";
import { Button } from "./button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-4 text-center",
        className
      )}
    >
      <h3 className="text-lg font-semibold text-[var(--foreground)] mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-[var(--foreground-secondary)] mb-4 max-w-sm">
          {description}
        </p>
      )}
      {(actionLabel && (actionHref || onAction)) && (
        actionHref ? (
          <Button asChild>
            <Link href={actionHref}>{actionLabel}</Link>
          </Button>
        ) : (
          <Button onClick={onAction}>{actionLabel}</Button>
        )
      )}
    </div>
  );
}

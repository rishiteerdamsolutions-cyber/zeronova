import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="container px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/opportunities"
              className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Opportunities
            </Link>
            <Link
              href="/events"
              className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Events
            </Link>
            <Link
              href="/impact-lab"
              className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Impact Lab
            </Link>
            <Link
              href="/collaboration"
              className="text-sm text-[var(--foreground-secondary)] hover:text-[var(--foreground)] transition-colors"
            >
              Collaboration
            </Link>
          </div>
          <p className="text-sm text-[var(--foreground-muted)]">
            © {new Date().getFullYear()} Zeronova. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

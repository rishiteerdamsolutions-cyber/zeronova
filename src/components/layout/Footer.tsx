export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
      <div className="container px-4 py-8">
        <p className="text-sm text-[var(--foreground-muted)] text-center">
          © {new Date().getFullYear()} Zeronova. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

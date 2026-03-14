import fs from "fs";
import path from "path";
import Image from "next/image";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const markdownComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-2xl md:text-3xl font-bold text-[var(--foreground)] border-b border-[var(--border)] pb-3 mb-6">
      {children}
    </h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-xl font-semibold text-[var(--foreground)] mt-10 mb-3 first:mt-0">
      {children}
    </h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-base font-semibold text-[var(--foreground)] mt-5 mb-2">
      {children}
    </h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-[var(--foreground-secondary)] text-[15px] leading-relaxed my-3">
      {children}
    </p>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc pl-6 my-4 space-y-1.5 text-[var(--foreground-secondary)] text-[15px]">
      {children}
    </ul>
  ),
  li: ({ children }: { children?: React.ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => (
    <strong className="font-semibold text-[var(--foreground)]">{children}</strong>
  ),
  hr: () => <hr className="my-8 border-[var(--border)]" />,
  table: ({ children }: { children?: React.ReactNode }) => (
    <div className="overflow-x-auto my-4 rounded-lg border border-[var(--border)]">
      <table className="w-full text-sm">{children}</table>
    </div>
  ),
  thead: ({ children }: { children?: React.ReactNode }) => (
    <thead className="bg-[var(--background-secondary)]">{children}</thead>
  ),
  tbody: ({ children }: { children?: React.ReactNode }) => (
    <tbody className="divide-y divide-[var(--border)]">{children}</tbody>
  ),
  tr: ({ children }: { children?: React.ReactNode }) => (
    <tr className="hover:bg-[var(--background-secondary)]/50 transition-colors">
      {children}
    </tr>
  ),
  th: ({ children }: { children?: React.ReactNode }) => (
    <th className="text-left font-semibold text-[var(--foreground)] px-4 py-3">
      {children}
    </th>
  ),
  td: ({ children }: { children?: React.ReactNode }) => (
    <td className="px-4 py-3 text-[var(--foreground-secondary)] [&_strong]:text-[var(--foreground)] [&_strong]:font-semibold">
      {children}
    </td>
  ),
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-[var(--accent)] pl-4 my-4 italic text-[var(--foreground-secondary)] text-sm">
      {children}
    </blockquote>
  ),
};

export default function QuotationPage() {
  const filePath = path.join(process.cwd(), "QUOTATION_ZERONOVA.md");
  const content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "# Quotation\n\nContent not found.";

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto py-8 md:py-12">
        <article className="bg-[var(--card)] rounded-xl border border-[var(--border)] shadow-sm p-6 md:p-10">
          <header className="flex items-center gap-4 pb-6 mb-6 border-b border-[var(--border)]">
            <Image
              src="/A-logo.png"
              alt="AI Developer India"
              width={56}
              height={56}
              className="rounded-lg object-contain"
            />
            <div>
              <p className="font-semibold text-[var(--foreground)]">AI Developer India</p>
              <p className="text-sm text-[var(--foreground-secondary)]">aideveloperindia@gmail.com · +91 9505009699</p>
            </div>
          </header>
          <div className="quotation-doc [&_.quotation-summary]:bg-[var(--accent)]/5 [&_.quotation-summary]:rounded-lg [&_.quotation-summary]:p-4 [&_.quotation-summary]:my-6 [&_.quotation-summary]:border [&_.quotation-summary]:border-[var(--accent)]/20">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {content}
            </ReactMarkdown>
          </div>
        </article>
        <div className="mt-8 flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

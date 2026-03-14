import fs from "fs";
import path from "path";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";

export default function QuotationPage() {
  const filePath = path.join(process.cwd(), "QUOTATION_ZERONOVA.md");
  const content = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf-8")
    : "# Quotation\n\nContent not found.";

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <div className="[&_h1]:text-2xl [&_h2]:text-xl [&_h2]:mt-8 [&_h3]:text-lg [&_h3]:mt-6 [&_table]:w-full [&_th]:text-left [&_th]:p-2 [&_td]:p-2 [&_tr]:border-b [&_ul]:list-disc [&_ul]:pl-6 [&_p]:my-2 [&_hr]:my-8">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
        <div className="mt-8">
          <Button asChild variant="outline">
            <Link href="/">← Back to Home</Link>
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}

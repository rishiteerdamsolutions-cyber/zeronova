import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Impact Lab | Zeronova",
  description: "Social innovation ideas from our community. Submit and discover ideas for positive change.",
};

export default function ImpactLabLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

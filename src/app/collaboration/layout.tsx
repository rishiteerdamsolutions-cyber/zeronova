import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Collaboration Hub | Zeronova",
  description: "Partnership announcements and shared initiatives from NGOs.",
};

export default function CollaborationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

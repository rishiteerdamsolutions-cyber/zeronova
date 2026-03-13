import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Volunteer Opportunities | Zeronova",
  description: "Find volunteer opportunities from verified NGOs. Teaching, environment, health, and more.",
};

export default function OpportunitiesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

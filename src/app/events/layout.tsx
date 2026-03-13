import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Events & Campaigns | Zeronova",
  description: "Join social events and campaigns. Tree plantation, blood donation, awareness programs.",
};

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

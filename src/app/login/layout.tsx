import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | Zeronova",
  description: "Sign in to Zeronova NGO Collaboration Platform.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

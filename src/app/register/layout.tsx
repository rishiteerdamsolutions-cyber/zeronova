import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Register | Zeronova",
  description: "Create an account as a volunteer or NGO organization.",
};

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

import { AppLayout } from "@/components/layout/AppLayout";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AppLayout showAuth={false}>{children}</AppLayout>;
}

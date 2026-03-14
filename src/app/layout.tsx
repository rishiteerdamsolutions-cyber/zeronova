import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PWAProvider } from "@/components/PWAProvider";
import { AuthProvider } from "@/lib/auth-context";
import { ToastProvider } from "@/lib/toast";

export const metadata: Metadata = {
  title: "Zeronova - NGO Collaboration Platform",
  description: "Discover. Volunteer. Impact. Connect with NGOs and social initiatives.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#1e3a5f",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          <AuthProvider>
            <ToastProvider>
              <PWAProvider>{children}</PWAProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

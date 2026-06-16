// src/app/layout.tsx
// The scaffolder generates this file; this minimal version is enough for the
// challenge. It imports the single Tailwind directive and wraps every page.
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ConferenceHub",
  description: "Book conference rooms.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">{children}</body>
    </html>
  );
}

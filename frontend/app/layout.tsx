import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Blog",
  description: "ポートフォリオブログ",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={geist.className}>
      <body className="min-h-screen bg-white text-zinc-900">{children}</body>
    </html>
  );
}

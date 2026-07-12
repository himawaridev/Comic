import type { Metadata } from "next";
import { Oswald, Poppins } from "next/font/google";
import "./globals.css";
import AppShell from "@/components/layout/AppShell";

const poppins = Poppins({
  variable: "--font-ui",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin", "latin-ext"],
  display: "swap",
});
const oswald = Oswald({ variable: "--font-heading", subsets: ["latin", "latin-ext"], display: "swap" });

export const metadata: Metadata = {
  title: "Truyen Hoan - ung dung doc truyen hien dai",
  description: "Doc truyen chu va comic voi giao dien mobile-first, sach va hien dai.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" data-theme="dark" suppressHydrationWarning>
      <body className={`${poppins.variable} ${oswald.variable}`}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/Context/ThemeContext";
import { SocketProvider } from "@/Context/SocketContext";

// Import use golbal:
import Footer from "@/Footer/Footer";
import Navigation from "@/Navigation/Navigation";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Truyện Hoàn - Trang đọc truyện hay",
  description: "Truyện Hoàn - Trang đọc truyện hay",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${robotoMono.variable}`}>
        <ThemeProvider>
          {/* SocketProvider: Quản lý kết nối socket và realtime updates */}
          <SocketProvider>
            <Navigation />
            <main className="main-content">
              {children}
            </main>
            <Footer />
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}


import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tiny Tales Adventure Bank 🪙 Turn Chores into Magical Adventures!",
  description: "A fun, virtual rewards bank to build lifelong habits for kids. Complete fun quests, earn golden coins, and unlock dream goals. Zero real money, 100% safe.",
};

export const viewport: Viewport = {
  themeColor: "#BAE6FD",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} font-sans h-full`}>
      <body className="min-h-full bg-sky-dream text-slate-800 antialiased flex flex-col justify-start items-center selection:bg-pink-300 selection:text-pink-900">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

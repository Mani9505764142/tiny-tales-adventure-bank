import type { Metadata, Viewport } from "next";
import { Fredoka } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Footer } from "@/components/Footer";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tiny Tales Adventure Bank 🪙 Turn Chores into Magical Adventures!",
  description: "Gamified family banking, 4-jar wealth system, and moral growth. Complete fun quests, earn golden coins, and unlock dream goals. Zero real money, 100% safe.",
  icons: {
    icon: "/icon.svg",
  },
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
        <Providers>
          <div className="w-full flex-1 flex flex-col items-center">
            {children}
          </div>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}

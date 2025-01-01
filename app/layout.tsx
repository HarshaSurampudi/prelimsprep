import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Header } from "@/app/components/header";
import { Footer } from "./components/footer";
import { Providers } from "./providers";
const inter = Inter({ subsets: ["latin"] });
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: {
    default: "PrelimsPrep - UPSC Prelims Practice Platform",
    template: "%s | PrelimsPrep",
  },
  description:
    "Master UPSC Prelims with adaptive practice of Past Year Questions. Access 1000+ previous year questions, track your progress, and improve with our adaptive learning algorithm.",
  keywords: [
    "UPSC",
    "IAS",
    "Prelims",
    "Practice Questions",
    "Previous Year Questions",
    "Civil Services",
    "Exam Preparation",
  ],
  authors: [{ name: "PrelimsPrep" }],
  creator: "PrelimsPrep",
  publisher: "PrelimsPrep",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://prelimsprep.in"),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.className} min-h-screen bg-background dark:bg-gray-800 min-h-screen flex flex-col`}
      >
        <Providers>
          <Header />
          <main className="px-4 sm:px-6 lg:px-8 flex-1">{children}</main>
          <Analytics />
          <SpeedInsights />
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}

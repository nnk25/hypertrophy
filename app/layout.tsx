import "./globals.css";
import type { Metadata } from "next";
import { Inter, Poppins, Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { DesktopSidebar } from "@/components/DesktopSidebar";
import { MobileNavbar } from "@/components/MobileNavbar";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: "Hypertrophy - Your Personal Fitness Coach",
  description: "An AI powered workout trainer that creates personalized workout plans based on your goals and preferences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn("h-full", "antialiased", inter.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-full flex flex-col pb-16 md:pb-0 md:pl-72">
        <DesktopSidebar />
        {children}
        <MobileNavbar />
      </body>
    </html>
  );
}

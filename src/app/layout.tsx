import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Backlos - Closure for Every Applicant",
  description: "B2B SaaS feedback delivery platform. Ensure every applicant to your hackathon, accelerator, job, grant, or fellowship receives highly personalized, AI-generated constructive feedback. No applicant gets ghosted.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased text-brand-text bg-white" suppressHydrationWarning>
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

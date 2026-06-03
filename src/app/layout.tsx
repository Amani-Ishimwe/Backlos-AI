import type { Metadata } from "next";
import Script from "next/script";
import { Space_Grotesk } from "next/font/google";
import { ToastProvider } from "@/components/ui/Toast";
import PendoInitializer from "@/components/PendoInitializer";
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
    <html lang="en" className={`${spaceGrotesk.variable}`}>
      <head>
        <Script id="pendo-install" strategy="beforeInteractive">{`
(function(apiKey){
    (function(p,e,n,d,o){var v,w,x,y,z;o=p[d]=p[d]||{};o._q=o._q||[];
    v=['initialize','identify','updateOptions','pageLoad','track', 'trackAgent'];for(w=0,x=v.length;w<x;++w)(function(m){
    o[m]=o[m]||function(){o._q[m===v[0]?'unshift':'push']([m].concat([].slice.call(arguments,0)));};})(v[w]);
    y=e.createElement(n);y.async=!0;y.src='https://cdn.pendo.io/agent/static/'+apiKey+'/pendo.js';
    z=e.getElementsByTagName(n)[0];z.parentNode.insertBefore(y,z);})(window,document,'script','pendo');
})('25770056-9017-4fc5-8298-6fc988b790f5');
        `}</Script>
      </head>
      <body className="font-sans antialiased text-brand-text bg-white">
        <PendoInitializer />
        {children}
        <ToastProvider />
      </body>
    </html>
  );
}

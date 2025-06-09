import type { Metadata } from "next";
import { StackProvider, StackTheme } from "@stackframe/stack";
import { stackServerApp } from "../stack";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Resynk - Revolutionary Resume Builder",
  description: "Create professional, AI-powered resumes with real-time collaboration, ATS optimization, and beautiful templates. The next-generation resume builder for modern professionals.",
  keywords: ["resume builder", "CV maker", "professional resume", "AI resume", "ATS optimization", "career tools"],
  authors: [{ name: "Resynk Team" }],
  creator: "Resynk",
  publisher: "Resynk",
  openGraph: {
    title: "Resynk - Revolutionary Resume Builder",
    description: "Create professional, AI-powered resumes with real-time collaboration and ATS optimization.",
    url: "https://resynk.dev",
    siteName: "Resynk",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Resynk Resume Builder",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Resynk - Revolutionary Resume Builder",
    description: "Create professional, AI-powered resumes with real-time collaboration and ATS optimization.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      ><StackProvider app={stackServerApp}><StackTheme>
        {children}
      </StackTheme></StackProvider></body>
    </html>
  );
}

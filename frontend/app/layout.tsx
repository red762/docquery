// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "DocQuery Online",
    template: "%s | DocQuery Online",
  },
  description:
    "DocQuery Online is an AI-powered platform that lets students and researchers instantly analyze, summarize, and extract answers from academic PDFs, papers, and notes.",
  keywords: [
    "DocQuery Online",
    "docquery",
    "academic research AI",
    "AI document search",
    "AI PDF analyzer",
    "PDF summarizer",
    "research paper search engine",
    "academic AI assistant",
    "student research tools",
    "university study helper",
    "AI for education",
    "AI document question answering",
    "smart academic search",
    "AI paper summarization",
    "AI-powered learning",
    "academic productivity tools",
    "AI academic search engine",
    "docquery academic AI",
    "research automation tool",
    "academic PDF search and summarize",
  ],
  authors: [{ name: "DocQuery", url: "https://docquery.online" }],
  openGraph: {
    title: "DocQuery Online",
    description:
      "AI-powered academic document search & summarizer. Instantly find answers from your PDFs and research papers.",
    url: "https://docquery.online",
    siteName: "DocQuery Online",
    images: [
      {
        url: "https://docquery.online/og-image.png",
        width: 1200,
        height: 630,
        alt: "DocQuery Online – AI academic document tool",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "DocQuery Online",
    description:
      "Search, analyze and summarize academic documents using AI — fast and free.",
    creator: "@docqueryapp", // optional
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  metadataBase: new URL("https://docquery.online"),
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://docquery.online" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-800`}
      >
        {/* Google Analytics */}
        <Script
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-W94Q4T3H8D"
        />
        <Script id="ga-config" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W94Q4T3H8D', { page_path: window.location.pathname });
          `}
        </Script>

        {/* Structured Data */}
        <Script id="ld-json" type="application/ld+json" strategy="afterInteractive">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "DocQuery Online",
            url: "https://docquery.online",
            potentialAction: {
              "@type": "SearchAction",
              target: "https://docquery.online/search?q={search_term_string}",
              "query-input": "required name=search_term_string",
            },
          })}
        </Script>

     

        {children}
      </body>
    </html>
  );
}

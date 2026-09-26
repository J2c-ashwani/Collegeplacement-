import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const siteUrl = process.env.NEXTAUTH_URL || 'https://collegeplacement-one.vercel.app';

export const viewport: Viewport = {
  themeColor: "#1E40AF",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PlacementConnect — Institutional Campus Placement & Verified Fresher Hiring Infrastructure",
    template: "%s | PlacementConnect",
  },
  description:
    "Institutional campus placement infrastructure connecting colleges, verified corporate employers, and graduating students through progressive interview assurance, 9-dimension readiness evaluation, and auditable placement evidence.",
  keywords: [
    "College Placement Management Software",
    "Campus Placement Software",
    "Placement Management System for Colleges",
    "TPO Software",
    "Training and Placement Software",
    "Campus Recruitment Platform India",
    "College Placement Portal",
    "Fresher Hiring Platform",
    "NAAC Placement Documentation",
    "NIRF Placement Data Software",
    "Progressive Interview Assurance",
  ],
  authors: [{ name: "PlacementConnect Institutional Systems" }],
  creator: "PlacementConnect",
  publisher: "PlacementConnect",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    title: "PlacementConnect — Institutional Campus Placement & Verified Fresher Hiring Infrastructure",
    description:
      "Enterprise placement infrastructure for colleges, corporate employers, and graduating students. Progressive interview assurance, 9-dimension evaluation, and audit-ready evidence.",
    siteName: "PlacementConnect",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlacementConnect — Institutional Campus Placement Infrastructure",
    description:
      "Connecting colleges, verified corporate recruiters, and graduating students with progressive interview assurance and auditable placement evidence.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        "name": "PlacementConnect",
        "applicationCategory": "BusinessApplication, EducationalApplication",
        "operatingSystem": "Web",
        "description":
          "Institutional campus placement infrastructure connecting higher-education colleges, verified corporate employers, and graduating students with progressive interview assurance and auditable placement evidence.",
        "url": siteUrl,
        "offers": {
          "@type": "AggregateOffer",
          "priceCurrency": "INR",
          "lowPrice": "15000",
          "highPrice": "60000",
        },
      },
      {
        "@type": "Organization",
        "name": "PlacementConnect",
        "url": siteUrl,
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "institutional partnerships",
          "areaServed": "IN",
          "availableLanguage": ["English", "Hindi"],
        },
      },
    ],
  };

  return (
    <html
      lang="en"
      style={
        {
          "--font-geist-sans":
            'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          "--font-geist-mono":
            '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        } as React.CSSProperties
      }
      className="h-full antialiased font-sans"
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

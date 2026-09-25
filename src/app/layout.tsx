import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "PlacementConnect — Institutional Placement & Verified Fresher Hiring Infrastructure",
  description:
    "PlacementConnect connects colleges, graduating students, and corporate employers through structured placement operations, readiness assessment, and verified hiring workflows.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}

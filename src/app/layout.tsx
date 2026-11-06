import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@fontsource/instrument-serif";
import "@fontsource/instrument-serif/400-italic.css";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme-provider";
import { SiteHeader } from "@/components/site/header";
import { SiteFooter } from "@/components/site/footer";
import { Toaster } from "pollen-ui";

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
    default: "Pollen UI: React components for Next.js",
    template: "%s | Pollen UI",
  },
  description:
    "An open source React component library for Next.js. Careful typography, spring-based motion, and light and dark themes out of the box.",
  keywords: [
    "Pollen UI",
    "React",
    "Next.js",
    "component library",
    "design system",
    "framer motion",
  ],
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col font-sans">
        {/* Applies the saved accent before first paint so there is no
            flash of default blue on reload. Mirrors applyAccent() in
            src/lib/accent.ts; guarded for blocked storage. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var a=localStorage.getItem("pollen-accent");if(a)document.documentElement.setAttribute("data-accent",a);}catch(e){}})();`,
          }}
        />
        <ThemeProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}

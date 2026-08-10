import type { Metadata, Viewport } from "next";
import { Fredoka, Comfortaa, Grandstander } from "next/font/google";
import { ThemeScript } from "@/components/ThemeScript";
import { BackgroundProvider } from "@/components/BackgroundContext";
import { BackgroundLayer } from "@/components/BackgroundLayer";
import { BackgroundPicker } from "@/components/BackgroundPicker";
import "./globals.css";

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const comfortaa = Comfortaa({
  variable: "--font-comfortaa",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const grandstander = Grandstander({
  variable: "--font-grandstander",
  subsets: ["latin"],
  weight: ["500", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "The Mood Bridge 💕",
  description:
    "A private space to share daily moods and send digital hugs with real-time notifications.",
  icons: {
    icon: "/favicon.ico",
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "The Mood Bridge 💕",
    description: "Share moods and send digital hugs 💕",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fdf2f8" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0a14" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fredoka.variable} ${comfortaa.variable} ${grandstander.variable} h-full`}
      suppressHydrationWarning
    >
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-full font-sans text-foreground antialiased selection:bg-pink-500 selection:text-white">
        <BackgroundProvider>
          <BackgroundLayer />
          <BackgroundPicker />
          <div className="relative z-10">{children}</div>
        </BackgroundProvider>
      </body>
    </html>
  );
}

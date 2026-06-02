import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import { StructuredData } from "@/components/structured-data";
import { absoluteUrl, serviceAreas, serviceNames, siteDescription, siteUrl } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Klickhafen Lokalservice | Haus, Garten & Objektservice Castrop-Rauxel",
    template: "%s | Klickhafen Lokalservice",
  },
  description: siteDescription,
  applicationName: "Klickhafen Lokalservice",
  keywords: [
    "Klickhafen Lokalservice",
    "Hausservice Castrop-Rauxel",
    "Gartenpflege Castrop-Rauxel",
    "Reinigung Castrop-Rauxel",
    "Montage Castrop-Rauxel",
    "Bodenverlegung Castrop-Rauxel",
    "Entrümpelung Castrop-Rauxel",
    ...serviceAreas,
    ...serviceNames,
  ],
  authors: [{ name: "Klickhafen Lokalservice" }],
  creator: "Klickhafen Lokalservice",
  publisher: "Klickhafen Lokalservice",
  category: "Lokaler Dienstleistungsservice",
  alternates: {
    types: {
      "application/ld+json": absoluteUrl("/schema.json"),
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/klickhafen_favicon_512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/klickhafen_favicon_180.png", sizes: "180x180", type: "image/png" }],
    shortcut: "/favicon.ico",
  },
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: "/",
    siteName: "Klickhafen Lokalservice",
    title: "Klickhafen Lokalservice | Haus, Garten & Objektservice Castrop-Rauxel",
    description: siteDescription,
    images: [
      {
        url: "/klickhafen_favicon_512.png",
        width: 512,
        height: 512,
        alt: "Klickhafen Lokalservice Logo",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Klickhafen Lokalservice | Haus, Garten & Objektservice Castrop-Rauxel",
    description: siteDescription,
    images: ["/klickhafen_favicon_512.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="font-sans antialiased">
        <StructuredData />
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}

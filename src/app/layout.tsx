import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { CookieNotice } from "@/components/cookie-notice";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Klickhafen Lokalservice",
  description:
    "Haus, Garten & Objektservice in Castrop-Rauxel und Umgebung: Gartenarbeiten, Reinigung, Montage, Bodenverlegung und Entrümpelung.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <CookieNotice />
      </body>
    </html>
  );
}

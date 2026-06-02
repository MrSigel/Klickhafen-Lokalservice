import type { Metadata } from "next";
import { LandingPage } from "@/components/landing-page";
import { siteDescription } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Haus, Garten & Objektservice Castrop-Rauxel",
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <LandingPage />;
}

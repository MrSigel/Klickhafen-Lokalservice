import { structuredData } from "@/lib/seo";

export function StructuredData() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData()).replace(/</g, "\\u003c"),
      }}
    />
  );
}

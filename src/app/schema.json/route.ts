import { NextResponse } from "next/server";
import { structuredData } from "@/lib/seo";

export function GET() {
  return NextResponse.json(structuredData(), {
    headers: {
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}

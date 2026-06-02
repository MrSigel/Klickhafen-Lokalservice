import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("service_requests")
    .select("*, request_images(*)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: "Anfragen konnten nicht geladen werden." }, { status: 500 });
  }

  return NextResponse.json({ requests: data ?? [] });
}

import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { offerStatuses } from "@/lib/offers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;

  if (!body?.status || !offerStatuses.includes(body.status as (typeof offerStatuses)[number])) {
    return NextResponse.json({ error: "Status ist ungültig." }, { status: 400 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("offers")
    .update({ status: body.status })
    .eq("id", id)
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Status konnte nicht geändert werden." }, { status: 500 });
  }

  return NextResponse.json({ offer: data });
}

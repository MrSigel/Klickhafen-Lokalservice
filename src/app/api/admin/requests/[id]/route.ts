import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const statuses = ["new", "contacted", "offered", "accepted", "completed", "rejected"];

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as { status?: string } | null;

  if (!body?.status || !statuses.includes(body.status)) {
    return NextResponse.json({ error: "Status ist ungültig." }, { status: 400 });
  }

  const { error } = await getSupabaseAdmin()
    .from("service_requests")
    .update({ status: body.status })
    .eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

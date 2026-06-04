import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const statuses = ["new", "contacted", "offered", "accepted", "completed", "rejected"];
const bucketName = "request-images";

function storagePathFromUrl(fileUrl: string) {
  const marker = `/storage/v1/object/public/${bucketName}/`;
  const [, path] = fileUrl.split(marker);

  return path ? decodeURIComponent(path) : "";
}

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

export async function DELETE(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = getSupabaseAdmin();
  const { data: images } = await supabase
    .from("request_images")
    .select("file_url")
    .eq("request_id", id);
  const filePaths = (images ?? [])
    .map((image) => storagePathFromUrl(image.file_url))
    .filter(Boolean);

  if (filePaths.length > 0) {
    await supabase.storage.from(bucketName).remove(filePaths);
  }

  const { data, error } = await supabase
    .from("service_requests")
    .delete()
    .eq("id", id)
    .select("id")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Anfrage konnte nicht gelöscht werden." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

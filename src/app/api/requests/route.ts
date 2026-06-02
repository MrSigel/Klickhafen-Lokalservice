import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

const bucketName = "request-images";

function value(formData: FormData, key: string) {
  const entry = formData.get(key);
  return typeof entry === "string" ? entry.trim() : "";
}

function cleanFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 120);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const salutation = value(formData, "salutation");
    const firstName = value(formData, "firstName");
    const lastName = value(formData, "lastName");
    const phone = value(formData, "phone");
    const email = value(formData, "email");

    if (!firstName || !lastName || !email) {
      return NextResponse.json(
        { error: "Vorname, Name und E-Mail sind Pflichtfelder." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Die E-Mail-Adresse ist ungültig." }, { status: 400 });
    }

    const files = [...formData.getAll("files"), ...formData.getAll("images")].filter(
      (file): file is File => file instanceof File && file.size > 0,
    );

    if (files.length > 5) {
      return NextResponse.json(
        { error: "Bitte maximal 5 Dateien hochladen." },
        { status: 400 },
      );
    }

    const invalidFile = files.find(
      (file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    );

    if (invalidFile) {
      return NextResponse.json(
        { error: "Bitte nur Bilder oder Videos hochladen." },
        { status: 400 },
      );
    }

    const calculatorDataRaw = value(formData, "calculatorData");
    const calculatorData = calculatorDataRaw ? JSON.parse(calculatorDataRaw) : null;
    const supabase = getSupabaseAdmin();
    const fullName = `${firstName} ${lastName}`.trim();

    const { data: serviceRequest, error: insertError } = await supabase
      .from("service_requests")
      .insert({
        salutation: salutation || null,
        first_name: firstName,
        last_name: lastName,
        name: fullName,
        phone,
        email,
        service_type: "Kontaktanfrage",
        description: value(formData, "description") || null,
        calculator_data: calculatorData,
      })
      .select("id")
      .single();

    if (insertError || !serviceRequest) {
      throw insertError ?? new Error("Anfrage konnte nicht gespeichert werden.");
    }

    if (files.length > 0) {
      const imageRows = [];

      for (const file of files) {
        const path = `${serviceRequest.id}/${Date.now()}-${cleanFileName(file.name)}`;
        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(path, file, {
            contentType: file.type || "application/octet-stream",
            upsert: false,
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
        imageRows.push({
          request_id: serviceRequest.id,
          file_url: data.publicUrl,
          file_name: file.name,
          file_type: file.type || "application/octet-stream",
        });
      }

      const { error: imageError } = await supabase.from("request_images").insert(imageRows);

      if (imageError) {
        throw imageError;
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Die Anfrage konnte nicht gesendet werden.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

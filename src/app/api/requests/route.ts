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
    const name = value(formData, "name");
    const phone = value(formData, "phone");
    const serviceType = value(formData, "serviceType");

    if (!name || !phone || !serviceType) {
      return NextResponse.json(
        { error: "Name, Telefon und gewünschte Leistung sind Pflichtfelder." },
        { status: 400 },
      );
    }

    const calculatorDataRaw = value(formData, "calculatorData");
    const calculatorData = calculatorDataRaw ? JSON.parse(calculatorDataRaw) : null;
    const supabase = getSupabaseAdmin();

    const { data: serviceRequest, error: insertError } = await supabase
      .from("service_requests")
      .insert({
        name,
        phone,
        email: value(formData, "email") || null,
        location: value(formData, "location") || null,
        service_type: serviceType,
        description: value(formData, "description") || null,
        desired_date: value(formData, "desiredDate") || null,
        price_type: value(formData, "priceType") || null,
        estimated_price: value(formData, "estimatedPrice") || null,
        calculator_data: calculatorData,
      })
      .select("id")
      .single();

    if (insertError || !serviceRequest) {
      throw insertError ?? new Error("Anfrage konnte nicht gespeichert werden.");
    }

    const files = formData
      .getAll("images")
      .filter((file): file is File => file instanceof File && file.size > 0);

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
      error instanceof Error
        ? error.message
        : "Die Anfrage konnte nicht gesendet werden.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}

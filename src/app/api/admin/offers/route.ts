import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import {
  calculateOfferPrice,
  clampDiscount,
  defaultCreditCheckConsentText,
  defaultOfferNotes,
  generateOfferNumber,
  positiveNumber,
} from "@/lib/offers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function text(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function bool(value: unknown) {
  return value === true || value === "true";
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { data, error } = await getSupabaseAdmin()
    .from("offers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ offers: [] });
  }

  return NextResponse.json({ offers: data ?? [] });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;

  if (!body) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const firstName = text(body.firstName);
  const lastName = text(body.lastName);
  const email = text(body.email);
  const phone = text(body.phone);
  const serviceDescription = text(body.serviceDescription);
  const validUntil = text(body.validUntil);
  const offerDate = text(body.offerDate);
  const specialPrice = positiveNumber(body.specialPrice);
  const netPrice = positiveNumber(body.netPrice);
  const creditCheckRequired = bool(body.creditCheckRequired);
  const submittedCreditCheckConsentText = text(body.creditCheckConsentText);
  const creditCheckConsentText =
    submittedCreditCheckConsentText || (creditCheckRequired ? defaultCreditCheckConsentText : "");
  const creditCheckThreshold = positiveNumber(body.creditCheckThreshold) || 500;

  if (!firstName || !lastName || (!email && !phone) || !serviceDescription || !validUntil) {
    return NextResponse.json({ error: "Bitte füllen Sie alle Pflichtfelder aus." }, { status: 400 });
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Die E-Mail-Adresse ist ungültig." }, { status: 400 });
  }

  if (netPrice <= 0 && specialPrice <= 0) {
    return NextResponse.json({ error: "Bitte geben Sie einen Preis oder Sonderpreis an." }, { status: 400 });
  }

  if (creditCheckRequired && !submittedCreditCheckConsentText) {
    return NextResponse.json(
      { error: "Bitte Einwilligungstext zur Bonitätsprüfung eintragen." },
      { status: 400 },
    );
  }

  const price = calculateOfferPrice({
    netPrice,
    discountPercent: clampDiscount(body.discountPercent),
    specialPrice,
    materialCosts: positiveNumber(body.materialCosts),
    travelCosts: positiveNumber(body.travelCosts),
    disposalCosts: positiveNumber(body.disposalCosts),
    otherCosts: positiveNumber(body.otherCosts),
    vatRate: 19,
  });

  const offerNumber = text(body.offerNumber) || generateOfferNumber();
  const { data, error } = await getSupabaseAdmin()
    .from("offers")
    .insert({
      customer_key: text(body.customerKey) || null,
      request_id: text(body.requestId) || null,
      offer_number: offerNumber,
      salutation: text(body.salutation) || null,
      first_name: firstName,
      last_name: lastName,
      email: email || null,
      phone: phone || null,
      service_category: text(body.serviceCategory) || null,
      service_description: serviceDescription,
      execution_location: text(body.executionLocation) || null,
      planned_date: text(body.plannedDate) || null,
      valid_until: validUntil,
      net_price: netPrice,
      discount_percent: price.discountPercent,
      special_price: specialPrice || null,
      material_costs: positiveNumber(body.materialCosts),
      travel_costs: positiveNumber(body.travelCosts),
      disposal_costs: positiveNumber(body.disposalCosts),
      other_costs: positiveNumber(body.otherCosts),
      vat_rate: price.vatRate,
      gross_total: price.grossTotal,
      payment_type: text(body.paymentType) || null,
      legal_notes: text(body.legalNotes) || defaultOfferNotes,
      credit_check_required: creditCheckRequired,
      credit_check_consent_text: creditCheckRequired ? creditCheckConsentText : null,
      credit_check_threshold: creditCheckThreshold,
      status: "draft",
      created_at: offerDate ? new Date(offerDate).toISOString() : undefined,
    })
    .select("*")
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Angebot konnte nicht gespeichert werden." }, { status: 500 });
  }

  return NextResponse.json({ offer: data });
}

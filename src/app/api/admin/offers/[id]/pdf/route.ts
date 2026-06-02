import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { calculateOfferPrice, formatMoney } from "@/lib/offers";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

type Offer = {
  id: string;
  offer_number: string | null;
  salutation: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  service_category: string | null;
  service_description: string | null;
  execution_location: string | null;
  planned_date: string | null;
  valid_until: string | null;
  net_price: number | null;
  discount_percent: number | null;
  special_price: number | null;
  material_costs: number | null;
  travel_costs: number | null;
  disposal_costs: number | null;
  other_costs: number | null;
  vat_rate: number | null;
  gross_total: number | null;
  payment_type: string | null;
  legal_notes: string | null;
  credit_check_required: boolean | null;
  credit_check_consent_text: string | null;
  credit_check_threshold: number | null;
  status: string | null;
  created_at: string | null;
};

const navy = rgb(0.059, 0.165, 0.239);
const accent = rgb(0.094, 0.78, 0.72);
const muted = rgb(0.39, 0.455, 0.545);
const light = rgb(0.956, 0.973, 0.98);

function dateText(value: string | null | undefined) {
  if (!value) {
    return "-";
  }

  return new Date(value).toLocaleDateString("de-DE");
}

function text(value: string | null | undefined) {
  return value?.trim() || "-";
}

function wrapText(value: string, maxLength: number) {
  const words = value.replace(/\r/g, "").split(/\s+/);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxLength && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Nicht autorisiert." }, { status: 401 });
  }

  const { id } = await context.params;
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase.from("offers").select("*").eq("id", id).single();

  if (error || !data) {
    return NextResponse.json({ error: "Angebot wurde nicht gefunden." }, { status: 404 });
  }

  const offer = data as Offer;
  const pdf = await PDFDocument.create();
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const page = pdf.addPage([595.28, 841.89]);
  const { width } = page.getSize();
  const margin = 48;
  let y = 790;

  try {
    const logoBytes = await readFile(path.join(process.cwd(), "public", "klickhafen_logo_transparent.png"));
    const logo = await pdf.embedPng(logoBytes);
    page.drawImage(logo, { x: margin, y: y - 32, width: 130, height: 42 });
  } catch {
    page.drawText("Klickhafen Lokalservice", { x: margin, y, size: 17, font: bold, color: navy });
  }

  const phone = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@klickhafen.de";
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? "https://klickhafen.net";
  page.drawText("Klickhafen Lokalservice", { x: 355, y, size: 12, font: bold, color: navy });
  page.drawText("Haus, Garten & Objektservice", { x: 355, y: y - 16, size: 9, font: regular, color: muted });
  page.drawText(`E-Mail: ${email}`, { x: 355, y: y - 31, size: 8.5, font: regular, color: muted });
  page.drawText(`Telefon: ${phone || "-"}`, { x: 355, y: y - 45, size: 8.5, font: regular, color: muted });
  page.drawText(`Web: ${site.replace(/^https?:\/\//, "")}`, { x: 355, y: y - 59, size: 8.5, font: regular, color: muted });

  y -= 92;
  page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 1, color: accent });
  y -= 38;
  page.drawText("Angebot", { x: margin, y, size: 26, font: bold, color: navy });
  page.drawText(`Nr. ${text(offer.offer_number)}`, { x: 370, y: y + 8, size: 11, font: bold, color: navy });
  page.drawText(`Datum: ${dateText(offer.created_at)}`, { x: 370, y: y - 8, size: 9, font: regular, color: muted });
  page.drawText(`Gültig bis: ${dateText(offer.valid_until)}`, { x: 370, y: y - 22, size: 9, font: regular, color: muted });

  y -= 38;
  page.drawRectangle({ x: margin, y: y - 82, width: width - margin * 2, height: 82, color: light });
  page.drawText("Kundendaten", { x: margin + 14, y: y - 18, size: 11, font: bold, color: navy });
  const customerName = [offer.salutation, offer.first_name, offer.last_name].filter(Boolean).join(" ");
  page.drawText(customerName || "-", { x: margin + 14, y: y - 36, size: 10, font: regular, color: navy });
  page.drawText(`E-Mail: ${text(offer.email)}`, { x: margin + 14, y: y - 52, size: 9, font: regular, color: muted });
  page.drawText(`Telefon: ${text(offer.phone)}`, { x: margin + 14, y: y - 68, size: 9, font: regular, color: muted });
  page.drawText("Ausführungsort", { x: 335, y: y - 18, size: 11, font: bold, color: navy });
  page.drawText(text(offer.execution_location), { x: 335, y: y - 36, size: 9.5, font: regular, color: navy });

  y -= 118;
  page.drawText("Leistung", { x: margin, y, size: 14, font: bold, color: navy });
  y -= 18;
  page.drawText(`Leistungsbereich: ${text(offer.service_category)}`, { x: margin, y, size: 10, font: regular, color: navy });
  y -= 16;
  page.drawText(`Geplanter Termin / Zeitraum: ${text(offer.planned_date)}`, { x: margin, y, size: 10, font: regular, color: navy });
  y -= 20;
  for (const line of wrapText(text(offer.service_description), 92)) {
    page.drawText(line, { x: margin, y, size: 9.5, font: regular, color: muted });
    y -= 14;
  }

  y -= 14;
  const price = calculateOfferPrice({
    netPrice: offer.net_price ?? 0,
    discountPercent: offer.discount_percent ?? 0,
    specialPrice: offer.special_price ?? 0,
    materialCosts: offer.material_costs ?? 0,
    travelCosts: offer.travel_costs ?? 0,
    disposalCosts: offer.disposal_costs ?? 0,
    otherCosts: offer.other_costs ?? 0,
    vatRate: offer.vat_rate ?? 19,
  });
  page.drawText("Preisübersicht", { x: margin, y, size: 14, font: bold, color: navy });
  y -= 18;
  const rows: Array<[string, string, boolean?]> = [
    ["Netto-Betrag", formatMoney(offer.net_price)],
    ["Materialkosten", formatMoney(offer.material_costs)],
    ["Anfahrtskosten", formatMoney(offer.travel_costs)],
    ["Entsorgungskosten", formatMoney(offer.disposal_costs)],
    ["Sonstige Kosten", formatMoney(offer.other_costs)],
    [`Rabatt ${price.discountPercent ? `${price.discountPercent}%` : ""}`.trim(), price.discountPercent ? `-${formatMoney(price.baseNet - price.discountedNet)}` : "-"],
    [`MwSt ${price.vatRate}%`, formatMoney(price.vatAmount)],
  ];
  for (const [label, value] of rows) {
    page.drawText(label, { x: margin, y, size: 9.5, font: regular, color: muted });
    page.drawText(value, { x: 430, y, size: 9.5, font: regular, color: navy });
    y -= 14;
  }
  if (price.usesSpecialPrice) {
    page.drawRectangle({ x: margin, y: y - 22, width: width - margin * 2, height: 30, color: rgb(0.91, 0.985, 0.97) });
    page.drawText("Sonderpreis final brutto", { x: margin + 10, y: y - 10, size: 10, font: bold, color: navy });
    page.drawText(formatMoney(price.grossTotal), { x: 420, y: y - 10, size: 12, font: bold, color: navy });
    y -= 42;
  } else {
    page.drawLine({ start: { x: margin, y }, end: { x: width - margin, y }, thickness: 0.6, color: accent });
    y -= 18;
    page.drawText("Gesamtbetrag brutto", { x: margin, y, size: 11, font: bold, color: navy });
    page.drawText(formatMoney(price.grossTotal), { x: 420, y, size: 12, font: bold, color: navy });
    y -= 30;
  }
  page.drawText(`Zahlungsart: ${text(offer.payment_type)}`, { x: margin, y, size: 9.5, font: regular, color: muted });

  y -= 26;
  page.drawText("Rechtliche Hinweise / Bedingungen", { x: margin, y, size: 13, font: bold, color: navy });
  y -= 16;
  for (const paragraph of text(offer.legal_notes).split(/\n+/).filter(Boolean)) {
    for (const line of wrapText(paragraph, 103)) {
      if (y < 120) {
        break;
      }
      page.drawText(line, { x: margin, y, size: 8.3, font: regular, color: muted });
      y -= 11;
    }
    y -= 4;
  }

  y = 96;
  page.drawText("Kunde", { x: margin, y, size: 10, font: bold, color: navy });
  page.drawText("Klickhafen Lokalservice", { x: 335, y, size: 10, font: bold, color: navy });
  page.drawLine({ start: { x: margin, y: y - 34 }, end: { x: 240, y: y - 34 }, thickness: 0.8, color: muted });
  page.drawLine({ start: { x: 335, y: y - 34 }, end: { x: 535, y: y - 34 }, thickness: 0.8, color: muted });
  page.drawText("Name, Ort, Datum, Unterschrift", { x: margin, y: y - 48, size: 7.5, font: regular, color: muted });
  page.drawText("Ort, Datum, Unterschrift", { x: 335, y: y - 48, size: 7.5, font: regular, color: muted });

  page.drawLine({ start: { x: margin, y: 34 }, end: { x: width - margin, y: 34 }, thickness: 0.5, color: muted });
  page.drawText("© Klickhafen Lokalservice · Ein Bereich von Klickhafen", { x: margin, y: 22, size: 7.5, font: regular, color: muted });
  page.drawText(`Klickhafen Lokalservice · Castrop-Rauxel und Umgebung · E-Mail: ${email} · Telefon: ${phone || "-"}`, {
    x: margin,
    y: 11,
    size: 7,
    font: regular,
    color: muted,
  });

  if (offer.credit_check_required && offer.credit_check_consent_text) {
    const consentPage = pdf.addPage([595.28, 841.89]);
    let consentY = 790;
    consentPage.drawText("Einwilligung zur Bonitätsprüfung", {
      x: margin,
      y: consentY,
      size: 22,
      font: bold,
      color: navy,
    });
    consentY -= 26;
    consentPage.drawText(`Angebot: ${text(offer.offer_number)}`, {
      x: margin,
      y: consentY,
      size: 10,
      font: regular,
      color: muted,
    });
    consentY -= 18;
    consentPage.drawText(`Kunde: ${customerName || "-"}`, {
      x: margin,
      y: consentY,
      size: 10,
      font: regular,
      color: muted,
    });
    consentY -= 34;
    consentPage.drawRectangle({
      x: margin,
      y: consentY - 260,
      width: width - margin * 2,
      height: 280,
      color: light,
    });
    consentPage.drawText("Einwilligungstext", {
      x: margin + 14,
      y: consentY,
      size: 12,
      font: bold,
      color: navy,
    });
    consentY -= 22;
    for (const paragraph of offer.credit_check_consent_text.split(/\n+/).filter(Boolean)) {
      for (const line of wrapText(paragraph, 98)) {
        consentPage.drawText(line, {
          x: margin + 14,
          y: consentY,
          size: 9.5,
          font: regular,
          color: muted,
        });
        consentY -= 14;
      }
      consentY -= 6;
    }

    consentY = 370;
    consentPage.drawText("Einwilligung Kunde zur Bonitätsprüfung", {
      x: margin,
      y: consentY,
      size: 13,
      font: bold,
      color: navy,
    });
    consentY -= 44;
    consentPage.drawLine({
      start: { x: margin, y: consentY },
      end: { x: 245, y: consentY },
      thickness: 0.8,
      color: muted,
    });
    consentPage.drawLine({
      start: { x: 305, y: consentY },
      end: { x: 545, y: consentY },
      thickness: 0.8,
      color: muted,
    });
    consentPage.drawText("Ort, Datum", { x: margin, y: consentY - 14, size: 8, font: regular, color: muted });
    consentPage.drawText("Name des Kunden, Unterschrift", {
      x: 305,
      y: consentY - 14,
      size: 8,
      font: regular,
      color: muted,
    });
    consentPage.drawLine({ start: { x: margin, y: 34 }, end: { x: width - margin, y: 34 }, thickness: 0.5, color: muted });
    consentPage.drawText("© Klickhafen Lokalservice · Ein Bereich von Klickhafen", {
      x: margin,
      y: 20,
      size: 7.5,
      font: regular,
      color: muted,
    });
  }

  if (offer.status === "draft") {
    await supabase.from("offers").update({ status: "downloaded" }).eq("id", offer.id);
  }

  const bytes = await pdf.save();
  const filename = `angebot-klickhafen-${text(offer.offer_number).replace(/[^a-zA-Z0-9-]/g, "-")}.pdf`;

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}

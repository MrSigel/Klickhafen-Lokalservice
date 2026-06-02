export const offerStatuses = ["draft", "downloaded", "sent", "accepted", "rejected"] as const;

export const defaultOfferNotes = [
  "Dieses Angebot ist unverbindlich bis zur schriftlichen oder digitalen Bestätigung durch den Kunden.",
  "Die Arbeiten beginnen erst nach Bestätigung dieses Angebots.",
  "Benötigtes Material wird entweder vom Kunden bereitgestellt oder nach vorheriger Zahlung durch Klickhafen Lokalservice besorgt. Kassenbon/Rechnung sowie mögliches Rückgeld werden transparent weitergegeben.",
  "Zusätzlicher Aufwand, der vor Ort nicht aus den vorherigen Angaben ersichtlich war, wird vor Ausführung separat abgestimmt.",
  "Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer, sofern nicht anders angegeben.",
].join("\n\n");

export const defaultCreditCheckConsentText =
  "Ich willige ein, dass Klickhafen Lokalservice vor Auftragsbeginn eine Bonitätsprüfung über eine geeignete Auskunftei, z. B. SCHUFA, durchführen darf. Die Prüfung dient ausschließlich der Einschätzung des Zahlungsausfallrisikos für dieses Angebot. Die Einwilligung erfolgt freiwillig und kann jederzeit mit Wirkung für die Zukunft widerrufen werden. Ohne Einwilligung kann Klickhafen Lokalservice alternativ Vorkasse oder eine andere Zahlungsart verlangen.";

export type OfferPriceInput = {
  netPrice: number;
  discountPercent: number;
  specialPrice: number;
  materialCosts: number;
  travelCosts: number;
  disposalCosts: number;
  otherCosts: number;
  vatRate?: number;
};

export function positiveNumber(value: unknown) {
  const parsed = typeof value === "number" ? value : Number(String(value ?? "").replace(",", "."));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

export function clampDiscount(value: unknown) {
  return Math.min(100, Math.max(0, positiveNumber(value)));
}

export function calculateOfferPrice(input: OfferPriceInput) {
  const vatRate = input.vatRate ?? 19;
  const baseNet =
    positiveNumber(input.netPrice) +
    positiveNumber(input.materialCosts) +
    positiveNumber(input.travelCosts) +
    positiveNumber(input.disposalCosts) +
    positiveNumber(input.otherCosts);
  const discountPercent = clampDiscount(input.discountPercent);
  const discountedNet = baseNet * (1 - discountPercent / 100);
  const calculatedGross = discountedNet * (1 + vatRate / 100);
  const specialPrice = positiveNumber(input.specialPrice);
  const grossTotal = specialPrice > 0 ? specialPrice : calculatedGross;

  return {
    vatRate,
    baseNet: roundMoney(baseNet),
    discountPercent,
    discountedNet: roundMoney(discountedNet),
    vatAmount: roundMoney(grossTotal - grossTotal / (1 + vatRate / 100)),
    calculatedGross: roundMoney(calculatedGross),
    grossTotal: roundMoney(grossTotal),
    usesSpecialPrice: specialPrice > 0,
  };
}

export function roundMoney(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function formatMoney(value: number | null | undefined) {
  return `${roundMoney(value ?? 0).toLocaleString("de-DE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} €`;
}

export function generateOfferNumber(date = new Date()) {
  const stamp = date
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, "");
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `KH-${stamp}-${suffix}`;
}

export function dateInputValue(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

export function addDaysInputValue(days: number) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return dateInputValue(date);
}

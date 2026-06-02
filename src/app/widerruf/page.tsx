import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Widerrufsbelehrung von Klickhafen Lokalservice.",
  alternates: {
    canonical: "/widerruf",
  },
};

export default function WiderrufPage() {
  return (
    <LegalPage
      title="Widerrufsbelehrung"
      intro="Informationen zum Widerrufsrecht für Verbraucher."
    >
      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">Widerrufsrecht</h2>
        <p className="leading-7 text-[#425466]">
          Verbraucher haben bei außerhalb von Geschäftsräumen oder über Fernkommunikation
          geschlossenen Verträgen grundsätzlich ein 14-tägiges Widerrufsrecht.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">Dienstleistungen</h2>
        <p className="leading-7 text-[#425466]">
          Wenn der Kunde ausdrücklich verlangt, dass die Dienstleistung vor Ablauf der
          Widerrufsfrist beginnt, kann das Widerrufsrecht bei vollständiger Vertragserfüllung unter
          bestimmten Voraussetzungen erlöschen.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">Arbeitsbeginn</h2>
        <p className="leading-7 text-[#425466]">
          Die Arbeiten beginnen erst nach bestätigtem Angebot und ausdrücklicher Zustimmung.
        </p>
      </section>
    </LegalPage>
  );
}

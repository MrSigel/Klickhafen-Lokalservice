import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Impressum | Klickhafen Lokalservice",
  description: "Impressum von Klickhafen Lokalservice.",
};

const details = {
  company: "Klickhafen Lokalservice",
  owner: "[Inhaber ergänzen]",
  address: "[Adresse ergänzen]",
  email: "kontakt@klickhafen.de",
  phone: "+49 155 63535989",
  vatId: "[USt-ID ergänzen, falls vorhanden]",
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      intro="Diese Seite ist eine Vorlage und sollte vor Veröffentlichung mit den vollständigen Anbieterangaben geprüft und ergänzt werden."
    >
      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">Anbieter</h2>
        <div className="rounded-md border border-[#dbe7ec] bg-[#F4F8FA] p-4 leading-7 text-[#425466]">
          <p>{details.company}</p>
          <p>{details.owner}</p>
          <p>{details.address}</p>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">Kontakt</h2>
        <div className="rounded-md border border-[#dbe7ec] bg-[#F4F8FA] p-4 leading-7 text-[#425466]">
          <p>E-Mail: {details.email}</p>
          <p>Telefon: {details.phone}</p>
        </div>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">Umsatzsteuer-ID</h2>
        <p className="leading-7 text-[#425466]">{details.vatId}</p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">
          Verantwortlich für Inhalte
        </h2>
        <p className="leading-7 text-[#425466]">
          Verantwortlich für die Inhalte dieser Website ist {details.owner}, Anschrift:
          {` ${details.address}`}.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">EU-Streitbeilegung</h2>
        <p className="leading-7 text-[#425466]">
          Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung bereit.
          Der Link kann bei Bedarf ergänzt werden: https://ec.europa.eu/consumers/odr/
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">
          Verbraucherstreitbeilegung
        </h2>
        <p className="leading-7 text-[#425466]">
          Angaben zur Teilnahme an einem Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle sollten vor Veröffentlichung individuell ergänzt werden.
        </p>
      </section>
    </LegalPage>
  );
}

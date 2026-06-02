import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum von Klickhafen Lokalservice.",
  alternates: {
    canonical: "/impressum",
  },
};

const details = {
  company: "Klickhafen Lokalservice",
  owner: "Enrico Gross",
  address: "Gertherstraße 76, 44577 Castrop-Rauxel",
  email: "kontakt@klickhafen.de",
  phone: "+49 155 63535989",
  vatId: "DE278597389",
};

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      intro="Anbieterkennzeichnung nach § 5 Digitale-Dienste-Gesetz (DDG)."
    >
      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">Anbieter</h2>
        <div className="rounded-md border border-[#dbe7ec] bg-[#F4F8FA] p-4 leading-7 text-[#425466]">
          <p>{details.company}</p>
          <p>Inhaber: {details.owner}</p>
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
        <h2 className="text-xl font-black text-[#0F2A3D]">
          Umsatzsteuer-Identifikationsnummer
        </h2>
        <p className="leading-7 text-[#425466]">
          Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz: {details.vatId}
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">
          Verantwortlich für Inhalte
        </h2>
        <p className="leading-7 text-[#425466]">
          Verantwortlich für die Inhalte dieser Website ist {details.owner}, {details.address}.
        </p>
      </section>

      <section className="grid gap-3">
        <h2 className="text-xl font-black text-[#0F2A3D]">
          Verbraucherstreitbeilegung
        </h2>
        <p className="leading-7 text-[#425466]">
          Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer
          Verbraucherschlichtungsstelle teilzunehmen.
        </p>
      </section>
    </LegalPage>
  );
}

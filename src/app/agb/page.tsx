import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "AGB und Angebotsbedingungen | Klickhafen Lokalservice",
  description: "Angebotsbedingungen von Klickhafen Lokalservice.",
};

const terms = [
  {
    title: "Geltungsbereich",
    text: "Diese Angebotsbedingungen gelten als Vorlage für Dienstleistungen rund um Haus, Garten, Reinigung, Montage, Bodenverlegung, Entrümpelung und Objektpflege.",
  },
  {
    title: "Anfrage und Angebot",
    text: "Kunden können über die Website eine Anfrage stellen. Ein Auftrag kommt erst zustande, wenn ein individuelles Angebot bestätigt und ein Termin vereinbart wurde.",
  },
  {
    title: "Unverbindliche Preisschätzung",
    text: "Die im Kostenrechner angezeigten Preise sind unverbindliche Richtwerte. Verbindlich ist nur ein individuell bestätigtes Angebot.",
  },
  {
    title: "Prüfung von Angaben und Dateien",
    text: "Angebote werden auf Basis der übermittelten Angaben, Bilder oder Videos vorbereitet. Falls sich der tatsächliche Aufwand vor Ort anders darstellt, kann eine Anpassung erforderlich sein.",
  },
  {
    title: "Stundenpreis oder Festpreis",
    text: "Je nach Auftrag kann eine Abrechnung nach Aufwand oder ein Festpreis vereinbart werden. Die jeweilige Preisart wird im Angebot festgelegt.",
  },
  {
    title: "Material, Sprinter, Entsorgung und Zusatzkosten",
    text: "Material, Sprinter, Entsorgung, Parkkosten, Sonderfahrten und weitere Zusatzkosten können separat berechnet werden, sofern sie für den Auftrag erforderlich sind.",
  },
  {
    title: "Terminvereinbarung",
    text: "Termine werden individuell abgestimmt. Witterung, Materialverfügbarkeit, Zugang zum Objekt oder unvorhersehbare Umstände können Terminänderungen erforderlich machen.",
  },
  {
    title: "Zahlung und Rechnungsstellung",
    text: "Die Zahlungsbedingungen werden im Angebot oder bei Auftragserteilung vereinbart. Eine Rechnung kann auf Wunsch oder nach Vereinbarung erstellt werden.",
  },
  {
    title: "Mitwirkungspflichten des Kunden",
    text: "Der Kunde stellt sicher, dass die Einsatzstelle zugänglich ist, notwendige Informationen vollständig übermittelt werden und relevante Besonderheiten vor Beginn der Arbeiten mitgeteilt werden.",
  },
  {
    title: "Haftung",
    text: "Die Haftung richtet sich nach den gesetzlichen Vorschriften. Für Schäden, die durch unvollständige Angaben, verdeckte Mängel oder nicht erkennbare Risiken entstehen, sollte die Verantwortlichkeit im Einzelfall geprüft werden.",
  },
  {
    title: "Abnahme der Leistung",
    text: "Nach Abschluss der Arbeiten sollte der Kunde die Leistung prüfen und erkennbare Beanstandungen zeitnah mitteilen, damit eine Klärung erfolgen kann.",
  },
  {
    title: "Stornierung und Terminverschiebung",
    text: "Terminverschiebungen oder Stornierungen sollten möglichst frühzeitig mitgeteilt werden. Bereits entstandene Kosten können nach vorheriger Vereinbarung berücksichtigt werden.",
  },
  {
    title: "Schlussbestimmungen",
    text: "Diese Bedingungen sind eine allgemeine Vorlage und sollten vor Verwendung an das konkrete Geschäftsmodell, die tatsächlichen Abläufe und die rechtlichen Anforderungen angepasst werden.",
  },
];

export default function AgbPage() {
  return (
    <LegalPage
      title="AGB und Angebotsbedingungen"
      intro="Diese Angebotsbedingungen sind eine Vorlage für Kundenanfragen und Angebote. Sie sollten vor Veröffentlichung rechtlich geprüft und an die tatsächliche Arbeitsweise angepasst werden."
    >
      {terms.map((term) => (
        <section key={term.title} className="grid gap-3">
          <h2 className="text-xl font-black text-[#0F2A3D]">{term.title}</h2>
          <p className="leading-7 text-[#425466]">{term.text}</p>
        </section>
      ))}
    </LegalPage>
  );
}

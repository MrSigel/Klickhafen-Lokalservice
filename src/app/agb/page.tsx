import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "AGB und Angebotsbedingungen | Klickhafen Lokalservice",
  description: "Angebotsbedingungen von Klickhafen Lokalservice.",
};

const terms = [
  {
    title: "Geltungsbereich",
    text: "Diese Angebotsbedingungen gelten für Anfragen und Dienstleistungen von Klickhafen Lokalservice, Inhaber Enrico Gross, rund um Haus, Garten, Reinigung, Montage, Bodenverlegung, Entrümpelung und Objektpflege.",
  },
  {
    title: "Anfrage und Angebot",
    text: "Die Anfrage über die Website ist unverbindlich. Ein Vertrag kommt erst zustande, wenn ein individuelles Angebot bestätigt und ein Termin vereinbart wurde.",
  },
  {
    title: "Unverbindliche Preisschätzung",
    text: "Die im Kostenrechner angezeigten Preise sind unverbindliche Richtwerte. Verbindlich ist nur ein individuell bestätigtes Angebot.",
  },
  {
    title: "Prüfung von Angaben und Dateien",
    text: "Angebote werden auf Basis der übermittelten Angaben, Bilder oder Videos vorbereitet. Falls sich der tatsächliche Aufwand vor Ort anders darstellt, kann eine Anpassung des Angebots erforderlich sein.",
  },
  {
    title: "Stundenpreis oder Festpreis",
    text: "Je nach Auftrag kann eine Abrechnung nach Aufwand oder ein Festpreis vereinbart werden. Die jeweilige Preisart wird im bestätigten Angebot festgelegt.",
  },
  {
    title: "Material, Sprinter, Entsorgung und Zusatzkosten",
    text: "Material, Sprinter, Entsorgung, Parkkosten, Sonderfahrten und weitere Zusatzkosten können separat berechnet werden, sofern sie für den Auftrag erforderlich sind und vorher abgestimmt wurden.",
  },
  {
    title: "Terminvereinbarung",
    text: "Termine werden individuell abgestimmt. Witterung, Materialverfügbarkeit, Zugang zum Objekt oder unvorhersehbare Umstände können Terminänderungen erforderlich machen.",
  },
  {
    title: "Zahlung und Rechnungsstellung",
    text: "Die Zahlungsbedingungen ergeben sich aus dem bestätigten Angebot oder der individuellen Vereinbarung. Rechnungen werden mit der dort angegebenen Zahlungsfrist fällig.",
  },
  {
    title: "Mitwirkungspflichten des Kunden",
    text: "Der Kunde stellt sicher, dass die Einsatzstelle zugänglich ist, notwendige Informationen vollständig übermittelt werden und relevante Besonderheiten wie Schäden, sensible Oberflächen, Gefahrenstellen oder Entsorgungsvorgaben vor Beginn der Arbeiten mitgeteilt werden.",
  },
  {
    title: "Haftung",
    text: "Es gelten die gesetzlichen Haftungsregelungen. Für Schäden aus der Verletzung von Leben, Körper oder Gesundheit sowie bei Vorsatz und grober Fahrlässigkeit wird nach den gesetzlichen Vorschriften gehaftet.",
  },
  {
    title: "Abnahme der Leistung",
    text: "Nach Abschluss der Arbeiten sollte der Kunde die Leistung prüfen und erkennbare Beanstandungen zeitnah mitteilen, damit eine Klärung oder Nachbesserung erfolgen kann.",
  },
  {
    title: "Stornierung und Terminverschiebung",
    text: "Terminverschiebungen oder Stornierungen sollten möglichst frühzeitig mitgeteilt werden. Bereits entstandene Kosten können berücksichtigt werden, wenn dies individuell vereinbart wurde oder gesetzlich zulässig ist.",
  },
  {
    title: "Verbraucherstreitbeilegung",
    text: "Wir sind nicht verpflichtet und nicht bereit, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.",
  },
  {
    title: "Schlussbestimmungen",
    text: "Es gilt deutsches Recht. Gesetzliche Verbraucherrechte bleiben unberührt.",
  },
];

export default function AgbPage() {
  return (
    <LegalPage
      title="AGB und Angebotsbedingungen"
      intro="Diese Bedingungen regeln unverbindliche Anfragen, Angebote und die spätere Durchführung vereinbarter Dienstleistungen."
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

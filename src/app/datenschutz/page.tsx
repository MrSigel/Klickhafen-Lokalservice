import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Datenschutz | Klickhafen Lokalservice",
  description: "Datenschutzerklärung von Klickhafen Lokalservice.",
};

const contact = {
  company: "Klickhafen Lokalservice",
  owner: "[Inhaber ergänzen]",
  address: "[Adresse ergänzen]",
  email: "kontakt@klickhafen.de",
  phone: "+49 155 63535989",
};

const sections = [
  {
    title: "Verantwortlicher",
    text: `${contact.company}, ${contact.owner}, ${contact.address}. Kontakt: ${contact.email}, ${contact.phone}.`,
  },
  {
    title: "Hosting und Server-Logs",
    text: "Die Website wird als Web Service über Render.com bereitgestellt. Beim Aufruf der Website können technisch notwendige Server-Logs verarbeitet werden, zum Beispiel IP-Adresse, Zeitpunkt, angefragte Seite, Browserinformationen und technische Statuscodes. Diese Verarbeitung dient dem sicheren und stabilen Betrieb der Website.",
  },
  {
    title: "Supabase als Backend, Datenbank und Storage",
    text: "Für Kontaktanfragen, Datenbankfunktionen und Datei-Uploads wird Supabase genutzt. Supabase kann die übermittelten Formulardaten und hochgeladenen Dateien im Auftrag des Websitebetreibers verarbeiten und speichern.",
  },
  {
    title: "Kontaktformular und Datei-Uploads",
    text: "Wenn Sie das Kontaktformular nutzen, werden die von Ihnen eingegebenen Daten wie Anrede, Vorname, Name, Telefonnummer, E-Mail-Adresse und Beschreibung verarbeitet. Zusätzlich können Bilder oder Videos hochgeladen werden. Diese Dateien werden nur zur Einschätzung Ihres Anliegens und zur Angebotserstellung genutzt.",
  },
  {
    title: "Zwecke und Rechtsgrundlagen",
    text: "Die Verarbeitung erfolgt zur Bearbeitung Ihrer Anfrage, zur Kommunikation, zur Angebotserstellung und zur Durchführung vorvertraglicher oder vertraglicher Maßnahmen. Als Rechtsgrundlagen kommen insbesondere Art. 6 Abs. 1 lit. b DSGVO und Art. 6 Abs. 1 lit. f DSGVO in Betracht.",
  },
  {
    title: "Speicherdauer",
    text: "Kontaktanfragen und Dateien werden nur so lange gespeichert, wie es für die Bearbeitung, Angebotserstellung, Vertragsdurchführung oder gesetzliche Aufbewahrungspflichten erforderlich ist. Nicht mehr benötigte Daten sollten regelmäßig gelöscht werden.",
  },
  {
    title: "Empfänger und Dienstleister",
    text: "Eine Weitergabe kann an technische Dienstleister wie Render.com und Supabase erfolgen, soweit dies für Betrieb, Speicherung und Bearbeitung notwendig ist. Eine Weitergabe zu Werbezwecken ist nicht vorgesehen.",
  },
  {
    title: "Cookies und lokale Speicherung",
    text: "Aktuell sind keine Analyse-, Tracking- oder Marketing-Cookies vorgesehen. Technisch notwendige Verarbeitung kann für Betrieb, Sicherheit und Formularfunktionen erforderlich sein. Ein optionaler Cookie-Hinweis wird nur angezeigt, wenn er über die Umgebungsvariable aktiviert wird.",
  },
  {
    title: "WhatsApp-Kontakt",
    text: "Wenn Sie den WhatsApp-Button nutzen, verlassen Sie diese Website und kommunizieren über WhatsApp. Dabei gelten zusätzlich die Datenschutzbedingungen des jeweiligen Anbieters. Bitte übermitteln Sie über WhatsApp nur Angaben, die für Ihr Anliegen notwendig sind.",
  },
  {
    title: "Rechte betroffener Personen",
    text: "Sie können im Rahmen der gesetzlichen Voraussetzungen Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch verlangen. Zudem können Sie eine erteilte Einwilligung mit Wirkung für die Zukunft widerrufen.",
  },
  {
    title: "Beschwerderecht",
    text: "Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen Datenschutzrecht verstößt.",
  },
];

export default function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Diese Datenschutzerklärung ist eine Vorlage und sollte vor Veröffentlichung rechtlich geprüft und an die tatsächliche Nutzung angepasst werden."
    >
      {sections.map((section) => (
        <section key={section.title} className="grid gap-3">
          <h2 className="text-xl font-black text-[#0F2A3D]">{section.title}</h2>
          <p className="leading-7 text-[#425466]">{section.text}</p>
        </section>
      ))}
    </LegalPage>
  );
}

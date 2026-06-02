import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Datenschutz",
  description: "Datenschutzerklärung von Klickhafen Lokalservice.",
  alternates: {
    canonical: "/datenschutz",
  },
};

const contact = {
  company: "Klickhafen Lokalservice",
  owner: "Enrico Gross",
  address: "Gertherstraße 76, 44577 Castrop-Rauxel",
  email: "kontakt@klickhafen.de",
  phone: "+49 155 63535989",
};

const sections = [
  {
    title: "Verantwortlicher",
    text: `${contact.company}, Inhaber ${contact.owner}, ${contact.address}. Kontakt: ${contact.email}, ${contact.phone}.`,
  },
  {
    title: "Hosting und Server-Logs",
    text: "Diese Website wird als Web Service über Render.com bereitgestellt. Beim Aufruf der Website können technisch notwendige Server-Logs verarbeitet werden, zum Beispiel IP-Adresse, Datum und Uhrzeit des Zugriffs, angefragte Seite, Referrer-URL, Browser- und Betriebssysteminformationen sowie technische Statuscodes. Die Verarbeitung erfolgt zur sicheren und stabilen Bereitstellung der Website auf Grundlage von Art. 6 Abs. 1 lit. f DSGVO.",
  },
  {
    title: "Supabase als Backend, Datenbank und Storage",
    text: "Für Kontaktanfragen, Datenbankfunktionen und Datei-Uploads wird Supabase genutzt. Supabase verarbeitet und speichert die übermittelten Formulardaten und hochgeladenen Dateien als technischer Dienstleister. Dazu können Kontaktdaten, Beschreibungstexte, Statusangaben, Preisschätzungen aus dem Kostenrechner sowie hochgeladene Bilder oder Videos gehören.",
  },
  {
    title: "Kontaktformular und Datei-Uploads",
    text: "Wenn Sie das Kontaktformular nutzen, verarbeiten wir Anrede, Vorname, Name, Telefonnummer, E-Mail-Adresse, Beschreibung und optional hochgeladene Bilder oder Videos. Diese Daten werden zur Bearbeitung Ihrer Anfrage, zur Einschätzung des Aufwands, zur Angebotserstellung und zur Kommunikation mit Ihnen genutzt. Rechtsgrundlagen sind Art. 6 Abs. 1 lit. b DSGVO für vorvertragliche Maßnahmen und Art. 6 Abs. 1 lit. f DSGVO für eine effiziente Bearbeitung von Anfragen.",
  },
  {
    title: "Kostenrechner",
    text: "Der Kostenrechner erzeugt eine unverbindliche Orientierung auf Basis Ihrer Auswahl. Wenn Sie die Einschätzung in das Kontaktformular übernehmen, können Leistung, Zusatzarbeiten, Aufwand, Entfernung und Preisspanne zusammen mit Ihrer Anfrage gespeichert werden.",
  },
  {
    title: "Adminbereich und technisch notwendige Cookies",
    text: "Für den geschützten Adminbereich wird nach erfolgreicher Anmeldung ein technisch notwendiger HTTP-only-Cookie mit dem Namen kh_admin gesetzt. Dieser dient ausschließlich der Authentifizierung im Adminbereich und läuft nach spätestens acht Stunden ab. Der Cookie-Banner speichert die Bestätigung des Hinweises im lokalen Speicher Ihres Browsers unter kh_cookie_notice, damit der Hinweis nicht bei jedem Seitenaufruf erneut angezeigt wird.",
  },
  {
    title: "Cookies, lokale Speicherung und Tracking",
    text: "Auf dieser Website sind derzeit keine Analyse-, Tracking- oder Marketing-Cookies eingebunden. Es werden keine Google-Analytics-, Meta-Pixel- oder vergleichbaren Tracking-Skripte geladen. Technisch notwendige Speicherung ist nach § 25 Abs. 2 TDDDG zulässig, soweit sie für einen ausdrücklich gewünschten digitalen Dienst erforderlich ist.",
  },
  {
    title: "WhatsApp-Kontakt",
    text: "Wenn Sie den WhatsApp-Button nutzen, verlassen Sie diese Website und kommunizieren über WhatsApp. Dabei gelten zusätzlich die Datenschutzbedingungen von WhatsApp. Bitte übermitteln Sie über WhatsApp nur Angaben, die für Ihr Anliegen notwendig sind.",
  },
  {
    title: "Empfänger und Dienstleister",
    text: "Empfänger personenbezogener Daten können technische Dienstleister wie Render.com und Supabase sein, soweit dies für Hosting, Speicherung, Sicherheit und Bearbeitung notwendig ist. Eine Weitergabe zu Werbe- oder Trackingzwecken findet nicht statt.",
  },
  {
    title: "Speicherdauer",
    text: "Kontaktanfragen und Dateien werden nur so lange gespeichert, wie es für Bearbeitung, Angebotserstellung, Vertragsdurchführung, Nachweiszwecke oder gesetzliche Aufbewahrungspflichten erforderlich ist. Nicht mehr benötigte Daten werden gelöscht.",
  },
  {
    title: "Rechte betroffener Personen",
    text: "Sie haben im Rahmen der gesetzlichen Voraussetzungen Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch. Soweit eine Verarbeitung auf Einwilligung beruht, können Sie diese mit Wirkung für die Zukunft widerrufen.",
  },
  {
    title: "Beschwerderecht",
    text: "Sie haben das Recht, sich bei einer Datenschutzaufsichtsbehörde zu beschweren, wenn Sie der Ansicht sind, dass die Verarbeitung Ihrer personenbezogenen Daten gegen Datenschutzrecht verstößt.",
  },
  {
    title: "Stand",
    text: "Stand dieser Datenschutzerklärung: 02.06.2026.",
  },
];

export default function DatenschutzPage() {
  return (
    <LegalPage
      title="Datenschutzerklärung"
      intro="Diese Datenschutzerklärung informiert über die Verarbeitung personenbezogener Daten auf dieser Website."
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

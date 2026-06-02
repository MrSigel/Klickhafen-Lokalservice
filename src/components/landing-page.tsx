"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const services = {
  Gartenarbeiten: [
    "Rasen mähen",
    "Hecke schneiden",
    "Unkraut entfernen",
    "Grünschnitt entsorgen",
    "Pool reinigen",
    "regelmäßige Pflege",
  ],
  Reinigung: [
    "Fensterreinigung",
    "Treppenhausreinigung",
    "Grundreinigung",
    "Gebäudereinigung",
    "Objektpflege",
  ],
  Montage: [
    "Möbelmontage",
    "Küchenmontage",
    "Regale montieren",
    "Schränke aufbauen",
    "Sonstige Montage",
  ],
  Bodenverlegung: [
    "Laminat verlegen",
    "Klick-Vinyl verlegen",
    "PVC verlegen",
    "alten Boden entfernen",
    "Sockelleisten montieren",
  ],
  Entrümpelung: [
    "Keller",
    "Garage",
    "Dachboden",
    "Wohnung",
    "Abtransport",
    "Sprinter benötigt",
    "Entsorgung benötigt",
  ],
};

const effort = {
  Klein: { hours: "2-3 Stunden", min: 2, max: 3 },
  Mittel: { hours: "4-6 Stunden", min: 4, max: 6 },
  Groß: { hours: "7-10 Stunden", min: 7, max: 10 },
};

const distances = {
  "Bis 5 km": { fee: 0, label: "0 €" },
  "5-15 km": { fee: 15, label: "15 €" },
  "15-25 km": { fee: 30, label: "30 €" },
  "25-35 km": { fee: 45, label: "45 €" },
  "Mehr als 35 km": { fee: null, label: "nach Absprache" },
};

const statusText = {
  idle: "",
  loading: "Anfrage wird gesendet...",
  success: "Vielen Dank. Wir prüfen Ihre Anfrage und melden uns mit einem passenden Angebot.",
};

const serviceCards = [
  {
    icon: "garden",
    title: "Garten & Außenbereich",
    text: "Gepflegte Außenflächen für private Haushalte, Mietobjekte und Gewerbe.",
    items: [
      "Gartenpflege",
      "Rasen mähen",
      "Hecken schneiden",
      "Unkraut entfernen",
      "Sommer- & Winterpflege",
      "Poolreinigung",
      "regelmäßige Pflege möglich",
    ],
  },
  {
    icon: "cleaning",
    title: "Reinigung",
    text: "Saubere Treppenhäuser, Fenster und Objekte mit planbarer Ausführung.",
    items: [
      "Fensterreinigung",
      "Gebäudereinigung",
      "Treppenhausreinigung",
      "Grundreinigung",
      "Objektpflege",
    ],
  },
  {
    icon: "tools",
    title: "Montage & Innenausbau",
    text: "Montagearbeiten, Küchenaufbau und Bodenverlegung aus einer Hand.",
    items: [
      "Möbelmontage",
      "Küchenmontage",
      "Laminat verlegen",
      "Klick-Vinyl verlegen",
      "PVC verlegen",
    ],
  },
  {
    icon: "transport",
    title: "Entrümpelung & Transport",
    text: "Räumen, sortieren und abtransportieren mit Sprinter nach Bedarf.",
    items: [
      "Keller entrümpeln",
      "Garage entrümpeln",
      "Dachboden entrümpeln",
      "Wohnung räumen",
      "Abtransport",
      "Sprinter nach Bedarf",
    ],
  },
];

const timelineSteps = [
  {
    title: "Leistung auswählen",
    text: "Sie wählen den passenden Bereich und beschreiben kurz den Auftrag.",
  },
  {
    title: "Preis einschätzen",
    text: "Der Rechner gibt eine erste Orientierung nach Aufwand.",
  },
  {
    title: "Bilder senden",
    text: "Fotos helfen, Umfang, Material und Entsorgung besser zu bewerten.",
  },
  {
    title: "Angebot erhalten",
    text: "Sie bekommen ein transparentes Angebot nach Prüfung Ihrer Angaben.",
  },
  {
    title: "Termin vereinbaren",
    text: "Der passende Termin wird flexibel abgestimmt.",
  },
  {
    title: "Erledigen lassen",
    text: "Der Auftrag wird zuverlässig vor Ort ausgeführt.",
  },
];

const careCards = [
  {
    title: "Wöchentlich",
    text: "Für regelmäßige Garten- und Objektpflege.",
  },
  {
    title: "Monatlich",
    text: "Für Reinigung, Außenbereiche und kleinere Pflegearbeiten.",
  },
  {
    title: "Saisonal",
    text: "Für Sommer- und Winterpflege.",
  },
  {
    title: "Jährlich",
    text: "Für planbare Objekt- und Grundstückspflege.",
  },
];

type ServiceKey = keyof typeof services;
type EffortKey = keyof typeof effort;
type DistanceKey = keyof typeof distances;

type FormState = {
  salutation: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  description: string;
  accepted: boolean;
};

const emptyForm: FormState = {
  salutation: "Herr",
  firstName: "",
  lastName: "",
  phone: "",
  email: "",
  description: "",
  accepted: false,
};

function formatEuro(value: number) {
  return `${Math.round(value)} €`;
}

export function LandingPage() {
  const [selectedService, setSelectedService] = useState<ServiceKey>("Gartenarbeiten");
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["Rasen mähen"]);
  const [selectedEffort, setSelectedEffort] = useState<EffortKey>("Mittel");
  const [selectedDistance, setSelectedDistance] = useState<DistanceKey>("Bis 5 km");
  const [wizardStep, setWizardStep] = useState(1);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [submitState, setSubmitState] = useState<keyof typeof statusText>("idle");
  const [error, setError] = useState("");
  const [fileError, setFileError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const reduceMotion = useReducedMotion();
  const buttonMotion = reduceMotion
    ? {}
    : {
        whileHover: { scale: 1.03 },
        whileTap: { scale: 0.97 },
      };
  const cardMotion = reduceMotion
    ? {}
    : {
        whileHover: { y: -4 },
        transition: { duration: 0.18 },
      };
  const sectionMotion = reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.16 },
        transition: { duration: 0.45 },
      };

  const estimate = useMemo(() => {
    const selected = effort[selectedEffort];
    const distance = distances[selectedDistance];
    const travelFee = distance.fee ?? 0;
    const min = selected.min * 23.8 + travelFee;
    const max = selected.max * 23.8 + travelFee;
    const fixed = max * 0.85;
    const travelNote =
      distance.fee === null
        ? "Anfahrt ab PLZ 44577 nach Absprache"
        : `Anfahrt ab PLZ 44577: ${distance.label}`;

    return {
      range: `ca. ${formatEuro(min)}-${formatEuro(max)}`,
      fixed: `ab ${formatEuro(fixed)}`,
      effortText: `Aufwand ca. ${selected.hours}`,
      travelNote,
      full: `Unverbindliche Schätzung: ca. ${formatEuro(min)}-${formatEuro(max)} | Festpreis-Vorteil: ab ${formatEuro(fixed)} | ${travelNote}`,
    };
  }, [selectedEffort, selectedDistance]);

  function toggleExtra(extra: string) {
    setSelectedExtras((current) =>
      current.includes(extra) ? current.filter((item) => item !== extra) : [...current, extra],
    );
  }

  function changeService(service: ServiceKey) {
    setSelectedService(service);
    setSelectedExtras([services[service][0]]);
  }

  function applyEstimate() {
    const summary = [
      "Preisschätzung aus dem Kostenrechner:",
      `Leistung: ${selectedService}`,
      selectedExtras.length ? `Zusatzarbeiten: ${selectedExtras.join(", ")}` : "",
      `Aufwand: ${selectedEffort} (${estimate.effortText})`,
      `Entfernung ab PLZ 44577: ${selectedDistance}`,
      `Preisschätzung: ${estimate.range}`,
      `Festpreis-Schätzung: ${estimate.fixed}`,
      estimate.travelNote,
    ]
      .filter(Boolean)
      .join("\n");

    setForm((current) => ({
      ...current,
      description: current.description ? `${current.description}\n\n${summary}` : summary,
    }));

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function updateFiles(selectedFiles: FileList | null) {
    setFileError("");
    const nextFiles = Array.from(selectedFiles ?? []);

    if (nextFiles.length > 5) {
      setFiles([]);
      setFileError("Bitte maximal 5 Dateien hochladen.");
      return;
    }

    const invalid = nextFiles.find(
      (file) => !file.type.startsWith("image/") && !file.type.startsWith("video/"),
    );

    if (invalid) {
      setFiles([]);
      setFileError("Bitte nur Bilder oder Videos hochladen.");
      return;
    }

    setFiles(nextFiles);
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.accepted) {
      setError("Bitte füllen Sie Vorname, Name und E-Mail aus und bestätigen Sie die Kontaktanfrage.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    if (files.length > 5 || fileError) {
      setError(fileError || "Bitte maximal 5 Dateien hochladen.");
      return;
    }

    setSubmitState("loading");
    const data = new FormData();
    data.append("salutation", form.salutation);
    data.append("firstName", form.firstName);
    data.append("lastName", form.lastName);
    data.append("phone", form.phone);
    data.append("email", form.email);
    data.append("description", form.description);
    data.append(
      "calculatorData",
      JSON.stringify({
        service: selectedService,
        extras: selectedExtras,
        effort: selectedEffort,
        distance: selectedDistance,
        estimate,
      }),
    );
    files.forEach((file) => data.append("files", file));

    const response = await fetch("/api/requests", {
      method: "POST",
      body: data,
    });
    const result = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      setSubmitState("idle");
      setError(result?.error ?? "Die Anfrage konnte nicht gesendet werden.");
      return;
    }

    setSubmitState("success");
    setForm(emptyForm);
    setFiles([]);
  }

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "4915563535989";
  const canGoNext =
    wizardStep === 1 ||
    wizardStep === 3 ||
    wizardStep === 4 ||
    (wizardStep === 2 && selectedExtras.length > 0);

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#10212E]">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <motion.a
            href="#start"
            aria-label="Klickhafen Lokalservice"
            className="group flex min-w-0 items-center"
            {...(reduceMotion ? {} : { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } })}
          >
            <img
              src="/klickhafen_logo_transparent.png"
              alt="Klickhafen"
              className="h-11 w-auto max-w-[168px] object-contain transition duration-200 group-hover:scale-[1.04] group-hover:drop-shadow-[0_8px_16px_rgba(15,42,61,0.18)] sm:h-12 sm:max-w-[220px]"
            />
          </motion.a>
          <div className="hidden items-center gap-7 text-sm font-bold text-[#0F2A3D] md:flex">
            <a className="transition hover:text-[#18C7B8]" href="#leistungen">
              Leistungen
            </a>
            <a className="transition hover:text-[#18C7B8]" href="#ablauf">
              Ablauf
            </a>
            <a className="transition hover:text-[#18C7B8]" href="#kostenrechner">
              Kostenrechner
            </a>
            <a className="transition hover:text-[#18C7B8]" href="#anfrage">
              Anfrage
            </a>
          </div>
          <motion.a
            href="#anfrage"
            className="shrink-0 rounded-md bg-[#18C7B8] px-5 py-3 text-sm font-extrabold text-[#0F2A3D] shadow-[0_10px_24px_rgba(24,199,184,0.28)] transition hover:bg-[#15b6a8]"
            {...buttonMotion}
          >
            <span className="sm:hidden">Anfrage</span>
            <span className="hidden sm:inline">Kostenlose Anfrage</span>
          </motion.a>
        </nav>
      </header>

      <main id="start">
        <motion.section
          className="relative overflow-hidden border-b border-[#dbe7ec] bg-[linear-gradient(135deg,#F4F8FA_0%,#FFFFFF_48%,#E9F7F6_100%)]"
          {...sectionMotion}
        >
          <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(90deg,rgba(15,42,61,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(15,42,61,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-5xl text-center">
              <p className="mb-5 inline-flex rounded-md border border-[#cce8e7] bg-white/85 px-4 py-2 text-sm font-extrabold text-[#0F2A3D] shadow-sm">
                Castrop-Rauxel · Dortmund · Herne · Bochum
              </p>
              <h1 className="mx-auto max-w-5xl text-4xl font-black leading-[1.06] tracking-tight text-[#0F2A3D] sm:text-5xl lg:text-6xl">
                Haus, Garten & Objektservice rund um Castrop-Rauxel
              </h1>
              <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-[#425466] sm:text-xl">
                Klickhafen Lokalservice übernimmt Gartenpflege, Reinigung, Montage,
                Bodenverlegung, Entrümpelung und regelmäßige Objektpflege in Castrop-Rauxel,
                Dortmund, Herne und Bochum.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <motion.a
                  href="#anfrage"
                  className="relative overflow-hidden rounded-md bg-[#0F2A3D] px-7 py-4 text-center text-base font-extrabold text-white shadow-[0_18px_40px_rgba(15,42,61,0.22)] transition hover:bg-[#14354d]"
                  {...(reduceMotion
                    ? buttonMotion
                    : {
                        ...buttonMotion,
                        animate: {
                          boxShadow: [
                            "0 18px 40px rgba(15,42,61,0.22)",
                            "0 18px 42px rgba(24,199,184,0.42)",
                            "0 18px 40px rgba(15,42,61,0.22)",
                          ],
                        },
                        transition: {
                          duration: 2.4,
                          repeat: Infinity,
                          ease: "easeInOut",
                        },
                      })}
                >
                  {!reduceMotion ? (
                    <motion.span
                      aria-hidden
                      className="absolute inset-y-0 -left-10 w-10 skew-x-[-18deg] bg-white/20"
                      animate={{ x: [0, 260] }}
                      transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
                    />
                  ) : null}
                  <span className="relative">Kostenlose Anfrage stellen</span>
                </motion.a>
                <motion.a
                  href="#kostenrechner"
                  className="rounded-md border border-[#b8d5df] bg-white px-7 py-4 text-center text-base font-extrabold text-[#0F2A3D] shadow-sm transition hover:border-[#18C7B8] hover:bg-[#f7fffd]"
                  {...buttonMotion}
                >
                  Preis berechnen
                </motion.a>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  "Anfrage mit Bildern",
                  "Schnelle Einschätzung",
                  "Stundenpreis oder Festpreis",
                  "Einsatz rund um 44577",
                ].map((badge) => (
                  <div
                    key={badge}
                    className="rounded-md border border-[#dbe7ec] bg-white/90 px-4 py-3 text-sm font-bold text-[#0F2A3D] shadow-sm"
                  >
                    <span className="mr-2 text-[#18C7B8]">✓</span>
                    {badge}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="leistungen" className="bg-white py-18 sm:py-20" {...sectionMotion}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow="Leistungen"
              title="Unsere Leistungen"
              text="Ob einmaliger Auftrag oder regelmäßige Pflege: Klickhafen Lokalservice bündelt die Arbeiten, die rund um Haus, Garten und Objekt zuverlässig erledigt werden müssen."
            />
            <div className="mt-10 grid gap-5 md:grid-cols-2">
              {serviceCards.map((card) => (
                <motion.article
                  key={card.title}
                  className="group rounded-lg border border-[#dbe7ec] bg-[#F4F8FA] p-6 shadow-sm transition hover:-translate-y-1 hover:border-[#18C7B8] hover:bg-white hover:shadow-[0_18px_42px_rgba(15,42,61,0.12)]"
                  {...cardMotion}
                >
                  <div className="flex items-start gap-4">
                    <motion.span
                      className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0F2A3D] text-[#18C7B8] transition group-hover:bg-[#18C7B8] group-hover:text-[#0F2A3D]"
                      {...(reduceMotion ? {} : { whileHover: { rotate: -3, scale: 1.06 } })}
                    >
                      <ServiceIcon name={card.icon} />
                    </motion.span>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight text-[#0F2A3D]">
                        {card.title}
                      </h3>
                      <p className="mt-2 leading-7 text-[#64748B]">{card.text}</p>
                    </div>
                  </div>
                  <ul className="mt-6 grid gap-3 text-[15px] font-medium text-[#425466] sm:grid-cols-2">
                    {card.items.map((item) => (
                      <li key={item} className="flex gap-3">
                        <span className="mt-1.5 h-2.5 w-2.5 shrink-0 rounded-sm bg-[#18C7B8]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.article>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section id="ablauf" className="py-18 sm:py-20" {...sectionMotion}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <SectionIntro
              eyebrow="Ablauf"
              title="So einfach läuft Ihre Anfrage ab"
              text="Von der ersten Einschätzung bis zur Ausführung bleibt der Ablauf klar, nachvollziehbar und auf schnelle Rückmeldung ausgelegt."
            />
            <div className="relative mt-10">
              <div className="absolute left-5 top-0 hidden h-full w-px bg-[#cde0e7] sm:block lg:left-0 lg:top-10 lg:h-px lg:w-full" />
              <div className="relative grid gap-4 lg:grid-cols-6">
                {timelineSteps.map((step, index) => (
                  <motion.div
                    key={step.title}
                    className="relative rounded-lg border border-[#dbe7ec] bg-white p-5 shadow-sm"
                    {...cardMotion}
                  >
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-[#0F2A3D] text-lg font-black text-white">
                      {index + 1}
                    </span>
                    <h3 className="mt-5 text-lg font-black text-[#0F2A3D]">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[#64748B]">{step.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          id="kostenrechner"
          className="bg-[#0F2A3D] py-14 text-white sm:py-16"
          {...sectionMotion}
        >
          <div className="mx-auto grid max-w-7xl items-stretch gap-6 px-4 sm:px-6 lg:grid-cols-[0.78fr_1.22fr] lg:px-8">
            <div className="flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.06] p-5 sm:p-6">
              <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">
                Kostenrechner
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Preis grob einschätzen
              </h2>
              <p className="mt-4 leading-7 text-[#d5e6ec]">
                Berechnen Sie in wenigen Schritten eine unverbindliche Einschätzung. Der genaue
                Preis wird nach Prüfung Ihrer Angaben bestätigt.
              </p>
              <div className="mt-6 grid gap-3">
                <p className="rounded-md bg-white/10 p-4 text-sm text-[#d5e6ec]">
                  Die Berechnung dient nur zur Orientierung und ersetzt kein individuelles Angebot.
                </p>
                <p className="rounded-md bg-white/10 p-4 text-sm font-bold text-white">
                  Ausgangspunkt für die Entfernung: PLZ 44577 Castrop-Rauxel
                </p>
                <p className="rounded-md bg-white/10 p-4 text-sm text-[#d5e6ec]">
                  Wählen Sie im Wizard die passende Entfernungsklasse, damit die Anfahrt in der
                  Schätzung berücksichtigt wird.
                </p>
              </div>
            </div>

            <div className="flex h-full min-h-[520px] flex-col rounded-lg bg-white p-5 text-[#10212E] shadow-[0_24px_60px_rgba(0,0,0,0.2)] sm:p-6">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-black text-[#18C7B8]">Schritt {wizardStep} von 5</p>
                  <h3 className="mt-1 text-2xl font-black text-[#0F2A3D]">
                    {wizardStep === 1 && "Leistung auswählen"}
                    {wizardStep === 2 && "Zusatzarbeiten auswählen"}
                    {wizardStep === 3 && "Aufwand auswählen"}
                    {wizardStep === 4 && "Entfernung auswählen"}
                    {wizardStep === 5 && "Ergebnis"}
                  </h3>
                </div>
                <div className="h-2 rounded-full bg-[#e6eef2] sm:w-48">
                  <div
                    className="h-2 rounded-full bg-[#18C7B8]"
                    style={{ width: `${(wizardStep / 5) * 100}%` }}
                  />
                </div>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={wizardStep}
                  className="min-h-[320px] flex-1"
                  initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                  animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                  exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
              {wizardStep === 1 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {(Object.keys(services) as ServiceKey[]).map((service) => (
                    <motion.button
                      key={service}
                      type="button"
                      onClick={() => changeService(service)}
                      className={`rounded-md border px-4 py-4 text-left font-extrabold transition ${
                        selectedService === service
                          ? "border-[#18C7B8] bg-[#e7fbf8] text-[#0F2A3D] shadow-sm"
                          : "border-[#dbe7ec] bg-white text-[#425466] hover:border-[#18C7B8]"
                      }`}
                      {...buttonMotion}
                    >
                      {service}
                    </motion.button>
                  ))}
                </div>
              ) : null}

              {wizardStep === 2 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {services[selectedService].map((extra) => (
                    <label
                      key={extra}
                      className="flex min-h-14 items-center gap-3 rounded-md border border-[#dbe7ec] bg-white px-4 py-3 font-medium transition hover:border-[#18C7B8]"
                    >
                      <input
                        type="checkbox"
                        checked={selectedExtras.includes(extra)}
                        onChange={() => toggleExtra(extra)}
                        className="h-4 w-4 accent-[#18C7B8]"
                      />
                      <span>{extra}</span>
                    </label>
                  ))}
                </div>
              ) : null}

              {wizardStep === 3 ? (
                <div className="grid gap-2 sm:grid-cols-3">
                  {(Object.keys(effort) as EffortKey[]).map((level) => (
                    <motion.button
                      key={level}
                      type="button"
                      onClick={() => setSelectedEffort(level)}
                      className={`rounded-md border px-4 py-4 text-left transition ${
                        selectedEffort === level
                          ? "border-[#18C7B8] bg-[#e7fbf8] shadow-sm"
                          : "border-[#dbe7ec] bg-white hover:border-[#18C7B8]"
                      }`}
                      {...buttonMotion}
                    >
                      <span className="block text-lg font-black text-[#0F2A3D]">{level}</span>
                      <span className="text-sm font-medium text-[#64748B]">
                        {effort[level].hours}
                      </span>
                    </motion.button>
                  ))}
                </div>
              ) : null}

              {wizardStep === 4 ? (
                <div>
                  <p className="mb-3 rounded-md bg-[#F4F8FA] px-4 py-3 text-sm font-bold text-[#0F2A3D]">
                    Entfernung jeweils ab PLZ 44577 Castrop-Rauxel auswählen.
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(Object.keys(distances) as DistanceKey[]).map((distance) => (
                      <motion.button
                        key={distance}
                        type="button"
                        onClick={() => setSelectedDistance(distance)}
                        className={`rounded-md border px-4 py-4 text-left transition ${
                          selectedDistance === distance
                            ? "border-[#18C7B8] bg-[#e7fbf8] shadow-sm"
                            : "border-[#dbe7ec] bg-white hover:border-[#18C7B8]"
                        }`}
                        {...buttonMotion}
                      >
                        <span className="block font-black text-[#0F2A3D]">{distance}</span>
                        <span className="text-sm font-medium text-[#64748B]">
                          ab PLZ 44577 · Anfahrt: {distances[distance].label}
                        </span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : null}

              {wizardStep === 5 ? (
                <div className="rounded-lg border border-[#dbe7ec] bg-[#F4F8FA] p-5">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md bg-white p-5 ring-1 ring-[#dbe7ec]">
                      <p className="text-sm font-bold text-[#64748B]">
                        Unverbindliche Schätzung
                      </p>
                      <p className="mt-3 text-2xl font-black text-[#0F2A3D]">{estimate.range}</p>
                      <p className="mt-2 text-sm text-[#64748B]">{estimate.travelNote}</p>
                    </div>
                    <div className="relative rounded-md border border-[#18C7B8] bg-white p-5 shadow-sm">
                      <span className="absolute right-4 top-4 rounded-md bg-[#18C7B8] px-2 py-1 text-xs font-black text-[#0F2A3D]">
                        Empfehlung
                      </span>
                      <p className="pr-28 text-sm font-bold text-[#64748B]">
                        Festpreis-Vorteil
                      </p>
                      <p className="mt-3 text-2xl font-black text-[#0F2A3D]">{estimate.fixed}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm font-medium text-[#64748B]">
                    Der genaue Preis wird nach Prüfung Ihrer Angaben bestätigt.
                  </p>
                  <motion.button
                    type="button"
                    onClick={applyEstimate}
                    className="mt-5 w-full rounded-md bg-[#18C7B8] px-6 py-4 text-base font-black text-[#0F2A3D] shadow-[0_14px_30px_rgba(24,199,184,0.24)] transition hover:bg-[#15b6a8]"
                    {...buttonMotion}
                  >
                    Mit dieser Einschätzung anfragen
                  </motion.button>
                </div>
              ) : null}

                </motion.div>
              </AnimatePresence>

              <div className="mt-6 flex gap-3">
                <motion.button
                  type="button"
                  onClick={() => setWizardStep((step) => Math.max(1, step - 1))}
                  disabled={wizardStep === 1}
                  className="rounded-md border border-[#dbe7ec] bg-white px-5 py-3 font-black text-[#0F2A3D]"
                  {...buttonMotion}
                >
                  Zurück
                </motion.button>
                <motion.button
                  type="button"
                  onClick={() => setWizardStep((step) => Math.min(5, step + 1))}
                  disabled={wizardStep === 5 || !canGoNext}
                  className="ml-auto rounded-md bg-[#0F2A3D] px-5 py-3 font-black text-white"
                  {...buttonMotion}
                >
                  Weiter
                </motion.button>
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className="bg-white py-18 sm:py-20" {...sectionMotion}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
              <SectionIntro
                eyebrow="Regelmäßige Pflege"
                title="Regelmäßige Pflege für Haus, Garten und Objekt"
                text="Auf Wunsch übernehmen wir wiederkehrende Arbeiten wöchentlich, monatlich, saisonal oder jährlich - ideal für Gärten, Treppenhäuser, Objekte und Außenbereiche."
              />
              <div className="grid gap-4 sm:grid-cols-2">
                {careCards.map((card) => (
                  <motion.div
                    key={card.title}
                    className="rounded-lg border border-[#dbe7ec] bg-[#F4F8FA] p-6 shadow-sm"
                    {...cardMotion}
                  >
                    <p className="text-xl font-black text-[#0F2A3D]">{card.title}</p>
                    <p className="mt-3 leading-7 text-[#64748B]">{card.text}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section className="py-18 sm:py-20" {...sectionMotion}>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg border border-[#dbe7ec] bg-white p-6 shadow-[0_20px_55px_rgba(15,42,61,0.08)] sm:p-8">
              <SectionIntro
                eyebrow="Transparenz"
                title="Flexible Preise nach Aufwand oder Festpreis"
                text="Je nach Auftrag arbeiten wir mit Stundenpreis oder Festpreis. Sprinter, Material und Entsorgung werden transparent separat berechnet."
              />
              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  "Unverbindliche Preisschätzung über den Kostenrechner",
                  "Angebot auf Basis Ihrer Bilder",
                  "Stundenpreis oder Festpreis möglich",
                  "Preise inkl. MwSt.",
                  "Sprinter und Entsorgung separat nach Aufwand",
                  "Rechnung auf Wunsch möglich",
                ].map((item) => (
                  <p
                    key={item}
                    className="rounded-md border border-[#e1edf1] bg-[#F4F8FA] p-4 font-bold text-[#0F2A3D]"
                  >
                    <span className="mr-2 text-[#18C7B8]">✓</span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section id="anfrage" className="bg-white py-14 sm:py-16" {...sectionMotion}>
          <div className="mx-auto grid max-w-7xl items-stretch gap-7 px-4 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8">
            <div className="flex h-full flex-col">
              <SectionIntro
                eyebrow="Kontakt"
                title="Individuelle Anfrage stellen"
                text="Schreiben Sie kurz, wobei Sie Unterstützung benötigen. Bilder oder Videos helfen bei der schnellen Einschätzung."
              />
              <div className="mt-7 flex flex-1 flex-col rounded-lg border border-[#dbe7ec] bg-[#0F2A3D] p-6 text-white shadow-[0_22px_55px_rgba(15,42,61,0.2)]">
                <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">
                  Direkter Kontakt
                </p>
                <p className="mt-3 text-2xl font-black">
                  Kurze Anfrage senden, Rückmeldung erhalten.
                </p>
                <motion.a
                  href={`https://wa.me/${whatsappNumber}`}
                  className="mt-6 block rounded-md bg-[#18C7B8] px-5 py-4 text-center text-base font-black text-[#0F2A3D] shadow-[0_14px_30px_rgba(24,199,184,0.22)]"
                  {...buttonMotion}
                >
                  WhatsApp öffnen
                </motion.a>
                <div className="mt-6 grid gap-3 text-sm text-[#d5e6ec]">
                  <p>E-Mail: kontakt@klickhafen.de</p>
                  <p>
                    Einsatzgebiet: Castrop-Rauxel, Dortmund, Herne, Bochum und Umgebung rund um
                    44577 Castrop-Rauxel.
                  </p>
                  <p className="rounded-md bg-white/10 p-4 font-bold text-white">
                    Ausgangspunkt für Entfernung und Anfahrt: PLZ 44577 Castrop-Rauxel.
                  </p>
                </div>
              </div>
            </div>

            <motion.form
              ref={formRef}
              onSubmit={submitRequest}
              className="grid gap-4 rounded-lg border border-[#dbe7ec] bg-[#F4F8FA] p-5 shadow-[0_18px_45px_rgba(15,42,61,0.08)] sm:p-6"
              {...(reduceMotion
                ? {}
                : {
                    initial: { opacity: 0, y: 12 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, amount: 0.2 },
                    transition: { duration: 0.35 },
                  })}
            >
              <div className="grid gap-4 sm:grid-cols-[0.6fr_1fr_1fr]">
                <Field label="Anrede">
                  <select
                    value={form.salutation}
                    onChange={(event) => updateForm("salutation", event.target.value)}
                    className="input"
                  >
                    {["Herr", "Frau", "Divers"].map((salutation) => (
                      <option key={salutation} value={salutation}>
                        {salutation}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Vorname" required>
                  <input
                    value={form.firstName}
                    onChange={(event) => updateForm("firstName", event.target.value)}
                    className="input"
                    required
                  />
                </Field>
                <Field label="Name" required>
                  <input
                    value={form.lastName}
                    onChange={(event) => updateForm("lastName", event.target.value)}
                    className="input"
                    required
                  />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Telefonnummer">
                  <input
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="E-Mail-Adresse" required>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    className="input"
                    required
                  />
                </Field>
              </div>

              <Field label="Beschreibung">
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  className="input min-h-32"
                  placeholder="Beschreiben Sie kurz Ihr Anliegen. Sie können zusätzlich Bilder oder Videos hochladen."
                />
              </Field>

              <Field label="Bilder oder Videos hochladen">
                <input
                  type="file"
                  multiple
                  accept="image/*,video/*"
                  onChange={(event) => updateFiles(event.target.files)}
                  className="block w-full rounded-md border border-dashed border-[#9fc5cf] bg-white px-4 py-4 text-sm font-medium text-[#425466]"
                />
                <span className="text-xs font-medium text-[#64748B]">
                  Maximal 5 Dateien, Bilder oder Videos.
                </span>
              </Field>

              {fileError ? (
                <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{fileError}</p>
              ) : null}

              <label className="flex gap-3 rounded-md border border-[#dbe7ec] bg-white p-4 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.accepted}
                  onChange={(event) => updateForm("accepted", event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#18C7B8]"
                  required
                />
                <span>Ich möchte auf Basis meiner Angaben kontaktiert werden.</span>
              </label>

              {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
              {submitState !== "idle" ? (
                <p className="rounded-md bg-white p-3 text-sm font-bold text-[#0F2A3D]">
                  {statusText[submitState]}
                </p>
              ) : null}

              <motion.button
                type="submit"
                disabled={submitState === "loading"}
                className="rounded-md bg-[#0F2A3D] px-6 py-4 text-base font-black text-white shadow-[0_16px_34px_rgba(15,42,61,0.22)] transition hover:bg-[#14354d]"
                {...buttonMotion}
              >
                Anfrage senden
              </motion.button>
            </motion.form>
          </div>
        </motion.section>
      </main>

      <motion.footer
        className="bg-[#0F2A3D] px-4 py-10 text-white"
        {...(reduceMotion
          ? {}
          : {
              initial: { opacity: 0, y: 16 },
              whileInView: { opacity: 1, y: 0 },
              viewport: { once: true, amount: 0.2 },
              transition: { duration: 0.4 },
            })}
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[1.35fr_1fr_1fr]">
            <motion.div {...(reduceMotion ? {} : { whileHover: { y: -2 } })}>
              <img
                src="/klickhafen_logo_transparent.png"
                alt="Klickhafen"
                className="h-12 w-auto max-w-[220px] object-contain brightness-0 invert"
              />
              <p className="mt-4 text-xl font-black">Klickhafen Lokalservice</p>
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#d5e6ec]">
                Haus, Garten & Objektservice rund um Castrop-Rauxel.
              </p>
            </motion.div>

            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">
                Navigation
              </p>
              <div className="mt-4 grid gap-3 text-sm font-medium text-[#d5e6ec]">
                {[
                  ["Leistungen", "#leistungen"],
                  ["Ablauf", "#ablauf"],
                  ["Kostenrechner", "#kostenrechner"],
                  ["Anfrage", "#anfrage"],
                ].map(([label, href]) => (
                  <motion.a
                    key={label}
                    href={href}
                    className="transition hover:text-[#18C7B8]"
                    {...(reduceMotion ? {} : { whileHover: { x: 3 } })}
                  >
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">
                Rechtliches
              </p>
              <div className="mt-4 grid gap-3 text-sm font-medium text-[#d5e6ec]">
                {["Impressum", "Datenschutz", "Kontakt"].map((label) => (
                  <motion.a
                    key={label}
                    href="#anfrage"
                    className="transition hover:text-[#18C7B8]"
                    {...(reduceMotion ? {} : { whileHover: { x: 3 } })}
                  >
                    {label}
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-white/12 pt-5 text-sm text-[#d5e6ec]">
            © Klickhafen.de Webdesign und Entwicklung
          </div>
        </div>
      </motion.footer>
    </div>
  );
}

function SectionIntro({
  eyebrow,
  title,
  text,
}: {
  eyebrow: string;
  title: string;
  text: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-black tracking-tight text-[#0F2A3D] sm:text-4xl">
        {title}
      </h2>
      <p className="mt-4 text-lg leading-8 text-[#64748B]">{text}</p>
    </div>
  );
}

function ServiceIcon({ name }: { name: string }) {
  const common = {
    width: 28,
    height: 28,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "garden") {
    return (
      <svg {...common}>
        <path d="M5 19c7.5 0 13-5.5 13-13v-1h-1C9.5 5 4 10.5 4 18v1h1Z" />
        <path d="M4 19c3.8-5.2 7.3-8.4 13-12" />
        <path d="M8 15c-.6-2.6-2.1-4.3-4-5" />
      </svg>
    );
  }

  if (name === "cleaning") {
    return (
      <svg {...common}>
        <path d="M7 20h10" />
        <path d="M9 20V9l6-3v14" />
        <path d="M6 9h12" />
        <path d="M18 4l1-2" />
        <path d="M20 7l2-1" />
        <path d="M4 7 2 6" />
      </svg>
    );
  }

  if (name === "tools") {
    return (
      <svg {...common}>
        <path d="m14.5 6.5 3-3 3 3-3 3" />
        <path d="m2.5 21.5 8.5-8.5" />
        <path d="m8 6 10 10" />
        <path d="m14 20 2-2 2 2 2-2-2-2" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M3 8h11v10H3z" />
      <path d="M14 11h4l3 3v4h-7z" />
      <path d="M7 18.5a1.5 1.5 0 1 0 0 .1" />
      <path d="M18 18.5a1.5 1.5 0 1 0 0 .1" />
      <path d="M6 11h5" />
    </svg>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-[#0F2A3D]">
        {label}
        {required ? <span className="text-[#18C7B8]"> *</span> : null}
      </span>
      {children}
    </label>
  );
}

"use client";

import { FormEvent, useMemo, useRef, useState } from "react";

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
    "alter Boden entfernen",
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

const formServiceOptions = [
  "Gartenarbeiten",
  "Fensterreinigung",
  "Gebäudereinigung",
  "Möbelmontage",
  "Küchenmontage",
  "Bodenverlegung",
  "Entrümpelung",
  "Objektpflege",
  "Sonstiges",
];

const statusText = {
  idle: "",
  loading: "Anfrage wird gesendet...",
  success: "Vielen Dank. Wir prüfen Ihre Anfrage und melden uns mit einem passenden Angebot.",
};

type ServiceKey = keyof typeof services;
type EffortKey = keyof typeof effort;

type FormState = {
  name: string;
  phone: string;
  email: string;
  location: string;
  serviceType: string;
  description: string;
  desiredDate: string;
  priceType: string;
  estimatedPrice: string;
  accepted: boolean;
};

const emptyForm: FormState = {
  name: "",
  phone: "",
  email: "",
  location: "",
  serviceType: "",
  description: "",
  desiredDate: "",
  priceType: "Noch offen",
  estimatedPrice: "",
  accepted: false,
};

function fixedPrice(max: number) {
  return Math.ceil((max * 45 * 0.86) / 10) * 10 - 1;
}

export function LandingPage() {
  const [selectedService, setSelectedService] = useState<ServiceKey>("Gartenarbeiten");
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["Rasen mähen"]);
  const [selectedEffort, setSelectedEffort] = useState<EffortKey>("Mittel");
  const [form, setForm] = useState<FormState>(emptyForm);
  const [files, setFiles] = useState<File[]>([]);
  const [submitState, setSubmitState] = useState<keyof typeof statusText>("idle");
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const estimate = useMemo(() => {
    const selected = effort[selectedEffort];
    const range = `ca. ${selected.min * 45}-${selected.max * 45} €`;
    const fixed = `ab ${fixedPrice(selected.max)} €`;

    return {
      range,
      fixed,
      effortText: `Aufwand ca. ${selected.hours}`,
      full: `Geschätzt nach Aufwand: ${range} | Empfohlenes Festpreis-Angebot: ${fixed}`,
    };
  }, [selectedEffort]);

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
      `Kostenrechner-Auswahl: ${selectedService}`,
      selectedExtras.length ? `Zusatzarbeiten: ${selectedExtras.join(", ")}` : "",
      `Aufwand: ${selectedEffort} (${estimate.effortText})`,
      estimate.full,
    ]
      .filter(Boolean)
      .join("\n");

    setForm((current) => ({
      ...current,
      serviceType:
        selectedService === "Montage"
          ? "Möbelmontage"
          : selectedService === "Reinigung"
            ? "Gebäudereinigung"
            : selectedService,
      priceType: "Festpreis",
      estimatedPrice: estimate.full,
      description: current.description ? `${current.description}\n\n${summary}` : summary,
    }));

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submitRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!form.name.trim() || !form.phone.trim() || !form.serviceType || !form.accepted) {
      setError("Bitte füllen Sie alle Pflichtfelder aus und bestätigen Sie die Angebotsanfrage.");
      return;
    }

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Bitte geben Sie eine gültige E-Mail-Adresse ein.");
      return;
    }

    setSubmitState("loading");
    const data = new FormData();
    data.append("name", form.name);
    data.append("phone", form.phone);
    data.append("email", form.email);
    data.append("location", form.location);
    data.append("serviceType", form.serviceType);
    data.append("description", form.description);
    data.append("desiredDate", form.desiredDate);
    data.append("priceType", form.priceType);
    data.append("estimatedPrice", form.estimatedPrice);
    data.append(
      "calculatorData",
      JSON.stringify({
        service: selectedService,
        extras: selectedExtras,
        effort: selectedEffort,
        estimate,
      }),
    );
    files.forEach((file) => data.append("images", file));

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

  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#10212E]">
      <header className="sticky top-0 z-30 border-b border-[#dbe7ec] bg-white/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <a href="#start" className="min-w-0">
            <span className="block text-base font-bold text-[#0F2A3D] sm:text-lg">
              Klickhafen Lokalservice
            </span>
            <span className="hidden text-xs text-[#64748B] sm:block">
              Haus, Garten & Objektservice
            </span>
          </a>
          <div className="hidden items-center gap-6 text-sm font-medium text-[#0F2A3D] md:flex">
            <a href="#leistungen">Leistungen</a>
            <a href="#ablauf">Ablauf</a>
            <a href="#kostenrechner">Kostenrechner</a>
            <a href="#anfrage">Anfrage</a>
          </div>
          <a
            href="#anfrage"
            className="shrink-0 rounded-md bg-[#18C7B8] px-4 py-2 text-sm font-bold text-[#0F2A3D] shadow-sm transition hover:bg-[#16b4a7]"
          >
            Kostenlose Anfrage
          </a>
        </nav>
      </header>

      <main id="start">
        <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
          <div className="flex max-w-4xl flex-col justify-center">
            <p className="mb-4 w-fit rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#0F2A3D] shadow-sm">
              Castrop-Rauxel · Dortmund · Herne · Bochum
            </p>
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-[#0F2A3D] sm:text-5xl lg:text-6xl">
              Haus, Garten & Objektservice in Castrop-Rauxel und Umgebung
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[#425466]">
              Klickhafen Lokalservice übernimmt Gartenarbeiten, Reinigung, Montage,
              Bodenverlegung, Entrümpelung und regelmäßige Objektpflege - zuverlässig,
              flexibel und transparent.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#anfrage"
                className="rounded-md bg-[#0F2A3D] px-6 py-3 text-center font-bold text-white transition hover:bg-[#14354d]"
              >
                Kostenlose Anfrage stellen
              </a>
              <a
                href="#kostenrechner"
                className="rounded-md border border-[#0F2A3D] bg-white px-6 py-3 text-center font-bold text-[#0F2A3D] transition hover:border-[#18C7B8]"
              >
                Preis berechnen
              </a>
            </div>
            <p className="mt-6 text-sm font-medium text-[#64748B]">
              Anfrage mit Bildern senden · Preis einschätzen · Angebot erhalten · Termin
              vereinbaren
            </p>
          </div>
        </section>

        <section id="leistungen" className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0F2A3D]">Unsere Leistungen</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {[
                {
                  title: "Garten & Außenbereich",
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
                  title: "Reinigung",
                  items: [
                    "Fensterreinigung",
                    "Gebäudereinigung",
                    "Treppenhausreinigung",
                    "Grundreinigung",
                    "Objektpflege",
                  ],
                },
                {
                  title: "Montage & Innenausbau",
                  items: [
                    "Möbelmontage",
                    "Küchenmontage",
                    "Laminat verlegen",
                    "Klick-Vinyl verlegen",
                    "PVC verlegen",
                  ],
                },
                {
                  title: "Entrümpelung & Transport",
                  items: [
                    "Keller entrümpeln",
                    "Garage entrümpeln",
                    "Dachboden entrümpeln",
                    "Wohnung räumen",
                    "Abtransport",
                    "Sprinter nach Bedarf",
                  ],
                },
              ].map((card) => (
                <article
                  key={card.title}
                  className="rounded-lg border border-[#dbe7ec] bg-[#F4F8FA] p-6"
                >
                  <h3 className="text-xl font-bold text-[#0F2A3D]">{card.title}</h3>
                  <ul className="mt-5 grid gap-3 text-[#425466] sm:grid-cols-2">
                    {card.items.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#18C7B8]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="ablauf" className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-[#0F2A3D]">
              So einfach läuft Ihre Anfrage ab
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
              {[
                "Leistung auswählen",
                "Preis einschätzen",
                "Anfrage mit Bildern senden",
                "Angebot erhalten",
                "Termin vereinbaren",
                "Auftrag erledigen lassen",
              ].map((step, index) => (
                <div key={step} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-[#dbe7ec]">
                  <p className="text-sm font-bold text-[#18C7B8]">0{index + 1}</p>
                  <p className="mt-3 font-bold text-[#0F2A3D]">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="kostenrechner" className="bg-[#0F2A3D] py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <h2 className="text-3xl font-extrabold">Preis unverbindlich berechnen</h2>
              <p className="mt-4 leading-7 text-[#d5e6ec]">
                Wählen Sie Ihre gewünschte Leistung aus und erhalten Sie eine erste
                Preisschätzung. Der genaue Preis wird nach Prüfung Ihrer Angaben und Bilder
                bestätigt.
              </p>
              <p className="mt-6 rounded-md bg-white/10 p-4 text-sm text-[#d5e6ec]">
                Preise sind immer unverbindliche Schätzungen. Sprinter, Material und Entsorgung
                werden transparent separat berechnet.
              </p>
            </div>
            <div className="rounded-lg bg-white p-5 text-[#10212E] shadow-xl">
              <div className="grid gap-5">
                <div>
                  <p className="mb-3 font-bold text-[#0F2A3D]">1. Leistung auswählen</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {(Object.keys(services) as ServiceKey[]).map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => changeService(service)}
                        className={`rounded-md border px-4 py-3 text-left font-semibold ${
                          selectedService === service
                            ? "border-[#18C7B8] bg-[#e7fbf8] text-[#0F2A3D]"
                            : "border-[#dbe7ec] bg-white text-[#425466]"
                        }`}
                      >
                        {service}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="mb-3 font-bold text-[#0F2A3D]">2. Zusatzarbeiten</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {services[selectedService].map((extra) => (
                      <label
                        key={extra}
                        className="flex items-center gap-3 rounded-md border border-[#dbe7ec] px-4 py-3"
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
                </div>

                <div>
                  <p className="mb-3 font-bold text-[#0F2A3D]">3. Aufwand auswählen</p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(Object.keys(effort) as EffortKey[]).map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedEffort(level)}
                        className={`rounded-md border px-4 py-3 text-left ${
                          selectedEffort === level
                            ? "border-[#18C7B8] bg-[#e7fbf8]"
                            : "border-[#dbe7ec] bg-white"
                        }`}
                      >
                        <span className="block font-bold text-[#0F2A3D]">{level}</span>
                        <span className="text-sm text-[#64748B]">{effort[level].hours}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg bg-[#F4F8FA] p-5">
                  <p className="font-bold text-[#0F2A3D]">4. Preisart</p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md bg-white p-4">
                      <p className="text-sm text-[#64748B]">Geschätzter Preis nach Aufwand</p>
                      <p className="mt-2 text-xl font-extrabold text-[#0F2A3D]">{estimate.range}</p>
                    </div>
                    <div className="rounded-md bg-white p-4">
                      <p className="text-sm text-[#64748B]">Günstigeres Festpreis-Angebot</p>
                      <p className="mt-2 text-xl font-extrabold text-[#0F2A3D]">{estimate.fixed}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#64748B]">
                    Der genaue Preis wird nach Prüfung Ihrer Bilder und Angaben bestätigt.
                  </p>
                  <button
                    type="button"
                    onClick={applyEstimate}
                    className="mt-5 w-full rounded-md bg-[#18C7B8] px-5 py-3 font-bold text-[#0F2A3D]"
                  >
                    Preisschätzung übernehmen & Anfrage senden
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
              <div>
                <h2 className="text-3xl font-extrabold text-[#0F2A3D]">
                  Regelmäßige Pflege für Haus, Garten und Objekt
                </h2>
                <p className="mt-4 leading-7 text-[#425466]">
                  Auf Wunsch übernehmen wir wiederkehrende Arbeiten wöchentlich, monatlich,
                  saisonal oder jährlich - ideal für Gärten, Treppenhäuser, Objekte und
                  Außenbereiche.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-4">
                {["Wöchentlich", "Monatlich", "Saisonal", "Jährlich"].map((item) => (
                  <div key={item} className="rounded-lg bg-[#F4F8FA] p-5 text-center font-bold">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-[#dbe7ec]">
              <h2 className="text-3xl font-extrabold text-[#0F2A3D]">
                Flexible Preise nach Aufwand oder Festpreis
              </h2>
              <p className="mt-4 max-w-3xl leading-7 text-[#425466]">
                Je nach Auftrag arbeiten wir mit Stundenpreis oder Festpreis. Sprinter, Material
                und Entsorgung werden transparent separat berechnet.
              </p>
              <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {[
                  "Unverbindliche Preisschätzung über den Kostenrechner",
                  "Angebot auf Basis Ihrer Bilder",
                  "Stundenpreis oder Festpreis möglich",
                  "Preise inkl. MwSt.",
                  "Sprinter und Entsorgung separat nach Aufwand",
                  "Rechnung auf Wunsch möglich",
                ].map((item) => (
                  <p key={item} className="rounded-md bg-[#F4F8FA] p-4 font-medium">
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="anfrage" className="bg-white py-16">
          <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.85fr_1.15fr] lg:px-8">
            <div>
              <h2 className="text-3xl font-extrabold text-[#0F2A3D]">
                Kostenlose Anfrage stellen
              </h2>
              <p className="mt-4 leading-7 text-[#425466]">
                Senden Sie Ihre Anfrage am besten direkt mit Bildern. So können Umfang, Material,
                Entsorgung und Termin schneller eingeschätzt werden.
              </p>
              <div className="mt-6 rounded-lg bg-[#F4F8FA] p-5">
                <p className="font-bold text-[#0F2A3D]">Kontakt</p>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  className="mt-4 block rounded-md bg-[#18C7B8] px-5 py-3 text-center font-bold text-[#0F2A3D]"
                >
                  WhatsApp öffnen
                </a>
                <p className="mt-4 text-sm text-[#64748B]">E-Mail: kontakt@klickhafen.de</p>
                <p className="mt-2 text-sm text-[#64748B]">
                  Einsatzgebiet: Castrop-Rauxel, Dortmund, Herne, Bochum und Umgebung rund um
                  44577 Castrop-Rauxel.
                </p>
                <p className="mt-2 text-sm font-semibold text-[#0F2A3D]">
                  Anfragen am besten direkt mit Bildern senden.
                </p>
              </div>
            </div>

            <form ref={formRef} onSubmit={submitRequest} className="grid gap-4 rounded-lg bg-[#F4F8FA] p-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Name *">
                  <input
                    value={form.name}
                    onChange={(event) => updateForm("name", event.target.value)}
                    className="input"
                    required
                  />
                </Field>
                <Field label="Telefon *">
                  <input
                    value={form.phone}
                    onChange={(event) => updateForm("phone", event.target.value)}
                    className="input"
                    required
                  />
                </Field>
                <Field label="E-Mail">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateForm("email", event.target.value)}
                    className="input"
                  />
                </Field>
                <Field label="Adresse / Ort">
                  <input
                    value={form.location}
                    onChange={(event) => updateForm("location", event.target.value)}
                    className="input"
                  />
                </Field>
              </div>

              <Field label="Gewünschte Leistung *">
                <select
                  value={form.serviceType}
                  onChange={(event) => updateForm("serviceType", event.target.value)}
                  className="input"
                  required
                >
                  <option value="">Bitte auswählen</option>
                  {formServiceOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Beschreibung">
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  className="input min-h-36"
                />
              </Field>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Wunschtermin">
                  <input
                    value={form.desiredDate}
                    onChange={(event) => updateForm("desiredDate", event.target.value)}
                    className="input"
                    placeholder="z. B. nächste Woche"
                  />
                </Field>
                <Field label="Preisschätzung">
                  <input
                    value={form.estimatedPrice}
                    onChange={(event) => updateForm("estimatedPrice", event.target.value)}
                    className="input"
                  />
                </Field>
              </div>

              <div>
                <p className="mb-2 text-sm font-bold text-[#0F2A3D]">Preisart</p>
                <div className="grid gap-2 sm:grid-cols-3">
                  {["Stundenpreis", "Festpreis", "Noch offen"].map((priceType) => (
                    <label key={priceType} className="flex items-center gap-2 rounded-md bg-white p-3">
                      <input
                        type="radio"
                        name="priceType"
                        checked={form.priceType === priceType}
                        onChange={() => updateForm("priceType", priceType)}
                        className="accent-[#18C7B8]"
                      />
                      {priceType}
                    </label>
                  ))}
                </div>
              </div>

              <Field label="Bilder hochladen">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(event) => setFiles(Array.from(event.target.files ?? []))}
                  className="block w-full rounded-md border border-[#dbe7ec] bg-white px-4 py-3 text-sm"
                />
              </Field>

              <label className="flex gap-3 rounded-md bg-white p-4 text-sm">
                <input
                  type="checkbox"
                  checked={form.accepted}
                  onChange={(event) => updateForm("accepted", event.target.checked)}
                  className="mt-1 h-4 w-4 shrink-0 accent-[#18C7B8]"
                  required
                />
                <span>Ich möchte ein Angebot auf Basis meiner Angaben erhalten.</span>
              </label>

              {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
              {submitState !== "idle" ? (
                <p className="rounded-md bg-white p-3 text-sm font-semibold text-[#0F2A3D]">
                  {statusText[submitState]}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={submitState === "loading"}
                className="rounded-md bg-[#0F2A3D] px-6 py-3 font-bold text-white"
              >
                Anfrage absenden
              </button>
            </form>
          </div>
        </section>
      </main>

      <footer className="bg-[#0F2A3D] px-4 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="font-bold">Klickhafen Lokalservice</p>
          <div className="flex gap-5 text-sm text-[#d5e6ec]">
            <a href="#anfrage">Impressum</a>
            <a href="#anfrage">Datenschutz</a>
            <a href="#anfrage">Kontakt</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-[#0F2A3D]">{label}</span>
      {children}
    </label>
  );
}

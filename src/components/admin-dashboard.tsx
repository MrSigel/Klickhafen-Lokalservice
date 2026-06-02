"use client";

import { useEffect, useMemo, useState } from "react";

const statuses = ["new", "contacted", "offered", "accepted", "completed", "rejected"];

type RequestImage = {
  id: string;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
};

type ServiceRequest = {
  id: string;
  salutation: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string;
  phone: string;
  email: string | null;
  location: string | null;
  service_type: string;
  description: string | null;
  desired_date: string | null;
  price_type: string | null;
  estimated_price: string | null;
  calculator_data: unknown;
  status: string;
  created_at: string;
  request_images: RequestImage[];
};

type CalculatorSummary = {
  category: string;
  extras: string;
  effort: string;
  distance: string;
  priceEstimate: string;
  fixedPrice: string;
  notices: string[];
};

function displayName(request: ServiceRequest) {
  const composed = [request.salutation, request.first_name, request.last_name]
    .filter(Boolean)
    .join(" ");

  return composed || request.name;
}

function calculatorSummary(data: unknown): CalculatorSummary | null {
  if (!data || typeof data !== "object") {
    return null;
  }

  const value = data as Record<string, unknown>;
  const estimate = value.estimate && typeof value.estimate === "object"
    ? (value.estimate as Record<string, unknown>)
    : {};
  const extrasValue = value.extras ?? estimate.extras;
  const notices = [
    value.offerNotice,
    value.materialNotice,
    value.extraNotice,
    estimate.offerNotice,
    estimate.materialNotice,
    estimate.extraNotice,
  ].filter((item): item is string => typeof item === "string" && item.trim().length > 0);

  return {
    category: String(value.category ?? value.service ?? estimate.category ?? "-"),
    extras: Array.isArray(extrasValue) ? extrasValue.join(", ") : String(extrasValue ?? "-"),
    effort: String(value.effort ?? estimate.effort ?? "-"),
    distance: String(value.distance ?? estimate.distance ?? "-"),
    priceEstimate: String(value.priceEstimate ?? estimate.range ?? "-"),
    fixedPrice: String(value.fixedPrice ?? estimate.fixed ?? "-"),
    notices,
  };
}

export function AdminDashboard() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const selected = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? requests[0],
    [requests, selectedId],
  );

  useEffect(() => {
    async function loadRequests() {
      const response = await fetch("/api/admin/requests");
      const result = (await response.json().catch(() => null)) as
        | { requests?: ServiceRequest[]; error?: string }
        | null;

      if (!response.ok) {
        setError("Anfragen konnten nicht geladen werden.");
      } else {
        setRequests(result?.requests ?? []);
      }

      setLoading(false);
    }

    loadRequests();
  }, []);

  async function updateStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/requests/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      setError("Status konnte nicht geändert werden.");
      return;
    }

    setRequests((current) =>
      current.map((request) => (request.id === id ? { ...request, status } : request)),
    );
  }

  return (
    <section className="mx-auto max-w-7xl">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-[#0F2A3D]">Anfragen</h1>
          <p className="text-[#64748B]">Kontaktanfragen, Dateien und Status prüfen.</p>
        </div>
        <p className="rounded-md bg-white px-4 py-2 text-sm font-bold text-[#0F2A3D] ring-1 ring-[#dbe7ec]">
          {requests.length} Einträge
        </p>
      </div>

      {loading ? <p className="rounded-md bg-white p-4">Anfragen werden geladen...</p> : null}
      {error ? (
        <div className="mb-5 rounded-lg border border-[#dbe7ec] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#0F2A3D]">
            Anfragen konnten nicht geladen werden.
          </h2>
          <p className="mt-2 text-[#64748B]">
            Bitte prüfen Sie die Verbindung oder versuchen Sie es später erneut.
          </p>
        </div>
      ) : null}

      {!error ? <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid max-h-[72vh] gap-3 overflow-auto">
          {requests.map((request) => (
            <button
              key={request.id}
              type="button"
              onClick={() => setSelectedId(request.id)}
              className={`rounded-lg border p-4 text-left ${
                selected?.id === request.id
                  ? "border-[#18C7B8] bg-white"
                  : "border-[#dbe7ec] bg-white/80"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-bold text-[#0F2A3D]">{displayName(request)}</p>
                  <p className="text-sm text-[#64748B]">{request.email ?? "Keine E-Mail"}</p>
                </div>
                <span className="rounded-full bg-[#e7fbf8] px-3 py-1 text-xs font-bold text-[#0F2A3D]">
                  {request.status}
                </span>
              </div>
              <p className="mt-3 text-sm text-[#64748B]">
                {new Date(request.created_at).toLocaleString("de-DE")}
              </p>
            </button>
          ))}
          {!loading && requests.length === 0 ? (
            <p className="rounded-md bg-white p-4 text-[#64748B]">Noch keine Anfragen vorhanden.</p>
          ) : null}
        </div>

        {selected ? (
          <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-[#dbe7ec]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0F2A3D]">{displayName(selected)}</h2>
                <p className="text-[#64748B]">Kontaktanfrage</p>
              </div>
              <select
                value={selected.status}
                onChange={(event) => updateStatus(selected.id, event.target.value)}
                className="rounded-md border border-[#dbe7ec] bg-white px-4 py-3"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Info label="Anrede" value={selected.salutation ?? "-"} />
              <Info label="Vorname" value={selected.first_name ?? "-"} />
              <Info label="Name" value={selected.last_name ?? selected.name ?? "-"} />
              <Info label="Telefon" value={selected.phone || "-"} />
              <Info label="E-Mail" value={selected.email ?? "-"} />
              <Info label="Erstellt" value={new Date(selected.created_at).toLocaleString("de-DE")} />
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-[#0F2A3D]">Beschreibung</p>
              <p className="mt-2 whitespace-pre-wrap rounded-md bg-[#F4F8FA] p-4 text-sm text-[#425466]">
                {selected.description || "-"}
              </p>
            </div>

            {selected.calculator_data ? (
              <div className="mt-6">
                <p className="text-sm font-bold text-[#0F2A3D]">Kostenrechner-Daten</p>
                {calculatorSummary(selected.calculator_data) ? (
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Kategorie", calculatorSummary(selected.calculator_data)?.category ?? "-"],
                      ["Zusatzleistungen", calculatorSummary(selected.calculator_data)?.extras ?? "-"],
                      ["Aufwand", calculatorSummary(selected.calculator_data)?.effort ?? "-"],
                      ["Entfernung", calculatorSummary(selected.calculator_data)?.distance ?? "-"],
                      ["Preisschätzung", calculatorSummary(selected.calculator_data)?.priceEstimate ?? "-"],
                      ["Festpreis-Vorschlag", calculatorSummary(selected.calculator_data)?.fixedPrice ?? "-"],
                    ].map(([label, value]) => (
                      <Info key={label} label={label} value={value} />
                    ))}
                    {calculatorSummary(selected.calculator_data)?.notices.map((notice) => (
                      <div
                        key={notice}
                        className="rounded-md bg-[#F4F8FA] p-4 sm:col-span-2"
                      >
                        <p className="text-xs font-bold uppercase text-[#64748B]">Hinweis</p>
                        <p className="mt-1 font-semibold text-[#0F2A3D]">{notice}</p>
                      </div>
                    ))}
                  </div>
                ) : null}
                <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-[#0F2A3D] p-4 text-xs text-white">
                  {JSON.stringify(selected.calculator_data, null, 2)}
                </pre>
              </div>
            ) : null}

            <div className="mt-6">
              <p className="text-sm font-bold text-[#0F2A3D]">Dateien</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {selected.request_images?.map((file) => (
                  <a key={file.id} href={file.file_url} target="_blank" rel="noreferrer">
                    {file.file_type?.startsWith("video/") ? (
                      <video
                        src={file.file_url}
                        controls
                        className="aspect-video w-full rounded-md object-cover ring-1 ring-[#dbe7ec]"
                      />
                    ) : (
                      <img
                        src={file.file_url}
                        alt={file.file_name ?? "Anfragedatei"}
                        className="aspect-video w-full rounded-md object-cover ring-1 ring-[#dbe7ec]"
                      />
                    )}
                    <span className="mt-1 block truncate text-xs text-[#64748B]">
                      {file.file_name}
                    </span>
                  </a>
                ))}
                {selected.request_images?.length === 0 ? (
                  <p className="rounded-md bg-[#F4F8FA] p-4 text-sm text-[#64748B]">
                    Keine Dateien hochgeladen.
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ) : null}
      </div> : null}
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md bg-[#F4F8FA] p-4">
      <p className="text-xs font-bold uppercase text-[#64748B]">{label}</p>
      <p className="mt-1 break-words font-semibold text-[#0F2A3D]">{value}</p>
    </div>
  );
}

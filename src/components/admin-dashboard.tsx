"use client";

import { useEffect, useMemo, useState } from "react";

const statuses = ["new", "contacted", "offered", "accepted", "completed", "rejected"];

type RequestImage = {
  id: string;
  file_url: string;
  file_name: string | null;
};

type ServiceRequest = {
  id: string;
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
        setError(result?.error ?? "Anfragen konnten nicht geladen werden.");
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
          <p className="text-[#64748B]">Neue Kontakte, Bilder und Preisschätzungen prüfen.</p>
        </div>
        <p className="rounded-md bg-white px-4 py-2 text-sm font-bold text-[#0F2A3D] ring-1 ring-[#dbe7ec]">
          {requests.length} Einträge
        </p>
      </div>

      {loading ? <p className="rounded-md bg-white p-4">Anfragen werden geladen...</p> : null}
      {error ? <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
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
                  <p className="font-bold text-[#0F2A3D]">{request.name}</p>
                  <p className="text-sm text-[#64748B]">{request.service_type}</p>
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
                <h2 className="text-2xl font-extrabold text-[#0F2A3D]">{selected.name}</h2>
                <p className="text-[#64748B]">{selected.service_type}</p>
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
              <Info label="Telefon" value={selected.phone} />
              <Info label="E-Mail" value={selected.email ?? "-"} />
              <Info label="Adresse / Ort" value={selected.location ?? "-"} />
              <Info label="Wunschtermin" value={selected.desired_date ?? "-"} />
              <Info label="Preisart" value={selected.price_type ?? "-"} />
              <Info label="Preisschätzung" value={selected.estimated_price ?? "-"} />
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-[#0F2A3D]">Beschreibung</p>
              <p className="mt-2 whitespace-pre-wrap rounded-md bg-[#F4F8FA] p-4 text-sm text-[#425466]">
                {selected.description || "-"}
              </p>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-[#0F2A3D]">calculator_data</p>
              <pre className="mt-2 max-h-64 overflow-auto rounded-md bg-[#0F2A3D] p-4 text-xs text-white">
                {JSON.stringify(selected.calculator_data, null, 2)}
              </pre>
            </div>

            <div className="mt-6">
              <p className="text-sm font-bold text-[#0F2A3D]">Bilder</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {selected.request_images?.map((image) => (
                  <a key={image.id} href={image.file_url} target="_blank" rel="noreferrer">
                    <img
                      src={image.file_url}
                      alt={image.file_name ?? "Anfragebild"}
                      className="aspect-video w-full rounded-md object-cover ring-1 ring-[#dbe7ec]"
                    />
                    <span className="mt-1 block truncate text-xs text-[#64748B]">
                      {image.file_name}
                    </span>
                  </a>
                ))}
                {selected.request_images?.length === 0 ? (
                  <p className="rounded-md bg-[#F4F8FA] p-4 text-sm text-[#64748B]">
                    Keine Bilder hochgeladen.
                  </p>
                ) : null}
              </div>
            </div>
          </article>
        ) : null}
      </div>
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

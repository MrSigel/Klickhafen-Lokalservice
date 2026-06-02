"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  addDaysInputValue,
  calculateOfferPrice,
  dateInputValue,
  defaultCreditCheckConsentText,
  defaultOfferNotes,
  formatMoney,
  generateOfferNumber,
  offerStatuses,
  positiveNumber,
} from "@/lib/offers";

const statuses = ["new", "contacted", "offered", "accepted", "completed", "rejected"];

const statusLabels: Record<string, string> = {
  new: "Neu",
  contacted: "Kontaktiert",
  offered: "Angebot gesendet",
  accepted: "Angenommen",
  completed: "Erledigt",
  rejected: "Abgelehnt",
};

const sourceLabels: Record<string, string> = {
  contact_form: "Kontaktformular",
  cost_calculator: "Kostenrechner",
};

const offerStatusLabels: Record<string, string> = {
  draft: "Entwurf",
  downloaded: "Heruntergeladen",
  sent: "Gesendet",
  accepted: "Angenommen",
  rejected: "Abgelehnt",
};

type AdminView = "dashboard" | "requests" | "customers";

type Offer = {
  id: string;
  customer_key: string | null;
  request_id: string | null;
  offer_number: string | null;
  salutation: string | null;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  service_category: string | null;
  service_description: string | null;
  execution_location: string | null;
  planned_date: string | null;
  valid_until: string | null;
  net_price: number | null;
  discount_percent: number | null;
  special_price: number | null;
  material_costs: number | null;
  travel_costs: number | null;
  disposal_costs: number | null;
  other_costs: number | null;
  vat_rate: number | null;
  gross_total: number | null;
  payment_type: string | null;
  legal_notes: string | null;
  credit_check_required: boolean | null;
  credit_check_consent_text: string | null;
  credit_check_threshold: number | null;
  status: string | null;
  created_at: string | null;
};

type RequestImage = {
  id: string;
  file_url: string;
  file_name: string | null;
  file_type: string | null;
};

type ServiceRequest = {
  id: string;
  request_source: string | null;
  salutation: string | null;
  first_name: string | null;
  last_name: string | null;
  name: string | null;
  phone: string | null;
  email: string | null;
  location: string | null;
  service_type: string | null;
  service_category: string | null;
  selected_services: unknown;
  effort_size: string | null;
  distance_zone: string | null;
  description: string | null;
  desired_date: string | null;
  price_type: string | null;
  estimated_price: string | null;
  fixed_price_suggestion: string | null;
  calculator_data: unknown;
  status: string;
  created_at: string;
  request_images: RequestImage[];
};

type Customer = {
  key: string;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  requests: ServiceRequest[];
  files: RequestImage[];
  firstDate: string;
  lastDate: string;
  contactCount: number;
  calculatorCount: number;
};

type OfferFormState = {
  offerNumber: string;
  offerDate: string;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  serviceCategory: string;
  serviceDescription: string;
  executionLocation: string;
  plannedDate: string;
  validUntil: string;
  netPrice: string;
  discountPercent: string;
  specialPrice: string;
  materialCosts: string;
  travelCosts: string;
  disposalCosts: string;
  otherCosts: string;
  paymentType: string;
  legalNotes: string;
  creditCheckRequired: boolean;
  creditCheckConsentText: string;
  creditCheckThreshold: string;
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

  return composed || request.name || "-";
}

function dateTime(value: string) {
  return new Date(value).toLocaleString("de-DE");
}

function sourceLabel(source: string | null | undefined) {
  return sourceLabels[source ?? "contact_form"] ?? "Kontaktformular";
}

function statusLabel(status: string) {
  return statusLabels[status] ?? status;
}

function sourceClass(source: string | null | undefined) {
  return source === "cost_calculator"
    ? "bg-[#e7fbf8] text-[#0F2A3D] ring-[#18C7B8]/40"
    : "bg-[#eef5f8] text-[#0F2A3D] ring-[#dbe7ec]";
}

function statusClass(status: string) {
  if (status === "new") {
    return "bg-[#e7fbf8] text-[#0F2A3D] ring-[#18C7B8]/40";
  }

  if (status === "rejected") {
    return "bg-red-50 text-red-700 ring-red-100";
  }

  if (status === "accepted" || status === "completed") {
    return "bg-emerald-50 text-emerald-700 ring-emerald-100";
  }

  return "bg-[#F4F8FA] text-[#0F2A3D] ring-[#dbe7ec]";
}

function arrayText(value: unknown) {
  return Array.isArray(value) ? value.filter(Boolean).join(", ") : "";
}

function calculatorSummary(request: ServiceRequest): CalculatorSummary {
  const data = request.calculator_data && typeof request.calculator_data === "object"
    ? (request.calculator_data as Record<string, unknown>)
    : {};
  const estimate = data.estimate && typeof data.estimate === "object"
    ? (data.estimate as Record<string, unknown>)
    : {};
  const extrasValue = request.selected_services ?? data.extras ?? estimate.extras;
  const notices = [
    data.offerNotice,
    data.noOrderNotice,
    data.materialNotice,
    data.extraNotice,
    estimate.offerNotice,
    estimate.materialNotice,
    estimate.extraNotice,
  ].filter((item): item is string => typeof item === "string" && item.trim().length > 0);

  return {
    category: String(request.service_category ?? data.category ?? data.service ?? estimate.category ?? request.service_type ?? "-"),
    extras: arrayText(extrasValue) || String(extrasValue ?? "-"),
    effort: String(request.effort_size ?? data.effort ?? estimate.effort ?? "-"),
    distance: String(request.distance_zone ?? data.distance ?? estimate.distance ?? "-"),
    priceEstimate: String(request.estimated_price ?? data.priceEstimate ?? estimate.range ?? "-"),
    fixedPrice: String(request.fixed_price_suggestion ?? data.fixedPrice ?? estimate.fixed ?? "-"),
    notices,
  };
}

function buildCustomers(requests: ServiceRequest[]) {
  const grouped = new Map<string, Customer>();

  for (const request of requests) {
    const key = request.email?.toLowerCase().trim() || request.phone?.replace(/\s+/g, "") || request.id;
    const existing = grouped.get(key);

    if (existing) {
      existing.requests.push(request);
      existing.files.push(...(request.request_images ?? []));
      existing.contactCount += request.request_source === "cost_calculator" ? 0 : 1;
      existing.calculatorCount += request.request_source === "cost_calculator" ? 1 : 0;
      existing.firstDate =
        new Date(request.created_at) < new Date(existing.firstDate) ? request.created_at : existing.firstDate;
      existing.lastDate =
        new Date(request.created_at) > new Date(existing.lastDate) ? request.created_at : existing.lastDate;
      continue;
    }

    grouped.set(key, {
      key,
      salutation: request.salutation ?? "-",
      firstName: request.first_name ?? "-",
      lastName: request.last_name ?? request.name ?? "-",
      email: request.email ?? "-",
      phone: request.phone ?? "-",
      requests: [request],
      files: [...(request.request_images ?? [])],
      firstDate: request.created_at,
      lastDate: request.created_at,
      contactCount: request.request_source === "cost_calculator" ? 0 : 1,
      calculatorCount: request.request_source === "cost_calculator" ? 1 : 0,
    });
  }

  return Array.from(grouped.values()).sort(
    (a, b) => new Date(b.lastDate).getTime() - new Date(a.lastDate).getTime(),
  );
}

export function AdminDashboard({ view }: { view: AdminView }) {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [selectedCustomerKey, setSelectedCustomerKey] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdminData() {
      const [requestsResponse, offersResponse] = await Promise.all([
        fetch("/api/admin/requests"),
        fetch("/api/admin/offers"),
      ]);
      const requestsResult = (await requestsResponse.json().catch(() => null)) as
        | { requests?: ServiceRequest[]; error?: string }
        | null;
      const offersResult = (await offersResponse.json().catch(() => null)) as
        | { offers?: Offer[]; error?: string }
        | null;

      if (!requestsResponse.ok || !offersResponse.ok) {
        setError("Anfragen konnten nicht geladen werden.");
      } else {
        setRequests(requestsResult?.requests ?? []);
        setOffers(offersResult?.offers ?? []);
      }

      setLoading(false);
    }

    loadAdminData();
  }, []);

  const filteredRequests = useMemo(
    () =>
      requests.filter((request) => {
        const normalizedSource =
          request.request_source === "cost_calculator" ? "cost_calculator" : "contact_form";
        const sourceMatch = sourceFilter === "all" || normalizedSource === sourceFilter;
        const statusMatch = statusFilter === "all" || request.status === statusFilter;
        return sourceMatch && statusMatch;
      }),
    [requests, sourceFilter, statusFilter],
  );

  const customers = useMemo(() => buildCustomers(requests), [requests]);
  const selectedRequest = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? filteredRequests[0],
    [filteredRequests, requests, selectedId],
  );
  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.key === selectedCustomerKey) ?? customers[0],
    [customers, selectedCustomerKey],
  );
  const fileTotal = requests.reduce(
    (sum, request) => sum + (request.request_images?.length ?? 0),
    0,
  );
  const stats = {
    total: requests.length,
    new: requests.filter((request) => request.status === "new").length,
    contact: requests.filter((request) => request.request_source !== "cost_calculator").length,
    calculator: requests.filter((request) => request.request_source === "cost_calculator").length,
    customers: customers.length,
    files: fileTotal,
    offers: offers.length,
    offerDrafts: offers.filter((offer) => offer.status === "draft").length,
    offerAccepted: offers.filter((offer) => offer.status === "accepted").length,
  };

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

  async function updateOfferStatus(id: string, status: string) {
    const response = await fetch(`/api/admin/offers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const result = (await response.json().catch(() => null)) as { offer?: Offer } | null;

    if (!response.ok || !result?.offer) {
      setError("Angebotsstatus konnte nicht geändert werden.");
      return;
    }

    setOffers((current) => current.map((offer) => (offer.id === id ? result.offer! : offer)));
  }

  function addOffer(offer: Offer) {
    setOffers((current) => [offer, ...current.filter((item) => item.id !== offer.id)]);
  }

  return (
    <section className="mx-auto max-w-7xl">
      <AdminNav active={view} />

      {loading ? <p className="rounded-md bg-white p-4">Adminbereich wird geladen...</p> : null}
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

      {!loading && !error && view === "dashboard" ? (
        <DashboardView requests={requests} stats={stats} />
      ) : null}
      {!loading && !error && view === "requests" ? (
        <RequestsView
          requests={filteredRequests}
          selected={selectedRequest}
          sourceFilter={sourceFilter}
          statusFilter={statusFilter}
          onSourceFilter={setSourceFilter}
          onStatusFilter={setStatusFilter}
          onSelect={setSelectedId}
          onStatusChange={updateStatus}
        />
      ) : null}
      {!loading && !error && view === "customers" ? (
        <CustomersView
          customers={customers}
          offers={offers}
          selected={selectedCustomer}
          onSelect={setSelectedCustomerKey}
          onOfferCreated={addOffer}
          onOfferStatusChange={updateOfferStatus}
        />
      ) : null}
    </section>
  );
}

function AdminNav({ active }: { active: AdminView }) {
  const links: Array<[AdminView, string, string]> = [
    ["dashboard", "Dashboard", "/admin/dashboard"],
    ["requests", "Anfragen", "/admin/anfragen"],
    ["customers", "Kunden", "/admin/kunden"],
  ];

  return (
    <div className="mb-7 flex flex-col gap-4 rounded-xl border border-[#dbe7ec] bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-black uppercase text-[#18C7B8]">Admin CRM</p>
        <h1 className="text-2xl font-extrabold text-[#0F2A3D]">Klickhafen Lokalservice</h1>
      </div>
      <nav className="flex flex-wrap gap-2">
        {links.map(([key, label, href]) => (
          <Link
            key={key}
            href={href}
            className={`rounded-md px-4 py-3 text-sm font-black transition ${
              active === key
                ? "bg-[#0F2A3D] text-white"
                : "bg-[#F4F8FA] text-[#0F2A3D] hover:bg-[#e7fbf8]"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}

function DashboardView({
  requests,
  stats,
}: {
  requests: ServiceRequest[];
  stats: Record<string, number>;
}) {
  const statCards = [
    ["Anfragen gesamt", stats.total],
    ["Neue Anfragen", stats.new],
    ["Kontaktformular", stats.contact],
    ["Kostenrechner", stats.calculator],
    ["Kunden gesamt", stats.customers],
    ["Dateien gesamt", stats.files],
    ["Angebote gesamt", stats.offers],
    ["Entwürfe", stats.offerDrafts],
    ["Angenommene Angebote", stats.offerAccepted],
  ];

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map(([label, value]) => (
          <div key={label} className="rounded-xl border border-[#dbe7ec] bg-white p-5 shadow-sm">
            <p className="text-sm font-black uppercase text-[#64748B]">{label}</p>
            <p className="mt-3 text-4xl font-black text-[#0F2A3D]">{value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-xl border border-[#dbe7ec] bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl font-extrabold text-[#0F2A3D]">Letzte 5 Anfragen</h2>
            <Link href="/admin/anfragen" className="text-sm font-black text-[#18C7B8]">
              Alle ansehen
            </Link>
          </div>
          <div className="mt-4 grid gap-3">
            {requests.slice(0, 5).map((request) => {
              const summary = calculatorSummary(request);
              return (
                <div key={request.id} className="rounded-lg bg-[#F4F8FA] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-black text-[#0F2A3D]">{displayName(request)}</p>
                      <p className="text-sm text-[#64748B]">{summary.category}</p>
                    </div>
                    <Badge className={sourceClass(request.request_source)}>
                      {sourceLabel(request.request_source)}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs font-bold text-[#64748B]">{dateTime(request.created_at)}</p>
                </div>
              );
            })}
            {requests.length === 0 ? (
              <p className="rounded-md bg-[#F4F8FA] p-4 text-[#64748B]">
                Noch keine Anfragen vorhanden.
              </p>
            ) : null}
          </div>
        </div>

        <div className="rounded-xl border border-[#dbe7ec] bg-white p-5 shadow-sm">
          <h2 className="text-xl font-extrabold text-[#0F2A3D]">Status-Verteilung</h2>
          <div className="mt-4 grid gap-3">
            {statuses.map((status) => (
              <div key={status} className="flex items-center justify-between rounded-lg bg-[#F4F8FA] p-3">
                <span className="font-bold text-[#0F2A3D]">{statusLabel(status)}</span>
                <span className="font-black text-[#18C7B8]">
                  {requests.filter((request) => request.status === status).length}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <Link className="rounded-md bg-[#0F2A3D] px-4 py-3 text-center font-black text-white" href="/admin/anfragen">
              Alle Anfragen ansehen
            </Link>
            <Link className="rounded-md bg-[#18C7B8] px-4 py-3 text-center font-black text-[#0F2A3D]" href="/admin/kunden">
              Kunden ansehen
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function RequestsView({
  requests,
  selected,
  sourceFilter,
  statusFilter,
  onSourceFilter,
  onStatusFilter,
  onSelect,
  onStatusChange,
}: {
  requests: ServiceRequest[];
  selected: ServiceRequest | undefined;
  sourceFilter: string;
  statusFilter: string;
  onSourceFilter: (value: string) => void;
  onStatusFilter: (value: string) => void;
  onSelect: (id: string) => void;
  onStatusChange: (id: string, status: string) => void;
}) {
  return (
    <div className="grid gap-5">
      <div className="rounded-xl border border-[#dbe7ec] bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0F2A3D]">Anfragen</h1>
            <p className="text-[#64748B]">Kontaktformular- und Kostenrechner-Anfragen prüfen.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Filter label="Quelle" value={sourceFilter} onChange={onSourceFilter}>
              <option value="all">Alle</option>
              <option value="contact_form">Kontaktformular</option>
              <option value="cost_calculator">Kostenrechner</option>
            </Filter>
            <Filter label="Status" value={statusFilter} onChange={onStatusFilter}>
              <option value="all">Alle</option>
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {statusLabel(status)}
                </option>
              ))}
            </Filter>
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="text-xs uppercase text-[#64748B]">
              <tr className="border-b border-[#dbe7ec]">
                <th className="py-3 pr-3">Datum</th>
                <th className="py-3 pr-3">Quelle</th>
                <th className="py-3 pr-3">Name</th>
                <th className="py-3 pr-3">Telefon</th>
                <th className="py-3 pr-3">E-Mail</th>
                <th className="py-3 pr-3">Kategorie</th>
                <th className="py-3 pr-3">Preisschätzung</th>
                <th className="py-3 pr-3">Status</th>
                <th className="py-3">Aktion</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => {
                const summary = calculatorSummary(request);
                return (
                  <tr key={request.id} className="border-b border-[#eef5f8]">
                    <td className="py-3 pr-3 font-medium text-[#64748B]">{dateTime(request.created_at)}</td>
                    <td className="py-3 pr-3">
                      <Badge className={sourceClass(request.request_source)}>
                        {sourceLabel(request.request_source)}
                      </Badge>
                    </td>
                    <td className="py-3 pr-3 font-bold text-[#0F2A3D]">{displayName(request)}</td>
                    <td className="py-3 pr-3">{request.phone || "-"}</td>
                    <td className="py-3 pr-3">{request.email || "-"}</td>
                    <td className="py-3 pr-3">{summary.category}</td>
                    <td className="py-3 pr-3">{summary.priceEstimate}</td>
                    <td className="py-3 pr-3">
                      <Badge className={statusClass(request.status)}>{statusLabel(request.status)}</Badge>
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => onSelect(request.id)}
                        className="rounded-md bg-[#0F2A3D] px-3 py-2 text-xs font-black text-white"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {requests.length === 0 ? (
          <p className="mt-4 rounded-md bg-[#F4F8FA] p-4 text-[#64748B]">
            Keine Anfragen für diese Filter vorhanden.
          </p>
        ) : null}
      </div>

      {selected ? (
        <RequestDetail request={selected} onStatusChange={onStatusChange} />
      ) : null}
    </div>
  );
}

function RequestDetail({
  request,
  onStatusChange,
}: {
  request: ServiceRequest;
  onStatusChange: (id: string, status: string) => void;
}) {
  const summary = calculatorSummary(request);

  return (
    <article className="rounded-xl border border-[#dbe7ec] bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-[#0F2A3D]">{displayName(request)}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className={sourceClass(request.request_source)}>{sourceLabel(request.request_source)}</Badge>
            <Badge className={statusClass(request.status)}>{statusLabel(request.status)}</Badge>
          </div>
        </div>
        <select
          value={request.status}
          onChange={(event) => onStatusChange(request.id, event.target.value)}
          className="rounded-md border border-[#dbe7ec] bg-white px-4 py-3 font-bold"
        >
          {statuses.map((status) => (
            <option key={status} value={status}>
              {statusLabel(status)}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="Anrede" value={request.salutation ?? "-"} />
        <Info label="Vorname" value={request.first_name ?? "-"} />
        <Info label="Name" value={request.last_name ?? request.name ?? "-"} />
        <Info label="Telefon" value={request.phone || "-"} />
        <Info label="E-Mail" value={request.email ?? "-"} />
        <Info label="Erstellt" value={dateTime(request.created_at)} />
      </div>

      <div className="mt-6">
        <p className="text-sm font-bold text-[#0F2A3D]">Beschreibung</p>
        <p className="mt-2 whitespace-pre-wrap rounded-md bg-[#F4F8FA] p-4 text-sm text-[#425466]">
          {request.description || "-"}
        </p>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Info label="Kategorie" value={summary.category} />
        <Info label="Ausgewählte Leistungen" value={summary.extras} />
        <Info label="Aufwand" value={summary.effort} />
        <Info label="Entfernung" value={summary.distance} />
        <Info label="Preisschätzung" value={summary.priceEstimate} />
        <Info label="Festpreis-Vorschlag" value={summary.fixedPrice} />
      </div>

      {summary.notices.length > 0 ? (
        <div className="mt-4 grid gap-3">
          {summary.notices.map((notice) => (
            <p key={notice} className="rounded-md border border-[#dbe7ec] bg-[#F4F8FA] p-4 text-sm font-semibold text-[#0F2A3D]">
              {notice}
            </p>
          ))}
        </div>
      ) : null}

      <FilesGrid files={request.request_images ?? []} />
    </article>
  );
}

function CustomersView({
  customers,
  offers,
  selected,
  onSelect,
  onOfferCreated,
  onOfferStatusChange,
}: {
  customers: Customer[];
  offers: Offer[];
  selected: Customer | undefined;
  onSelect: (key: string) => void;
  onOfferCreated: (offer: Offer) => void;
  onOfferStatusChange: (id: string, status: string) => void;
}) {
  const [showOfferWizard, setShowOfferWizard] = useState(false);
  const customerOffers = selected
    ? offers.filter((offer) => offer.customer_key === selected.key)
    : [];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-xl border border-[#dbe7ec] bg-white p-5 shadow-sm">
        <h1 className="text-3xl font-extrabold text-[#0F2A3D]">Kunden</h1>
        <p className="text-[#64748B]">Automatisch aus allen Anfragen nach E-Mail oder Telefon gruppiert.</p>
        <div className="mt-5 grid max-h-[72vh] gap-3 overflow-auto">
          {customers.map((customer) => (
            <button
              key={customer.key}
              type="button"
              onClick={() => {
                setShowOfferWizard(false);
                onSelect(customer.key);
              }}
              className={`rounded-lg border p-4 text-left transition ${
                selected?.key === customer.key
                  ? "border-[#18C7B8] bg-[#e7fbf8]"
                  : "border-[#dbe7ec] bg-[#F4F8FA] hover:border-[#18C7B8]"
              }`}
            >
              <p className="font-black text-[#0F2A3D]">
                {[customer.salutation !== "-" ? customer.salutation : "", customer.firstName !== "-" ? customer.firstName : "", customer.lastName].filter(Boolean).join(" ")}
              </p>
              <p className="mt-1 text-sm text-[#64748B]">{customer.email}</p>
              <p className="mt-1 text-sm text-[#64748B]">{customer.phone}</p>
              <p className="mt-3 text-xs font-bold uppercase text-[#18C7B8]">
                {customer.requests.length} Anfrage(n)
              </p>
            </button>
          ))}
          {customers.length === 0 ? (
            <p className="rounded-md bg-[#F4F8FA] p-4 text-[#64748B]">Noch keine Kunden vorhanden.</p>
          ) : null}
        </div>
      </div>

      {selected ? (
        <article className="rounded-xl border border-[#dbe7ec] bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-[#0F2A3D]">Kundendetails</h2>
              <p className="mt-1 text-sm text-[#64748B]">
                Angebote, Anfragen und Dateien dieses Kunden.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowOfferWizard((current) => !current)}
              className="rounded-md bg-[#18C7B8] px-5 py-3 text-sm font-black text-[#0F2A3D] shadow-sm"
            >
              Angebot erstellen
            </button>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Info label="Anrede" value={selected.salutation} />
            <Info label="Vorname" value={selected.firstName} />
            <Info label="Name" value={selected.lastName} />
            <Info label="E-Mail" value={selected.email} />
            <Info label="Telefonnummer" value={selected.phone} />
            <Info label="Anfragen insgesamt" value={String(selected.requests.length)} />
            <Info label="Kontaktformular-Anfragen" value={String(selected.contactCount)} />
            <Info label="Kostenrechner-Anfragen" value={String(selected.calculatorCount)} />
            <Info label="Hochgeladene Dateien" value={String(selected.files.length)} />
            <Info label="Erste Anfrage" value={dateTime(selected.firstDate)} />
            <Info label="Letzte Anfrage" value={dateTime(selected.lastDate)} />
          </div>

          {showOfferWizard ? (
            <OfferWizard
              customer={selected}
              onCreated={(offer) => {
                onOfferCreated(offer);
              }}
            />
          ) : null}

          <div className="mt-6">
            <p className="text-sm font-bold text-[#0F2A3D]">Erstellte Angebote</p>
            <div className="mt-3 grid gap-3">
              {customerOffers.map((offer) => (
                <div key={offer.id} className="rounded-lg border border-[#dbe7ec] bg-[#F4F8FA] p-4">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <p className="font-black text-[#0F2A3D]">
                        {offer.offer_number ?? "-"}
                      </p>
                      <p className="mt-1 text-sm text-[#64748B]">
                        {dateTime(offer.created_at ?? new Date().toISOString())} ·{" "}
                        {formatMoney(offer.gross_total)}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {offer.credit_check_required ? (
                          <Badge className="bg-[#e7fbf8] text-[#0F2A3D] ring-[#18C7B8]/40">
                            Bonitätsprüfung
                          </Badge>
                        ) : null}
                        <Badge className={statusClass(offer.status ?? "draft")}>
                          {offerStatusLabels[offer.status ?? "draft"] ?? offer.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a
                        href={`/api/admin/offers/${offer.id}/pdf`}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md bg-[#0F2A3D] px-4 py-2 text-sm font-black text-white"
                      >
                        PDF herunterladen
                      </a>
                      <select
                        value={offer.status ?? "draft"}
                        onChange={(event) => onOfferStatusChange(offer.id, event.target.value)}
                        className="rounded-md border border-[#dbe7ec] bg-white px-3 py-2 text-sm font-bold text-[#0F2A3D]"
                      >
                        {offerStatuses.map((status) => (
                          <option key={status} value={status}>
                            {offerStatusLabels[status]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <Info
                      label="Bonitätsprüfung aktiviert"
                      value={offer.credit_check_required ? "Ja" : "Nein"}
                    />
                    <Info
                      label="Schwelle"
                      value={formatMoney(offer.credit_check_threshold ?? 500)}
                    />
                  </div>
                  {offer.credit_check_required ? (
                    <div className="mt-3 rounded-md bg-white p-3 ring-1 ring-[#dbe7ec]">
                      <p className="text-xs font-bold uppercase text-[#64748B]">
                        Einwilligungstext
                      </p>
                      <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#0F2A3D]">
                        {offer.credit_check_consent_text || "-"}
                      </p>
                    </div>
                  ) : null}
                </div>
              ))}
              {customerOffers.length === 0 ? (
                <p className="rounded-md bg-[#F4F8FA] p-4 text-sm text-[#64748B]">
                  Für diesen Kunden wurden noch keine Angebote erstellt.
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6">
            <p className="text-sm font-bold text-[#0F2A3D]">Anfragen dieses Kunden</p>
            <div className="mt-3 grid gap-3">
              {selected.requests.map((request) => {
                const summary = calculatorSummary(request);
                return (
                  <div key={request.id} className="rounded-lg bg-[#F4F8FA] p-4">
                    <div className="flex flex-wrap justify-between gap-2">
                      <p className="font-black text-[#0F2A3D]">{summary.category}</p>
                      <div className="flex flex-wrap gap-2">
                        <Badge className={sourceClass(request.request_source)}>
                          {sourceLabel(request.request_source)}
                        </Badge>
                        <Badge className={statusClass(request.status)}>
                          {statusLabel(request.status)}
                        </Badge>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-[#64748B]">{dateTime(request.created_at)}</p>
                    <p className="mt-2 text-sm font-semibold text-[#0F2A3D]">
                      {summary.priceEstimate}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <FilesGrid files={selected.files} />
        </article>
      ) : null}
    </div>
  );
}

function OfferWizard({
  customer,
  onCreated,
}: {
  customer: Customer;
  onCreated: (offer: Offer) => void;
}) {
  const latestRequest = customer.requests[0];
  const [step, setStep] = useState(1);
  const [createdOffer, setCreatedOffer] = useState<Offer | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState<OfferFormState>(() => ({
    offerNumber: generateOfferNumber(),
    offerDate: dateInputValue(),
    salutation: customer.salutation === "-" ? "Herr" : customer.salutation,
    firstName: customer.firstName === "-" ? "" : customer.firstName,
    lastName: customer.lastName === "-" ? "" : customer.lastName,
    email: customer.email === "-" ? "" : customer.email,
    phone: customer.phone === "-" ? "" : customer.phone,
    serviceCategory: calculatorSummary(latestRequest).category === "-"
      ? "Garten & Außenbereich"
      : calculatorSummary(latestRequest).category,
    serviceDescription: latestRequest?.description ?? "",
    executionLocation: latestRequest?.location ?? "",
    plannedDate: "",
    validUntil: addDaysInputValue(14),
    netPrice: "",
    discountPercent: "",
    specialPrice: "",
    materialCosts: "",
    travelCosts: "",
    disposalCosts: "",
    otherCosts: "",
    paymentType: "Zahlung nach Leistung",
    legalNotes: defaultOfferNotes,
    creditCheckRequired: false,
    creditCheckConsentText: defaultCreditCheckConsentText,
    creditCheckThreshold: "500",
  }));

  const price = calculateOfferPrice({
    netPrice: positiveNumber(form.netPrice),
    discountPercent: positiveNumber(form.discountPercent),
    specialPrice: positiveNumber(form.specialPrice),
    materialCosts: positiveNumber(form.materialCosts),
    travelCosts: positiveNumber(form.travelCosts),
    disposalCosts: positiveNumber(form.disposalCosts),
    otherCosts: positiveNumber(form.otherCosts),
    vatRate: 19,
  });

  function update<K extends keyof OfferFormState>(key: K, value: OfferFormState[K]) {
    setCreatedOffer(null);
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate() {
    if (!form.firstName.trim() || !form.lastName.trim() || (!form.email.trim() && !form.phone.trim())) {
      return "Bitte Kundendaten vollständig ausfüllen. E-Mail oder Telefonnummer ist erforderlich.";
    }

    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      return "Bitte eine gültige E-Mail-Adresse eintragen.";
    }

    if (!form.serviceDescription.trim()) {
      return "Bitte eine Leistungsbeschreibung eintragen.";
    }

    if (!form.validUntil.trim()) {
      return "Bitte die Gültigkeit des Angebots eintragen.";
    }

    if (positiveNumber(form.netPrice) <= 0 && positiveNumber(form.specialPrice) <= 0) {
      return "Bitte Preis netto oder Sonderpreis eintragen.";
    }

    if (positiveNumber(form.discountPercent) > 100) {
      return "Rabatt darf maximal 100 % betragen.";
    }

    if (form.creditCheckRequired && !form.creditCheckConsentText.trim()) {
      return "Bitte Einwilligungstext zur Bonitätsprüfung eintragen.";
    }

    return "";
  }

  async function createOffer() {
    setError("");
    const validationError = validate();

    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    const response = await fetch("/api/admin/offers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerKey: customer.key,
        requestId: latestRequest?.id,
        offerNumber: form.offerNumber,
        offerDate: form.offerDate,
        salutation: form.salutation,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
        serviceCategory: form.serviceCategory,
        serviceDescription: form.serviceDescription,
        executionLocation: form.executionLocation,
        plannedDate: form.plannedDate,
        validUntil: form.validUntil,
        netPrice: form.netPrice,
        discountPercent: form.discountPercent,
        specialPrice: form.specialPrice,
        materialCosts: form.materialCosts,
        travelCosts: form.travelCosts,
        disposalCosts: form.disposalCosts,
        otherCosts: form.otherCosts,
        paymentType: form.paymentType,
        legalNotes: form.legalNotes,
        creditCheckRequired: form.creditCheckRequired,
        creditCheckConsentText: form.creditCheckConsentText,
        creditCheckThreshold: form.creditCheckThreshold,
      }),
    });
    const result = (await response.json().catch(() => null)) as
      | { offer?: Offer; error?: string }
      | null;
    setLoading(false);

    if (!response.ok || !result?.offer) {
      setError(result?.error ?? "Angebot konnte nicht erstellt werden.");
      return;
    }

    setCreatedOffer(result.offer);
    onCreated(result.offer);
  }

  const stepTitle = [
    "Kundendaten prüfen",
    "Auftragsdaten",
    "Preisangaben",
    "Rechtliche Hinweise",
    "Vorschau & PDF erstellen",
  ][step - 1];

  return (
    <div className="mt-6 rounded-xl border border-[#18C7B8]/40 bg-[#F4F8FA] p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-[#18C7B8]">Angebots-Wizard</p>
          <h3 className="text-xl font-extrabold text-[#0F2A3D]">
            Schritt {step} von 5 · {stepTitle}
          </h3>
        </div>
        <div className="h-2 rounded-full bg-white sm:w-48">
          <div className="h-2 rounded-full bg-[#18C7B8]" style={{ width: `${(step / 5) * 100}%` }} />
        </div>
      </div>

      <p className="mt-4 rounded-md bg-white p-3 text-xs font-semibold leading-5 text-[#64748B]">
        Hinweis: Diese Vorlage ersetzt keine rechtliche Prüfung. Bitte prüfen Sie Ihre Angebots- und Pflichtangaben vor geschäftlicher Nutzung.
      </p>

      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_0.78fr]">
        <div className="rounded-lg bg-white p-4 ring-1 ring-[#dbe7ec]">
          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <WizardField label="Anrede">
                <select value={form.salutation} onChange={(event) => update("salutation", event.target.value)} className="input">
                  {["Herr", "Frau", "Divers"].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </WizardField>
              <WizardField label="Vorname" required>
                <input value={form.firstName} onChange={(event) => update("firstName", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Name" required>
                <input value={form.lastName} onChange={(event) => update("lastName", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="E-Mail">
                <input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Telefonnummer">
                <input value={form.phone} onChange={(event) => update("phone", event.target.value)} className="input" />
              </WizardField>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <WizardField label="Angebotsnummer">
                  <input value={form.offerNumber} onChange={(event) => update("offerNumber", event.target.value)} className="input" />
                </WizardField>
                <WizardField label="Angebotsdatum">
                  <input type="date" value={form.offerDate} onChange={(event) => update("offerDate", event.target.value)} className="input" />
                </WizardField>
                <WizardField label="Leistungsbereich">
                  <select value={form.serviceCategory} onChange={(event) => update("serviceCategory", event.target.value)} className="input">
                    {[
                      "Garten & Außenbereich",
                      "Reinigung",
                      "Montage & Innenausbau",
                      "Entrümpelung & Transport",
                      "Notfallservice",
                      "Sonstiges",
                    ].map((item) => (
                      <option key={item} value={item}>{item}</option>
                    ))}
                  </select>
                </WizardField>
                <WizardField label="Gültig bis" required>
                  <input type="date" value={form.validUntil} onChange={(event) => update("validUntil", event.target.value)} className="input" />
                </WizardField>
                <WizardField label="Ausführungsort">
                  <input value={form.executionLocation} onChange={(event) => update("executionLocation", event.target.value)} className="input" />
                </WizardField>
                <WizardField label="Geplanter Termin / Zeitraum">
                  <input value={form.plannedDate} onChange={(event) => update("plannedDate", event.target.value)} className="input" />
                </WizardField>
              </div>
              <WizardField label="Leistungsbeschreibung" required>
                <textarea value={form.serviceDescription} onChange={(event) => update("serviceDescription", event.target.value)} className="input min-h-32" />
              </WizardField>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <WizardField label="Preis netto" required>
                <input type="number" min="0" step="0.01" value={form.netPrice} onChange={(event) => update("netPrice", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Rabatt in %">
                <input type="number" min="0" max="100" step="0.01" value={form.discountPercent} onChange={(event) => update("discountPercent", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Sonderpreis final brutto">
                <input type="number" min="0" step="0.01" value={form.specialPrice} onChange={(event) => update("specialPrice", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Materialkosten">
                <input type="number" min="0" step="0.01" value={form.materialCosts} onChange={(event) => update("materialCosts", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Anfahrtskosten">
                <input type="number" min="0" step="0.01" value={form.travelCosts} onChange={(event) => update("travelCosts", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Entsorgungskosten">
                <input type="number" min="0" step="0.01" value={form.disposalCosts} onChange={(event) => update("disposalCosts", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Sonstige Kosten">
                <input type="number" min="0" step="0.01" value={form.otherCosts} onChange={(event) => update("otherCosts", event.target.value)} className="input" />
              </WizardField>
              <WizardField label="Zahlungsart">
                <select value={form.paymentType} onChange={(event) => update("paymentType", event.target.value)} className="input">
                  {[
                    "Vorkasse",
                    "Vorkasse bei Material",
                    "Teilzahlung nach Absprache",
                    "Zahlung nach Leistung",
                    "Barzahlung",
                    "Überweisung",
                    "Rechnung",
                  ].map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </WizardField>
            </div>
          ) : null}

          {step === 4 ? (
            <div className="grid gap-4">
              <WizardField label="Rechtliche Hinweise / Bedingungen">
                <textarea value={form.legalNotes} onChange={(event) => update("legalNotes", event.target.value)} className="input min-h-56" />
              </WizardField>
              <div className="rounded-lg border border-[#dbe7ec] bg-[#F4F8FA] p-4">
                {price.grossTotal > positiveNumber(form.creditCheckThreshold) ? (
                  <p className="mb-3 rounded-md bg-white p-3 text-sm font-bold leading-6 text-[#0F2A3D]">
                    Bei Angeboten über {formatMoney(positiveNumber(form.creditCheckThreshold))} kann vor Auftragsannahme eine Bonitätsprüfung erforderlich sein, sofern der Kunde ausdrücklich einwilligt.
                  </p>
                ) : null}
                <label className="flex gap-3 text-sm font-bold text-[#0F2A3D]">
                  <input
                    type="checkbox"
                    checked={form.creditCheckRequired}
                    onChange={(event) => update("creditCheckRequired", event.target.checked)}
                    className="mt-1 h-4 w-4 shrink-0 accent-[#18C7B8]"
                  />
                  <span>Bonitätsprüfung/SCHUFA-Abfrage bei diesem Angebot erforderlich</span>
                </label>
                <p className="mt-3 text-xs font-semibold leading-5 text-[#64748B]">
                  Hinweis: Eine Bonitätsprüfung darf nur mit geeigneter Rechtsgrundlage erfolgen, z. B. mit ausdrücklicher Einwilligung oder bei berechtigtem Interesse im Rahmen eines Zahlungsausfallrisikos. Bitte vor Nutzung rechtlich prüfen.
                </p>
                {form.creditCheckRequired ? (
                  <div className="mt-4 grid gap-3">
                    <p className="rounded-md bg-white p-3 text-sm font-bold text-[#0F2A3D]">
                      Alternativ kann Vorkasse vereinbart werden.
                    </p>
                    <WizardField label="Einwilligungstext Bonitätsprüfung" required>
                      <textarea
                        value={form.creditCheckConsentText}
                        onChange={(event) => update("creditCheckConsentText", event.target.value)}
                        className="input min-h-40"
                      />
                    </WizardField>
                  </div>
                ) : null}
              </div>
            </div>
          ) : null}

          {step === 5 ? (
            <OfferPreview form={form} price={price} />
          ) : null}

          {error ? <p className="mt-4 rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setStep((current) => Math.max(1, current - 1))}
              disabled={step === 1}
              className="rounded-md border border-[#dbe7ec] bg-white px-4 py-3 font-black text-[#0F2A3D]"
            >
              Zurück bearbeiten
            </button>
            {step < 5 ? (
              <button
                type="button"
                onClick={() => setStep((current) => Math.min(5, current + 1))}
                className="ml-auto rounded-md bg-[#0F2A3D] px-5 py-3 font-black text-white"
              >
                Weiter
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={createOffer}
                  disabled={loading}
                  className="ml-auto rounded-md bg-[#18C7B8] px-5 py-3 font-black text-[#0F2A3D]"
                >
                  {loading ? "PDF wird vorbereitet..." : "PDF erstellen"}
                </button>
                {createdOffer ? (
                  <a
                    href={`/api/admin/offers/${createdOffer.id}/pdf`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-md bg-[#0F2A3D] px-5 py-3 font-black text-white"
                  >
                    PDF herunterladen
                  </a>
                ) : null}
              </>
            )}
          </div>
        </div>

        <div className="rounded-lg bg-white p-4 ring-1 ring-[#dbe7ec]">
          <p className="text-sm font-black uppercase text-[#64748B]">Preiszusammenfassung</p>
          <div className="mt-4 grid gap-3">
            <Info label="Netto-Zwischensumme" value={formatMoney(price.baseNet)} />
            <Info label="Rabatt" value={price.discountPercent ? `${price.discountPercent}%` : "-"} />
            <Info label="MwSt 19 %" value={formatMoney(price.vatAmount)} />
            <Info
              label={price.usesSpecialPrice ? "Sonderpreis final brutto" : "Gesamtbetrag brutto"}
              value={formatMoney(price.grossTotal)}
            />
          </div>
          {createdOffer ? (
            <p className="mt-4 rounded-md bg-[#e7fbf8] p-3 text-sm font-bold text-[#0F2A3D]">
              Angebot {createdOffer.offer_number} wurde gespeichert.
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function OfferPreview({
  form,
  price,
}: {
  form: OfferFormState;
  price: ReturnType<typeof calculateOfferPrice>;
}) {
  return (
    <div className="rounded-lg border border-[#dbe7ec] bg-white p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase text-[#18C7B8]">Vorschau</p>
          <h3 className="text-2xl font-black text-[#0F2A3D]">Angebot</h3>
          <p className="mt-1 text-sm text-[#64748B]">{form.offerNumber}</p>
        </div>
        <div className="text-sm font-semibold text-[#64748B]">
          <p>Datum: {form.offerDate}</p>
          <p>Gültig bis: {form.validUntil}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <Info label="Kunde" value={[form.salutation, form.firstName, form.lastName].filter(Boolean).join(" ")} />
        <Info label="Kontakt" value={[form.email, form.phone].filter(Boolean).join(" · ") || "-"} />
        <Info label="Leistungsbereich" value={form.serviceCategory} />
        <Info label="Ausführungsort" value={form.executionLocation || "-"} />
        <Info label="Termin / Zeitraum" value={form.plannedDate || "-"} />
        <Info label="Zahlungsart" value={form.paymentType} />
      </div>
      <div className="mt-4 rounded-md bg-[#F4F8FA] p-4">
        <p className="text-xs font-bold uppercase text-[#64748B]">Leistungsbeschreibung</p>
        <p className="mt-2 whitespace-pre-wrap text-sm font-semibold text-[#0F2A3D]">
          {form.serviceDescription || "-"}
        </p>
      </div>
      <div className="mt-4 rounded-md border border-[#18C7B8] bg-[#e7fbf8] p-4">
        <p className="text-sm font-black text-[#0F2A3D]">
          {price.usesSpecialPrice ? "Sonderpreis final brutto" : "Gesamtbetrag brutto"}
        </p>
        <p className="mt-2 text-3xl font-black text-[#0F2A3D]">{formatMoney(price.grossTotal)}</p>
      </div>
      {form.creditCheckRequired ? (
        <div className="mt-4 rounded-md border border-[#dbe7ec] bg-[#F4F8FA] p-4">
          <p className="text-sm font-black text-[#0F2A3D]">
            Einwilligung zur Bonitätsprüfung
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm font-semibold leading-6 text-[#64748B]">
            {form.creditCheckConsentText || "-"}
          </p>
        </div>
      ) : null}
    </div>
  );
}

function WizardField({
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

function FilesGrid({ files }: { files: RequestImage[] }) {
  return (
    <div className="mt-6">
      <p className="text-sm font-bold text-[#0F2A3D]">Dateien</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {files.map((file) => (
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
            <span className="mt-1 block truncate text-xs text-[#64748B]">{file.file_name}</span>
          </a>
        ))}
        {files.length === 0 ? (
          <p className="rounded-md bg-[#F4F8FA] p-4 text-sm text-[#64748B]">
            Keine Dateien hochgeladen.
          </p>
        ) : null}
      </div>
    </div>
  );
}

function Filter({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-xs font-black uppercase text-[#64748B]">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-[#dbe7ec] bg-white px-4 py-3 font-bold text-[#0F2A3D]"
      >
        {children}
      </select>
    </label>
  );
}

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black ring-1 ${className}`}>
      {children}
    </span>
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

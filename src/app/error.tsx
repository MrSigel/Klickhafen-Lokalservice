"use client";

import Link from "next/link";
import { ContactFallback } from "@/components/contact-fallback";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen bg-[#F4F8FA] px-4 py-16 text-[#10212E] sm:px-6">
      <section className="mx-auto max-w-3xl rounded-lg border border-[#dbe7ec] bg-white p-6 shadow-[0_20px_55px_rgba(15,42,61,0.08)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">Fehler</p>
        <h1 className="mt-3 text-3xl font-black text-[#0F2A3D] sm:text-4xl">
          Da ist etwas schiefgelaufen.
        </h1>
        <p className="mt-4 leading-8 text-[#64748B]">
          Bitte laden Sie die Seite neu oder kontaktieren Sie uns direkt. Wir helfen Ihnen gerne
          weiter.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={reset}
            className="rounded-md bg-[#0F2A3D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#14354d]"
          >
            Seite neu laden
          </button>
          <Link
            href="/"
            className="rounded-md border border-[#dbe7ec] bg-[#F4F8FA] px-5 py-3 text-center text-sm font-black text-[#0F2A3D] transition hover:border-[#18C7B8] hover:bg-white"
          >
            Zur Startseite
          </Link>
        </div>
        <ContactFallback
          className="mt-6"
          title="Direkt Kontakt aufnehmen"
          text="Wenn der Fehler bestehen bleibt, erreichen Sie uns direkt per WhatsApp, Telefon oder E-Mail."
        />
      </section>
    </main>
  );
}

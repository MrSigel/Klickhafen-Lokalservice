import Link from "next/link";
import { ContactFallback } from "@/components/contact-fallback";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[#F4F8FA] px-4 py-16 text-[#10212E] sm:px-6">
      <section className="mx-auto max-w-3xl rounded-lg border border-[#dbe7ec] bg-white p-6 shadow-[0_20px_55px_rgba(15,42,61,0.08)] sm:p-8">
        <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">404</p>
        <h1 className="mt-3 text-3xl font-black text-[#0F2A3D] sm:text-4xl">
          Diese Seite wurde nicht gefunden.
        </h1>
        <p className="mt-4 leading-8 text-[#64748B]">
          Die gewünschte Seite existiert nicht oder wurde verschoben. Sie können zurück zur
          Startseite gehen oder uns direkt kontaktieren.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/"
            className="rounded-md bg-[#0F2A3D] px-5 py-3 text-center text-sm font-black text-white transition hover:bg-[#14354d]"
          >
            Zur Startseite
          </Link>
          <Link
            href="/#anfrage"
            className="rounded-md bg-[#18C7B8] px-5 py-3 text-center text-sm font-black text-[#0F2A3D] transition hover:bg-[#15b6a8]"
          >
            Kostenlose Anfrage stellen
          </Link>
        </div>
        <div className="mt-6 rounded-md border border-[#dbe7ec] bg-[#F4F8FA] p-4">
          <p className="font-black text-[#0F2A3D]">
            Suchen Sie Hilfe rund um Haus, Garten oder Objektpflege?
          </p>
          <p className="mt-2 text-sm leading-6 text-[#64748B]">
            Stellen Sie direkt eine Anfrage oder senden Sie Ihr Anliegen per WhatsApp.
          </p>
        </div>
        <ContactFallback
          className="mt-6"
          title="Direkt kontaktieren"
          text="Wir helfen Ihnen schnell weiter, auch wenn die gewünschte Seite nicht gefunden wurde."
          whatsappLabel="WhatsApp kontaktieren"
        />
      </section>
    </main>
  );
}

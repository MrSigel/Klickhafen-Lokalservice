import Link from "next/link";

type LegalPageProps = {
  title: string;
  intro: string;
  children: React.ReactNode;
};

export function LegalPage({ title, intro, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#F4F8FA] text-[#10212E]">
      <header className="sticky top-0 z-30 border-b border-white/60 bg-white/90 shadow-sm backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" aria-label="Klickhafen Lokalservice" className="flex min-w-0 items-center">
            <img
              src="/klickhafen_logo_transparent.png"
              alt="Klickhafen"
              className="h-11 w-auto max-w-[168px] object-contain sm:h-12 sm:max-w-[220px]"
            />
          </Link>
          <div className="hidden items-center gap-7 text-sm font-bold text-[#0F2A3D] md:flex">
            <Link className="transition hover:text-[#18C7B8]" href="/#leistungen">
              Leistungen
            </Link>
            <Link className="transition hover:text-[#18C7B8]" href="/#ablauf">
              Ablauf
            </Link>
            <Link className="transition hover:text-[#18C7B8]" href="/#kostenrechner">
              Kostenrechner
            </Link>
            <Link className="transition hover:text-[#18C7B8]" href="/#anfrage">
              Anfrage
            </Link>
          </div>
          <Link
            href="/#anfrage"
            className="shrink-0 rounded-md bg-[#18C7B8] px-5 py-3 text-sm font-extrabold text-[#0F2A3D] shadow-[0_10px_24px_rgba(24,199,184,0.28)] transition hover:bg-[#15b6a8]"
          >
            Anfrage
          </Link>
        </nav>
      </header>

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <article className="mx-auto max-w-4xl rounded-lg border border-[#dbe7ec] bg-white p-6 shadow-[0_20px_55px_rgba(15,42,61,0.08)] sm:p-8">
          <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">
            Rechtlicher Hinweis
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#0F2A3D] sm:text-4xl">
            {title}
          </h1>
          <p className="mt-4 leading-8 text-[#64748B]">{intro}</p>
          <div className="legal-content mt-8 grid gap-7">{children}</div>
        </article>
      </main>

      <footer className="bg-[#0F2A3D] px-4 py-10 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-[1.35fr_1fr_1fr]">
            <div>
              <img
                src="/klickhafen_logo_transparent.png"
                alt="Klickhafen"
                className="h-12 w-auto max-w-[220px] object-contain brightness-0 invert"
              />
              <p className="mt-3 max-w-sm text-sm leading-6 text-[#d5e6ec]">
                Haus, Garten & Objektservice rund um Castrop-Rauxel.
              </p>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">
                Navigation
              </p>
              <div className="mt-4 grid gap-3 text-sm font-medium text-[#d5e6ec]">
                <Link className="transition hover:text-[#18C7B8]" href="/#leistungen">
                  Leistungen
                </Link>
                <Link className="transition hover:text-[#18C7B8]" href="/#ablauf">
                  Ablauf
                </Link>
                <Link className="transition hover:text-[#18C7B8]" href="/#kostenrechner">
                  Kostenrechner
                </Link>
                <Link className="transition hover:text-[#18C7B8]" href="/#anfrage">
                  Anfrage
                </Link>
              </div>
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-wide text-[#18C7B8]">
                Rechtliches
              </p>
              <div className="mt-4 grid gap-3 text-sm font-medium text-[#d5e6ec]">
                <Link className="transition hover:text-[#18C7B8]" href="/impressum">
                  Impressum
                </Link>
                <Link className="transition hover:text-[#18C7B8]" href="/datenschutz">
                  Datenschutz
                </Link>
                <Link className="transition hover:text-[#18C7B8]" href="/agb">
                  AGB
                </Link>
                <Link className="transition hover:text-[#18C7B8]" href="/widerruf">
                  Widerruf
                </Link>
                <Link className="transition hover:text-[#18C7B8]" href="/#anfrage">
                  Kontakt
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-white/12 pt-5 text-center">
            <a
              href="https://klickhafen.net"
              target="_blank"
              rel="noreferrer"
              className="inline-grid rounded-md px-3 py-2 text-sm font-semibold text-[#d5e6ec] transition hover:bg-white/10 hover:text-[#18C7B8]"
            >
              <span>© Klickhafen Lokalservice</span>
              <span className="text-xs font-medium text-[#9fb9c4]">Ein Bereich von Klickhafen</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

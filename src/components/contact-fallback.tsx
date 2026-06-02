"use client";

import { motion, useReducedMotion } from "framer-motion";

type ContactFallbackProps = {
  title?: string;
  text?: string;
  whatsappLabel?: string;
  whatsappText?: string;
  className?: string;
};

const defaultTitle = "Aktuell gibt es Schwierigkeiten mit unserem Formular.";
const defaultText =
  "Unsere Techniker arbeiten bereits daran. Bitte kontaktieren Sie uns direkt telefonisch, per WhatsApp oder per E-Mail.";
const defaultWhatsappText =
  "Hallo, ich habe eine Anfrage über Ihre Website. Ich möchte folgendes Anliegen besprechen:";

export function ContactFallback({
  title = defaultTitle,
  text = defaultText,
  whatsappLabel = "WhatsApp öffnen",
  whatsappText = defaultWhatsappText,
  className = "",
}: ContactFallbackProps) {
  const reduceMotion = useReducedMotion();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "4915563535989";
  const phoneNumber = process.env.NEXT_PUBLIC_PHONE_NUMBER ?? "+4915563535989";
  const email = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "kontakt@klickhafen.de";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappText)}`;

  return (
    <motion.div
      className={`rounded-lg border border-[#dbe7ec] bg-white p-5 shadow-[0_18px_45px_rgba(15,42,61,0.1)] ${className}`}
      {...(reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 12 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.25 },
          })}
    >
      <div className="flex items-start gap-4">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#0F2A3D] text-[#18C7B8]">
          <svg
            width="25"
            height="25"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M12 3 5 6v5c0 4.6 3 8.5 7 10 4-1.5 7-5.4 7-10V6l-7-3Z" />
            <path d="M9.5 12.2 11.3 14l3.4-4" />
          </svg>
        </span>
        <div>
          <h3 className="text-xl font-black text-[#0F2A3D]">{title}</h3>
          <p className="mt-2 leading-7 text-[#64748B]">{text}</p>
        </div>
      </div>
      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        <ContactButton href={whatsappUrl} label={whatsappLabel} primary />
        <ContactButton href={`tel:${phoneNumber.replace(/\s/g, "")}`} label="Telefonisch anrufen" />
        <ContactButton href={`mailto:${email}`} label="E-Mail schreiben" />
      </div>
    </motion.div>
  );
}

function ContactButton({
  href,
  label,
  primary,
}: {
  href: string;
  label: string;
  primary?: boolean;
}) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={`rounded-md px-4 py-3 text-center text-sm font-black transition ${
        primary
          ? "bg-[#18C7B8] text-[#0F2A3D] hover:bg-[#15b6a8]"
          : "border border-[#dbe7ec] bg-[#F4F8FA] text-[#0F2A3D] hover:border-[#18C7B8] hover:bg-white"
      }`}
    >
      {label}
    </a>
  );
}

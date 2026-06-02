"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const storageKey = "whatsapp_widget_seen";
const message =
  "Schreiben Sie mir direkt über WhatsApp und schicken Sie mir dort Ihr Anliegen für einen schnellen und reibungslosen Prozess.";
const prefilledText =
  "Hallo, ich habe eine Anfrage über Ihre Website. Ich möchte folgendes Anliegen besprechen:";

export function WhatsAppWidget() {
  const [showBubble, setShowBubble] = useState(false);
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const isAdminRoute = pathname?.startsWith("/admin");
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "4915563535989";
  const whatsappUrl = useMemo(
    () => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(prefilledText)}`,
    [whatsappNumber],
  );

  useEffect(() => {
    if (isAdminRoute) {
      return;
    }

    setShowBubble(localStorage.getItem(storageKey) !== "true");
  }, [isAdminRoute]);

  if (isAdminRoute) {
    return null;
  }

  function hideBubble() {
    localStorage.setItem(storageKey, "true");
    setShowBubble(false);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[60] flex max-w-[calc(100vw-2.5rem)] flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      <AnimatePresence>
        {showBubble ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 10 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="relative max-w-[280px] rounded-2xl border border-[#D9E5EA] bg-white p-4 pr-10 text-sm leading-6 text-[#10212E] shadow-[0_18px_45px_rgba(15,42,61,0.16)] sm:max-w-[320px]"
          >
            <button
              type="button"
              onClick={hideBubble}
              className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-md text-[#64748B] transition hover:bg-[#F4F8FA] hover:text-[#0F2A3D]"
              aria-label="WhatsApp-Hinweis schließen"
            >
              <span aria-hidden="true">×</span>
            </button>
            {message}
            <span className="absolute bottom-[-7px] right-7 h-3.5 w-3.5 rotate-45 border-b border-r border-[#D9E5EA] bg-white" />
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        onClick={hideBubble}
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#18C7B8] text-[#0F2A3D] shadow-[0_16px_36px_rgba(15,42,61,0.24)] transition hover:bg-[#15b6a8] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-5 sm:py-4"
        aria-label="WhatsApp öffnen"
        {...(reduceMotion ? {} : { whileHover: { scale: 1.04 }, whileTap: { scale: 0.96 } })}
      >
        <svg
          width="25"
          height="25"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.9"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-12.6 7.3L3 20l1.5-5A8.4 8.4 0 1 1 21 11.5Z" />
          <path d="M8.8 9.1c.2 3 2.5 5.2 5.4 6" />
          <path d="m8.9 9 .9-.9 1.4 1.4-.7 1" />
          <path d="m14.2 15.1 1-.7 1.4 1.4-.9.9" />
        </svg>
        <span className="hidden text-sm font-black sm:inline">WhatsApp</span>
      </motion.a>
    </div>
  );
}

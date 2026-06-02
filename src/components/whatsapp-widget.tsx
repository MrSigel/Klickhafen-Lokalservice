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
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_rgba(37,211,102,0.34)] transition hover:bg-[#1EBE5D] sm:h-auto sm:w-auto sm:gap-2 sm:rounded-2xl sm:px-5 sm:py-4"
        aria-label="WhatsApp öffnen"
        {...(reduceMotion ? {} : { whileHover: { scale: 1.04 }, whileTap: { scale: 0.96 } })}
      >
        <svg
          width="27"
          height="27"
          viewBox="0 0 32 32"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M16.01 3.2C9.03 3.2 3.35 8.79 3.35 15.66c0 2.2.59 4.35 1.71 6.23L3.2 28.8l7.13-1.84a12.8 12.8 0 0 0 5.68 1.34c6.98 0 12.66-5.59 12.66-12.46S22.99 3.2 16.01 3.2Zm0 22.97c-1.88 0-3.72-.5-5.33-1.46l-.38-.23-4.24 1.1 1.13-4.09-.26-.42a10.12 10.12 0 0 1-1.56-5.41c0-5.7 4.78-10.33 10.65-10.33 5.86 0 10.64 4.63 10.64 10.33s-4.78 10.51-10.65 10.51Zm5.84-7.72c-.32-.16-1.9-.92-2.2-1.03-.29-.11-.5-.16-.72.16-.21.31-.82 1.03-1.01 1.24-.19.21-.37.24-.69.08-.32-.16-1.35-.49-2.58-1.56-.95-.84-1.6-1.87-1.78-2.19-.19-.31-.02-.48.14-.64.15-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.7-.98-2.33-.26-.61-.52-.53-.72-.54h-.61c-.21 0-.56.08-.85.4-.29.31-1.12 1.08-1.12 2.63 0 1.55 1.15 3.05 1.31 3.26.16.21 2.27 3.41 5.49 4.78.77.33 1.37.53 1.83.68.77.24 1.47.21 2.03.13.62-.09 1.9-.76 2.17-1.5.27-.74.27-1.37.19-1.5-.08-.13-.29-.21-.61-.37Z" />
        </svg>
        <span className="hidden text-sm font-black sm:inline">WhatsApp</span>
      </motion.a>
    </div>
  );
}

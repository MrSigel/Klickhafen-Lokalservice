"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

export function CookieNotice() {
  const [visible, setVisible] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    setVisible(localStorage.getItem("kh_cookie_notice") !== "accepted");
  }, []);

  function acceptNotice() {
    localStorage.setItem("kh_cookie_notice", "accepted");
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible ? (
        <motion.aside
          initial={reduceMotion ? false : { opacity: 0, x: 34 }}
          animate={reduceMotion ? undefined : { opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: 34 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-24 right-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-lg border border-[#dbe7ec] bg-white p-5 text-[#10212E] shadow-[0_22px_55px_rgba(15,42,61,0.18)] sm:bottom-28 sm:right-6"
          aria-label="Cookie-Hinweis"
        >
          <div className="flex items-start gap-3">
            <span className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[#0F2A3D] text-[#18C7B8]">
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 22a10 10 0 0 0 10-10 4 4 0 0 1-4-4 4 4 0 0 1-4-4 10 10 0 1 0-2 18Z" />
                <path d="M8 10h.01" />
                <path d="M12 15h.01" />
                <path d="M15 11h.01" />
              </svg>
            </span>
            <div>
              <p className="text-base font-black text-[#0F2A3D]">Cookie-Hinweis</p>
              <p className="mt-2 text-sm leading-6 text-[#425466]">
                Diese Website verwendet derzeit nur technisch notwendige Verarbeitung. Weitere
                Informationen finden Sie in der{" "}
                <a
                  href="/datenschutz"
                  className="font-bold text-[#0F2A3D] underline decoration-[#18C7B8] underline-offset-4 hover:text-[#18C7B8]"
                >
                  Datenschutzerklärung
                </a>
                .
              </p>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-[1fr_auto]">
            <a
              href="/datenschutz"
              className="rounded-md border border-[#dbe7ec] px-4 py-3 text-center text-sm font-black text-[#0F2A3D] transition hover:border-[#18C7B8] hover:bg-[#F4F8FA]"
            >
              Mehr erfahren
            </a>
            <button
              type="button"
              onClick={acceptNotice}
              className="rounded-md bg-[#0F2A3D] px-5 py-3 text-sm font-black text-white transition hover:bg-[#14354d]"
            >
              Verstanden
            </button>
          </div>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}

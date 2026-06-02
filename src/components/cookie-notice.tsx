"use client";

import { useEffect, useState } from "react";

export function CookieNotice() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_COOKIE_BANNER === "true";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    setVisible(localStorage.getItem("kh_cookie_notice") !== "accepted");
  }, [enabled]);

  if (!enabled || !visible) {
    return null;
  }

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-3xl rounded-lg border border-[#dbe7ec] bg-white p-4 text-[#10212E] shadow-[0_22px_55px_rgba(15,42,61,0.18)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-[#425466]">
          Diese Website verwendet derzeit nur technisch notwendige Verarbeitung. Weitere Hinweise
          finden Sie in der Datenschutzerklärung.
        </p>
        <button
          type="button"
          onClick={() => {
            localStorage.setItem("kh_cookie_notice", "accepted");
            setVisible(false);
          }}
          className="rounded-md bg-[#0F2A3D] px-4 py-2 text-sm font-black text-white"
        >
          Verstanden
        </button>
      </div>
    </div>
  );
}

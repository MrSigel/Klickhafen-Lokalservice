"use client";

import { FormEvent, useState } from "react";

export function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      setLoading(false);
      setError("Passwort ist ungültig.");
      return;
    }

    window.location.reload();
  }

  return (
    <section className="mx-auto max-w-md rounded-lg bg-white p-6 shadow-sm ring-1 ring-[#dbe7ec]">
      <h1 className="text-2xl font-extrabold text-[#0F2A3D]">Adminbereich</h1>
      <form onSubmit={submit} className="mt-6 grid gap-4">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-[#0F2A3D]">Passwort</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-md border border-[#dbe7ec] bg-white px-4 py-3 outline-none focus:border-[#18C7B8]"
            required
          />
        </label>
        {error ? <p className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</p> : null}
        <button
          type="submit"
          disabled={loading}
          className="rounded-md bg-[#0F2A3D] px-5 py-3 font-bold text-white"
        >
          {loading ? "Prüfen..." : "Einloggen"}
        </button>
      </form>
    </section>
  );
}

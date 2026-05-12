// MF maps — V1
// Structure simplifiée prête pour Vercel
// Next.js + React + Tailwind

// =========================
// package.json
// =========================
{
  "name": "mf-maps",
  "private": true,
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "latest",
    "react": "latest",
    "react-dom": "latest"
  }
}

// =========================
// app/page.js
// =========================
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  // IMPORTANT :
  // Remplacer l'URL ci-dessous par ton export CSV Google Sheets.

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzIr6m4Itx77Zc2yBD4drjlHKCqF44afUdNRCmWU3QW7LyfY-o1rQulVH2_-dmjcOUjehN9hPZCbk9/pub?gid=398812539&single=true&output=csv";

  useEffect(() => {
    async function loadStations() {
      try {
        const response = await fetch(csvUrl);
        const text = await response.text();

        const rows = text.split("\n").slice(1);

        const parsed = rows
          .filter((row) => row.trim() !== "")
          .map((row) => {
            const cols = row.split(",");

            return {
              station: cols[0] || "",
              type: cols[1] || "",
              latitude: cols[2] || "",
              longitude: cols[3] || "",
              contacts: cols[4] || "",
              sim: cols[5] || "",
              password: cols[6] || "",
              notes: cols[7] || "",
              insee: cols[8] || "",
            };
          });

        setStations(parsed);
      } catch (err) {
        console.error(err);
      }
    }

    loadStations();
  }, []);

  const filtered = stations.filter((s) =>
    s.station.toLowerCase().includes(search.toLowerCase())
  );

  function openWaze(lat, lng) {
    window.open(
      `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-4">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-blue-900 text-white p-5">
            <h1 className="text-3xl font-bold">MF maps</h1>
            <p className="opacity-80">Stations météo</p>
          </div>

          <div className="p-4">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une station"
              className="w-full rounded-2xl border p-4"
            />
          </div>

          <div className="space-y-4 p-4">
            {filtered.map((station, index) => (
              <div
                key={index}
                className="rounded-3xl bg-slate-50 border p-4"
              >
                <div className="flex justify-between gap-4">
                  <div>
                    <h2 className="font-bold text-xl">
                      {station.station}
                    </h2>

                    <p className="text-slate-500 text-sm">
                      {station.type}
                    </p>

                    <p className="text-slate-400 text-sm">
                      INSEE : {station.insee}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        openWaze(
                          station.latitude,
                          station.longitude
                        )
                      }
                      className="bg-blue-600 text-white px-4 py-2 rounded-2xl"
                    >
                      Waze
                    </button>

                    <button
                      onClick={() => setSelected(station)}
                      className="bg-slate-200 px-4 py-2 rounded-2xl"
                    >
                      Infos
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {selected ? (
            <div>
              <div className="bg-blue-900 text-white p-5">
                <h2 className="text-2xl font-bold">
                  {selected.station}
                </h2>
                <p>{selected.type}</p>
              </div>

              <div className="p-6 space-y-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Contacts
                  </h3>

                  <div className="rounded-2xl bg-slate-100 p-4 whitespace-pre-wrap">
                    {selected.contacts || "Aucun contact"}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Identifiant SIM
                  </h3>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    {selected.sim || "Non renseigné"}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Mot de passe SIM
                  </h3>

                  <div className="rounded-2xl bg-slate-100 p-4">
                    {selected.password || "Non renseigné"}
                  </div>
                </div>

                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Notes
                  </h3>

                  <textarea
                    defaultValue={selected.notes}
                    className="w-full min-h-[160px] rounded-2xl border p-4"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-10 text-slate-400 text-center">
              Sélectionne une station
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

// =========================
// Instructions
// =========================

// 1. Créer un projet Next.js
// 2. Coller ce fichier
// 3. Push sur GitHub
// 4. Importer sur Vercel
// 5. Remplacer csvUrl par ton Google Sheets export CSV
// 6. Déployer

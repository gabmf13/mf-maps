
"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

  // IMPORTANT :
  // Remplacer l'URL ci-dessous par ton export CSV Google Sheets.

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-EXAMPLE/pub?output=csv";

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

  function open🧭(lat, lng) {
    window.open(
      `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f5f7] p-4">
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative overflow-hidden">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#022859] to-[#003b82] text-white p-5">
            <div className="flex items-center gap-4">
              <img
                src="/MF_maps_logo.png"
                alt="MF maps"
                className="w-16 h-16 rounded-2xl shadow-lg bg-white p-1"
              />

              <div>
                <h1 className="text-3xl font-bold tracking-tight">MF maps</h1>
                <p className="opacity-80">Stations météo</p>
              </div>
            </div>
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

          <div className="space-y-4 p-4 max-h-\[75vh\] overflow-y-auto">
            {filtered.map((station, index) => (
              <div
                key={index}
                className="rounded-[28px] bg-white border border-slate-100 shadow-lg p-4 transition-all duration-200"
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
                        open🧭(
                          station.latitude,
                          station.longitude
                        )
                      }
                      className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-5 py-3 rounded-2xl shadow-lg font-semibold hover:opacity-90 transition"
                    >
                      🧭
                    </button>

                    <button
                      onClick={() => setSelected(station)}
                      className="bg-slate-900 text-white px-5 py-3 rounded-2xl shadow font-semibold hover:bg-slate-800 transition"
                    >
                      ℹ️
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
              <div className="bg-gradient-to-r from-[#022859] to-[#003b82] text-white p-5">
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
                    placeholder="Ajouter une note..."
                    defaultValue={selected.notes}
                    className="w-full min-h-[160px] rounded-2xl border p-4"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-10 text-slate-400 text-center">
              🛰️ Sélectionne une station météo pour afficher les informations détaillées
            </div>
          )}
        </div>
      </div>
    </main>
  );
}


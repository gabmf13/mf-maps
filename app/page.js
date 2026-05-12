"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");

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
    <main className="min-h-screen bg-[#eef2f7] text-slate-900">
      <div className="max-w-md mx-auto min-h-screen bg-[#f7f8fa] relative overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-br from-[#001f4d] via-[#003b82] to-[#0d5bd7] text-white px-5 pt-14 pb-8 rounded-b-[34px] shadow-2xl">
          <div className="flex items-center gap-4">
            <img
              src="/MF_maps_logo.png"
              alt="MF maps"
              className="w-16 h-16 rounded-2xl shadow-lg bg-white p-1"
            />

            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                MF maps
              </h1>

              <p className="opacity-80">
                Stations météo
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="px-4 -mt-5 relative z-20">
          <div className="bg-white rounded-[28px] shadow-xl border border-slate-100 px-4 py-3 flex items-center gap-3">

            <span className="text-slate-400 text-xl">
              🔍
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une station météo..."
              className="w-full bg-transparent outline-none text-[17px]"
            />
          </div>
        </div>

        {/* LISTE */}
        <div className="px-4 pt-4 pb-32 space-y-4 overflow-y-auto">

          {filtered.map((station, index) => (

            <div
              key={index}
              className="rounded-[30px] bg-white border border-slate-100 shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-4 active:scale-[0.98] transition-all duration-200"
            >

              <div className="flex justify-between gap-4">

                {/* INFOS */}
                <div className="flex items-start gap-4 flex-1">

                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-white text-2xl shadow-lg">
                    🛰️
                  </div>

                  <div className="flex-1">

                    <h2 className="font-bold text-[20px] tracking-tight">
                      {station.station}
                    </h2>

                    <p className="text-slate-500 text-sm">
                      {station.type}
                    </p>

                    <p className="text-slate-400 text-sm">
                      📍 {station.latitude}, {station.longitude}
                    </p>

                    <p className="text-slate-400 text-sm">
                      INSEE : {station.insee}
                    </p>

                  </div>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      openWaze(
                        station.latitude,
                        station.longitude
                      )
                    }
                    className="bg-[#1677ff] text-white w-14 h-14 rounded-2xl shadow-lg font-semibold text-xl flex items-center justify-center"
                  >
                    🧭
                  </button>

                  <button
                    onClick={() => setSelected(station)}
                    className="bg-slate-100 text-slate-700 w-14 h-14 rounded-2xl font-semibold text-xl flex items-center justify-center"
                  >
                    ℹ️
                  </button>

                </div>
              </div>
            </div>

          ))}
        </div>

        {/* DETAILS */}
        {selected && (
          <div className="fixed inset-0 bg-black/40 z-50 flex items-end">

            <div className="bg-white w-full rounded-t-[36px] p-6 max-h-[85vh] overflow-y-auto">

              <div className="w-16 h-1 bg-slate-300 rounded-full mx-auto mb-6"></div>

              <h2 className="text-2xl font-bold mb-2">
                {selected.station}
              </h2>

              <p className="text-slate-500 mb-6">
                {selected.type}
              </p>

              <button
                onClick={() =>
                  openWaze(
                    selected.latitude,
                    selected.longitude
                  )
                }
                className="w-full bg-[#1677ff] text-white rounded-2xl py-4 font-semibold text-lg mb-6"
              >
                🧭 Ouvrir dans Waze
              </button>

              <div className="space-y-4">

                <div className="bg-slate-100 rounded-2xl p-4">
                  <p className="text-sm text-slate-500 mb-1">
                    Contacts
                  </p>

                  <p className="font-medium whitespace-pre-wrap">
                    {selected.contacts || "Aucun contact"}
                  </p>
                </div>

                <div className="bg-slate-100 rounded-2xl p-4">
                  <p className="text-sm text-slate-500 mb-1">
                    Identifiant SIM
                  </p>

                  <p className="font-medium">
                    {selected.sim || "Non renseigné"}
                  </p>
                </div>

                <div className="bg-slate-100 rounded-2xl p-4">
                  <p className="text-sm text-slate-500 mb-1">
                    Mot de passe SIM
                  </p>

                  <p className="font-medium">
                    {selected.password || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500 mb-2">
                    Notes
                  </p>

                  <textarea
                    defaultValue={selected.notes}
                    placeholder="Ajouter une note..."
                    className="w-full min-h-[140px] rounded-2xl border border-slate-200 p-4"
                  />
                </div>

              </div>

              <button
                onClick={() => setSelected(null)}
                className="w-full mt-6 bg-slate-200 rounded-2xl py-4 font-semibold"
              >
                Fermer
              </button>

            </div>
          </div>
        )}

        {/* BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white/95 backdrop-blur border-t border-slate-200 flex justify-around py-4 z-40 shadow-2xl">

          <button className="flex flex-col items-center gap-1 text-blue-600 font-semibold text-sm">
            <span className="text-2xl">📋</span>
            Liste
          </button>

          <button className="flex flex-col items-center gap-1 text-slate-400 text-sm">
            <span className="text-2xl">🗺️</span>
            Carte
          </button>

          <button className="flex flex-col items-center gap-1 text-slate-400 text-sm">
            <span className="text-2xl">⭐</span>
            Favoris
          </button>

        </div>

      </div>
    </main>
  );
}

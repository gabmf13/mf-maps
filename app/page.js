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
              station: cols[0]?.trim() || "",
              insee: cols[1]?.trim() || "",
              type: cols[2]?.trim() || "",
              latitude: cols[3]?.trim() || "",
              longitude: cols[4]?.trim() || "",
              contacts: cols[5]?.trim() || "",
              sim: cols[6]?.trim() || "",
              password: cols[7]?.trim() || "",
              notes: cols[8]?.trim() || "",
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
    if (!lat || !lng) return;

    window.open(
      `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`,
      "_blank"
    );
  }

  return (
    <main className="min-h-screen bg-[#edf1f5] text-slate-900">
      <div className="max-w-md mx-auto min-h-screen bg-[#edf1f5] relative overflow-hidden">

        {/* HEADER */}
        <div className="bg-gradient-to-br from-[#003aa8] to-[#0057d9] px-5 pt-12 pb-8 rounded-b-[32px] shadow-xl">

          <div className="flex items-center gap-4">

            <img
              src="/MF_maps_logo.png"
              alt="MF maps"
              className="w-16 h-16 rounded-[20px] bg-white p-2 shadow-lg"
            />

            <div>
              <h1 className="text-white text-3xl font-bold">
                MF maps
              </h1>

              <p className="text-blue-100 text-base mt-1">
                Stations météo
              </p>
            </div>

          </div>

        </div>

        {/* SEARCH */}
        <div className="px-4 -mt-5 relative z-20">

          <div className="bg-white rounded-[24px] shadow-lg px-4 py-3 flex items-center gap-3">

            <span className="text-xl text-slate-400">
              🔎
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une station..."
              className="flex-1 outline-none text-[17px] bg-transparent text-slate-700"
            />

          </div>

        </div>

        {/* LIST */}
        <div className="px-4 pt-4 pb-32 space-y-3">

          {filtered.map((station, index) => (

            <div
              key={index}
              className="bg-white rounded-[24px] px-4 py-3 shadow-[0_4px_18px_rgba(0,0,0,0.07)]"
            >

              <div className="flex items-center gap-3">

                {/* IMAGE */}
                <div className="w-16 h-16 min-w-[64px] rounded-[18px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md overflow-hidden">

                  <img
                    src="/station.png"
                    alt=""
                    className="w-10 h-10 object-contain"
                  />

                </div>

                {/* INFOS */}
                <div className="flex-1 min-w-0">

                  <h2 className="font-bold text-[16px] truncate text-[#111827]">
                    {station.station}
                  </h2>

                  <p className="text-slate-400 mt-1 text-[14px]">
                    INSEE : {station.insee}
                  </p>

                </div>

                {/* BUTTONS */}
                <div className="flex items-center gap-2">

                  <button
                    onClick={() =>
                      openWaze(
                        station.latitude,
                        station.longitude
                      )
                    }
                    className="w-12 h-12 rounded-[16px] bg-[#1677ff] text-white text-lg shadow-md flex items-center justify-center"
                  >
                    🧭
                  </button>

                  <button
                    onClick={() => setSelected(station)}
                    className="w-12 h-12 rounded-[16px] bg-[#f3f5f8] text-slate-700 text-lg flex items-center justify-center"
                  >
                    ℹ️
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* DETAIL */}
        {selected && (

          <div className="fixed inset-0 bg-[#edf1f5] z-50 overflow-y-auto">

            {/* TOP */}
            <div className="bg-gradient-to-br from-[#003aa8] to-[#0057d9] px-5 pt-14 pb-8 rounded-b-[32px] shadow-xl">

              <div className="flex items-center justify-between">

                <button
                  onClick={() => setSelected(null)}
                  className="w-10 h-10 rounded-full bg-white/20 text-white text-xl flex items-center justify-center"
                >
                  ←
                </button>

                <h1 className="text-white text-2xl font-bold">
                  MF maps
                </h1>

                <div className="w-10"></div>

              </div>

              <div className="mt-6 flex items-center gap-4">

                <div className="w-20 h-20 rounded-[24px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-lg">

                  <img
                    src="/station.png"
                    alt=""
                    className="w-12 h-12 object-contain"
                  />

                </div>

                <div className="min-w-0">

                  <h2 className="text-white text-2xl font-bold leading-tight">
                    {selected.station}
                  </h2>

                  <p className="text-blue-100 mt-2 text-lg">
                    INSEE : {selected.insee}
                  </p>

                </div>

              </div>

            </div>

            {/* BUTTON */}
            <div className="px-4 mt-5">

              <button
                onClick={() =>
                  openWaze(
                    selected.latitude,
                    selected.longitude
                  )
                }
                className="w-full bg-[#1677ff] text-white rounded-[20px] py-4 text-base font-semibold shadow-lg"
              >
                🧭 Ouvrir dans Waze
              </button>

            </div>

            {/* INFOS */}
            <div className="px-4 py-5">

              <div className="bg-white rounded-[24px] p-4 shadow-lg space-y-4">

                <h3 className="text-xl font-bold">
                  Informations
                </h3>

                <div className="bg-[#f7f8fb] rounded-[18px] p-4">

                  <p className="text-slate-400 mb-1 text-sm">
                    Type
                  </p>

                  <p>
                    {selected.type || "Non renseigné"}
                  </p>

                </div>

                <div className="bg-[#f7f8fb] rounded-[18px] p-4">

                  <p className="text-slate-400 mb-1 text-sm">
                    Coordonnées
                  </p>

                  <p>
                    {selected.latitude}, {selected.longitude}
                  </p>

                </div>

                <div className="bg-[#f7f8fb] rounded-[18px] p-4">

                  <p className="text-slate-400 mb-1 text-sm">
                    Contacts
                  </p>

                  <p className="whitespace-pre-wrap">
                    {selected.contacts || "Aucun contact"}
                  </p>

                </div>

                <div className="bg-[#f7f8fb] rounded-[18px] p-4">

                  <p className="text-slate-400 mb-1 text-sm">
                    Identifiant SIM
                  </p>

                  <p>
                    {selected.sim || "Non renseigné"}
                  </p>

                </div>

                <div className="bg-[#f7f8fb] rounded-[18px] p-4">

                  <p className="text-slate-400 mb-1 text-sm">
                    Mot de passe SIM
                  </p>

                  <p>
                    {selected.password || "Non renseigné"}
                  </p>

                </div>

                <div>

                  <p className="text-slate-400 mb-2 text-sm">
                    Notes
                  </p>

                  <textarea
                    defaultValue={selected.notes}
                    className="w-full min-h-[140px] rounded-[18px] border border-slate-200 p-4"
                  />

                </div>

              </div>

            </div>

          </div>

        )}

        {/* NAVBAR */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex justify-around py-3 z-40">

          <button className="flex flex-col items-center text-blue-600 font-semibold">
            <span className="text-xl">📋</span>
            Liste
          </button>

          <button className="flex flex-col items-center text-slate-400">
            <span className="text-xl">🗺️</span>
            Carte
          </button>

          <button className="flex flex-col items-center text-slate-400">
            <span className="text-xl">⭐</span>
            Favoris
          </button>

        </div>

      </div>
    </main>
  );
}

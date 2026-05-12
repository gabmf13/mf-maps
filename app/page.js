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
        <div className="bg-gradient-to-br from-[#002c7d] to-[#0057d9] px-6 pt-14 pb-10 rounded-b-[40px] shadow-2xl">

          <div className="flex items-center gap-5">

            <img
              src="/MF_maps_logo.png"
              alt="MF maps"
              className="w-20 h-20 rounded-[26px] bg-white p-2 shadow-lg"
            />

            <div>
              <h1 className="text-white text-4xl font-bold">
                MF maps
              </h1>

              <p className="text-blue-100 text-xl mt-1">
                Stations météo
              </p>
            </div>

          </div>
        </div>

        {/* SEARCH */}
        <div className="px-4 -mt-7 relative z-20">

          <div className="bg-white rounded-[32px] shadow-[0_10px_30px_rgba(0,0,0,0.12)] px-5 py-5 flex items-center gap-4">

            <span className="text-3xl text-slate-400">
              🔎
            </span>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une station..."
              className="flex-1 outline-none text-[22px] bg-transparent text-slate-700"
            />

          </div>
        </div>

        {/* LIST */}
        <div className="px-4 pt-5 pb-36 space-y-4">

          {filtered.map((station, index) => (

            <div
              key={index}
              className="bg-white rounded-[30px] px-4 py-4 shadow-[0_6px_24px_rgba(0,0,0,0.08)]"
            >

              <div className="flex items-center justify-between gap-3">

                {/* LEFT */}
                <div className="flex items-center gap-4 flex-1 min-w-0">

                  <div className="w-20 h-20 min-w-[80px] rounded-[24px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center overflow-hidden shadow-lg">

                    <img
                      src="/station.png"
                      alt=""
                      className="w-14 h-14 object-contain"
                    />

                  </div>

                  <div className="flex-1 min-w-0">

                    <h2 className="font-bold text-[18px] leading-tight truncate text-[#111827]">
                      {station.station}
                    </h2>

                    <p className="text-slate-400 mt-2 text-[15px]">
                      INSEE : {station.insee}
                    </p>

                  </div>

                </div>

                {/* ACTIONS */}
                <div className="flex items-center gap-3">

                  <button
                    onClick={() =>
                      openWaze(
                        station.latitude,
                        station.longitude
                      )
                    }
                    className="w-14 h-14 rounded-[20px] bg-[#1677ff] text-white text-xl shadow-lg flex items-center justify-center"
                  >
                    🧭
                  </button>

                  <button
                    onClick={() => setSelected(station)}
                    className="w-14 h-14 rounded-[20px] bg-[#f3f5f8] text-slate-700 text-xl flex items-center justify-center"
                  >
                    ℹ️
                  </button>

                </div>

              </div>

            </div>

          ))}

        </div>

        {/* DETAIL PAGE */}
        {selected && (

          <div className="fixed inset-0 bg-[#edf1f5] z-50 overflow-y-auto">

            {/* HEADER DETAIL */}
            <div className="bg-gradient-to-br from-[#002c7d] to-[#0057d9] px-6 pt-14 pb-10 rounded-b-[40px] shadow-2xl">

              <div className="flex items-center justify-between">

                <button
                  onClick={() => setSelected(null)}
                  className="w-12 h-12 rounded-full bg-white/20 text-white text-2xl flex items-center justify-center"
                >
                  ←
                </button>

                <h1 className="text-white text-2xl font-bold">
                  MF maps
                </h1>

                <div className="w-12"></div>

              </div>

              <div className="mt-8 flex items-center gap-5">

                <div className="w-28 h-28 rounded-[30px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-2xl">

                  <img
                    src="/station.png"
                    alt=""
                    className="w-20 h-20 object-contain"
                  />

                </div>

                <div className="min-w-0">

                  <h2 className="text-white text-3xl font-bold leading-tight">
                    {selected.station}
                  </h2>

                  <p className="text-blue-100 mt-3 text-xl">
                    INSEE : {selected.insee}
                  </p>

                </div>

              </div>

            </div>

            {/* BUTTON */}
            <div className="px-5 mt-6">

              <button
                onClick={() =>
                  openWaze(
                    selected.latitude,
                    selected.longitude
                  )
                }
                className="w-full bg-[#1677ff] text-white rounded-[24px] py-5 text-lg font-semibold shadow-xl"
              >
                🧭 Ouvrir dans Waze
              </button>

            </div>

            {/* INFOS */}
            <div className="px-5 py-6">

              <div className="bg-white rounded-[30px] p-5 shadow-lg space-y-5">

                <h3 className="text-2xl font-bold">
                  Informations
                </h3>

                <div className="bg-[#f7f8fb] rounded-[24px] p-5">
                  <p className="text-slate-400 mb-2">
                    Type
                  </p>

                  <p className="text-lg">
                    {selected.type || "Non renseigné"}
                  </p>
                </div>

                <div className="bg-[#f7f8fb] rounded-[24px] p-5">
                  <p className="text-slate-400 mb-2">
                    Coordonnées
                  </p>

                  <p className="text-lg">
                    {selected.latitude}, {selected.longitude}
                  </p>
                </div>

                <div className="bg-[#f7f8fb] rounded-[24px] p-5">
                  <p className="text-slate-400 mb-2">
                    Contacts
                  </p>

                  <p className="text-lg whitespace-pre-wrap">
                    {selected.contacts || "Aucun contact"}
                  </p>
                </div>

                <div className="bg-[#f7f8fb] rounded-[24px] p-5">
                  <p className="text-slate-400 mb-2">
                    Identifiant SIM
                  </p>

                  <p className="text-lg">
                    {selected.sim || "Non renseigné"}
                  </p>
                </div>

                <div className="bg-[#f7f8fb] rounded-[24px] p-5">
                  <p className="text-slate-400 mb-2">
                    Mot de passe SIM
                  </p>

                  <p className="text-lg">
                    {selected.password || "Non renseigné"}
                  </p>
                </div>

                <div>
                  <p className="text-slate-400 mb-3">
                    Notes
                  </p>

                  <textarea
                    defaultValue={selected.notes}
                    className="w-full min-h-[180px] rounded-[24px] border border-slate-200 p-5 text-lg"
                  />
                </div>

              </div>

            </div>

          </div>

        )}

        {/* BOTTOM BAR */}
        <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-slate-200 flex justify-around py-4 z-40">

          <button className="flex flex-col items-center text-blue-600 font-semibold">
            <span className="text-2xl">📋</span>
            Liste
          </button>

          <button className="flex flex-col items-center text-slate-400">
            <span className="text-2xl">🗺️</span>
            Carte
          </button>

          <button className="flex flex-col items-center text-slate-400">
            <span className="text-2xl">⭐</span>
            Favoris
          </button>

        </div>

      </div>
    </main>
  );
}

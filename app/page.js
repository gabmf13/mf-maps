"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";

       

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);

const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);

const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);

const Popup = dynamic(
  () => import("react-leaflet").then((mod) => mod.Popup),
  { ssr: false }
);



export default function Home() {
  const [stations, setStations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("list");
  const [contactPages, setContactPages] = useState({
  capteur: [],
  systeme: [],
});
  

  const [showLegend, setShowLegend] = useState(false);
  const typeColors = {

  "ALTI_RADAR_MER - RADAR":
    "from-zinc-700 to-black",

  "CLIMATOLOGIE - MESURE_EN_DOUBLE":
    "from-emerald-400 to-emerald-600",

  "CLIMATOLOGIE - RCE_AUTO":
    "from-green-400 to-green-600",

  "INSTITUTIONNEL - NUCLEAIRES_AUTRES":
    "from-slate-400 to-slate-600",

  "MONTAGNE - NIVOSE":
    "from-violet-400 to-purple-600",

  "OARA - DGPR_SALAMANDRE":
    "from-sky-400 to-blue-600",

  "OARA - FEUX_FORET":
    "from-cyan-400 to-blue-500",

  "OARA - SEMAPHORES":
    "from-blue-400 to-indigo-600",

  "RADOME_RESOME - RRA":
    "from-orange-400 to-amber-600",

  "RADOME_RESOME - SYNOP":
    "from-orange-500 to-orange-700",
};
  const radarStations = [
  {
    name: "Radar Collobrières",
    url: "https://docs.google.com/forms"
  },
  {
    name: "Radar Bollène",
    url: "https://docs.google.com/forms"
  },
  {
    name: "Radar Colombis",
    url: "https://docs.google.com/forms"
  },
  {
    name: "Radar Maurel",
    url: "https://docs.google.com/forms"
  },
  {
    name: "Radar Vars",
    url: "https://docs.google.com/forms"
  }
];
  

  const csvUrl =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzIr6m4Itx77Zc2yBD4drjlHKCqF44afUdNRCmWU3QW7LyfY-o1rQulVH2_-dmjcOUjehN9hPZCbk9/pub?gid=398812539&single=true&output=csv";
const capteurUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzIr6m4Itx77Zc2yBD4drjlHKCqF44afUdNRCmWU3QW7LyfY-o1rQulVH2_-dmjcOUjehN9hPZCbk9/pub?gid=1335083814&single=true&output=csv";

const systemeUrl =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vRzIr6m4Itx77Zc2yBD4drjlHKCqF44afUdNRCmWU3QW7LyfY-o1rQulVH2_-dmjcOUjehN9hPZCbk9/pub?gid=2067157827&single=true&output=csv";
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
    async function loadContacts() {

  async function parseCsv(url) {

    const response = await fetch(url);

    const text = await response.text();

    const rows = text.split("\n");

    const headers =
      rows[0].split(",");

    return rows
      .slice(1)
      .filter((row) => row.trim() !== "")
      .map((row) => {

        const cols = row.split(",");

        const obj = {};

        headers.forEach((header, index) => {

          obj[header.trim().toLowerCase()] =
            cols[index]?.trim() || "";

        });

        return obj;

      });

  }

  const capteur =
    await parseCsv(capteurUrl);

  const systeme =
    await parseCsv(systemeUrl);

  setContactPages({
    capteur,
    systeme,
  });

}
    loadContacts();
  }, []);

  const filtered = stations.filter((s) => {

  const query = search.toLowerCase();

  return (
    s.station.toLowerCase().includes(query) ||
    s.insee.toLowerCase().includes(query)
  );

});

function openWaze(lat, lng) {

  if (!lat || !lng) return;

  window.location.href =
    `waze://?ll=${lat},${lng}&navigate=yes`;

}

/* NAVIGATION APP */
function changeTab(newTab) {

  window.history.pushState(
    { tab: newTab },
    ""
  );

  setTab(newTab);

}

/* SWIPE / RETOUR */
useEffect(() => {

  window.history.replaceState(
    { tab: "list" },
    ""
  );

  const handlePopState = (event) => {

    if (event.state?.tab) {

      changeTab(event.state.tab);

    } else {

      changeTab("list");

    }

  };

  window.addEventListener(
    "popstate",
    handlePopState
  );

  return () => {

    window.removeEventListener(
      "popstate",
      handlePopState
    );

  };

}, []);

  return (
    <main className="min-h-screen bg-[#edf1f5] text-slate-900">
      <div className="max-w-md mx-auto h-screen bg-[#edf1f5] relative overflow-hidden">

{/* HEADER */}
<div className="bg-gradient-to-br relative z-20 from-[#003aa8] to-[#0057d9] px-5 pt-5 pb-5 rounded-b-[32px] shadow-xl">

  <div className="flex items-center justify-between gap-3">

    {/* LOGO + TITRE */}
    <div className="flex items-center gap-3 min-w-0">

      <img
        src="/MF_maps_logo.png"
        alt="MF maps"
        className="w-16 h-16 rounded-[20px] bg-white p-2 shadow-lg flex-shrink-0"
      />

      <div className="min-w-0">

        <h1 className="text-white text-2xl font-bold leading-none whitespace-nowrap">
          MF Maps
        </h1>

        <p className="text-blue-100 text-sm mt-1">
          Stations météo
        </p>

      </div>

    </div>

    {/* BOUTON CONTACT */}
    <button
      onClick={() => changeTab("contact")}
      className="bg-white/10 border border-white/20 rounded-[18px] px-3 py-2 text-white backdrop-blur flex items-center gap-2 flex-shrink-0"
    >

      <span className="text-sm font-semibold">
        Contact DSO
      </span>

      <span className="text-xl">
        📞
      </span>

    </button>

  </div>

</div>
{/* SEARCH */}
<div className="px-4 -mt-2 relative z-30">

  <div className="bg-white rounded-[24px] shadow-lg px-4 py-3 flex items-center gap-3">

    <span className="text-xl text-slate-400 flex-shrink-0">
      🔎
    </span>

    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Rechercher une station..."
      enterKeyHint="search"
      onKeyDown={(e) => {

        if (e.key === "Enter") {

          e.currentTarget.blur();

        }

      }}
      className="flex-1 min-w-0 outline-none text-[16px] bg-transparent text-slate-700"
    />

    <button
      onClick={() => {

        document.activeElement.blur();
        setShowLegend(true);

      }}
      className="flex-shrink-0 bg-[#1677ff] text-white px-3 py-2 rounded-[14px] text-sm font-semibold whitespace-nowrap"
    >
      Légende
    </button>

  </div>

</div>

        {/* CONTENT */}
<div className="px-4 pt-[10px] pb-32 overflow-y-auto scrollbar-hide h-[calc(100vh-210px)]">

  {tab === "list" && (

    <div className="space-y-3">

      {filtered.map((station, index) => (

        <div
          key={index}
          className="bg-white rounded-[24px] px-4 py-3 shadow-[0_4px_18px_rgba(0,0,0,0.07)]"
        >

          <div className="flex items-center gap-3">

            <div
  className={`w-20 h-20 min-w-[80px] rounded-[22px] bg-gradient-to-br ${
    typeColors[station.type] ||
    "from-cyan-400 to-blue-600"
  } flex items-center justify-center shadow-md overflow-hidden`}
>

  <img
    src="/station.png"
    alt=""
    className="w-14 h-14 object-contain"
  />

</div>

            

            <div className="flex-1 min-w-0">

              <h2 className="font-bold text-[14px] leading-tight text-[#111827] break-words">
                {station.station}
              </h2>

              <p className="text-slate-400 mt-2 text-[13px]">
                {station.insee}
              </p>

            </div>

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

  )}

  {tab === "map" && !selected && (

    <div className="absolute left-0 right-0 top-[95px] bottom-[72px] z-0 overflow-hidden">

      <MapContainer
        center={[46.5, 2.5]}
        zoom={6}
        zoomControl={false}
        style={{
  height: "100%",
  width: "100%",
}}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {filtered.map((station, index) => {

          const lat = parseFloat(station.latitude);
          const lng = parseFloat(station.longitude);

          if (isNaN(lat) || isNaN(lng)) return null;

          return (
            <Marker
  key={index}
  position={[lat, lng]}
  icon={
    typeof window !== "undefined"
      ? new (require("leaflet").Icon)({

          iconUrl:

            station.type === "ALTI_RADAR_MER - RADAR"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png"

            : station.type === "CLIMATOLOGIE - MESURE_EN_DOUBLE"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"

            : station.type === "CLIMATOLOGIE - RCE_AUTO"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png"

            : station.type === "INSTITUTIONNEL - NUCLEAIRES_AUTRES"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png"

            : station.type === "MONTAGNE - NIVOSE"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-violet.png"

            : station.type === "OARA - DGPR_SALAMANDRE"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"

            : station.type === "OARA - FEUX_FORET"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"

            : station.type === "OARA - SEMAPHORES"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png"

            : station.type === "RADOME_RESOME - RRA"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"

            : station.type === "RADOME_RESOME - SYNOP"
              ? "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-orange.png"

            : "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",

          shadowUrl:
            "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      : undefined
  }
>

              <Popup
  closeButton={false}
  className="custom-popup"
>

  <div className="w-[180px] min-h-[80px] flex flex-col justify-between">

    <div className="flex justify-between items-start">

      <div className="pt-2">

        <h2 className="text-[15px] font-bold text-[#1a1a1a] leading-none">
          {station.station}
        </h2>

        <p className="text-[12px] text-slate-500 mt-3">
          INSEE : {station.insee}
        </p>

      </div>

    </div>

    <div className="h-[1px] bg-slate-200 my-5"></div>

    <div className="flex gap-2">

      {/* WAZE */}
      <button
        onClick={() =>
          openWaze(lat, lng)
        }
        className="flex-1 h-[38px] rounded-[22px] bg-[#1d6fff] shadow-md flex items-center justify-center text-white text-[18px]"
      >
        🧭
      </button>

      {/* INFO */}
      <button
        onClick={() => setSelected(station)}
        className="flex-1 h-[38px] rounded-[22px] bg-[#1d6fff] shadow-md flex items-center justify-center text-white text-[18px]"
      >
        ℹ️
      </button>

    </div>

  </div>

</Popup>

            </Marker>
          );
        })}

      </MapContainer>

    </div>

  )}
  {tab === "radar" && (

  <div className="px-4 pt-4 pb-32 space-y-3">

    {radarStations.map((radar, index) => (

      <div
        key={index}
        className="bg-white rounded-[24px] px-4 py-3 shadow-[0_4px_18px_rgba(0,0,0,0.07)]"
      >

        <div className="flex items-center justify-between gap-3">

          <div className="flex items-center gap-3 min-w-0">

            <div className="w-20 h-20 min-w-[80px] rounded-[18px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center shadow-md text-white text-3xl">
              📡
            </div>

            <div>

              <h2 className="font-bold text-[14px] text-[#111827]">
                {radar.name}
              </h2>

              <p className="text-slate-400 text-sm mt-1">
                Formulaire de préventive
              </p>

            </div>

          </div>

          <button
            onClick={() =>
              window.open(
                radar.url,
                "_blank"
              )
            }
            className="w-12 h-12 rounded-[16px] bg-[#1677ff] text-white text-lg shadow-md flex items-center justify-center"
          >
            📝
          </button>

        </div>

      </div>

    ))}

  </div>

)}
{tab === "contact" && (

  <div className="px-4 pt-4 pb-32 space-y-3 overflow-y-auto h-[calc(100vh-210px)]">

    {/* CAPTEUR */}
    <button
      onClick={() => changeTab("contact-capteur")}
      className="w-full bg-white rounded-[24px] px-5 py-5 shadow-lg flex items-center justify-between"
    >

      <div className="flex items-center gap-4">

       <div className="min-w-[90px]">

            <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center overflow-hidden">

              <img
                src="/station.png"
                alt=""
                className="w-14 h-14 object-contain"
              />

            </div>
             </div>

        <div className="text-left">

          <h2 className="font-bold text-lg">
            Capteur
          </h2>

          <p className="text-slate-400 text-sm">
            Contacts capteurs
          </p>

        </div>

      </div>

      <span className="text-2xl text-slate-400">
        →
      </span>

    </button>

    {/* SYSTEME */}
    <button
      onClick={() => changeTab("contact-systeme")}
      className="w-full bg-white rounded-[24px] px-5 py-5 shadow-lg flex items-center justify-between"
    >

      <div className="flex items-center gap-4">

        <div className="w-16 h-16 rounded-[18px] bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-3xl">
          💻
        </div>

        <div className="text-left">

          <h2 className="font-bold text-lg">
            Système
          </h2>

          <p className="text-slate-400 text-sm">
            Contacts systèmes
          </p>

        </div>

      </div>

      <span className="text-2xl text-slate-400">
        →
      </span>

    </button>

    


  </div>

)}
{tab === "contact-capteur" && (

  <div className="px-4 pt-4 pb-32 space-y-4 overflow-y-auto h-[calc(100vh-210px)]">

    <div className="sticky top-0 z-50 pt-1">

  <button
    onClick={() => changeTab("contact")}
    className="bg-white/95 backdrop-blur rounded-[18px] px-4 py-3 shadow-lg flex items-center gap-2"
  >
    <span className="text-xl">
      ←
    </span>

    Retour
  </button>

</div>

    <div className="bg-white rounded-[24px] p-5 shadow-lg text-center">

      <h2 className="text-2xl font-bold">
        Contacts Capteurs
      </h2>

    </div>

    {contactPages.capteur.map((item, index) => (

      <div
        key={index}
        className="bg-white rounded-[24px] p-5 shadow-lg"
      >

        <div className="flex gap-4">

          {/* IMAGE */}
          <div className="min-w-[90px]">

            <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center overflow-hidden">

              <img
                src="/station.png"
                alt=""
                className="w-14 h-14 object-contain"
              />

            </div>

            <div className="mt-3 text-center">

              <p className="font-bold text-[11px] break-words leading-tight max-w-[90px]">
  {item.code}
</p>
            

            </div>

          </div>

          {/* CONTACTS */}
          <div className="flex-1 space-y-5">

            {/* REFERENT */}
            <div>

              <p className="text-slate-400 text-sm">
                Référent
              </p>

              <p className="font-bold">
                {item.referent}
              </p>

              <a
                href={`tel:${item.referentphone}`}
                className="text-sky-600 text-sm font-medium"
              >
                📞 {item.referentphone}
              </a>

            </div>

            {/* TECH 1 */}
            {item.tech1 && (

              <div>

                <p className="text-slate-400 text-sm">
                  Technicien
                </p>

                <p className="font-bold">
                  {item.tech1}
                </p>

                <a
                  href={`tel:${item.tech1phone}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  📞 {item.tech1phone}
                </a>

              </div>

            )}

            {/* TECH 2 */}
            {item.tech2 && (

              <div>

                <p className="text-slate-400 text-sm">
                  Technicien
                </p>

                <p className="font-bold">
                  {item.tech2}
                </p>

                <a
                  href={`tel:${item.tech2phone}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  📞 {item.tech2phone}
                </a>

              </div>

            )}

            {/* TECH 3 */}
            {item.tech3 && (

              <div>

                <p className="text-slate-400 text-sm">
                  Technicien
                </p>

                <p className="font-bold">
                  {item.tech3}
                </p>

                <a
                  href={`tel:${item.tech3phone}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  📞 {item.tech3phone}
                </a>

              </div>

            )}

          </div>

        </div>

      </div>

    ))}

  </div>

)}

{tab === "contact-systeme" && (

  <div className="px-4 pt-4 pb-32 space-y-4 overflow-y-auto scrollbar-hide h-[calc(100vh-210px)]">

    {/* RETOUR */}
    <div className="sticky top-0 z-50 pt-1">

  <button
    onClick={() => changeTab("contact")}
    className="bg-white/95 backdrop-blur rounded-[18px] px-4 py-3 shadow-lg flex items-center gap-2"
  >
    <span className="text-xl">
      ←
    </span>

    Retour
  </button>

</div>

    {/* HEADER */}
    <div className="bg-white rounded-[24px] p-5 shadow-lg text-center">

      <h2 className="text-2xl font-bold">
        Contacts Système
      </h2>

    </div>

    {/* CARTES */}
    {contactPages.systeme.map((item, index) => (

      <div
        key={index}
        className="bg-white rounded-[24px] p-5 shadow-lg"
      >

        <div className="flex gap-4">

          {/* ICON */}
          <div className="min-w-[90px]">

            <div className="w-20 h-20 rounded-[20px] bg-gradient-to-br from-violet-400 to-indigo-600 flex items-center justify-center text-white text-3xl">
              💻
            </div>

            <div className="mt-3 text-center">

              <p className="font-bold text-[11px] break-words leading-tight max-w-[90px]">
                {item.code || item.name}
              </p>

            </div>

          </div>

          {/* CONTACTS */}
          <div className="flex-1 space-y-5">

            {/* REFERENT */}
            {item.referent && (

              <div>

                <p className="text-slate-400 text-sm">
                  Référent
                </p>

                <p className="font-bold">
                  {item.referent}
                </p>

                <a
                  href={`tel:${item.referentphone}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  📞 {item.referentphone}
                </a>

              </div>

            )}

            {/* TECH 1 */}
            {item.tech1 && (

              <div>

                <p className="text-slate-400 text-sm">
                  Technicien
                </p>

                <p className="font-bold">
                  {item.tech1}
                </p>

                <a
                  href={`tel:${item.tech1phone}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  📞 {item.tech1phone}
                </a>

              </div>

            )}

            {/* TECH 2 */}
            {item.tech2 && (

              <div>

                <p className="text-slate-400 text-sm">
                  Technicien
                </p>

                <p className="font-bold">
                  {item.tech2}
                </p>

                <a
                  href={`tel:${item.tech2phone}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  📞 {item.tech2phone}
                </a>

              </div>

            )}

            {/* TECH 3 */}
            {item.tech3 && (

              <div>

                <p className="text-slate-400 text-sm">
                  Technicien
                </p>

                <p className="font-bold">
                  {item.tech3}
                </p>

                <a
                  href={`tel:${item.tech3phone}`}
                  className="text-sky-600 text-sm font-medium"
                >
                  📞 {item.tech3phone}
                </a>

              </div>

            )}

          </div>

        </div>

      </div>

    ))}

  </div>

)}



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
                  MF Maps
                </h1>

                <div className="w-10"></div>

              </div>

              <div className="mt-6 flex items-center gap-4">

                <div
  className={`w-20 h-20 rounded-[24px] bg-gradient-to-br ${
    typeColors[selected.type] ||
    "from-cyan-400 to-blue-600"
  } flex items-center justify-center shadow-lg`}
>
                  <img
                    src="/station.png"
                    alt=""
                    className="w-14 h-14 object-contain"
                  />

                </div>

                <div className="min-w-0">

                  <h2 className="text-white text-2xl font-bold leading-tight break-words">
                    {selected.station}
                  </h2>

                  <p className="text-blue-100 mt-2 text-lg">
                    INSEE : {selected.insee}
                  </p>

                </div>

              </div>

            </div>

            {/* WAZE */}
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
        {showLegend && (

  <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center p-4">

    <div className="bg-white rounded-[28px] w-full max-w-sm p-5 shadow-2xl">

      <div className="flex items-center justify-between mb-5">

        <h2 className="text-xl font-bold">
          Légende
        </h2>

        <button
          onClick={() => setShowLegend(false)}
          className="text-slate-400 text-2xl"
        >
          ✕
        </button>

      </div>

      <div className="space-y-3">

        {Object.entries(typeColors).map(([type, color]) => (

          <div
            key={type}
            className="flex items-center gap-3"
          >

            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${color}`}
            />

            <p className="text-sm text-slate-700">
              {type}
            </p>

          </div>

        ))}

      </div>

    </div>

  </div>

)}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl max-w-md mx-auto bg-white border-t border-slate-200 flex justify-around py-3 z-40">

          <button
  onClick={() => changeTab("list")}
  className={`flex flex-col items-center ${
    tab === "list"
      ? "text-blue-600 font-semibold"
      : "text-slate-400"}`}>
            <span className="text-xl">📋</span>
            Liste
          </button>

<button
  onClick={() => changeTab("map")}
  className={`flex flex-col items-center ${
    tab === "map"
      ? "text-blue-600 font-semibold"
      : "text-slate-400"
  }`}
>            <span className="text-xl">🗺️</span>
            Carte
          </button>

          <button
  onClick={() => changeTab("radar")}
  className={`flex flex-col items-center ${
    tab === "radar"
      ? "text-blue-600 font-semibold"
      : "text-slate-400"
  }`}
>
  <span className="text-xl">📝</span>
   Forms Radar
</button>

        </div>

      </div>
    </main>
  );
}

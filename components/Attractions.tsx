"use client";

import { useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flame,
  MapPin,
  Ruler,
  Sparkles,
} from "lucide-react";
import { ATRACCIONES, ZONAS, type Atraccion, type ZonaId } from "@/data/park";

function IlustracionAtraccion({
  atraccion,
  color,
  colorSuave,
  index,
}: {
  atraccion: Atraccion;
  color: string;
  colorSuave: string;
  index: number;
}) {
  return (
    <div
      className="relative h-48 overflow-hidden rounded-t-[1.5rem] border-b-4 border-tinta transition-transform duration-500 group-hover:scale-[1.02]"
      style={{ backgroundColor: colorSuave }}
    >
      <svg viewBox="0 0 300 180" className="h-full w-full" aria-hidden>
        {/* Sol y nubes suaves */}
        <circle
          cx={55 + ((index * 47) % 190)}
          cy="36"
          r="20"
          fill="#ffd93b"
          stroke="#161b32"
          strokeWidth="3.5"
        />
        <g fill="#ffffff" opacity="0.85">
          <circle cx={210 - ((index * 31) % 120)} cy="34" r="11" />
          <circle cx={224 - ((index * 31) % 120)} cy="34" r="14" />
          <circle cx={238 - ((index * 31) % 120)} cy="36" r="10" />
        </g>

        {/* Ilustración temática según la zona */}
        {atraccion.zona === "extrema" && (
          <g>
            <line x1="65" y1="85" x2="65" y2="175" stroke="#161b32" strokeWidth="4" />
            <line x1="150" y1="115" x2="150" y2="175" stroke="#161b32" strokeWidth="4" />
            <line x1="230" y1="75" x2="230" y2="175" stroke="#161b32" strokeWidth="4" />
            <path
              d="M -10 145 Q 50 55, 110 120 T 230 70 L 315 140"
              fill="none"
              stroke="#161b32"
              strokeWidth="12"
              strokeLinecap="round"
            />
            <path
              d="M -10 145 Q 50 55, 110 120 T 230 70 L 315 140"
              fill="none"
              stroke={color}
              strokeWidth="6"
              strokeLinecap="round"
            />
            <g transform="translate(226, 61) rotate(14)">
              <rect x="-14" y="-8" width="28" height="12" rx="5" fill="#ffd93b" stroke="#161b32" strokeWidth="3" />
              <circle cx="-6" cy="-11" r="3.5" fill="#ffffff" stroke="#161b32" strokeWidth="2" />
              <circle cx="6" cy="-11" r="3.5" fill="#ffffff" stroke="#161b32" strokeWidth="2" />
            </g>
          </g>
        )}

        {atraccion.zona === "fantasia" && (
          <g transform="translate(150, 115)">
            <rect x="-48" y="-20" width="96" height="75" rx="8" fill={color} stroke="#161b32" strokeWidth="4" />
            <polygon points="-56,-20 -32,-58 -8,-20" fill="#ffd93b" stroke="#161b32" strokeWidth="3.5" />
            <polygon points="8,-20 32,-58 56,-20" fill="#ffd93b" stroke="#161b32" strokeWidth="3.5" />
            <polygon points="-22,-30 0,-74 22,-30" fill="#ffffff" stroke="#161b32" strokeWidth="3.5" />
            <path d="M -14 55 L -14 25 A 14 14 0 0 1 14 25 L 14 55 Z" fill="#161b32" />
          </g>
        )}

        {atraccion.zona === "acuatica" && (
          <g>
            <path
              d="M 40 55 C 120 55, 110 120, 210 130"
              fill="none"
              stroke="#161b32"
              strokeWidth="16"
              strokeLinecap="round"
            />
            <path
              d="M 40 55 C 120 55, 110 120, 210 130"
              fill="none"
              stroke="#ffffff"
              strokeWidth="9"
              strokeLinecap="round"
            />
            <path
              d="M 0 138 Q 38 122, 75 138 T 150 138 T 225 138 T 300 138 V 180 H 0 Z"
              fill={color}
              stroke="#161b32"
              strokeWidth="3.5"
            />
          </g>
        )}

        {atraccion.zona === "infantil" && (
          <g transform="translate(150, 108)">
            <line x1="-26" y1="65" x2="0" y2="0" stroke="#161b32" strokeWidth="4.5" />
            <line x1="26" y1="65" x2="0" y2="0" stroke="#161b32" strokeWidth="4.5" />
            <circle r="46" fill="none" stroke="#161b32" strokeWidth="6" />
            <circle r="46" fill="none" stroke={color} strokeWidth="3.5" />
            {[0, 60, 120, 180, 240, 300].map((deg) => (
              <g key={deg} transform={`rotate(${deg})`}>
                <line x1="0" y1="0" x2="0" y2="-46" stroke="#161b32" strokeWidth="2.5" />
                <circle cx="0" cy="-46" r="7" fill="#ffd93b" stroke="#161b32" strokeWidth="2.5" />
              </g>
            ))}
            <circle r="11" fill="#ffffff" stroke="#161b32" strokeWidth="3" />
          </g>
        )}

        {/* Base del suelo */}
        <rect x="0" y="166" width="300" height="16" fill="#161b32" opacity="0.12" />
      </svg>

      {/* Pill de Zona */}
      <span
        className="absolute left-3.5 top-3.5 rounded-full border-2 border-tinta bg-white px-3 py-1 text-xs font-black uppercase tracking-wide shadow-sm"
        style={{ color }}
      >
        {atraccion.zona}
      </span>

      {/* Indicador de Adrenalina */}
      <span
        className="absolute right-3.5 top-3.5 flex items-center gap-1 rounded-full border-2 border-tinta bg-uva px-2.5 py-1 text-xs font-black text-sol shadow-sm"
        aria-label={`Nivel de emoción ${atraccion.emocion} de 5`}
      >
        <Flame className="h-3.5 w-3.5 fill-sol" aria-hidden />
        {atraccion.emocion}/5
      </span>
    </div>
  );
}

export default function Attractions() {
  const [zona, setZona] = useState<ZonaId | "todas">("todas");
  const [activaId, setActivaId] = useState<string | null>(null);
  const pistaRef = useRef<HTMLDivElement>(null);

  const lista = ATRACCIONES.filter((a) => zona === "todas" || a.zona === zona);

  const mover = (dir: number) => {
    pistaRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section
      id="atracciones"
      className="relative overflow-hidden bg-[#d8f1ff] py-16 text-uva md:py-24"
    >
      {/* VIDEO DE FONDO EN AZUL CIELO CLARO (VISIBLE EN DESKTOP Y MOBILE) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden>
        <video
          className="h-full w-full object-cover opacity-45 saturate-110"
          src="/assets/hero-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />
        {/* Velo celeste luminoso para integrar el video y conservar legibilidad */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#d8f1ff]/75 via-[#e8f6ff]/45 to-[#ffffff]/80" />
      </div>

      {/* Contenido superior y filtros */}
      <div className="relative z-10 mx-auto max-w-6xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="reveal">
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-tinta bg-sol px-4 py-1.5 text-xs font-black uppercase tracking-wider text-uva shadow-sm">
              <Sparkles className="h-4 w-4" aria-hidden />
              Atracciones estrella
            </p>
            <h2 className="mt-3 font-display text-4xl font-black leading-none text-uva drop-shadow-[0_2px_0_rgba(255,255,255,0.85)] sm:text-5xl md:text-6xl">
              Explora atracciones
            </h2>
          </div>

          {/* Controles de carrusel */}
          <div className="reveal flex gap-2">
            <button
              type="button"
              onClick={() => mover(-1)}
              className="btn-sticker flex h-11 w-11 items-center justify-center rounded-full bg-white text-uva"
              aria-label="Atracciones anteriores"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => mover(1)}
              className="btn-sticker flex h-11 w-11 items-center justify-center rounded-full bg-sol text-uva"
              aria-label="Siguientes atracciones"
            >
              <ChevronRight className="h-5 w-5" aria-hidden />
            </button>
          </div>
        </div>

        {/* Filtros por zona (deslizables en mobile) */}
        <div className="reveal -mx-4 mt-6 flex items-center gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <button
            type="button"
            onClick={() => {
              setZona("todas");
              setActivaId(null);
            }}
            className={`btn-sticker shrink-0 rounded-full px-5 py-2 text-sm font-extrabold transition-all ${
              zona === "todas" ? "bg-uva text-sol" : "bg-white/95 text-uva"
            }`}
          >
            Todas ({ATRACCIONES.length})
          </button>
          {ZONAS.map((z) => {
            const seleccionada = zona === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => {
                  setZona(z.id);
                  setActivaId(null);
                }}
                className="btn-sticker shrink-0 rounded-full px-5 py-2 text-sm font-extrabold transition-all"
                style={{
                  backgroundColor: seleccionada ? z.color : "rgba(255,255,255,0.95)",
                  color: seleccionada ? "#ffffff" : "#161b32",
                }}
              >
                {z.nombre}
              </button>
            );
          })}
        </div>
      </div>

      {/* Carrusel interactivo limpio */}
      <div
        ref={pistaRef}
        className="relative z-10 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-6 md:px-[max(1rem,calc((100vw-72rem)/2+1rem))]"
        role="list"
        aria-label="Listado de atracciones"
      >
        {lista.map((a, i) => {
          const z = ZONAS.find((zz) => zz.id === a.zona) ?? ZONAS[0];
          const expandida = activaId === a.id;

          return (
            <article
              key={a.id}
              role="listitem"
              onClick={() => setActivaId(expandida ? null : a.id)}
              className={`group sticker-lg flex w-[285px] shrink-0 cursor-pointer snap-start flex-col rounded-[1.75rem] bg-white text-tinta transition-all duration-300 hover:-translate-y-1.5 sm:w-[300px] ${
                expandida ? "ring-4 ring-sol" : ""
              }`}
            >
              <IlustracionAtraccion
                atraccion={a}
                color={z.color}
                colorSuave={z.colorSuave}
                index={i}
              />

              <div className="flex flex-1 flex-col justify-between p-4">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-display text-xl font-black leading-tight text-uva">
                      {a.nombre}
                    </h3>
                  </div>

                  {/* Métricas esenciales en píldoras compactas */}
                  <div className="mt-3 flex items-center gap-2 text-xs font-extrabold">
                    <span className="flex items-center gap-1 rounded-full bg-nube px-2.5 py-1 text-uva">
                      <Ruler className="h-3.5 w-3.5 text-rosa" aria-hidden />
                      {a.estaturaMin === 0 ? "Libre" : `${a.estaturaMin} cm`}
                    </span>
                    <span className="flex items-center gap-1 rounded-full bg-nube px-2.5 py-1 text-uva">
                      <Clock className="h-3.5 w-3.5 text-rosa" aria-hidden />
                      {a.esperaMin} min
                    </span>
                  </div>

                  {/* Detalle desplegable solo al tocar la tarjeta */}
                  {expandida && (
                    <p className="mt-3 rounded-xl bg-nube/80 p-2.5 text-xs font-semibold leading-relaxed text-tinta/85">
                      {a.descripcion}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <a
                    href="#mapa"
                    onClick={(e) => e.stopPropagation()}
                    className="btn-sticker flex flex-1 items-center justify-center gap-1.5 rounded-full bg-sol px-4 py-2.5 font-display text-sm font-black text-uva"
                  >
                    <MapPin className="h-4 w-4" aria-hidden />
                    Ubicar
                  </a>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActivaId(expandida ? null : a.id);
                    }}
                    className="rounded-full border-2 border-uva/20 px-3 py-2 text-xs font-extrabold text-uva hover:bg-nube"
                  >
                    {expandida ? "Menos" : "+ Info"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
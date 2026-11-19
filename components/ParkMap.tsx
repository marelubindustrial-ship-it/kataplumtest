"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Clock,
  Compass,
  Footprints,
  LocateFixed,
  MapPin,
  Minus,
  Navigation,
  Plus,
  Ruler,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import { ATRACCIONES, ZONAS, precioMXN, type Atraccion, type ZonaId } from "@/data/park";
import { PRODUCTOS } from "@/data/tickets";

const VB_W = 1400;
const VB_H = 950;

const FILTROS_ESTATURA = [
  { valor: 0, etiqueta: "Todas las estaturas" },
  { valor: 90, etiqueta: "Hasta 90 cm" },
  { valor: 110, etiqueta: "Hasta 110 cm" },
  { valor: 120, etiqueta: "Hasta 120 cm" },
  { valor: 130, etiqueta: "Hasta 130 cm" },
  { valor: 140, etiqueta: "140 cm o más" },
];

const ANCLAS_ZONA: Record<ZonaId, { cx: number; cy: number; radioX: number; radioY: number }> = {
  extrema: { cx: 1080, cy: 255, radioX: 165, radioY: 110 },
  fantasia: { cx: 365, cy: 265, radioX: 175, radioY: 110 },
  infantil: { cx: 335, cy: 675, radioX: 165, radioY: 105 },
  acuatica: { cx: 1045, cy: 670, radioX: 175, radioY: 105 },
};

const SERVICIOS_PARQUE = [
  { id: "banos-norte", x: 695, y: 210, tipo: "WC" },
  { id: "comida-central", x: 755, y: 495, tipo: "FOOD" },
  { id: "enfermeria", x: 565, y: 745, tipo: "MED" },
  { id: "lockers", x: 835, y: 765, tipo: "LOCK" },
];

type Punto = { x: number; y: number };
type Vista = { x: number; y: number; k: number };
type AtraccionMapeada = Atraccion & { mapX: number; mapY: number };

function estrellas(n: number): string {
  return "★".repeat(n) + "☆".repeat(5 - n);
}

export default function ParkMap() {
  const [zonaActiva, setZonaActiva] = useState<ZonaId | "todas">("todas");
  const [estaturaMax, setEstaturaMax] = useState<number>(0);
  const [seleccionada, setSeleccionada] = useState<Atraccion | null>(null);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const [vista, setVista] = useState<Vista>({ x: 0, y: 0, k: 1 });
  const [animandoVista, setAnimandoVista] = useState<boolean>(false);
  const [arrastrando, setArrastrando] = useState<boolean>(false);

  const contenedorRef = useRef<HTMLDivElement | null>(null);
  const punterosActivos = useRef<Record<number, Punto>>({});
  const pinchInicial = useRef<{ dist: number; k: number } | null>(null);
  const arrastre = useRef<{ inicioX: number; inicioY: number; baseX: number; baseY: number } | null>(null);

  const limitar = useCallback((v: Vista): Vista => {
    const k = Math.min(2.8, Math.max(1, v.k));
    const maxX = ((VB_W * k - VB_W) / 2) * 0.96;
    const maxY = ((VB_H * k - VB_H) / 2) * 0.96;
    return {
      k,
      x: Math.min(maxX, Math.max(-maxX, v.x)),
      y: Math.min(maxY, Math.max(-maxY, v.y)),
    };
  }, []);

  const enfocarPunto = useCallback(
    (px: number, py: number, targetK = 1.75) => {
      setAnimandoVista(true);
      const k = Math.min(2.8, Math.max(1, targetK));
      const x = (VB_W / 2 - px) * k;
      const y = (VB_H / 2 - py) * k;
      setVista(limitar({ x, y, k }));
      window.setTimeout(() => setAnimandoVista(false), 450);
    },
    [limitar]
  );

  const reiniciarVista = useCallback(() => {
    setAnimandoVista(true);
    setVista({ x: 0, y: 0, k: 1 });
    setZonaActiva("todas");
    setSeleccionada(null);
    window.setTimeout(() => setAnimandoVista(false), 450);
  }, []);

  const zoom = useCallback(
    (delta: number) => {
      setAnimandoVista(true);
      setVista((v) => limitar({ ...v, k: v.k + delta }));
      window.setTimeout(() => setAnimandoVista(false), 250);
    },
    [limitar]
  );

  const alRueda = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY < 0 ? 0.18 : -0.18;
      setVista((v) => limitar({ ...v, k: v.k + delta }));
    },
    [limitar]
  );

  useEffect(() => {
    const el = contenedorRef.current;
    if (!el) return;
    el.addEventListener("wheel", alRueda, { passive: false });
    return () => el.removeEventListener("wheel", alRueda);
  }, [alRueda]);

  const distanciaPunteros = (): number => {
    const pts = Object.values(punterosActivos.current);
    if (pts.length < 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  };

  const alBajar = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    setAnimandoVista(false);
    punterosActivos.current[e.pointerId] = { x: e.clientX, y: e.clientY };
    e.currentTarget.setPointerCapture?.(e.pointerId);

    const cantidad = Object.keys(punterosActivos.current).length;
    if (cantidad === 2) {
      arrastre.current = null;
      pinchInicial.current = { dist: distanciaPunteros(), k: vista.k };
    } else if (cantidad === 1) {
      arrastre.current = {
        inicioX: e.clientX,
        inicioY: e.clientY,
        baseX: vista.x,
        baseY: vista.y,
      };
      setArrastrando(true);
    }
  };

  const alMover = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!punterosActivos.current[e.pointerId]) return;
    punterosActivos.current[e.pointerId] = { x: e.clientX, y: e.clientY };

    const cantidad = Object.keys(punterosActivos.current).length;
    if (cantidad === 2 && pinchInicial.current && pinchInicial.current.dist > 0) {
      const distActual = distanciaPunteros();
      const factor = distActual / pinchInicial.current.dist;
      const nuevoK = pinchInicial.current.k * factor;
      setVista((v) => limitar({ ...v, k: nuevoK }));
      return;
    }

    if (arrastre.current && cantidad === 1) {
      const { inicioX, inicioY, baseX, baseY } = arrastre.current;
      const rect = contenedorRef.current?.getBoundingClientRect();
      const scaleX = VB_W / (rect?.width || VB_W);
      const scaleY = VB_H / (rect?.height || VB_H);
      const dx = (e.clientX - inicioX) * scaleX;
      const dy = (e.clientY - inicioY) * scaleY;

      setVista((v) => limitar({ ...v, x: baseX + dx, y: baseY + dy }));
    }
  };

  const alSubir = (e: React.PointerEvent<HTMLDivElement>) => {
    delete punterosActivos.current[e.pointerId];
    const restantes = Object.values(punterosActivos.current);

    if (restantes.length < 2) {
      pinchInicial.current = null;
    }
    if (restantes.length === 1) {
      arrastre.current = {
        inicioX: restantes[0].x,
        inicioY: restantes[0].y,
        baseX: vista.x,
        baseY: vista.y,
      };
    } else if (restantes.length === 0) {
      arrastre.current = null;
      setArrastrando(false);
    }
  };

  const atraccionesMapeadas: AtraccionMapeada[] = ATRACCIONES.map((a, idx) => {
    const ancla = ANCLAS_ZONA[a.zona];
    const delMismoGrupo = ATRACCIONES.filter((item) => item.zona === a.zona);
    const posEnGrupo = delMismoGrupo.findIndex((item) => item.id === a.id);
    const totalGrupo = Math.max(1, delMismoGrupo.length);
    const angulo = (posEnGrupo / totalGrupo) * Math.PI * 2 - Math.PI / 3;
    const factorRadio = totalGrupo === 1 ? 0 : 0.72 + (idx % 2) * 0.22;

    return {
      ...a,
      mapX: Math.round(ancla.cx + Math.cos(angulo) * ancla.radioX * factorRadio),
      mapY: Math.round(ancla.cy + Math.sin(angulo) * ancla.radioY * factorRadio),
    };
  });

  const visibles = atraccionesMapeadas.filter(
    (a) => (zonaActiva === "todas" || a.zona === zonaActiva) && (estaturaMax === 0 || a.estaturaMin <= estaturaMax)
  );

  const zonaDe = (id: ZonaId) => ZONAS.find((z) => z.id === id) ?? ZONAS[0];

  const seleccionarZona = (zId: ZonaId | "todas") => {
    setZonaActiva(zId);
    if (zId === "todas") {
      reiniciarVista();
    } else {
      const ancla = ANCLAS_ZONA[zId];
      enfocarPunto(ancla.cx, ancla.cy, 1.5);
    }
  };

  const seleccionarAtraccion = (a: AtraccionMapeada) => {
    setSeleccionada(a);
    enfocarPunto(a.mapX, a.mapY, 1.85);
  };

  const translateX = vista.x + (VB_W * (1 - vista.k)) / 2;
  const translateY = vista.y + (VB_H * (1 - vista.k)) / 2;

  return (
    <section
      id="mapa"
      className="relative overflow-hidden bg-gradient-to-b from-[#dff4ff] via-[#eef9ff] to-white py-14 md:py-24"
    >
      {/* Sol decorativo */}
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full border-4 border-tinta bg-sol opacity-90 sm:h-64 sm:w-64"
        aria-hidden
      />

      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Encabezado */}
        <div className="reveal flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border-2 border-tinta bg-white px-3.5 py-1.5 text-xs font-black uppercase tracking-wider text-uva shadow-sm">
              <Compass className="h-4 w-4 text-rosa" aria-hidden />
              Plano oficial interactivo · Kataplum
            </p>
            <h2 className="mt-3 max-w-2xl font-display text-3xl font-black leading-[1.02] text-uva sm:text-4xl md:text-6xl">
              Camina el parque antes de llegar
            </h2>
            <p className="mt-2.5 max-w-xl text-sm font-bold text-tinta/75 sm:text-base md:text-lg">
              Explora las avenidas, puentes y zonas temáticas. Pellizca o usa los botones para acercarte y toca cualquier pin.
            </p>
          </div>

          {/* Filtro por estatura */}
          <label className="flex w-full flex-col gap-1.5 sm:w-auto sm:flex-row sm:items-center">
            <span className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wide text-uva">
              <Ruler className="h-4 w-4 text-rosa" aria-hidden />
              Estatura:
            </span>
            <select
              value={estaturaMax}
              onChange={(e) => setEstaturaMax(Number(e.target.value))}
              className="btn-sticker w-full cursor-pointer rounded-full bg-white px-4 py-2.5 text-sm font-extrabold text-uva focus:outline-none sm:w-auto"
            >
              {FILTROS_ESTATURA.map((f) => (
                <option key={f.valor} value={f.valor}>
                  {f.etiqueta}
                </option>
              ))}
            </select>
          </label>
        </div>

        {/* Barra de navegación por Zonas Temáticas */}
        <div className="reveal -mx-4 mt-6 flex items-center gap-2.5 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:pb-0">
          <button
            type="button"
            onClick={() => seleccionarZona("todas")}
            className={`btn-sticker flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
              zonaActiva === "todas" ? "bg-uva text-sol" : "bg-white text-uva"
            }`}
          >
            <Sparkles className="h-4 w-4" aria-hidden />
            Mapa Completo ({ATRACCIONES.length})
          </button>
          {ZONAS.map((z) => {
            const activa = zonaActiva === z.id;
            return (
              <button
                key={z.id}
                type="button"
                onClick={() => seleccionarZona(z.id)}
                className="btn-sticker flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold transition-all sm:px-5 sm:py-2.5 sm:text-sm"
                style={{
                  backgroundColor: activa ? z.color : "#ffffff",
                  color: activa ? "#ffffff" : "#161b32",
                }}
              >
                <span
                  className="h-2.5 w-2.5 rounded-full border border-tinta"
                  style={{ backgroundColor: activa ? "#ffd93b" : z.color }}
                />
                {z.nombre}
              </button>
            );
          })}
        </div>

        {/* LIENZO INTERACTIVO TIPO GOOGLE MAPS / DISNEY PARK */}
        <div
          ref={contenedorRef}
          onPointerDown={alBajar}
          onPointerMove={alMover}
          onPointerUp={alSubir}
          onPointerCancel={alSubir}
          className={`reveal sticker-lg relative mt-5 aspect-[1/1] w-full touch-none select-none overflow-hidden rounded-[1.75rem] border-4 border-tinta bg-[#7ec8e3] sm:aspect-[4/3] sm:rounded-[2.25rem] lg:aspect-[16/10] ${
            arrastrando ? "cursor-grabbing" : "cursor-grab"
          }`}
          role="application"
          aria-label="Mapa ilustrado interactivo del parque temático Kataplum"
        >
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="xMidYMid slice"
            className="block h-full w-full"
            aria-hidden
          >
            <defs>
              <pattern id="cesped-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="6" cy="8" r="1.5" fill="#7ab85c" opacity="0.55" />
                <circle cx="18" cy="18" r="1.5" fill="#7ab85c" opacity="0.55" />
              </pattern>
              <pattern id="agua-ondas" width="40" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M0 10 Q 10 5, 20 10 T 40 10"
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeOpacity="0.35"
                  strokeLinecap="round"
                />
              </pattern>
              <filter id="sombra-mapa" x="-15%" y="-15%" width="130%" height="130%">
                <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#161b32" floodOpacity="0.22" />
              </filter>
            </defs>

            <g
              style={{
                transformOrigin: "0px 0px",
                transform: `translate(${translateX}px, ${translateY}px) scale(${vista.k})`,
                transition: animandoVista ? "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
              }}
            >
              {/* 1. ENTORNO EXTERIOR */}
              <rect x="-250" y="-250" width="1900" height="1450" fill="#bce6ff" />
              <path
                d="M-150 120 Q 150 20, 420 95 T 950 75 T 1550 110 L 1550 320 L -150 320 Z"
                fill="#9bd4f5"
              />

              {/* 2. GRAN PLATAFORMA ELEVADA DEL PARQUE */}
              <rect
                x="55"
                y="78"
                width="1290"
                height="822"
                rx="88"
                fill="#4a3569"
                stroke="#161b32"
                strokeWidth="7"
              />
              <rect
                x="55"
                y="60"
                width="1290"
                height="820"
                rx="88"
                fill="#9be07a"
                stroke="#161b32"
                strokeWidth="7"
              />
              <rect x="55" y="60" width="1290" height="820" rx="88" fill="url(#cesped-dots)" />

              {/* 3. LAGUNA DEL MUNDO ACUÁTICO */}
              <path
                d="M 850 640 C 920 560, 1180 550, 1265 650 C 1320 720, 1250 835, 1080 845 C 910 855, 790 780, 810 695 Z"
                fill="#4fc3f7"
                stroke="#161b32"
                strokeWidth="5"
              />
              <path
                d="M 850 640 C 920 560, 1180 550, 1265 650 C 1320 720, 1250 835, 1080 845 C 910 855, 790 780, 810 695 Z"
                fill="url(#agua-ondas)"
              />

              {/* 4. BIOMAS DE LAS 4 ZONAS TEMÁTICAS */}
              <path
                d="M 115 140 C 260 95, 530 105, 585 205 C 630 290, 560 405, 420 420 C 270 435, 120 390, 100 280 C 88 210, 85 160, 115 140 Z"
                fill="#eedbfa"
                stroke="#974292"
                strokeWidth="5"
                strokeDasharray="12 8"
                opacity={zonaActiva === "todas" || zonaActiva === "fantasia" ? 0.95 : 0.3}
              />
              <path
                d="M 820 130 C 980 90, 1245 120, 1290 235 C 1330 340, 1220 435, 1065 435 C 910 435, 805 370, 795 265 C 788 190, 780 150, 820 130 Z"
                fill="#ffe0d6"
                stroke="#e0492e"
                strokeWidth="5"
                strokeDasharray="12 8"
                opacity={zonaActiva === "todas" || zonaActiva === "extrema" ? 0.95 : 0.3}
              />
              <path
                d="M 105 515 C 240 485, 490 500, 540 605 C 585 700, 510 825, 340 835 C 180 845, 95 775, 95 660 C 95 585, 80 530, 105 515 Z"
                fill="#fff1cc"
                stroke="#f0a208"
                strokeWidth="5"
                strokeDasharray="12 8"
                opacity={zonaActiva === "todas" || zonaActiva === "infantil" ? 0.95 : 0.3}
              />
              <path
                d="M 815 510 C 960 475, 1225 495, 1285 600 C 1335 690, 1280 825, 1110 845 C 940 865, 790 800, 780 685 C 772 600, 775 530, 815 510 Z"
                fill="#d4f3ff"
                stroke="#0284c7"
                strokeWidth="5"
                strokeDasharray="12 8"
                opacity={zonaActiva === "todas" || zonaActiva === "acuatica" ? 0.45 : 0.15}
              />

              {/* 5. AVENIDAS Y CAMINOS PEATONALES */}
              <g fill="none" stroke="#c89d66" strokeWidth="64" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 700 855 L 700 220" />
                <path d="M 355 275 C 520 245, 880 245, 1065 275 C 1150 380, 1145 560, 1055 665 C 880 710, 520 710, 345 665 C 255 560, 260 380, 355 275 Z" />
                <path d="M 270 470 L 1130 470" />
              </g>
              <g fill="none" stroke="#fff3db" strokeWidth="52" strokeLinecap="round" strokeLinejoin="round">
                <path d="M 700 855 L 700 220" />
                <path d="M 355 275 C 520 245, 880 245, 1065 275 C 1150 380, 1145 560, 1055 665 C 880 710, 520 710, 345 665 C 255 560, 260 380, 355 275 Z" />
                <path d="M 270 470 L 1130 470" />
              </g>
              <g fill="none" stroke="#e2b980" strokeWidth="3" strokeDasharray="10 12" strokeLinecap="round">
                <path d="M 700 830 L 700 235" />
                <path d="M 355 275 C 520 245, 880 245, 1065 275 C 1150 380, 1145 560, 1055 665 C 880 710, 520 710, 345 665 C 255 560, 260 380, 355 275 Z" />
              </g>

              {/* Puente de madera */}
              <g transform="translate(955 675) rotate(-18)">
                <rect x="-42" y="-22" width="84" height="44" rx="8" fill="#d97706" stroke="#161b32" strokeWidth="4" />
                <line x1="-22" y1="-22" x2="-22" y2="22" stroke="#161b32" strokeWidth="3" />
                <line x1="0" y1="-22" x2="0" y2="22" stroke="#161b32" strokeWidth="3" />
                <line x1="22" y1="-22" x2="22" y2="22" stroke="#161b32" strokeWidth="3" />
              </g>

              {/* 6. MONUMENTOS DEL PARQUE */}
              {/* Gran Carpa Blanca Central */}
              <g transform="translate(700 465)" filter="url(#sombra-mapa)">
                <circle r="78" fill="#fde68a" stroke="#161b32" strokeWidth="4" />
                <path
                  d="M -68 18 Q 0 -75, 68 18 Q 25 5, 0 24 Q -25 5, -68 18 Z"
                  fill="#ffffff"
                  stroke="#161b32"
                  strokeWidth="4.5"
                  strokeLinejoin="round"
                />
                <path d="M 0 -46 L 0 24 M -34 -16 L -18 14 M 34 -16 L 18 14" stroke="#e5e7eb" strokeWidth="3" />
                <rect x="-56" y="18" width="112" height="24" rx="12" fill="#4c1d95" stroke="#161b32" strokeWidth="3" />
                <text y="34" textAnchor="middle" fill="#ffd93b" fontSize="13" fontWeight="900" fontFamily="var(--font-baloo)">
                  PLAZA KATAPLUM
                </text>
              </g>

              {/* Montaña Rusa Roja */}
              <g transform="translate(1165 195)" filter="url(#sombra-mapa)">
                <path
                  d="M -85 45 Q -45 -55, -10 20 T 65 -35 L 95 45"
                  fill="none"
                  stroke="#161b32"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M -85 45 Q -45 -55, -10 20 T 65 -35 L 95 45"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <line x1="-45" y1="-8" x2="-45" y2="45" stroke="#ffd93b" strokeWidth="4" />
                <line x1="55" y1="-15" x2="55" y2="45" stroke="#ffd93b" strokeWidth="4" />
              </g>

              {/* Rueda de la Fortuna */}
              <g transform="translate(885 150)" filter="url(#sombra-mapa)">
                <line x1="-24" y1="55" x2="0" y2="0" stroke="#161b32" strokeWidth="5" />
                <line x1="24" y1="55" x2="0" y2="0" stroke="#161b32" strokeWidth="5" />
                <circle r="44" fill="none" stroke="#161b32" strokeWidth="6" />
                <circle r="44" fill="none" stroke="#ffd93b" strokeWidth="3" />
                <circle r="10" fill="#ec4899" stroke="#161b32" strokeWidth="3" />
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <g key={deg} transform={`rotate(${deg})`}>
                    <line x1="0" y1="0" x2="0" y2="-44" stroke="#161b32" strokeWidth="2" />
                    <circle cx="0" cy="-44" r="6" fill="#38bdf8" stroke="#161b32" strokeWidth="2.5" />
                  </g>
                ))}
              </g>

              {/* Castillo Fantasía */}
              <g transform="translate(215 185)" filter="url(#sombra-mapa)">
                <rect x="-36" y="-5" width="72" height="45" rx="6" fill="#c084fc" stroke="#161b32" strokeWidth="4" />
                <polygon points="-42,-5 -24,-38 -6,-5" fill="#f43f5e" stroke="#161b32" strokeWidth="3.5" />
                <polygon points="6,-5 24,-38 42,-5" fill="#f43f5e" stroke="#161b32" strokeWidth="3.5" />
                <polygon points="-16,-15 0,-52 16,-15" fill="#ffd93b" stroke="#161b32" strokeWidth="3.5" />
                <path d="M -10 40 L -10 20 A 10 10 0 0 1 10 20 L 10 40 Z" fill="#4c1d95" />
              </g>

              {/* Toboganes Acuáticos */}
              <g transform="translate(1185 735)" filter="url(#sombra-mapa)">
                <path
                  d="M -30 -35 C 20 -35, -25 10, 30 20"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="12"
                  strokeLinecap="round"
                />
                <path
                  d="M -30 -35 C 20 -35, -25 10, 30 20"
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="6"
                  strokeLinecap="round"
                />
                <circle cx="32" cy="22" r="10" fill="#ffffff" opacity="0.85" />
              </g>

              {/* Árboles decorativos */}
              {[
                [165, 425],
                [565, 165],
                [815, 375],
                [565, 565],
                [185, 765],
                [1265, 435],
                [615, 815],
                [785, 815],
              ].map(([tx, ty], i) => (
                <g key={i} transform={`translate(${tx} ${ty})`}>
                  <ellipse cx="0" cy="14" rx="14" ry="6" fill="#161b32" opacity="0.2" />
                  <circle cx="-8" cy="2" r="13" fill="#4ade80" stroke="#161b32" strokeWidth="3" />
                  <circle cx="9" cy="3" r="12" fill="#22c55e" stroke="#161b32" strokeWidth="3" />
                  <circle cx="0" cy="-7" r="14" fill="#86efac" stroke="#161b32" strokeWidth="3" />
                </g>
              ))}

              {/* 7. LETREROS DE ZONAS TEMÁTICAS */}
              {ZONAS.map((z) => {
                const pos: Record<ZonaId, { x: number; y: number }> = {
                  fantasia: { x: 365, y: 145 },
                  extrema: { x: 1065, y: 145 },
                  infantil: { x: 325, y: 805 },
                  acuatica: { x: 1045, y: 805 },
                };
                const activa = zonaActiva === "todas" || zonaActiva === z.id;
                return (
                  <g
                    key={z.id}
                    transform={`translate(${pos[z.id].x} ${pos[z.id].y})`}
                    opacity={activa ? 1 : 0.25}
                    style={{ cursor: "pointer" }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onClick={() => seleccionarZona(z.id)}
                  >
                    <rect
                      x="-98"
                      y="-20"
                      width="196"
                      height="36"
                      rx="18"
                      fill="#ffffff"
                      stroke="#161b32"
                      strokeWidth="3.5"
                    />
                    <text
                      y="4"
                      textAnchor="middle"
                      fill={z.color}
                      fontSize="17"
                      fontWeight="900"
                      fontFamily="var(--font-baloo)"
                    >
                      {z.nombre.toUpperCase()}
                    </text>
                  </g>
                );
              })}

              {/* 8. PINS DE SERVICIOS */}
              {SERVICIOS_PARQUE.map((s) => (
                <g key={s.id} transform={`translate(${s.x} ${s.y})`}>
                  <rect
                    x="-22"
                    y="-14"
                    width="44"
                    height="26"
                    rx="8"
                    fill="#161b32"
                    stroke="#ffffff"
                    strokeWidth="2"
                  />
                  <text y="4" textAnchor="middle" fill="#ffd93b" fontSize="11" fontWeight="900">
                    {s.tipo}
                  </text>
                </g>
              ))}

              {/* 9. PORTAL DE ENTRADA PRINCIPAL */}
              <g transform="translate(700 865)" filter="url(#sombra-mapa)">
                <rect x="-105" y="-26" width="210" height="50" rx="18" fill="#ffd93b" stroke="#161b32" strokeWidth="5" />
                <text y="6" textAnchor="middle" fontSize="20" fontWeight="900" fill="#161b32" fontFamily="var(--font-baloo)">
                  ★ ACCESO PRINCIPAL ★
                </text>
              </g>

              {/* 10. MARCADORES INTERACTIVOS DE ATRACCIONES */}
              {visibles.map((a) => {
                const z = zonaDe(a.zona);
                const activa = seleccionada?.id === a.id;
                const hovered = hoverId === a.id;
                const destacado = activa || hovered;

                return (
                  <g
                    key={a.id}
                    transform={`translate(${a.mapX} ${a.mapY})`}
                    style={{ cursor: "pointer" }}
                    onPointerDown={(e) => e.stopPropagation()}
                    onPointerEnter={() => setHoverId(a.id)}
                    onPointerLeave={() => setHoverId(null)}
                    onClick={() => seleccionarAtraccion(a)}
                  >
                    <ellipse cx="0" cy="6" rx={destacado ? 22 : 16} ry={destacado ? 9 : 6} fill="#161b32" opacity="0.28" />

                    {activa && (
                      <circle cx="0" cy="-22" r="34" fill="none" stroke="#ffd93b" strokeWidth="4">
                        <animate attributeName="r" from="22" to="42" dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from="1" to="0" dur="1.4s" repeatCount="indefinite" />
                      </circle>
                    )}

                    {/* Área táctil amplia para dedos en móvil */}
                    <circle cx="0" cy="-24" r="34" fill="transparent" />

                    <g transform={`translate(0, ${destacado ? -6 : 0}) scale(${destacado ? 1.2 : 1.05})`}>
                      <path
                        d="M 0 4 C -14 -12, -24 -22, -24 -36 A 24 24 0 1 1 24 -36 C 24 -22, 14 -12, 0 4 Z"
                        fill={z.color}
                        stroke="#161b32"
                        strokeWidth="4"
                        strokeLinejoin="round"
                      />
                      <circle cx="0" cy="-36" r="15" fill="#ffffff" />
                      <text
                        y="-31"
                        textAnchor="middle"
                        fontSize="13"
                        fontWeight="900"
                        fill="#161b32"
                        fontFamily="var(--font-baloo)"
                      >
                        {a.estaturaMin === 0 ? "★" : `${a.estaturaMin}`}
                      </text>
                    </g>

                    {(vista.k >= 1.3 || destacado) && (
                      <g transform="translate(0, 26)">
                        <rect
                          x="-78"
                          y="-12"
                          width="156"
                          height="24"
                          rx="12"
                          fill={activa ? "#161b32" : "#ffffff"}
                          stroke="#161b32"
                          strokeWidth="2.5"
                        />
                        <text
                          y="4"
                          textAnchor="middle"
                          fontSize="11.5"
                          fontWeight="800"
                          fill={activa ? "#ffd93b" : "#161b32"}
                        >
                          {a.nombre.length > 20 ? `${a.nombre.slice(0, 19)}…` : a.nombre}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </g>
          </svg>

          {/* HUD SUPERIOR IZQUIERDO */}
          <div className="pointer-events-none absolute left-3 top-3 flex items-center gap-2 rounded-2xl border-2 border-tinta bg-white/95 px-3 py-1.5 shadow-md backdrop-blur-sm sm:left-4 sm:top-4 sm:border-3 sm:px-3.5 sm:py-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-uva text-sol sm:h-8 sm:w-8">
              <Navigation className="h-3.5 w-3.5 rotate-45 sm:h-4 sm:w-4" aria-hidden />
            </div>
            <div>
              <p className="font-display text-[11px] font-black uppercase text-uva sm:text-xs">Vista Aérea</p>
              <p className="text-[10px] font-bold text-tinta/70 sm:text-[11px]">
                {visibles.length} atracciones
              </p>
            </div>
          </div>

          {/* HUD DERECHO */}
          <div className="absolute right-3 top-3 flex flex-col gap-2 sm:right-4 sm:top-4">
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => zoom(0.35)}
              className="btn-sticker flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-uva"
              aria-label="Acercar mapa"
            >
              <Plus className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => zoom(-0.35)}
              className="btn-sticker flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-uva"
              aria-label="Alejar mapa"
            >
              <Minus className="h-5 w-5" aria-hidden />
            </button>
            <button
              type="button"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={reiniciarVista}
              className="btn-sticker flex h-11 w-11 items-center justify-center rounded-2xl bg-sol text-uva"
              aria-label="Restablecer vista completa"
            >
              <LocateFixed className="h-5 w-5" aria-hidden />
            </button>
          </div>

          {/* HUD INFERIOR */}
          <div className="pointer-events-none absolute bottom-3 left-3 right-3 flex flex-wrap items-center justify-between gap-2 sm:bottom-4 sm:left-4 sm:right-4">
            <div className="flex items-center gap-2 rounded-full border-2 border-tinta bg-white/95 px-3.5 py-1.5 text-[11px] font-extrabold text-uva shadow-sm sm:px-4 sm:text-xs">
              <Footprints className="h-3.5 w-3.5 shrink-0 text-rosa sm:h-4 sm:w-4" aria-hidden />
              <span>Arrastra con 1 dedo · Pellizca para acercar</span>
            </div>

            <div className="hidden items-center gap-3 rounded-full border-2 border-tinta bg-uva/95 px-4 py-1.5 text-xs font-bold text-white shadow-sm md:flex">
              <span className="flex items-center gap-1">
                <Utensils className="h-3.5 w-3.5 text-sol" /> Food Court
              </span>
              <span>·</span>
              <span className="text-sol">★ = Todas las edades</span>
              <span>·</span>
              <span>Número = Estatura mín. (cm)</span>
            </div>
          </div>
        </div>

        {/* Directorio rápido debajo del mapa */}
        <div className="reveal mt-7 sm:mt-8">
          <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-display text-lg font-black text-uva sm:text-xl">
              Atracciones en ruta ({visibles.length})
            </h3>
            <span className="text-xs font-bold text-tinta/60">
              Toca una tarjeta para ubicarla en el mapa
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 sm:gap-3.5 lg:grid-cols-3">
            {visibles.map((a) => {
              const z = zonaDe(a.zona);
              const esActiva = seleccionada?.id === a.id;
              return (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => seleccionarAtraccion(a)}
                  className={`btn-sticker flex items-center gap-3 rounded-2xl bg-white p-3 text-left transition-all sm:gap-3.5 sm:p-3.5 ${
                    esActiva ? "ring-4 ring-sol" : ""
                  }`}
                >
                  <span
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border-3 border-tinta font-display text-sm font-black text-white shadow-sm sm:h-12 sm:w-12"
                    style={{ backgroundColor: z.color }}
                  >
                    {a.estaturaMin === 0 ? "★" : `${a.estaturaMin}`}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-display text-sm font-extrabold text-uva sm:text-base">
                      {a.nombre}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs font-bold text-tinta/65">
                      <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: z.color }} />
                      {z.nombre} · {a.esperaMin} min espera
                    </span>
                  </span>
                </button>
              );
            })}
            {visibles.length === 0 && (
              <p className="sticker col-span-full rounded-2xl bg-white p-6 text-center text-sm font-bold text-uva sm:text-base">
                No hay atracciones que coincidan con esa estatura. Selecciona una estatura mayor o "Todas las estaturas".
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom sheet en móvil / Modal centrado en escritorio */}
      {seleccionada && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-tinta/55 p-0 backdrop-blur-sm sm:items-center sm:p-4"
          role="dialog"
          aria-modal="true"
          aria-label={`Detalle de ${seleccionada.nombre}`}
          onClick={() => setSeleccionada(null)}
        >
          <div
            className="animate-aparicion sticker-lg max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-[2rem] bg-white p-5 pb-8 sm:rounded-[2.25rem] sm:p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-tinta/20 sm:hidden" aria-hidden />

            <div className="flex items-start justify-between gap-3">
              <div>
                <span
                  className="inline-block rounded-full px-3 py-0.5 text-xs font-black uppercase tracking-wider text-white"
                  style={{ backgroundColor: zonaDe(seleccionada.zona).color }}
                >
                  {zonaDe(seleccionada.zona).nombre}
                </span>
                <h3 className="mt-1.5 font-display text-2xl font-black text-uva sm:text-3xl">
                  {seleccionada.nombre}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSeleccionada(null)}
                className="btn-sticker rounded-full bg-nube p-2.5 text-uva"
                aria-label="Cerrar detalle"
              >
                <X className="h-5 w-5" aria-hidden />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="sticker-sm flex items-center gap-1.5 rounded-full bg-nube px-3 py-1.5 text-xs font-extrabold text-uva">
                <Ruler className="h-3.5 w-3.5 text-rosa" aria-hidden />
                {seleccionada.estaturaMin === 0
                  ? "Sin estatura mínima"
                  : `Estatura mín. ${seleccionada.estaturaMin} cm`}
              </span>
              <span className="sticker-sm flex items-center gap-1.5 rounded-full bg-nube px-3 py-1.5 text-xs font-extrabold text-uva">
                <Clock className="h-3.5 w-3.5 text-rosa" aria-hidden />
                Espera {seleccionada.esperaMin} min
              </span>
              <span
                className="sticker-sm rounded-full bg-nube px-3 py-1.5 text-xs font-extrabold text-dorado"
                aria-label={`Nivel de emoción ${seleccionada.emocion} de 5`}
              >
                Adrenalina: {estrellas(seleccionada.emocion)}
              </span>
            </div>

            <p className="mt-4 text-sm font-semibold leading-relaxed text-tinta/80 sm:text-base">
              {seleccionada.descripcion}
            </p>

            <a
              href="#boletos"
              onClick={() => setSeleccionada(null)}
              className="btn-sticker mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-sol px-6 py-3.5 font-display text-base font-black text-uva sm:text-lg"
            >
              <CalendarDays className="h-5 w-5" aria-hidden />
              Comprar pase desde {precioMXN(PRODUCTOS[0].precio)}
            </a>
          </div>
        </div>
      )}
    </section>
  );
}
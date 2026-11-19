"use client";

import { useEffect, useRef } from "react";
import { Compass, Heart, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const CAPITULOS = [
  {
    icono: Compass,
    fondo: "#974292",
    titulo: "Explora",
    texto:
      "Cuatro zonas temáticas conectadas por senderos llenos de jardines, esculturas gigantes y sorpresas en cada esquina. Pierde la noción del tiempo, no del mapa.",
  },
  {
    icono: Zap,
    fondo: "#e0492e",
    titulo: "Vive",
    texto:
      "Siente la adrenalina de la Rusa Kataplum, el vértigo de la Torre del Rayo y la frescura del Mundo Acuático. Más de 40 atracciones te esperan.",
  },
  {
    icono: Heart,
    fondo: "#3d9be9",
    titulo: "Regresa",
    texto:
      "Con el Pase Anual cada visita es distinta: eventos de temporada, el desfile de luces y un amigo gratis el mes de tu cumpleaños. Kataplum se vuelve tu segundo hogar.",
  },
];

export default function Story() {
  const pinRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducir || !pinRef.current) return;

    const ctx = gsap.context(() => {
      const paneles = gsap.utils.toArray<HTMLElement>(".story-panel");
      const progreso = pinRef.current!.querySelector<HTMLElement>(".story-barra");

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: pinRef.current,
          start: "top top",
          end: `+=${window.innerHeight * 2.4}`,
          scrub: 0.6,
          pin: true,
          onUpdate: (self) => {
            if (progreso) progreso.style.height = `${self.progress * 100}%`;
          },
        },
      });

      paneles.forEach((panel, i) => {
        if (i === 0) {
          tl.fromTo(panel, { opacity: 1 }, { opacity: 1, duration: 0.25 });
          tl.to(panel, { opacity: 0, y: -60, scale: 0.95, duration: 0.25 });
        } else {
          tl.fromTo(
            panel,
            { opacity: 0, y: 80, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.3 },
            ">-0.05"
          );
          if (i < paneles.length - 1) {
            tl.to(panel, { opacity: 0, y: -60, scale: 0.95, duration: 0.25 });
          }
        }
      });
    }, pinRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={pinRef} className="relative flex min-h-[100dvh] items-center overflow-hidden bg-tinta">
      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-4 top-0 hidden w-1.5 items-center md:flex" aria-hidden>
        <div className="relative h-2/3 w-full overflow-hidden rounded-full bg-white/15">
          <div className="story-barra absolute left-0 top-0 w-full rounded-full bg-sol" style={{ height: 0 }} />
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-6xl gap-10 px-4 py-20 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="relative min-h-[380px] md:min-h-[420px]">
          {CAPITULOS.map((cap, i) => {
            const Icono = cap.icono;
            return (
              <div
                key={cap.titulo}
                className={`story-panel absolute inset-0 flex flex-col justify-center ${
                  i === 0 ? "opacity-100" : "opacity-0"
                }`}
              >
                <span
                  className="sticker mb-6 flex h-16 w-16 items-center justify-center rounded-2xl text-white"
                  style={{ backgroundColor: cap.fondo }}
                >
                  <Icono className="h-8 w-8" aria-hidden />
                </span>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-sol">Capítulo {i + 1} de 3</p>
                <h3 className="mt-2 font-display text-6xl font-extrabold text-white md:text-8xl">{cap.titulo}</h3>
                <p className="mt-4 max-w-md text-lg font-semibold text-white/80">{cap.texto}</p>
              </div>
            );
          })}
        </div>

        {/* Decoración flotante */}
        <div className="relative hidden h-[420px] md:block" aria-hidden>
          <div className="absolute left-4 top-6 h-40 w-40 animate-flotar rounded-full border-4 border-tinta bg-sol shadow-sticker-lg" />
          <div className="absolute bottom-8 left-24 h-24 w-24 animate-flotar rounded-3xl border-4 border-tinta bg-rosa shadow-sticker-lg" style={{ animationDelay: "1.2s" }} />
          <div className="absolute right-2 top-24 h-32 w-32 animate-flotar rounded-full border-4 border-tinta bg-morado shadow-sticker-lg" style={{ animationDelay: "0.6s" }} />
          <div className="absolute bottom-24 right-16 h-16 w-16 animate-flotar rounded-2xl border-4 border-tinta bg-cielo shadow-sticker-lg" style={{ animationDelay: "1.8s" }} />
        </div>
      </div>
    </section>
  );
}

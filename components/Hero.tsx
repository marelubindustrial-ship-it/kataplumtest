"use client";

import { useEffect, useRef } from "react";
import { Compass, Ticket, Zap } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const FRASES_MARQUEE = [
  "Más de 40 atracciones",
  "Mundo Acuático incluido",
  "Desfile de luces cada día",
  "4 zonas temáticas",
  "Compra en línea y evita filas",
];

export default function Hero() {
  const seccionRef = useRef<HTMLElement>(null);
  const tituloRef = useRef<HTMLHeadingElement>(null);
  const fondoRef = useRef<HTMLImageElement>(null);
  const nubeARef = useRef<HTMLDivElement>(null);
  const nubeBRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reducir = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducir || !seccionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(fondoRef.current, {
        yPercent: 10,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: seccionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(tituloRef.current, {
        yPercent: -12,
        ease: "none",
        scrollTrigger: {
          trigger: seccionRef.current,
          start: "top top",
          end: "70% top",
          scrub: true,
        },
      });
      gsap.to(nubeARef.current, {
        xPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: seccionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(nubeBRef.current, {
        xPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: seccionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, seccionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="inicio"
      ref={seccionRef}
      className="relative flex min-h-[100dvh] flex-col justify-between overflow-hidden bg-[#d8f1ff] pt-20"
    >
      {/* Imagen de fondo principal */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          ref={fondoRef}
          src="/images/fondo.png"
          alt="Vista panorámica del parque temático Kataplum"
          className="h-full w-full scale-[1.02] object-cover object-right-bottom md:object-center"
        />
        {/* Velo sutil a la izquierda para garantizar legibilidad del texto sin tapar el parque */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-[#e8f6ff]/95 via-[#e8f6ff]/70 to-transparent md:w-3/4"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-[#e8f6ff]/60 via-transparent to-transparent h-32"
          aria-hidden
        />
      </div>

      {/* Nubes decorativas con parallax */}
      <div
        ref={nubeARef}
        className="pointer-events-none absolute left-[38%] top-[14%] z-10 hidden md:block"
        aria-hidden
      >
        <div className="h-8 w-24 rounded-full bg-white/85 shadow-sm" />
        <div className="-mt-3.5 ml-5 h-6 w-16 rounded-full bg-white/85" />
      </div>
      <div
        ref={nubeBRef}
        className="pointer-events-none absolute right-[10%] top-[11%] z-10 hidden md:block"
        aria-hidden
      >
        <div className="h-8 w-28 rounded-full bg-white/80 shadow-sm" />
        <div className="-ml-3 -mt-4 h-6 w-16 rounded-full bg-white/80" />
      </div>

      {/* Contenido redistribuido a la izquierda dejando libre la panorámica del parque */}
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 py-12 md:px-8 md:py-16">
        <div className="flex max-w-xl flex-col items-start">
          <p className="reveal mb-4 inline-flex items-center gap-2 rounded-full border-2 border-uva/15 bg-white/90 px-4 py-1.5 text-xs font-black uppercase tracking-wider text-uva shadow-sm backdrop-blur-sm">
            <Zap className="h-4 w-4 fill-sol text-uva" aria-hidden />
            Parque de diversiones · CDMX
          </p>

          <h1
            ref={tituloRef}
            className="font-display text-5xl font-black leading-[0.94] tracking-tight text-uva sm:text-6xl lg:text-[4.75rem]"
          >
            Tu día de{" "}
            <span className="relative inline-block">
              aventura
              {/* Tres destellos amarillos */}
              <svg
                className="pointer-events-none -right-11 -top-5 hidden h-12 w-12 text-sol sm:absolute sm:block"
                viewBox="0 0 40 40"
                fill="none"
                aria-hidden
              >
                <path
                  d="M8 14L17 7M12 22L25 18M12 30L22 31"
                  stroke="currentColor"
                  strokeWidth="5"
                  strokeLinecap="round"
                />
              </svg>
            </span>{" "}
            empieza aquí
          </h1>

          <p className="reveal mt-5 max-w-md rounded-2xl bg-white/75 p-3.5 text-base font-bold leading-relaxed text-uva backdrop-blur-sm sm:bg-transparent sm:p-0 sm:backdrop-blur-none md:text-lg">
            Cuatro zonas temáticas, más de 40 atracciones y un Mundo Acuático completo. Explora el
            mapa y asegura tu entrada en menos de 2 minutos.
          </p>

          {/* Botones apilados estilo píldora */}
          <div className="reveal mt-7 flex w-full max-w-xs flex-col gap-3.5">
            <a
              href="#boletos"
              className="btn-sticker flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-tinta bg-sol px-7 py-3.5 font-display text-lg font-black text-uva transition-transform hover:-translate-y-0.5"
            >
              <Ticket className="h-5 w-5" aria-hidden />
              Compara los pases
            </a>
            <a
              href="#mapa"
              className="btn-sticker flex w-full items-center justify-center gap-2.5 rounded-full border-2 border-uva bg-white/95 px-7 py-3.5 font-display text-lg font-black text-uva backdrop-blur-sm transition-transform hover:-translate-y-0.5"
            >
              <Compass className="h-5 w-5" aria-hidden />
              Explora atracciones
            </a>
          </div>
        </div>
      </div>

      {/* Marquee inferior */}
      <div className="relative z-20 -rotate-1 border-y-4 border-tinta bg-rosa py-2.5" aria-hidden>
        <div className="marquee-track flex w-max whitespace-nowrap">
          {[0, 1].map((copia) => (
            <div key={copia} className="flex items-center">
              {FRASES_MARQUEE.concat(FRASES_MARQUEE).map((frase, i) => (
                <span
                  key={`${copia}-${i}`}
                  className="mx-6 flex items-center gap-6 font-display text-lg font-bold text-tinta"
                >
                  {frase}
                  <Zap className="h-4 w-4" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
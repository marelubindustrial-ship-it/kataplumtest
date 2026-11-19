"use client";

import { useEffect, useState } from "react";
import { Menu, Sparkles, Ticket, X } from "lucide-react";

const LINKS = [
  { href: "#atracciones", label: "Atracciones" },
  { href: "#mapa", label: "Mapa del parque" },
  { href: "#boletos", label: "Boletos" },
  { href: "#como-llegar", label: "Cómo llegar" },
];

export default function Header() {
  const [oculto, setOculto] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);

  useEffect(() => {
    let ultimoY = window.scrollY;
    const alScroll = () => {
      const y = window.scrollY;
      // Se oculta al bajar y reaparece al subir
      setOculto(y > 140 && y > ultimoY);
      ultimoY = y;
    };
    window.addEventListener("scroll", alScroll, { passive: true });
    return () => window.removeEventListener("scroll", alScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuAbierto ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuAbierto]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-transform duration-300 ${
          oculto && !menuAbierto ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 pt-4">
          <a
            href="#inicio"
            className="btn-sticker flex items-center gap-2 rounded-full bg-sol px-4 py-2 font-display text-xl font-bold text-tinta"
            aria-label="Kataplum, ir al inicio"
          >
            <Sparkles className="h-5 w-5" aria-hidden />
            Kataplum
          </a>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Navegación principal">
            {LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 font-bold text-tinta transition-colors hover:bg-white"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#boletos"
              className="btn-sticker ml-2 flex items-center gap-2 rounded-full bg-uva px-5 py-2 font-display font-bold text-white"
            >
              <Ticket className="h-4 w-4" aria-hidden />
              Comprar boletos
            </a>
          </nav>

          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            className="btn-sticker rounded-full bg-white p-3 md:hidden"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </header>

      {/* Menú móvil a pantalla completa */}
      {menuAbierto && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-uva"
          role="dialog"
          aria-modal="true"
          aria-label="Menú"
        >
          <div className="flex items-center justify-between px-4 pt-4">
            <span className="flex items-center gap-2 rounded-full border-4 border-tinta bg-sol px-4 py-2 font-display text-xl font-bold text-tinta">
              <Sparkles className="h-5 w-5" aria-hidden />
              Kataplum
            </span>
            <button
              type="button"
              onClick={() => setMenuAbierto(false)}
              className="btn-sticker rounded-full bg-white p-3 text-tinta"
              aria-label="Cerrar menú"
            >
              <X className="h-5 w-5" aria-hidden />
            </button>
          </div>
          <nav className="flex flex-1 flex-col items-start justify-center gap-2 px-8" aria-label="Navegación móvil">
            {LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMenuAbierto(false)}
                className="font-display text-4xl font-bold text-white transition-transform active:scale-95"
                style={{ transitionDelay: `${i * 40}ms` }}
              >
                {link.label}
              </a>
            ))}
            <a
              href="#boletos"
              onClick={() => setMenuAbierto(false)}
              className="btn-sticker mt-6 flex items-center gap-2 rounded-full bg-sol px-6 py-3 font-display text-xl font-bold text-tinta"
            >
              <Ticket className="h-5 w-5" aria-hidden />
              Comprar boletos
            </a>
          </nav>
        </div>
      )}
    </>
  );
}

import { Facebook, Instagram, Sparkles, Youtube } from "lucide-react";

export default function Footer() {
  return (
    <footer className="overflow-hidden bg-tinta pb-10 pt-16 text-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="flex items-center gap-2 font-display text-3xl font-extrabold text-sol">
              <Sparkles className="h-7 w-7" aria-hidden />
              Kataplum
            </p>
            <p className="mt-3 max-w-sm font-semibold text-white/70">
              El parque de diversiones donde cada visita es una aventura nueva. Boletos en línea, mapa
              interactivo y un día que nunca olvidarás.
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="btn-sticker rounded-full bg-white p-3 text-tinta"
                aria-label="Instagram de Kataplum"
              >
                <Instagram className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="btn-sticker rounded-full bg-white p-3 text-tinta"
                aria-label="Facebook de Kataplum"
              >
                <Facebook className="h-5 w-5" aria-hidden />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="btn-sticker rounded-full bg-white p-3 text-tinta"
                aria-label="YouTube de Kataplum"
              >
                <Youtube className="h-5 w-5" aria-hidden />
              </a>
            </div>
          </div>
          <nav aria-label="Enlaces del parque">
            <p className="font-display text-lg font-extrabold text-sol">El parque</p>
            <ul className="mt-3 space-y-2 font-semibold text-white/70">
              <li><a className="transition-colors hover:text-sol" href="#atracciones">Atracciones</a></li>
              <li><a className="transition-colors hover:text-sol" href="#mapa">Mapa del parque</a></li>
              <li><a className="transition-colors hover:text-sol" href="#boletos">Boletos y Pase Anual</a></li>
              <li><a className="transition-colors hover:text-sol" href="#como-llegar">Cómo llegar</a></li>
            </ul>
          </nav>
          <div>
            <p className="font-display text-lg font-extrabold text-sol">Ayuda</p>
            <ul className="mt-3 space-y-2 font-semibold text-white/70">
              <li><a className="transition-colors hover:text-sol" href="mailto:ayuda@kataplum.com.mx">ayuda@kataplum.com.mx</a></li>
              <li><a className="transition-colors hover:text-sol" href="tel:+525500001234">55 0000 1234</a></li>
              <li>Lun a dom · 9:00 a 22:00</li>
            </ul>
          </div>
        </div>

        <p
          className="mt-14 select-none text-center font-display text-[18vw] font-extrabold leading-none text-white/10 md:text-[11rem]"
          aria-hidden
        >
          KATAPLUM
        </p>
        <p className="mt-6 text-center text-sm font-semibold text-white/40">
          © {new Date().getFullYear()} Kataplum · Rediseño conceptual del sitio. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}

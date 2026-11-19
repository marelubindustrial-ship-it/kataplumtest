"use client";

import { Bus, Car, Clock, MapPin, TrainFront, Umbrella } from "lucide-react";
import { ENTRADA } from "@/data/park";

const OPCIONES = [
  {
    icono: Car,
    titulo: "En auto",
    texto: ENTRADA.estacionamiento + ". La entrada principal está sobre Av. de los Parques.",
  },
  {
    icono: Bus,
    titulo: "Transporte público",
    texto: "Metrobús Línea 3, estación Parques, a 5 minutos caminando de la entrada principal.",
  },
  {
    icono: TrainFront,
    titulo: "App de transporte",
    texto: "Escribe “Kataplum” en tu app favorita; el punto de destino oficial te deja justo en taquillas.",
  },
];

export default function Visit() {
  return (
    <section id="como-llegar" className="bg-crema py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="reveal">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-tinta bg-white px-4 py-1.5 text-sm font-bold text-tinta">
            <MapPin className="h-4 w-4 text-morado" aria-hidden />
            Cómo llegar
          </p>
          <h2 className="mt-4 font-display text-4xl font-extrabold text-tinta md:text-6xl">
            Te esperamos aquí
          </h2>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {OPCIONES.map((op) => {
            const Icono = op.icono;
            return (
              <div key={op.titulo} className="reveal sticker-lg rounded-[1.75rem] bg-white p-6">
                <span className="sticker flex h-12 w-12 items-center justify-center rounded-2xl bg-sol text-tinta">
                  <Icono className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-display text-xl font-extrabold text-tinta">{op.titulo}</h3>
                <p className="mt-2 font-semibold text-tinta/70">{op.texto}</p>
              </div>
            );
          })}
        </div>

        <div className="reveal sticker-lg mt-6 grid gap-5 rounded-[1.75rem] bg-uva p-6 text-white md:grid-cols-3">
          <div className="flex items-start gap-3">
            <MapPin className="mt-1 h-6 w-6 shrink-0 text-sol" aria-hidden />
            <div>
              <p className="font-display font-extrabold">Dirección</p>
              <p className="text-sm font-semibold text-white/80">{ENTRADA.direccion}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-6 w-6 shrink-0 text-sol" aria-hidden />
            <div>
              <p className="font-display font-extrabold">Horarios</p>
              <p className="text-sm font-semibold text-white/80">{ENTRADA.horarioSemana}</p>
              <p className="text-sm font-semibold text-white/80">{ENTRADA.horarioFin}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Umbrella className="mt-1 h-6 w-6 shrink-0 text-sol" aria-hidden />
            <div>
              <p className="font-display font-extrabold">Abrimos con lluvia o sol</p>
              <p className="text-sm font-semibold text-white/80">
                Solo las atracciones extremas pausan durante tormentas eléctricas, por tu seguridad.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

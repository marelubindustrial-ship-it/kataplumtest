"use client";

import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CalendarDays,
  Check,
  ChevronLeft,
  CreditCard,
  Mail,
  Minus,
  PartyPopper,
  Plus,
  ShieldCheck,
  Ticket,
  User,
  Zap,
} from "lucide-react";
import { EXTRAS, PRODUCTOS, TIPOS_VISITANTE, type ProductoBoleto } from "@/data/tickets";
import { precioMXN } from "@/data/park";

const PASOS = ["Boleto", "Fecha", "Tus datos", "Confirmación"] as const;

export default function Tickets() {
  const [paso, setPaso] = useState(0);
  const [productoId, setProductoId] = useState<string>(PRODUCTOS[0].id);
  const [tipoId, setTipoId] = useState("adulto");
  const [cantidad, setCantidad] = useState(2);
  const [fastPass, setFastPass] = useState(false);
  const [locker, setLocker] = useState(false);
  const [fecha, setFecha] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [errores, setErrores] = useState<Record<string, string>>({});
  const [folio, setFolio] = useState("");

  const producto: ProductoBoleto = PRODUCTOS.find((p) => p.id === productoId)!;
  const tipo = TIPOS_VISITANTE.find((t) => t.id === tipoId)!;

  const hoy = useMemo(() => new Date().toISOString().split("T")[0], []);

  const total = useMemo(() => {
    let t = tipo.aplica(producto) * cantidad;
    if (fastPass) t += EXTRAS.fastPass.precio * cantidad;
    if (locker) t += EXTRAS.locker.precio;
    return t;
  }, [tipo, producto, cantidad, fastPass, locker]);

  const validarDatos = () => {
    const e: Record<string, string> = {};
    if (nombre.trim().length < 3) e.nombre = "Escribe tu nombre completo";
    if (!/^\S+@\S+\.\S+$/.test(email)) e.email = "Escribe un correo válido";
    if (telefono.replace(/\D/g, "").length < 8) e.telefono = "Escribe un teléfono válido";
    setErrores(e);
    return Object.keys(e).length === 0;
  };

  const pagar = () => {
    const codigo = `KPL-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    setFolio(codigo);
    setPaso(3);
  };

  const reiniciar = () => {
    setPaso(0);
    setFolio("");
    setFecha("");
    setNombre("");
    setEmail("");
    setTelefono("");
    setErrores({});
  };

  return (
    <section id="boletos" className="relative overflow-hidden bg-uva py-16 md:py-24">
      <div className="pointer-events-none absolute -left-20 top-20 h-64 w-64 rounded-full border-4 border-tinta bg-morado opacity-40" aria-hidden />
      <div className="pointer-events-none absolute -right-16 bottom-16 h-48 w-48 rounded-full border-4 border-tinta bg-sol opacity-30" aria-hidden />

      <div className="relative mx-auto max-w-5xl px-4">
        <div className="reveal text-center">
          <p className="inline-flex items-center gap-2 rounded-full border-2 border-tinta bg-sol px-4 py-1.5 text-sm font-bold text-tinta">
            <Ticket className="h-4 w-4" aria-hidden />
            Compra en línea y evita filas
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl font-display text-4xl font-extrabold text-white md:text-6xl">
            Tus boletos, en menos de 2 minutos
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-lg font-semibold text-white/75">
            Sin registros complicados: elige tu boleto, tu fecha y listo. Te enviamos tu entrada con código QR al correo.
          </p>
        </div>

        {/* Indicador de pasos */}
        <ol className="reveal mt-10 flex items-center justify-center gap-0" aria-label="Progreso de la compra">
          {PASOS.map((p, i) => (
            <li key={p} className="flex items-center">
              <div className="flex flex-col items-center">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-4 font-display font-extrabold ${
                    i < paso
                      ? "border-tinta bg-sol text-tinta"
                      : i === paso
                        ? "border-tinta bg-white text-tinta"
                        : "border-white/40 bg-transparent text-white/60"
                  }`}
                  aria-current={i === paso ? "step" : undefined}
                >
                  {i < paso ? <Check className="h-5 w-5" aria-hidden /> : i + 1}
                </span>
                <span className={`mt-1.5 hidden text-xs font-bold sm:block ${i === paso ? "text-sol" : "text-white/60"}`}>
                  {p}
                </span>
              </div>
              {i < PASOS.length - 1 && <span className={`mx-1 h-1.5 w-8 rounded-full sm:mx-2 sm:w-14 ${i < paso ? "bg-sol" : "bg-white/25"}`} aria-hidden />}
            </li>
          ))}
        </ol>

        <div className="reveal sticker-lg mt-8 rounded-[2rem] bg-white p-5 md:p-8">
          {/* ---------- PASO 0: producto ---------- */}
          {paso === 0 && (
            <div>
              <div className="grid gap-5 md:grid-cols-2">
                {PRODUCTOS.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setProductoId(p.id)}
                    aria-pressed={productoId === p.id}
                    className={`sticker rounded-[1.5rem] p-5 text-left transition-transform ${
                      productoId === p.id ? "" : "opacity-90"
                    }`}
                    style={{
                      backgroundColor: "#fff",
                      boxShadow:
                        productoId === p.id
                          ? `0 4px 0 0 #161b32, 0 0 0 4px ${p.color}`
                          : "0 4px 0 0 #161b32",
                    }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span
                          className="rounded-full border-2 border-tinta px-3 py-0.5 text-xs font-extrabold text-tinta"
                          style={{ backgroundColor: p.color }}
                        >
                          {p.esPaseAnual ? "MEJOR VALOR" : "EL CLÁSICO"}
                        </span>
                        <h3 className="mt-3 font-display text-2xl font-extrabold text-tinta">{p.nombre}</h3>
                        <p className="text-sm font-bold text-tinta/60">{p.tagline}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-3xl font-extrabold text-tinta">{precioMXN(p.precio)}</p>
                        <p className="text-xs font-bold text-tinta/50">MXN / persona</p>
                      </div>
                    </div>
                    <ul className="mt-4 space-y-1.5">
                      {p.incluye.map((inc) => (
                        <li key={inc} className="flex items-start gap-2 text-sm font-semibold text-tinta/80">
                          <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0" style={{ color: p.color === "#974292" ? "#974292" : "#b8860b" }} aria-hidden />
                          {inc}
                        </li>
                      ))}
                    </ul>
                  </button>
                ))}
              </div>

              <div className="mt-6 grid gap-4 border-t-4 border-dashed border-tinta/15 pt-6 md:grid-cols-3">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-extrabold text-tinta">Tipo de visitante</span>
                  <select
                    value={tipoId}
                    onChange={(e) => setTipoId(e.target.value)}
                    className="sticker-sm w-full cursor-pointer rounded-2xl bg-nube px-4 py-3 font-bold text-tinta focus:outline-none"
                  >
                    {TIPOS_VISITANTE.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.nombre} · {precioMXN(t.aplica(producto))}
                      </option>
                    ))}
                  </select>
                </label>
                <div>
                  <span className="mb-1.5 block text-sm font-extrabold text-tinta">Cantidad</span>
                  <div className="sticker-sm flex w-fit items-center gap-3 rounded-2xl bg-nube px-2 py-1.5">
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.max(1, c - 1))}
                      className="rounded-full bg-white p-2 text-tinta transition-transform active:scale-90"
                      aria-label="Quitar un boleto"
                    >
                      <Minus className="h-4 w-4" aria-hidden />
                    </button>
                    <span className="w-8 text-center font-display text-xl font-extrabold text-tinta">{cantidad}</span>
                    <button
                      type="button"
                      onClick={() => setCantidad((c) => Math.min(10, c + 1))}
                      className="rounded-full bg-white p-2 text-tinta transition-transform active:scale-90"
                      aria-label="Agregar un boleto"
                    >
                      <Plus className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="mb-0 block text-sm font-extrabold text-tinta">Extras</span>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-tinta">
                    <input
                      type="checkbox"
                      checked={fastPass}
                      onChange={(e) => setFastPass(e.target.checked)}
                      className="h-5 w-5 accent-morado"
                    />
                    <Zap className="h-4 w-4 text-dorado" aria-hidden />
                    Fast Pass · {precioMXN(EXTRAS.fastPass.precio)} c/u
                  </label>
                  <label className="flex cursor-pointer items-center gap-2 text-sm font-bold text-tinta">
                    <input
                      type="checkbox"
                      checked={locker}
                      onChange={(e) => setLocker(e.target.checked)}
                      className="h-5 w-5 accent-morado"
                    />
                    Locker en Mundo Acuático · {precioMXN(EXTRAS.locker.precio)}
                  </label>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="font-display text-3xl font-extrabold text-tinta" aria-live="polite">
                  Total: <span className="text-morado">{precioMXN(total)}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className="btn-sticker flex items-center gap-2 rounded-full bg-sol px-7 py-3.5 font-display text-lg font-bold text-tinta"
                >
                  Elegir fecha
                  <ChevronLeft className="h-5 w-5 rotate-180" aria-hidden />
                </button>
              </div>
            </div>
          )}

          {/* ---------- PASO 1: fecha ---------- */}
          {paso === 1 && (
            <div className="mx-auto max-w-md">
              <h3 className="font-display text-2xl font-extrabold text-tinta">¿Qué día nos visitas?</h3>
              <p className="mt-1 font-semibold text-tinta/60">
                {cantidad} × {producto.nombre} ({tipo.nombre.toLowerCase()})
              </p>
              <label className="mt-5 block">
                <span className="mb-1.5 flex items-center gap-1.5 text-sm font-extrabold text-tinta">
                  <CalendarDays className="h-4 w-4" aria-hidden />
                  Fecha de visita
                </span>
                <input
                  type="date"
                  value={fecha}
                  min={hoy}
                  onChange={(e) => setFecha(e.target.value)}
                  className="sticker-sm w-full rounded-2xl bg-nube px-4 py-3 font-bold text-tinta focus:outline-none"
                />
              </label>
              {fecha && (
                <p className="mt-3 rounded-2xl bg-crema p-3 text-sm font-bold text-tinta">
                  {new Date(`${fecha}T12:00:00`).toLocaleDateString("es-MX", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {new Date(`${fecha}T12:00:00`).getDay() % 6 === 0
                    ? " · horario extendido 9:00 a 22:00"
                    : " · horario 10:00 a 20:00"}
                </p>
              )}
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setPaso(0)}
                  className="btn-sticker flex items-center gap-1 rounded-full bg-nube px-5 py-3 font-display font-bold text-tinta"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                  Atrás
                </button>
                <button
                  type="button"
                  disabled={!fecha}
                  onClick={() => setPaso(2)}
                  className="btn-sticker flex items-center gap-2 rounded-full bg-sol px-6 py-3 font-display font-bold text-tinta disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Continuar
                  <ChevronLeft className="h-5 w-5 rotate-180" aria-hidden />
                </button>
              </div>
            </div>
          )}

          {/* ---------- PASO 2: datos ---------- */}
          {paso === 2 && (
            <form
              className="mx-auto max-w-md"
              onSubmit={(e) => {
                e.preventDefault();
                if (validarDatos()) pagar();
              }}
              noValidate
            >
              <h3 className="font-display text-2xl font-extrabold text-tinta">¿A quién enviamos tus entradas?</h3>
              <div className="mt-5 space-y-4">
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-extrabold text-tinta">
                    <User className="h-4 w-4" aria-hidden />
                    Nombre completo
                  </span>
                  <input
                    type="text"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ana Martínez"
                    className="sticker-sm w-full rounded-2xl bg-nube px-4 py-3 font-bold text-tinta placeholder:text-tinta/40 focus:outline-none"
                    aria-invalid={!!errores.nombre}
                  />
                  {errores.nombre && <span className="mt-1 block text-sm font-bold text-red-600">{errores.nombre}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-extrabold text-tinta">
                    <Mail className="h-4 w-4" aria-hidden />
                    Correo electrónico
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ana@correo.com"
                    className="sticker-sm w-full rounded-2xl bg-nube px-4 py-3 font-bold text-tinta placeholder:text-tinta/40 focus:outline-none"
                    aria-invalid={!!errores.email}
                  />
                  {errores.email && <span className="mt-1 block text-sm font-bold text-red-600">{errores.email}</span>}
                </label>
                <label className="block">
                  <span className="mb-1.5 flex items-center gap-1.5 text-sm font-extrabold text-tinta">
                    <CreditCard className="h-4 w-4" aria-hidden />
                    Teléfono
                  </span>
                  <input
                    type="tel"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    placeholder="55 1234 5678"
                    className="sticker-sm w-full rounded-2xl bg-nube px-4 py-3 font-bold text-tinta placeholder:text-tinta/40 focus:outline-none"
                    aria-invalid={!!errores.telefono}
                  />
                  {errores.telefono && <span className="mt-1 block text-sm font-bold text-red-600">{errores.telefono}</span>}
                </label>
              </div>
              <div className="mt-6 flex justify-between">
                <button
                  type="button"
                  onClick={() => setPaso(1)}
                  className="btn-sticker flex items-center gap-1 rounded-full bg-nube px-5 py-3 font-display font-bold text-tinta"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden />
                  Atrás
                </button>
                <button
                  type="submit"
                  className="btn-sticker flex items-center gap-2 rounded-full bg-sol px-6 py-3 font-display text-lg font-bold text-tinta"
                >
                  Pagar {precioMXN(total)}
                </button>
              </div>
              <p className="mt-4 flex items-center justify-center gap-1.5 text-center text-xs font-bold text-tinta/50">
                <ShieldCheck className="h-4 w-4" aria-hidden />
                Pago seguro simulado · puedes cambiar tu fecha hasta 24 h antes
              </p>
            </form>
          )}

          {/* ---------- PASO 3: confirmación ---------- */}
          {paso === 3 && (
            <div className="mx-auto max-w-md text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-4 border-tinta bg-sol shadow-sticker animate-flotar">
                <PartyPopper className="h-10 w-10 text-tinta" aria-hidden />
              </div>
              <h3 className="mt-5 font-display text-3xl font-extrabold text-tinta">¡Listo, {nombre.split(" ")[0]}!</h3>
              <p className="mt-2 font-semibold text-tinta/70">
                Tu compra está confirmada. Enviamos {cantidad} {cantidad === 1 ? "entrada" : "entradas"} de{" "}
                {producto.nombre.toLowerCase()} a <strong className="text-tinta">{email}</strong>.
              </p>
              <div className="sticker mt-6 rounded-[1.5rem] bg-nube p-5 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-wider text-tinta/50">Folio</p>
                    <p className="font-display text-2xl font-extrabold text-morado">{folio}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-extrabold uppercase tracking-wider text-tinta/50">Total pagado</p>
                    <p className="font-display text-2xl font-extrabold text-tinta">{precioMXN(total)}</p>
                  </div>
                </div>
                <div className="mt-3 border-t-2 border-dashed border-tinta/20 pt-3 text-sm font-bold text-tinta/70">
                  <p>
                    {new Date(`${fecha}T12:00:00`).toLocaleDateString("es-MX", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </p>
                  <p>
                    {cantidad} × {tipo.nombre}
                    {fastPass && " · con Fast Pass"}
                  </p>
                  <p className="mt-2 text-xs font-semibold">
                    Presenta este folio en la entrada principal junto con tu identificación.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={reiniciar}
                className="btn-sticker mt-6 rounded-full bg-uva px-6 py-3 font-display font-bold text-white"
              >
                Comprar más boletos
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

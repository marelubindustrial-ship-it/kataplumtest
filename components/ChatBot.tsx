"use client";

import { useEffect, useRef, useState } from "react";
import { MessageCircle, Send, Sparkles, X } from "lucide-react";
import { CONOCIMIENTO, NOMBRE_BOT, RESPUESTA_FALLO, SUGERENCIAS } from "@/data/bot";

interface Mensaje {
  id: number;
  de: "bot" | "usuario";
  texto: string;
}

function responder(pregunta: string): string {
  const texto = pregunta
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  let mejor: { respuesta: string; puntos: number } | null = null;
  for (const item of CONOCIMIENTO) {
    let puntos = 0;
    for (const clave of item.claves) {
      const normalizada = clave
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      if (texto.includes(normalizada)) puntos += normalizada.length;
    }
    if (puntos > 0 && (!mejor || puntos > mejor.puntos)) {
      mejor = { respuesta: item.respuesta, puntos };
    }
  }
  return mejor ? mejor.respuesta : RESPUESTA_FALLO;
}

export default function ChatBot() {
  const [abierto, setAbierto] = useState(false);
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [entrada, setEntrada] = useState("");
  const [escribiendo, setEscribiendo] = useState(false);
  const [saludoEnviado, setSaludoEnviado] = useState(false);
  const listaRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  useEffect(() => {
    listaRef.current?.scrollTo({ top: listaRef.current.scrollHeight, behavior: "smooth" });
  }, [mensajes, escribiendo, abierto]);

  const agregar = (de: Mensaje["de"], texto: string) => {
    idRef.current += 1;
    setMensajes((m) => [...m, { id: idRef.current, de, texto }]);
  };

  const abrirChat = () => {
    setAbierto(true);
    if (!saludoEnviado) {
      setSaludoEnviado(true);
      setEscribiendo(true);
      setTimeout(() => {
        setEscribiendo(false);
        agregar(
          "bot",
          `¡Hola! Soy ${NOMBRE_BOT}, la asistente virtual de Kataplum. Puedo contarte sobre horarios, precios, estaturas mínimas, cómo llegar y más. ¿En qué te ayudo?`
        );
      }, 900);
    }
  };

  const enviar = (texto: string) => {
    const limpio = texto.trim();
    if (!limpio || escribiendo) return;
    agregar("usuario", limpio);
    setEntrada("");
    setEscribiendo(true);
    const demora = 700 + Math.min(1400, limpio.length * 25);
    setTimeout(() => {
      setEscribiendo(false);
      agregar("bot", responder(limpio));
    }, demora);
  };

  return (
    <>
      {/* Botón flotante estilo WhatsApp */}
      {!abierto && (
        <button
          type="button"
          onClick={abrirChat}
          className="fixed bottom-5 right-5 z-50 flex h-16 w-16 items-center justify-center rounded-full border-4 border-tinta bg-[#25d366] shadow-sticker-lg transition-transform hover:scale-105 active:scale-95"
          aria-label="Abrir chat con la asistente virtual de Kataplum"
        >
          <MessageCircle className="h-8 w-8 text-white" aria-hidden />
          <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-tinta bg-sol text-[10px] font-extrabold text-tinta">
            1
          </span>
        </button>
      )}

      {/* Ventana de chat */}
      {abierto && (
        <div
          className="fixed bottom-0 right-0 z-50 flex h-[100dvh] w-full flex-col bg-[#e7e0d8] sm:bottom-5 sm:right-5 sm:h-[560px] sm:max-h-[calc(100dvh-2.5rem)] sm:w-[380px] sm:rounded-[1.75rem] sm:border-4 sm:border-tinta sm:shadow-sticker-lg"
          role="dialog"
          aria-modal="false"
          aria-label="Chat con la asistente virtual"
        >
          {/* Encabezado estilo WhatsApp */}
          <div className="flex items-center gap-3 bg-[#075e54] px-4 py-3 sm:rounded-t-[1.4rem]">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white/40 bg-sol">
              <Sparkles className="h-6 w-6 text-tinta" aria-hidden />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-display font-extrabold text-white">{NOMBRE_BOT} · Kataplum</p>
              <p className="flex items-center gap-1 text-xs font-bold text-white/70">
                <span className={`h-2 w-2 rounded-full ${escribiendo ? "bg-sol" : "bg-[#25d366]"}`} aria-hidden />
                {escribiendo ? "escribiendo…" : "en línea"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAbierto(false)}
              className="rounded-full p-2 text-white transition-colors hover:bg-white/15"
              aria-label="Cerrar chat"
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          {/* Mensajes */}
          <div ref={listaRef} className="flex-1 space-y-2 overflow-y-auto px-3 py-4" aria-live="polite">
            {mensajes.map((m) => (
              <div key={m.id} className={`flex ${m.de === "usuario" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[82%] rounded-2xl px-3.5 py-2.5 text-sm font-semibold shadow-sm ${
                    m.de === "usuario"
                      ? "rounded-br-sm bg-[#dcf8c6] text-tinta"
                      : "rounded-bl-sm bg-white text-tinta"
                  }`}
                >
                  {m.texto}
                </div>
              </div>
            ))}
            {escribiendo && (
              <div className="flex justify-start" aria-label="La asistente está escribiendo">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-white px-4 py-3 shadow-sm">
                  {[0, 1, 2].map((i) => (
                    <span
                      key={i}
                      className="h-2 w-2 animate-escribir rounded-full bg-tinta/40"
                      style={{ animationDelay: `${i * 0.18}s` }}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sugerencias */}
          <div className="flex gap-2 overflow-x-auto px-3 pb-2" role="list" aria-label="Preguntas sugeridas">
            {SUGERENCIAS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => enviar(s)}
                className="shrink-0 rounded-full border-2 border-[#075e54] bg-white px-3 py-1.5 text-xs font-bold text-[#075e54] transition-colors hover:bg-[#075e54] hover:text-white"
              >
                {s}
              </button>
            ))}
          </div>

          {/* Entrada */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              enviar(entrada);
            }}
            className="flex items-center gap-2 px-3 pb-3 pt-1 sm:pb-3"
          >
            <input
              type="text"
              value={entrada}
              onChange={(e) => setEntrada(e.target.value)}
              placeholder="Escribe tu pregunta…"
              className="min-w-0 flex-1 rounded-full border-2 border-tinta/20 bg-white px-4 py-3 text-sm font-semibold text-tinta placeholder:text-tinta/40 focus:border-[#075e54] focus:outline-none"
              aria-label="Escribe tu pregunta"
            />
            <button
              type="submit"
              disabled={!entrada.trim() || escribiendo}
              className="btn-sticker flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#075e54] text-white disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Enviar mensaje"
            >
              <Send className="h-5 w-5" aria-hidden />
            </button>
          </form>
        </div>
      )}
    </>
  );
}

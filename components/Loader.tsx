"use client";

import { useEffect, useState } from "react";

const TRACK_PATH =
  "M 15 150 Q 50 150, 75 95 T 135 95 C 155 135, 165 155, 185 155 C 225 155, 225 75, 185 75 C 145 75, 145 155, 185 155 C 215 155, 245 85, 275 85 T 345 145";

export default function Loader() {
  const [visible, setVisible] = useState(true);
  const [salir, setSalir] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setSalir(true), 2100);
    const t2 = setTimeout(() => setVisible(false), 2600);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[60] flex items-center justify-center overflow-hidden bg-uva transition-transform duration-500 ease-in ${
        salir ? "-translate-y-full" : ""
      }`}
      aria-hidden
    >
      <div className="relative h-64 w-88 sm:h-72 sm:w-[28rem]">
        <svg
          viewBox="0 0 360 200"
          className="h-full w-full overflow-visible"
          fill="none"
        >
          {/* Soportes estructurales */}
          <g
            stroke="currentColor"
            className="text-tinta/40"
            strokeWidth="3"
            strokeLinecap="round"
          >
            <line x1="55" y1="115" x2="55" y2="185" />
            <line x1="95" y1="68" x2="95" y2="185" />
            <line x1="185" y1="145" x2="185" y2="185" />
            <line x1="275" y1="88" x2="275" y2="185" />
            <line x1="315" y1="135" x2="315" y2="185" />
            <line x1="20" y1="185" x2="340" y2="185" strokeWidth="4" />
          </g>

          {/* Vía base (borde exterior tinta) */}
          <path
            d={TRACK_PATH}
            stroke="currentColor"
            className="text-tinta"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Riel interior apagado (tramo pendiente) */}
          <path
            d={TRACK_PATH}
            stroke="white"
            strokeOpacity="0.2"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Riel iluminado en amarillo (se pinta conforme avanza el carrito) */}
          <path
            pathLength={100}
            d={TRACK_PATH}
            stroke="currentColor"
            className="text-sol"
            strokeWidth="5"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="100"
            strokeDashoffset="100"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="100"
              to="0"
              dur="2.1s"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.45 0.05 0.55 0.95"
              fill="freeze"
            />
          </path>

          {/* Carrito pegado sobre el riel con animateMotion */}
          <g>
            <animateMotion
              path={TRACK_PATH}
              dur="2.1s"
              rotate="auto"
              calcMode="spline"
              keyTimes="0; 1"
              keySplines="0.45 0.05 0.55 0.95"
              fill="freeze"
            />

            {/* Offset vertical (-6px) para que las ruedas pisen justo encima del riel */}
            <g transform="translate(0, -6)">
              {/* Estela de velocidad */}
              <line
                x1="-28"
                y1="-8"
                x2="-16"
                y2="-8"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                opacity="0.8"
              />
              <line
                x1="-24"
                y1="-2"
                x2="-15"
                y2="-2"
                stroke="currentColor"
                className="text-sol"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Pasajeros con brazos arriba */}
              <circle
                cx="-4"
                cy="-16"
                r="4"
                fill="white"
                stroke="currentColor"
                className="text-tinta"
                strokeWidth="2"
              />
              <path
                d="M -8 -21 L -5 -17 M 0 -21 L -3 -17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />

              <circle
                cx="6"
                cy="-16"
                r="4"
                fill="white"
                stroke="currentColor"
                className="text-tinta"
                strokeWidth="2"
              />
              <path
                d="M 2 -21 L 5 -17 M 10 -21 L 7 -17"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />

              {/* Cuerpo del carrito */}
              <rect
                x="-13"
                y="-13"
                width="28"
                height="12"
                rx="5"
                fill="currentColor"
                className="text-sol stroke-tinta"
                strokeWidth="3"
              />

              {/* Ruedas */}
              <circle
                cx="-7"
                cy="1"
                r="3.5"
                fill="white"
                stroke="currentColor"
                className="text-tinta"
                strokeWidth="2"
              />
              <circle
                cx="9"
                cy="1"
                r="3.5"
                fill="white"
                stroke="currentColor"
                className="text-tinta"
                strokeWidth="2"
              />
            </g>
          </g>
        </svg>
      </div>
    </div>
  );
}
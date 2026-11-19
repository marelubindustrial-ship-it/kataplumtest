"use client";

import { useEffect } from "react";

/**
 * Observa todos los elementos `.reveal` y les añade `.is-visible`
 * cuando entran al viewport. Funciona en desktop y mobile.
 */
export function useReveal() {
  useEffect(() => {
    const elementos = document.querySelectorAll<HTMLElement>(".reveal");
    if (!("IntersectionObserver" in window)) {
      elementos.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add("is-visible");
            observer.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );
    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

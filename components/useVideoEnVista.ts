"use client";

import { type RefObject, useEffect } from "react";
import { useReducedMotion } from "framer-motion";

/**
 * Reproduce un <video> solo mientras está en pantalla y la pestaña está
 * visible; al salir de la vista o al ocultar la pestaña se pausa, así un solo
 * vídeo decodifica a la vez (evita el cuelgue de tener3 loops corriendo a la
 * vez). Con prefers-reduced-motion se congela en el primer frame (el poster).
 */
export function useVideoEnVista(ref: RefObject<HTMLVideoElement | null>) {
  const reduce = useReducedMotion();

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    if (reduce) {
      video.pause();
      video.currentTime = 0;
      return;
    }

    let enPantalla = false;
    const sincronizar = () => {
      if (enPantalla && !document.hidden) {
        video.play().catch(() => {
          /* autoplay bloqueado: queda en el poster */
        });
      } else {
        video.pause();
      }
    };

    const observer = new IntersectionObserver(
      ([entrada]) => {
        enPantalla = entrada.isIntersecting;
        sincronizar();
      },
      { threshold: 0.25 },
    );
    observer.observe(video);

    const alCambiarVisibilidad = () => sincronizar();
    document.addEventListener("visibilitychange", alCambiarVisibilidad);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", alCambiarVisibilidad);
    };
  }, [ref, reduce]);
}

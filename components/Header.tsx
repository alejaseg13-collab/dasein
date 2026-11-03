"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function horaColombia(): string {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

export default function Header() {
  const reduce = useReducedMotion();
  // La hora se calcula solo en el cliente (new Date() no puede usarse en el
  // prerender): "--:--" como marcador estable hasta el primer tick.
  const [hora, setHora] = useState("");

  useEffect(() => {
    let cancelado = false;
    // El primer tick corrige la hora del prerender (visita en vivo).
    const arranque = window.setTimeout(() => {
      if (!cancelado) setHora(horaColombia());
    }, 0);
    const id = window.setInterval(() => {
      if (!cancelado) setHora(horaColombia());
    }, 60000);
    return () => {
      cancelado = true;
      window.clearTimeout(arranque);
      window.clearInterval(id);
    };
  }, []);

  return (
    <header
      className="absolute inset-x-0 top-0 z-40 px-5 pt-7 sm:px-6 md:px-[5.5%] md:pt-[38px]"
    >
      <div className="flex items-center justify-between gap-6">
        <Image
          src="/logo/logo-dasein-horizontal-studio.svg"
          alt="Dasein Studio"
          width={132}
          height={33}
          unoptimized
          className="h-[30px] w-auto md:h-[32px]"
        />

        <div className="hidden md:block">
          <p className="text-[13px] font-semibold leading-snug text-white">
            Estudio independiente
          </p>
          <p className="text-[13px] leading-snug text-[#e8ecec]/90">
            Desarrollo web/software | Marketing Digital | Branding
          </p>
        </div>

        <div className="hidden md:block">
          <p className="text-[13px] font-semibold leading-snug text-white">Horario</p>
          <p className="text-[13px] leading-snug text-[#e8ecec]/90">
            {hora || "--:--"} UTC-5
          </p>
        </div>

        <motion.a
          href="#contacto"
          whileHover={reduce ? undefined : { y: -4 }}
          transition={{
            y: { type: "spring", stiffness: 300, damping: 20 },
          }}
          className="inline-flex shrink-0 items-center gap-2.5 rounded-[10px] bg-white px-4 py-2.5 text-[13px] font-medium text-[#00272c] transition-colors hover:bg-white/90 sm:px-[18px] sm:py-3 sm:text-[13.5px]"
        >
          Empezar proyecto
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3 11L11 3M11 3H4.5M11 3v6.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.a>
      </div>

      <div className="mt-4 h-px w-full bg-white/25 md:mt-[19px]" />
    </header>
  );
}

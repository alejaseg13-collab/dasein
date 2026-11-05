"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIntro } from "@/components/IntroProvider";

const EASE_OUT = "easeOut" as const;

function horaColombia(): string {
  return new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).format(new Date());
}

export default function Header({ intro = false }: { intro?: boolean }) {
  const reduce = useReducedMotion();
  // La hora se calcula solo en el cliente (new Date() no puede usarse en el
  // prerender): "--:--" como marcador estable hasta el primer tick.
  const [hora, setHora] = useState("");
  // Solo en la portada (intro=true) el header entra con la animación de apertura;
  // en el resto de páginas se muestra directo.
  const { running } = useIntro();

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

  // Revelado con máscara: el texto cae desde arriba (mismo recurso que el
  // titular principal del hero). Sin intro o con reduced-motion: estático.
  const cae = (delay: number) => {
    if (!intro || reduce) return {};
    return {
      initial: { y: "-110%" },
      animate: { y: running ? "0%" : "-110%" },
      transition: { duration: 0.6, ease: EASE_OUT, delay },
    } as const;
  };

  return (
    <header className="absolute inset-x-0 top-0 z-40 px-5 pt-7 sm:px-6 md:px-[5.5%] md:pt-[38px]">
      <div className="flex items-center justify-between gap-6">
        <span className="block overflow-hidden">
          <motion.span className="block" {...cae(1.3)}>
            <Image
              src="/logo/logo-dasein-horizontal-studio.svg"
              alt="Dasein Studio"
              width={132}
              height={33}
              unoptimized
              className="block h-[30px] w-auto md:h-[32px]"
            />
          </motion.span>
        </span>

        <div className="hidden md:block">
          <span className="block overflow-hidden">
            <motion.span className="block" {...cae(1.4)}>
              <p className="text-[13px] font-semibold leading-snug text-white">
                Estudio independiente
              </p>
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span className="block" {...cae(1.52)}>
              <p className="text-[13px] leading-snug text-[#e8ecec]/90">
                Desarrollo web/software | Marketing Digital | Branding
              </p>
            </motion.span>
          </span>
        </div>

        <div className="hidden md:block">
          <span className="block overflow-hidden">
            <motion.span className="block" {...cae(1.4)}>
              <p className="text-[13px] font-semibold leading-snug text-white">Horario</p>
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span className="block" {...cae(1.52)}>
              <p className="text-[13px] leading-snug text-[#e8ecec]/90">
                {hora || "--:--"} UTC-5
              </p>
            </motion.span>
          </span>
        </div>

        <motion.a
          href="#contacto"
          initial={intro && !reduce ? { opacity: 0 } : false}
          animate={intro && !reduce ? { opacity: running ? 1 : 0 } : undefined}
          whileHover={reduce ? undefined : { y: -4 }}
          transition={{
            opacity: { duration: 0.6, ease: EASE_OUT, delay: 1.62 },
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

      <motion.div
        className="mt-4 h-px w-full origin-left bg-white/25 md:mt-[19px]"
        initial={intro && !reduce ? { scaleX: 0 } : false}
        animate={intro && !reduce ? { scaleX: running ? 1 : 0 } : undefined}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 1.45 }}
      />
    </header>
  );
}

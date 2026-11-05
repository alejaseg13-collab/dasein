"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import localFont from "next/font/local";
import Image from "next/image";
import Prism from "@/components/Prism";

// TODO: confirmar el número de WhatsApp con el equipo.
const WHATSAPP_NUMBER = "573209239138";

const EASE_OUT = "easeOut" as const;

// Misma fuente del párrafo "Si prefieres un contacto más directo…" (Sharp Sans),
// respetando la parte bold y la parte light del titular.
const sharpBold = localFont({
  src: "../public/fonts/sharp-sans/sharp-sans-extrabold.otf",
  weight: "800",
  display: "swap",
});

const sharpLight = localFont({
  src: "../public/fonts/sharp-sans/sharp-sans-light.otf",
  weight: "300",
  display: "swap",
});

function WhatsAppIcon() {
  return (
    <Image
      src="/images/wtp.svg"
      alt=""
      width={24}
      height={24}
      unoptimized
      className="h-[18px] w-[18px] shrink-0"
    />
  );
}

function Dot({ filled }: { filled: boolean }) {
  return (
    <motion.span
      className="block h-[18px] w-[18px] rounded-full border-2 border-white"
      animate={{ backgroundColor: filled ? "#ffffff" : "rgba(255,255,255,0)" }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
    />
  );
}

function Dots({ pattern, invert }: { pattern: boolean[]; invert: boolean }) {
  return (
    <div className="flex flex-col gap-[46px]">
      {pattern.map((f, i) => (
        <Dot key={i} filled={f !== invert} />
      ))}
    </div>
  );
}

export default function ClosingCta() {
  const reduce = useReducedMotion();
  const [invert, setInvert] = useState(false);
  // En desktop el titular se dibuja solo en el canvas3D (el HTML permanece
  // oculto → nunca se ve un "cambio de letra" al aparecer el cubo). El HTML
  // solo sirve de fallback: móvil o fuentes que no cargan.
  const [htmlVisible, setHtmlVisible] = useState(false);
  const mostrarFallback = useCallback(() => setHtmlVisible(true), []);

  useEffect(() => {
    if (window.innerWidth >= 768) return;
    const id = window.setTimeout(() => setHtmlVisible(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  useEffect(() => {
    if (reduce) return;
    const id = window.setInterval(() => setInvert((v) => !v), 3000);
    return () => window.clearInterval(id);
  }, [reduce]);

  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { amount: 0.3 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  return (
    <section className="relative z-10 flex min-h-[90svh] items-center justify-center overflow-hidden px-4 py-24 md:px-[5.5%]">
      <div aria-hidden="true" className="absolute left-[4.7%] top-1/2 hidden -translate-y-1/2 md:block">
        <Dots pattern={[false, true, false]} invert={invert} />
      </div>
      <div aria-hidden="true" className="absolute right-[4.7%] top-1/2 hidden -translate-y-1/2 md:block">
        <Dots pattern={[true, false, true]} invert={invert} />
      </div>

      <h2
        style={{ opacity: htmlVisible ? 1 : 0 }}
        className={`relative z-10 text-center text-[48px] uppercase leading-[1.05] tracking-[-0.01em] text-white md:text-[clamp(64px,7.2vw,108px)]`}
      >
        <motion.span {...enter(0)} className={`block font-extrabold ${sharpBold.className}`}>
          Demos forma
        </motion.span>
        <motion.span {...enter(0.12)} className="block">
          <span className={`font-extrabold ${sharpBold.className}`}>Y dirección</span>
          <span className={`font-light ${sharpLight.className}`}> a tus</span>
        </motion.span>
        <motion.span {...enter(0.24)} className={`block font-light ${sharpLight.className}`}>
          Proyectos
        </motion.span>
      </h2>

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center">
        <Prism onFallback={mostrarFallback} />
      </div>

      <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-8 px-4 md:bottom-[6%] md:flex-row md:items-end md:justify-between md:px-[5.5%]">
        <motion.p
          {...enter(0.6)}
          className="max-w-[250px] text-center text-[17px] font-light leading-[1.25] text-white md:text-left md:text-[24px]"
        >
          Si prefieres un contacto más directo,{" "}
          <strong className="font-semibold">escríbenos por WhatsApp</strong>
        </motion.p>

        <motion.div {...enter(0.7)} className="flex items-center gap-8">
          <span aria-hidden="true" className="hidden h-px w-[280px] bg-white md:block" />
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[56px] items-center justify-center gap-2.5 rounded-[6px] border border-white px-7 text-[15px] font-medium text-white transition-colors duration-300 hover:bg-white hover:text-[#111]"
          >
            <WhatsAppIcon />
            Hablemos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

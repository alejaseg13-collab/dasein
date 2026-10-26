"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import localFont from "next/font/local";
import Prism from "@/components/Prism";

// TODO: confirmar el número de WhatsApp con el equipo.
const WHATSAPP_NUMBER = "573122468060";

const EASE_OUT = "easeOut" as const;

const clashDisplay = localFont({
  src: "../public/fonts/Clash Display/ClashDisplay-Variable.ttf",
  weight: "200 700",
  display: "swap",
});

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.6" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M9.1 7.8c-.35.12-.67.4-.85.76l-.55 1c-.27.5-.16 1.13.22 1.63a12.4 12.4 0 0 0 2.55 2.6c.95.62 1.86 1 2.5 1.18.48.12.99-.02 1.34-.36l.83-.95-1.55-1.1-.72.37c-.82-.37-1.56-.9-2.13-1.55-.55-.62-.93-1.32-1.13-2.02l.45-.66-1.1-1.05z"
        fill="currentColor"
      />
    </svg>
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
  const [prismaListo, setPrismaListo] = useState(false);

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
    <section className="relative z-10 flex min-h-[90svh] items-center justify-center overflow-hidden px-4 py-24 md:px-[4%]">
      <div aria-hidden="true" className="absolute left-[4.7%] top-1/2 hidden -translate-y-1/2 md:block">
        <Dots pattern={[false, true, false]} invert={invert} />
      </div>
      <div aria-hidden="true" className="absolute right-[4.7%] top-1/2 hidden -translate-y-1/2 md:block">
        <Dots pattern={[true, false, true]} invert={invert} />
      </div>

      <h2
        style={{ opacity: prismaListo ? 0 : 1 }}
        className={`relative z-10 text-center text-[44px] uppercase leading-[1.05] tracking-[-0.01em] text-white transition-opacity duration-700 md:text-[clamp(60px,6.4vw,96px)] ${clashDisplay.className}`}
      >
        <motion.span {...enter(0)} className="block font-bold">
          Demos forma
        </motion.span>
        <motion.span {...enter(0.12)} className="block">
          <span className="font-bold">Y dirección</span>
          <span className="font-light"> a tus</span>
        </motion.span>
        <motion.span {...enter(0.24)} className="block font-light">
          Proyectos
        </motion.span>
      </h2>

      <motion.div
        initial={reduce ? false : { opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ amount: 0.3 }}
        transition={{ duration: 1.2, ease: EASE_OUT, delay: 0.4 }}
        className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
      >
        <Prism onReady={() => setPrismaListo(true)} />
      </motion.div>

      <div className="absolute inset-x-0 bottom-8 z-20 flex flex-col items-center gap-8 px-4 md:bottom-[6%] md:flex-row md:items-end md:justify-between md:px-[4%]">
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
            className="inline-flex h-[56px] w-[235px] items-center justify-center gap-2.5 rounded-[6px] border border-white text-[15px] font-medium text-white transition-colors duration-300 hover:bg-white hover:text-[#111]"
          >
            <WhatsAppIcon />
            Hablemos por WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}

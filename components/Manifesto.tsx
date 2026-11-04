"use client";

import localFont from "next/font/local";
import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT = "easeOut" as const;

const clashDisplay = localFont({
  src: "../public/fonts/clash-display/clashdisplay-variable.ttf",
  weight: "200 700",
  display: "swap",
});

export default function Manifesto() {
  const reduce = useReducedMotion();

  const word = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, filter: "blur(18px)" },
    whileInView: { opacity: 1, filter: "blur(0px)" },
    viewport: { amount: 0.4 },
    transition: { duration: 1.1, ease: EASE_OUT, delay },
  });

  const cyanBlock = {
    initial: reduce ? false : { opacity: 0, x: -36 },
    whileInView: { opacity: 1, x: 0 },
    viewport: { amount: 0.6 },
    transition: { duration: 1.1, ease: EASE_OUT, delay: 0.35 },
  };

  return (
    <section className="relative z-10 px-6 pb-[80px] pt-[72px] md:px-[11.7%] md:pt-[80px]">
      <p className="text-[13px] font-medium uppercase leading-none tracking-[0.14em] text-white md:text-[19px]">
        Diseño y estrategia de marca
      </p>

      <h2
        className={`mt-[14px] text-[clamp(32px,7.5vw,170px)] font-semibold uppercase leading-[1.35] tracking-[-0.01em] text-white md:leading-[1.12] ${clashDisplay.className}`}
      >
        <span className="flex flex-wrap items-center justify-between gap-x-8 gap-y-9 md:gap-y-7">
          <motion.span {...word(0)} className="whitespace-nowrap [word-spacing:0.25em]">
            Somos una
          </motion.span>

          <span className="flex items-center gap-8 md:gap-[48px]">
            <span className="font-sans text-[15px] font-light leading-[1.35] tracking-normal text-white/80 normal-case md:w-[118px] md:text-[18px]">
              Cuéntanos que tienes en mente
            </span>
            <a
              href="#contacto"
              className="group inline-flex h-[52px] shrink-0 items-center gap-[14px] rounded-full bg-white pl-[20px] pr-[6px] transition-colors hover:bg-white/90 motion-reduce:transition-none md:h-[56px] md:gap-[18px] md:pl-[22px] md:pr-[7px]"
            >
              <span className="font-sans text-[15px] font-medium normal-case text-[#666] md:text-[16px]">
                Hablemos
              </span>
              <span className="flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#0bcadf] md:h-[42px] md:w-[42px]">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 14 14"
                  fill="none"
                  aria-hidden="true"
                  className="text-white transition-transform duration-300 ease-out group-hover:translate-x-[3px] group-hover:-translate-y-[3px] motion-reduce:transition-none"
                >
                  <path
                    d="M3 11L11 3M11 3H4.5M11 3v6.5"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </a>
          </span>
        </span>

        <motion.span {...word(0.12)} className="mt-3 block whitespace-nowrap [word-spacing:0.25em] md:mt-0">
          Agencia digital
        </motion.span>

        <span className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-5 md:mt-0">
          <motion.span
            {...cyanBlock}
            className="flex shrink-0 items-center gap-[8px] md:gap-[0.08em]"
          >
            <span className="flex h-[76px] w-[200px] shrink-0 items-center bg-[#0bcadf] px-[14px] md:h-[0.8em] md:w-[2.5em] md:px-[0.17em]">
              <span className="font-sans text-[14px] font-semibold leading-[1.5] tracking-[0.01em] text-[#03081e] md:text-[max(13px,0.16em)] md:leading-[1.55]">
                Un estudio creativo
                <br />
                desde Colombia
              </span>
            </span>
            <span aria-hidden="true" className="flex h-[76px] items-stretch gap-[8px] md:h-[0.8em] md:gap-[0.08em]">
              <span className="w-[24px] bg-[#0bcadf] md:w-[0.28em]" />
              <span className="w-[12px] bg-[#0bcadf] md:w-[0.144em]" />
              <span className="w-[5px] bg-[#0bcadf] md:w-[0.05em]" />
            </span>
          </motion.span>

          <motion.span {...word(0.22)} className="whitespace-nowrap [word-spacing:0.25em]">
            Ganadora
          </motion.span>
        </span>
      </h2>

      {/* Cierra el bloque: misma línea que el separador de arriba. */}
      <div aria-hidden="true" className="mt-[64px] h-px w-full bg-white/45" />
    </section>
  );
}

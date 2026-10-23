"use client";

import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";

const EASE_OUT = "easeOut" as const;

/**
 * TODO: sustituir estos textos de relleno por los SVG reales de los clientes
 * (blanco) cuando estén en /public/logo (ver DESIGN.md — "Faltan").
 * Cada marca lleva su propio tratamiento tipográfico solo como marcador.
 */
const LOGOS: { id: string; node: React.ReactNode }[] = [
  {
    id: "burberry",
    node: (
      <span className="text-[21px] font-semibold uppercase tracking-[0.02em] md:text-[26px]">
        Burberry
      </span>
    ),
  },
  {
    id: "adidas",
    node: (
      <span className="text-[24px] font-semibold lowercase tracking-[-0.03em] md:text-[30px]">
        adidas
      </span>
    ),
  },
  {
    id: "ensigna",
    node: (
      <span className="text-[15px] font-medium uppercase tracking-[0.3em] md:text-[18px]">
        Ensigna
      </span>
    ),
  },
  {
    id: "stationery",
    node: (
      <span className="flex flex-col items-center leading-none">
        <span className="text-[7px] uppercase tracking-[0.3em] md:text-[8px]">
          Extra Delicious
        </span>
        <span className="mt-[5px] text-[16px] font-medium uppercase tracking-[0.28em] md:text-[19px]">
          Stationery
        </span>
      </span>
    ),
  },
  {
    id: "mexicana",
    node: (
      <span className="text-[21px] font-semibold italic uppercase tracking-[0.01em] md:text-[26px]">
        Mexicana
      </span>
    ),
  },
  {
    id: "gpsnvision",
    node: (
      <span className="text-[21px] font-semibold lowercase tracking-[-0.03em] md:text-[26px]">
        gpsnvision
      </span>
    ),
  },
  {
    id: "logistics",
    node: (
      <span className="text-[19px] font-medium italic uppercase tracking-[0.04em] md:text-[23px]">
        Logistics
      </span>
    ),
  },
];

const MARQUEE_CSS = `
@keyframes dasein-marquee {
  from { transform: translate3d(0, 0, 0); }
  to { transform: translate3d(-50%, 0, 0); }
}
.dasein-marquee {
  animation: dasein-marquee 64s linear infinite;
  will-change: transform;
}
.dasein-marquee-host:hover .dasein-marquee {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .dasein-marquee { animation: none; }
}
`;

export default function Clients() {
  const reduce = useReducedMotion();

  return (
    <section className="relative z-10 -mt-10 px-6 pb-[110px] text-center md:-mt-[110px] md:px-12">
      <Reveal
        as="h2"
        y={24}
        amount={0.6}
        duration={1}
        className="text-[36px] font-light leading-[1.05] text-white md:text-[68px]"
      >
        Nuestros <span className="font-daisy italic">clientes</span>
      </Reveal>

      <Reveal
        as="p"
        y={16}
        amount={0.8}
        duration={1}
        delay={0.15}
        className="mx-auto mt-[16px] max-w-[620px] text-[14px] font-light leading-[1.5] text-white/70 md:mt-[24px] md:max-w-[860px] md:text-[19px]"
      >
        Ellos han confiado en nosotros. Sé también uno de nuestros{" "}
        <span className="font-semibold text-white">clientes satisfechos</span>.
      </Reveal>

      <motion.div
        initial={reduce ? false : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ amount: 0.4 }}
        transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.3 }}
        className="dasein-marquee-host relative mx-[-24px] mt-[64px] h-[56px] overflow-hidden md:mx-[-48px] md:mt-[72px] md:h-[70px]"
      >
        <style>{MARQUEE_CSS}</style>
        <div className="dasein-marquee absolute inset-y-0 left-0 flex w-max items-center">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-8 pr-8 text-white/95 md:gap-11 md:pr-11"
            >
              {LOGOS.map((logo) => (
                <li key={logo.id} className="flex shrink-0 items-center">
                  {logo.node}
                </li>
              ))}
            </ul>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

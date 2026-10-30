"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";

const EASE_OUT = "easeOut" as const;

/**
 * Logos reales de los clientes (SVG en /public/images, con su color propio).
 * Todos se pintan a la misma altura de cinta; el ancho lo define cada SVG.
 */
const LOGOS: { id: string; src: string; alt: string; width: number; height: number }[] = [
  { id: "astralem", src: "/images/Astralem.svg", alt: "Astralem", width: 156, height: 32 },
  { id: "atria", src: "/images/Atria.svg", alt: "Atria", width: 206, height: 40 },
  { id: "boko", src: "/images/Boko.svg", alt: "Boko", width: 157, height: 44 },
  { id: "casa-facil", src: "/images/Casa-Facil.svg", alt: "Casa-Facil", width: 75, height: 62 },
  { id: "ejepets", src: "/images/Ejepets.svg", alt: "Ejepets", width: 123, height: 42 },
  { id: "fcs", src: "/images/FCS.svg", alt: "FCS", width: 79, height: 75 },
  { id: "jabo", src: "/images/Jabo.svg", alt: "Jabo", width: 154, height: 39 },
  { id: "lolarepa", src: "/images/Lolarepa.svg", alt: "Lolarepa", width: 59, height: 62 },
  { id: "manuel-foto", src: "/images/Manuel%20Foto.svg", alt: "Manuel Foto", width: 151, height: 57 },
  { id: "senda", src: "/images/Senda.svg", alt: "Senda", width: 145, height: 42 },
  { id: "vora", src: "/images/Vora.svg", alt: "Vora", width: 113, height: 28 },
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
    <section className="relative z-10 -mt-10 px-6 pb-[72px] text-center md:-mt-[110px] md:px-[5.5%]">
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
        className="dasein-marquee-host relative mx-[-24px] mt-[64px] h-[56px] overflow-hidden md:mx-[-5.5%] md:mt-[72px] md:h-[70px]"
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
                  <Image
                    src={logo.src}
                    alt={logo.alt}
                    width={logo.width}
                    height={logo.height}
                    unoptimized
                    className="h-[34px] w-auto md:h-[42px]"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

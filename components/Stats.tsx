"use client";

import localFont from "next/font/local";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";

const clashDisplay = localFont({
  src: "../public/fonts/Clash Display/ClashDisplay-Variable.ttf",
  weight: "200 700",
  display: "swap",
});

const sharpSansBold = localFont({
  src: "../public/fonts/Sharp Sans/Sharp Sans Bold.otf",
  weight: "700",
  display: "swap",
});

const STATS = [
  { prefijo: "+", valor: 35, etiqueta: "PROYECTOS CREATIVOS" },
  { prefijo: "+", valor: 4, etiqueta: "AÑOS DE EXPERIENCIA" },
];

const EASE_OUT = "easeOut" as const;

type StatData = (typeof STATS)[number];

function Stat({ prefijo, valor, etiqueta, delay }: StatData & { delay: number }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const count = useMotionValue(reduce ? valor : 0);
  const display = useTransform(count, (v) => Math.round(v));

  useEffect(() => {
    if (reduce) {
      count.set(valor);
      return;
    }
    if (!inView) return;
    const controls = animate(count, valor, { duration: 1.6, ease: EASE_OUT });
    return () => controls.stop();
  }, [inView, reduce, valor, count]);

  return (
    <motion.div
      ref={ref}
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      className="flex flex-col items-center text-center"
    >
      <span
        className={`${clashDisplay.className} inline-block text-[64px] font-semibold leading-[1.05] tracking-[-0.02em] text-white tabular-nums md:text-[120px]`}
        style={{ minWidth: `${String(valor).length + prefijo.length}ch` }}
      >
        {prefijo}
        <motion.span>{display}</motion.span>
      </span>
      <span
        className={`${sharpSansBold.className} mt-3 text-[13px] font-bold uppercase leading-[1.4] text-white md:mt-4 md:text-[18px]`}
      >
        {etiqueta}
      </span>
    </motion.div>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-8 w-8 md:h-9 md:w-9" fill="#fcae04" aria-hidden="true">
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.56l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

export default function Stats() {
  const reduce = useReducedMotion();

  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  return (
    <section className="relative z-10 px-6 py-[72px] md:px-[4.4%] md:py-[96px]">
      <div className="md:grid md:grid-cols-2">
        <div>
          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="h-px w-[120px] origin-left bg-white"
          />

          <h2
            className={`${sharpSansBold.className} mt-8 text-[18px] font-bold uppercase leading-[1.65] text-white md:text-[19px]`}
          >
            <motion.span {...enter(0.15)} className="block">
              UN EQUIPO LLENO
            </motion.span>
            <motion.span {...enter(0.25)} className="block">
              DE GANAS Y TALENTO
            </motion.span>
          </h2>

          <div className="mt-6 flex gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={reduce ? false : { opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.4 + i * 0.1 }}
              >
                <Star />
              </motion.span>
            ))}
          </div>
        </div>

        <div className="mt-12 md:mt-0">
          <motion.p
            {...enter(0.2)}
            className="max-w-[640px] text-[19px] font-light leading-[1.45] text-white md:text-[26px]"
          >
            Enfatizamos cómo profundizar en la complejidad de cada caso para dar con conexiones y
            soluciones sencillas y potentes. Soluciones tecnológicas a la medida de tu visión.
          </motion.p>

          <div className="mt-12 flex justify-between md:mt-16">
            {STATS.map((stat, i) => (
              <Stat key={stat.etiqueta} {...stat} delay={0.3 + i * 0.1} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

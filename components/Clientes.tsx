"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE_OUT = "easeOut" as const;

export default function Clientes() {
  const reduce = useReducedMotion();

  return (
    <section className="relative z-10 -mt-10 px-6 pb-[110px] text-center md:-mt-[110px] md:px-12">
      <motion.h2
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        transition={{ duration: 1, ease: EASE_OUT }}
        className="text-[36px] font-light leading-[1.05] text-white md:text-[68px]"
      >
        Nuestros <span className="font-daisy italic">clientes</span>
      </motion.h2>
      <motion.p
        initial={reduce ? false : { opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 1, ease: EASE_OUT, delay: 0.15 }}
        className="mx-auto mt-[16px] max-w-[620px] text-[13.5px] font-light leading-[1.5] text-white/65 md:mt-[22px] md:text-[15px]"
      >
        Ellos han confiado en nosotros. Sé también uno de nuestros clientes satisfechos.
      </motion.p>
      {/* TODO: fila de logos de clientes — cinta continua lenta que se detiene al pasar el mouse.
          PENDIENTE: faltan los logos de clientes en /public (ver DESIGN.md "Faltan"). */}
    </section>
  );
}

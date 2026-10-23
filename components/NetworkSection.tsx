"use client";

import { motion, MotionConfig } from "framer-motion";
import Reveal from "@/components/Reveal";

const EASE_OUT = "easeOut" as const;

export default function NetworkSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative z-10 pt-[64px] pb-[96px] md:pt-[96px] md:pb-[140px]">
        <div className="px-[4.5%] md:grid md:grid-cols-[46%_1fr]">
          <h2 className="text-[24px] uppercase leading-[1.45] text-white md:pr-8 md:text-[27px]">
            <Reveal as="span" delay={0} className="block font-normal">
              Diseñamos de forma increíble.
            </Reveal>
            <Reveal as="span" delay={0.1} className="block font-semibold">
              Creamos de forma eficiente.
            </Reveal>
          </h2>

          <Reveal
            as="p"
            delay={0.2}
            className="mt-6 text-[15px] font-light leading-[1.55] text-[#9c9aa0] md:mt-0 md:text-[19px]"
          >
            Diseñamos para que tu negocio crezca, se diferencie y conecte. Conectamos cada punto
            de tu negocio para crear marcas fuertes, productos que funcionan y experiencias que
            generan resultados.
          </Reveal>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ amount: 0.25 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
          className="relative mx-[4.5%] mt-[56px] overflow-hidden md:mt-[80px]"
        >
          <div className="aspect-video w-full">
            <motion.img
              src="/images/fondo-red-poster.webp"
              alt=""
              initial={{ scale: 1.05, x: "-1.5%" }}
              whileInView={{ scale: 1.15, x: "1.5%" }}
              viewport={{ amount: 0.25 }}
              transition={{
                duration: 6,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <motion.div
              initial={{ x: "-60%" }}
              whileInView={{ x: "210%" }}
              viewport={{ amount: 0.25 }}
              transition={{
                duration: 2.5,
                ease: "easeInOut",
                delay: 1.5,
                repeat: Infinity,
                repeatDelay: 5,
              }}
              className="absolute -top-[20%] left-0 h-[140%] w-[45%] rotate-[-10deg] bg-gradient-to-r from-transparent via-white/15 to-transparent blur-[6px]"
            />
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}

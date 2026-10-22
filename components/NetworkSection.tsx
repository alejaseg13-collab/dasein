"use client";

import { motion, MotionConfig } from "framer-motion";

const EASE_OUT = "easeOut" as const;

const enter = (delay: number, y: number) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8, ease: EASE_OUT, delay },
});

export default function NetworkSection() {
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative z-10 pt-[64px] pb-[96px] md:pt-[96px] md:pb-[140px]">
        <div className="px-[4.5%] md:grid md:grid-cols-[46%_1fr]">
          <h2 className="text-[24px] uppercase leading-[1.45] text-white md:pr-8 md:text-[27px]">
            <motion.span {...enter(0, 24)} className="block font-normal">
              Diseñamos de forma increíble.
            </motion.span>
            <motion.span {...enter(0.1, 24)} className="block font-semibold">
              Creamos de forma eficiente.
            </motion.span>
          </h2>

          <motion.p
            {...enter(0.2, 24)}
            className="mt-6 text-[15px] font-light leading-[1.55] text-[#9c9aa0] md:mt-0 md:text-[19px]"
          >
            Diseñamos para que tu negocio crezca, se diferencie y conecte. Conectamos cada punto
            de tu negocio para crear marcas fuertes, productos que funcionan y experiencias que
            generan resultados.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.15 }}
          className="mx-[4.5%] mt-[56px] overflow-hidden md:mt-[80px]"
        >
          <div className="aspect-video w-full">
            <motion.img
              src="/images/fondo-red-poster.webp"
              alt=""
              initial={{ scale: 1 }}
              whileInView={{ scale: 1.12 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 10,
                ease: "easeInOut",
                repeat: Infinity,
                repeatType: "reverse",
              }}
              className="h-full w-full object-cover"
            />
          </div>
        </motion.div>
      </section>
    </MotionConfig>
  );
}

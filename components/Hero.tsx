"use client";

import Image from "next/image";
import { useCallback } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

const EASE_OUT = "easeOut" as const;

export default function Hero() {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 40, damping: 20, mass: 0.6 });
  const y = useSpring(my, { stiffness: 40, damping: 20, mass: 0.6 });

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (reduce) return;
      const r = e.currentTarget.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      mx.set(-px * 24);
      my.set(-py * 24);
    },
    [mx, my, reduce],
  );

  const astronautaZoom = reduce
    ? {}
    : {
        animate: { scale: [1, 1.08] },
        transition: { duration: 20, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" as const },
      };

  const nieblaDrift = reduce
    ? {}
    : {
        animate: { x: ["-3%", "3%"] },
        transition: { duration: 16, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" as const },
      };

  const glowPulse = reduce
    ? {}
    : {
        animate: { opacity: [0.45, 0.8, 0.45] },
        transition: { duration: 6, repeat: Infinity, ease: "easeInOut" as const },
      };

  return (
    <section
      onMouseMove={onMouseMove}
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#08090b] md:aspect-[1512/1323]"
    >
      <motion.div
        className="absolute inset-0"
        style={{ x, y, transformOrigin: "53% 33%" }}
        {...astronautaZoom}
      >
        <Image
          src="/images/hero-astronauta.webp"
          alt=""
          width={2752}
          height={1536}
          unoptimized
          preload
          className="absolute left-[-10.5%] top-[-3.3%] hidden w-[111%] max-w-none md:block"
          style={{
            maskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, black 0%, black 80%, transparent 100%)",
          }}
        />
        <Image
          src="/images/hero-astronauta-cuadro.webp"
          alt=""
          width={1600}
          height={1500}
          unoptimized
          preload
          className="absolute inset-0 h-full w-full object-cover object-[58%_45%] md:hidden"
        />
        <motion.div
          className="absolute left-[53%] top-[33%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,255,252,0.5),rgba(110,240,230,0.12),transparent)] blur-[40px] mix-blend-screen"
          {...glowPulse}
        />
      </motion.div>

      <div className="relative z-30 px-6 md:px-12">
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.1 }}
          className="flex items-center gap-3 pt-[28vh] md:pt-[clamp(180px,19svh,260px)]"
        >
          <span className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-white/80">
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
          </span>
          <span className="text-[12px] font-medium uppercase leading-none tracking-[0.2em] text-white md:text-[13px]">
            Todo tu proyecto a medida
          </span>
        </motion.div>

        <h1 className="mt-[18px] max-w-[720px] text-[40px] font-light leading-[0.98] tracking-[-0.015em] text-white md:text-[clamp(56px,4.6vw,70px)] md:leading-[1.11]">
          {["La presencia", "no se encuentra,"].map((line, i) => (
            <motion.span
              key={line}
              className="block"
              initial={reduce ? false : { opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 + i * 0.15 }}
            >
              {line}
            </motion.span>
          ))}
          <motion.span
            className="mt-[6px] block font-daisy text-[42px] italic leading-[1.02] md:text-[clamp(68px,5.6vw,85px)]"
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE_OUT, delay: 0.5 }}
          >
            Se diseña.
          </motion.span>
        </h1>
      </div>

      <div className="absolute inset-x-0 bottom-10 z-30 flex flex-col gap-6 px-6 md:contents">
        <motion.div
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.75 }}
          className="md:absolute md:left-12 md:top-[55%] md:max-w-[290px]"
          style={{
            maskImage: "linear-gradient(to right, black 25%, transparent 92%)",
            WebkitMaskImage: "linear-gradient(to right, black 25%, transparent 92%)",
          }}
        >
          <div className="mb-[14px] h-px w-[110px] bg-white/40" />
          <p className="text-[14px] font-light leading-[1.1] text-white/90 md:text-[13.5px] md:leading-[14.4px]">
            Construimos identidades, productos, experiencias de usuario y mundos digitales para
            tus proyectos más ambiciosos.
          </p>
        </motion.div>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.95 }}
          className="md:absolute md:right-12 md:top-[52%] md:w-[348px]"
        >
          <div className="flex items-center gap-2.5 rounded-[12px] border border-white/20 bg-white/20 p-3 backdrop-blur-md">
            <div
              className="h-[78px] w-[78px] shrink-0 rounded-[8px] bg-[url('/images/hero-astronauta.webp')] bg-[length:200%] bg-[position:85%_50%]"
              aria-hidden="true"
            />
            <div>
              <p className="text-[15px] font-semibold leading-none text-[#2b4242]">Identidad</p>
              <p className="mt-2 text-[12.5px] font-light leading-[13.8px] text-white/80">
                narrativa, naming, sistemas visuales y estrategia de marca según tus
                necesidades.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-0 left-[-19%] z-20 h-[48%] w-[138%]"
        style={{
          maskImage: "linear-gradient(to top, black 0%, black 78%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to top, black 0%, black 78%, transparent 100%)",
        }}
        {...nieblaDrift}
      >
        <Image
          src="/images/hero-niebla.webp"
          alt=""
          width={1376}
          height={768}
          unoptimized
          className="absolute inset-0 h-full w-full object-cover object-[center_65%]"
        />
      </motion.div>
    </section>
  );
}

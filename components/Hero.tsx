"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { useIntro } from "@/components/IntroProvider";

const EASE_OUT = "easeOut" as const;
const EASE_INOUT = [0.37, 0, 0.63, 1] as const;
const CLIP_RECT = "inset(14% 10% 32% 46% round 16px)";
const CLIP_FULL = "inset(0% 0% 0% 0% round 0px)";

export default function Hero() {
  const { running } = useIntro();
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
        animate: { scale: [1, 1.12] },
        transition: { duration: 6, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" as const },
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

  const shine = reduce
    ? {}
    : {
        animate: { x: ["-100%", "100%"] },
        transition: { duration: 2.6, repeat: Infinity, ease: "linear" as const },
      };

  const scrollToNext = useCallback(() => {
    const next = document.querySelectorAll("section")[1];
    next?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }, [reduce]);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const fogOpacity = useTransform(scrollYProgress, [0, 0.45], [0, 1]);
  const fogY = useTransform(scrollYProgress, [0, 0.45], ["0%", reduce ? "0%" : "-6%"]);

  return (
    <section
      ref={heroRef}
      onMouseMove={onMouseMove}
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#08090b] md:aspect-[1512/1323]"
    >
      <motion.div
        data-intro-clip
        className="absolute inset-0"
        initial={{ clipPath: CLIP_RECT }}
        animate={{ clipPath: running ? CLIP_FULL : CLIP_RECT }}
        transition={{ duration: 0.75, ease: EASE_INOUT, delay: 0.48 }}
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
      </motion.div>

      <div className="relative z-30 px-6 md:px-12">
        <motion.div
          data-intro
          initial={{ opacity: 0, y: 8 }}
          animate={running ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          transition={{ duration: 0.2, ease: EASE_OUT, delay: 0.55 }}
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
            <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <motion.span
                data-intro
                className="block"
                initial={{ y: "110%" }}
                animate={{ y: running ? "0%" : "110%" }}
                transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.62 + i * 0.075 }}
              >
                {line}
              </motion.span>
            </span>
          ))}
          <span className="mt-[6px] block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <motion.span
              data-intro
              className="block font-daisy text-[42px] italic leading-[1.02] md:text-[clamp(68px,5.6vw,85px)]"
              initial={{ y: "110%" }}
              animate={{ y: running ? "0%" : "110%" }}
              transition={{ duration: 0.35, ease: EASE_OUT, delay: 0.77 }}
            >
              Se diseña.
            </motion.span>
          </span>
        </h1>
      </div>

      <div className="absolute inset-x-0 bottom-10 z-30 flex flex-col gap-6 px-6 md:contents">
        <motion.div
          data-intro
          initial={{ opacity: 0, y: 10 }}
          animate={running ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
          transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.95 }}
          className="flex flex-col gap-5 md:absolute md:left-12 md:top-[53%] md:flex-row md:items-center md:gap-7"
        >
          <div className="max-w-[250px]">
            <div className="mb-[14px] h-px w-[250px] bg-white/50" />
            <p className="text-[14px] font-light leading-[1.1] text-white md:text-[13.5px] md:leading-[14.4px]">
              Construimos identidades, productos digitales, experiencias de usuario y mundos
              completos para tus proyectos más ambiciosos.
            </p>
          </div>
          <a
            href="#contacto"
            className="inline-flex w-fit shrink-0 items-center gap-2 rounded-[6px] bg-white px-[18px] py-[10px] text-[14px] font-medium text-[#1e726c] transition-colors hover:bg-white/90"
          >
            Discutir proyecto
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M3 11L11 3M11 3H4.5M11 3v6.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </motion.div>

        <div className="md:absolute md:left-1/2 md:top-[57%] md:-translate-x-1/2">
          <motion.button
            type="button"
            data-intro
            onClick={scrollToNext}
            initial={{ opacity: 0 }}
            animate={running ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.3, ease: EASE_OUT, delay: 1 }}
            className="flex items-center gap-3"
          >
            <span className="text-[13px] font-light text-white">Desliza y conoce</span>
            <span className="relative block h-px w-[46px] overflow-hidden bg-white/40">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                {...shine}
              />
            </span>
          </motion.button>
        </div>

        <motion.div
          data-intro
          initial={{ opacity: 0, y: 16 }}
          animate={running ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.35, ease: EASE_OUT, delay: 1.1 }}
          className="md:absolute md:right-12 md:top-[52%] md:w-[316px]"
        >
          <div className="flex items-center gap-3 rounded-[6px] bg-white p-2.5">
            <div
              className="h-[66px] w-[66px] shrink-0 rounded-[6px] bg-[url('/images/hero-astronauta.webp')] bg-[length:200%] bg-[position:80%_48%]"
              aria-hidden="true"
            />
            <div>
              <p className="text-[14px] font-bold leading-none text-black">Identidad</p>
              <p className="mt-1.5 text-[12px] leading-[13px] text-[#666666]">
                Narrativa, naming, sistemas visuales y estrategia de marca según tus
                necesidades.
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="pointer-events-none absolute bottom-0 left-[-19%] z-20 h-[48%] w-[138%]"
        style={{
          opacity: fogOpacity,
          y: fogY,
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

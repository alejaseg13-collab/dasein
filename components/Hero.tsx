"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useIntro } from "@/components/IntroProvider";
import Header from "@/components/Header";

const EASE_INOUT = [0.37, 0, 0.63, 1] as const;
const CLIP_RECT = "inset(14% 10% 32% 46% round 16px)";
const CLIP_FULL = "inset(0% 0% 0% 0% round 0px)";

export default function Hero() {
  const { running } = useIntro();
  const reduce = useReducedMotion();

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
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reduce) {
      video.pause();
      video.currentTime = 0;
    } else {
      video.play().catch(() => {
        /* autoplay bloqueado por el navegador: queda en el primer frame */
      });
    }
  }, [reduce]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const fogOpacity = useTransform(scrollYProgress, [0, 0.45], [0.4, 1]);
  // Niebla visible desde el inicio (0.4) que se refuerza al hacer scroll (1).
  const fogY = useTransform(scrollYProgress, [0, 0.45], ["0%", reduce ? "0%" : "-6%"]);

  return (
    <section
      ref={heroRef}
      className="relative min-h-[100svh] w-full overflow-hidden bg-[#08090b] md:aspect-[1512/1323]"
    >
      <motion.div
        data-intro-clip
        className="absolute inset-0"
        initial={{ clipPath: CLIP_RECT, opacity: 0 }}
        animate={{ clipPath: running ? CLIP_FULL : CLIP_RECT, opacity: running ? 1 : 0 }}
        transition={{ duration: 1.2, ease: EASE_INOUT, delay: 0.6 }}
      >
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src="/videos/Loop%20Astronauta.mp4"
            autoPlay
            muted
            loop
            playsInline
            aria-hidden="true"
            className="absolute inset-0 h-full w-full max-w-none object-cover object-[58%_45%] md:inset-auto md:left-[-10.5%] md:top-[-3.3%] md:h-auto md:w-[111%] md:[mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)] md:[-webkit-mask-image:linear-gradient(to_bottom,black_0%,black_80%,transparent_100%)]"
          />
          <motion.div
            className="absolute left-[53%] top-[33%] h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(200,255,252,0.5),rgba(110,240,230,0.12),transparent)] blur-[40px] mix-blend-screen"
            {...glowPulse}
          />
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
        </div>

      <div className="relative z-30 px-6 md:px-[5.5%]">
        <div
          data-intro
          className="flex items-center gap-3 pt-[28vh] md:pt-[clamp(220px,25svh,300px)]"
        >
          <span className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full border border-white/80">
            <span className="h-[3px] w-[3px] rounded-full bg-white" />
          </span>
          <span className="text-[12px] font-medium uppercase leading-none tracking-[0.2em] text-white md:text-[13px]">
            Todo tu proyecto a medida
          </span>
        </div>

        <h1 className="mt-[18px] max-w-[720px] text-[40px] font-light leading-[0.98] tracking-[-0.015em] text-white md:text-[clamp(56px,4.6vw,70px)] md:leading-[1.11]">
          {["La presencia", "no se encuentra,"].map((line) => (
            <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
              <span className="block">{line}</span>
            </span>
          ))}
          <span className="mt-[6px] block overflow-hidden pb-[0.1em] -mb-[0.1em]">
            <span className="block font-daisy text-[42px] italic leading-[1.02] md:text-[clamp(68px,5.6vw,85px)]">
              Se diseña.
            </span>
          </span>
        </h1>
      </div>

      <div className="absolute inset-x-0 bottom-10 z-30 flex flex-col gap-6 px-6 md:contents">
        <div
          data-intro
          className="flex flex-col gap-5 md:absolute md:left-12 md:top-[48%] md:flex-row md:items-center md:gap-7"
        >
          <div className="max-w-[340px] md:max-w-[360px]">
            <div className="mb-[16px] h-px w-full bg-white/50" />
            <p className="text-[14px] font-light leading-[1.55] tracking-[0.01em] text-white md:text-[14px] md:leading-[1.6]">
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
        </div>

        <div className="md:absolute md:left-[60%] md:top-[51%] md:-translate-x-1/2 md:-translate-y-1/2">
          <button
            type="button"
            onClick={scrollToNext}
            className="flex items-center gap-3"
          >
            <span className="text-[13px] font-light text-white">Desliza y conoce</span>
            <span className="relative block h-px w-[46px] overflow-hidden bg-white/40">
              <motion.span
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                {...shine}
              />
            </span>
          </button>
        </div>

          <div
            data-intro
            className="md:absolute md:right-12 md:top-[47%] md:w-[316px]"
          >
          <div className="flex items-center gap-3 rounded-[6px] bg-white p-2.5">
            <div
              className="h-[66px] w-[66px] shrink-0 rounded-[6px] bg-[url('/images/hero-astronauta.webp')] bg-[length:200%] bg-[position:80%_48%]"
              aria-hidden="true"
            />
            <div>
              <p className="text-[14px] font-bold leading-none text-black">Identidad</p>
              <p className="mt-1.5 text-[12px] leading-[13px] text-[#666666]">
                Narrativa, naming, sistemas visuales y estrategia de marca.
              </p>
            </div>
            </div>
          </div>
        </div>
        <Header />
      </motion.div>
    </section>
  );
}

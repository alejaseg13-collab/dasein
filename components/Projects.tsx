"use client";

import Image from "next/image";
import { AnimatePresence, motion, MotionConfig, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { projects, type Project } from "@/data/projects";

const EASE_OUT = "easeOut" as const;
const EASE_INOUT = [0.65, 0, 0.35, 1] as const;
const SLIDE = 0.9;

const enter = (delay: number, y: number) => ({
  initial: { opacity: 0, y },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.3 },
  transition: { duration: 0.8, ease: EASE_OUT, delay },
});

function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="w-[var(--card)]">
      <div className="group relative aspect-[1.64/1] w-full overflow-hidden">
        <Image
          src={project.imagen}
          alt={project.alt}
          fill
          sizes="(min-width: 768px) 60vw, 86vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
        />
      </div>
      <div className="mt-3 flex w-full items-baseline justify-between text-[13px] text-white md:mt-4 md:text-[16px]">
        <span className="font-normal">{project.anio}</span>
        <span className="font-semibold uppercase">{project.nombre}</span>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <svg
      viewBox="0 0 28 20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="h-[16px] w-[22px] md:h-[24px] md:w-[32px]"
      aria-hidden
    >
      <path d="M1 10h25" strokeLinecap="round" />
      <path d="m17 2 9 8-9 8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Projects() {
  const reduce = useReducedMotion();
  const n = projects.length;
  const [track, setTrack] = useState({ pos: n, instant: false });
  const pos = track.pos;
  const [pitch, setPitch] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(zoneRef, { once: true, amount: 0.2 });
  const lastAdv = useRef(0);

  useLayoutEffect(() => {
    const el = itemRef.current;
    if (!el) return;
    const measure = () => setPitch(el.getBoundingClientRect().width);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const advance = useCallback(
    (dir: 1 | -1) => {
      const now = performance.now();
      if (now - lastAdv.current < 450) return;
      lastAdv.current = now;
      setTrack((t) => {
        const nextPos = t.pos + dir;
        return nextPos >= 0 && nextPos <= 3 * n - 1 ? { ...t, pos: nextPos, instant: false } : t;
      });
    },
    [n],
  );

  const onTrackComplete = useCallback(() => {
    setTrack((t) => {
      if (t.pos >= 2 * n) return { pos: t.pos - n, instant: true };
      if (t.pos < n) return { pos: t.pos + n, instant: true };
      return t;
    });
  }, [n]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      advance(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      advance(-1);
    }
  };

  const items = Array.from({ length: n * 3 }, (_, i) => projects[i % n]);

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative z-10 overflow-hidden pb-[110px] pt-[80px] md:pb-[150px] md:pt-[100px]">
        <div className="px-[3.7%] md:grid md:grid-cols-[45%_1fr]">
          <h2 className="text-[13px] uppercase leading-[1.7] text-white md:text-[15px]">
            <motion.span {...enter(0, 24)} className="block font-semibold">
              Echa un vistazo a algunos
            </motion.span>
            <motion.span {...enter(0.1, 24)} className="block font-normal">
              De nuestros trabajos
            </motion.span>
          </h2>

          <motion.p
            {...enter(0.2, 24)}
            className="mt-6 text-[17px] font-light leading-[1.45] text-white/90 md:mt-0 md:text-[26px]"
          >
            Explora una selección de nuestros proyectos más recientes, creatividad, estrategia y
            experiencia de usuario.
          </motion.p>
        </div>

        <div
          ref={zoneRef}
          className="relative mt-[48px] h-[calc(var(--card)/1.64+2.75rem)] w-full overflow-hidden [--card:86vw] [--gap:4vw] [--marg:5vw] md:mt-[72px] md:[--card:60vw] md:[--gap:3.5vw] md:[--marg:3.7vw]"
          role="group"
          aria-label="Carrusel de proyectos"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          {reduce ? (
            <div className="relative pl-[var(--marg)]">
              <div className="relative z-10 w-[var(--card)]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={pos}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.35, ease: EASE_OUT }}
                  >
                    <ProjectCard project={projects[((pos % n) + n) % n]} />
                  </motion.div>
                </AnimatePresence>
              </div>
              <div
                className="absolute top-0 origin-top-left scale-[0.72]"
                style={{ left: "calc(var(--marg) + var(--card) + var(--gap))" }}
              >
                <ProjectCard project={projects[(((pos + 1) % n) + n) % n]} />
              </div>
            </div>
          ) : (
            <motion.div
              className="absolute left-0 top-0 flex cursor-grab select-none pl-[var(--marg)] active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.08}
              onDragEnd={(_, info) => {
                if (info.offset.x < -80 || info.velocity.x < -500) advance(1);
                else if (info.offset.x > 80 || info.velocity.x > 500) advance(-1);
              }}
              animate={{
                x: -pos * pitch,
                opacity: inView ? 1 : 0,
                clipPath: inView ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)",
                transition: {
                  x: track.instant ? { duration: 0 } : { duration: SLIDE, ease: EASE_INOUT },
                  opacity: { duration: 1, ease: EASE_OUT },
                  clipPath: { duration: 1, ease: EASE_OUT },
                },
              }}
              onAnimationComplete={onTrackComplete}
            >
              {items.map((project, i) => (
                <div
                  key={i}
                  ref={i === 0 ? itemRef : undefined}
                  className="w-[calc(var(--card)+var(--gap))] flex-none"
                >
                  <motion.div
                    className="w-full origin-top-left"
                    style={{ zIndex: i === pos ? 20 : 10 }}
                    animate={{
                      scale: i === pos ? 1 : 0.72,
                      transition: track.instant
                        ? { duration: 0 }
                        : { duration: SLIDE, ease: EASE_INOUT },
                    }}
                  >
                    <ProjectCard project={project} />
                  </motion.div>
                </div>
              ))}
            </motion.div>
          )}

          <div
            className="absolute z-30 -translate-x-1/2 -translate-y-1/2"
            style={{
              left: "calc(var(--marg) + var(--card) + var(--gap) / 2)",
              top: "calc(var(--card) / 1.64 / 2)",
            }}
          >
            <motion.button
              type="button"
              aria-label="Siguiente proyecto"
              onClick={() => advance(1)}
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="group flex h-[56px] w-[56px] items-center justify-center rounded-full bg-white text-black md:h-[140px] md:w-[140px]"
            >
              <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">
                <Arrow />
              </span>
            </motion.button>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

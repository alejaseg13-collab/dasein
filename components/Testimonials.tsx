"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { testimonials, type Testimonial } from "@/data/testimonials";

const EASE_OUT = "easeOut" as const;
const EASE_INOUT = [0.65, 0, 0.35, 1] as const;
const SLIDE = 0.7;

function QuoteIcon() {
  return (
    <svg viewBox="0 0 72 60" className="h-[60px] w-auto" fill="white" aria-hidden="true">
      <path d="M0 60V34C0 14 8 4 26 0l4 10c-10 3-14 9-14 18h14v32H0z" />
      <path d="M40 60V34c0-20 8-30 26-34l4 10c-10 3-14 9-14 18h14v32H40z" />
    </svg>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="#fcae04" aria-hidden="true">
      <path d="M12 2.5l2.95 5.98 6.6.96-4.78 4.65 1.13 6.57L12 17.56l-5.9 3.1 1.13-6.57L2.45 9.44l6.6-.96L12 2.5z" />
    </svg>
  );
}

function Arrow({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg viewBox="0 0 18 12" className="h-3 w-[18px]" fill="none" aria-hidden="true">
      {dir === "prev" ? (
        <path d="M18 6H2M7 1L2 6l5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M0 6h16M11 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function Card({
  t,
  delay,
  reduce,
  active,
  instant,
}: {
  t: Testimonial;
  delay: number;
  reduce: boolean | null;
  active: boolean;
  instant: boolean;
}) {
  const iniciales = t.nombre
    .split(" ")
    .map((p) => p[0])
    .join("");

  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.02 }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      whileHover={reduce ? undefined : { y: -4, transition: { duration: 0.25, ease: EASE_OUT } }}
      className="group relative w-[var(--card)]"
    >
      <motion.div
        className="origin-top-left"
        animate={{
          scale: reduce || active ? 1 : 0.95,
          opacity: reduce || active ? 1 : 0.6,
          transition:
            reduce || instant ? { duration: 0 } : { duration: SLIDE, ease: EASE_INOUT },
        }}
      >
        <div className="relative h-[300px] md:h-[248px]">
          {/* burbuja en color plano uniforme: sin degradados que corten */}
          <div className="absolute inset-0 rounded-[28px] rounded-bl-none border border-b-0 border-white/30 bg-[rgba(48,11,9,0.62)] backdrop-blur-[10px] transition-colors duration-300 group-hover:border-white/55" />
          {/* cola: mismo color y desenfoque que la burbuja → de corrido */}
          <div aria-hidden="true" className="absolute left-0 top-full h-[43px] w-[43px]">
            <div className="absolute inset-0 bg-[rgba(48,11,9,0.62)] backdrop-blur-[10px] [clip-path:polygon(0_0,0_100%,100%_0)]" />
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 43 43">
              <path
                d="M0.5 0 L0.5 43 L43 0"
                fill="none"
                strokeWidth="1"
                className="stroke-white/30 transition-colors duration-300 group-hover:stroke-white/55"
              />
            </svg>
          </div>
          <div className="relative z-10 flex h-full flex-col px-7 py-[28px] md:px-[40px]">
            <p className="text-[16px] leading-[30px] text-white">&quot;{t.texto}&quot;</p>
            <div className="mt-3 flex gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} />
              ))}
            </div>
          </div>
        </div>

        <div className="ml-[43px] mt-[20px] flex items-center gap-3">
          {/* TODO: cuando lleguen las fotos (t.foto en /images/testimonios),
              reemplazar este círculo de iniciales por la imagen circular. */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/80 bg-white/10 text-[15px] font-medium text-white">
            {iniciales}
          </div>
          <div>
            <p className="text-[18px] font-medium leading-tight text-white">{t.nombre}</p>
            <p className="mt-1 text-[13px] uppercase leading-tight text-white/80">{t.empresa}</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Testimonials() {
  const reduce = useReducedMotion();
  const n = testimonials.length;
  const [track, setTrack] = useState({ pos: n, instant: true });
  const pos = track.pos;
  const [pitch, setPitch] = useState(0);
  const itemRef = useRef<HTMLDivElement>(null);
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
        return nextPos >= 0 && nextPos <= 3 * n - 1 ? { pos: nextPos, instant: false } : t;
      });
    },
    [n],
  );

  // Al terminar el desplazamiento, vuelve a la copia del medio sin salto
  // (x y escalas/opacidades con duración 0 durante el rebase).
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

  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { amount: 0.3 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  const items = Array.from({ length: n * 3 }, (_, i) => testimonials[i % n]);
  const actual = ((pos % n) + n) % n;

  return (
    <section className="relative z-10 px-6 py-[56px] md:px-[5.5%] md:py-[80px]">
      <div className="md:grid md:grid-cols-[30%_70%]">
        <div>
          <motion.div
            initial={reduce ? false : { opacity: 0, scale: 0.85 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ amount: 0.5 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
            className="origin-left"
          >
            <QuoteIcon />
          </motion.div>

          <h2 className="mt-10 text-[46px] font-light leading-[1.05] text-white md:mt-14 md:text-[72px]">
            <motion.span {...enter(0.1)} className="block">
              Esto dicen
            </motion.span>
            <motion.span {...enter(0.2)} className="block font-daisy italic">
              de nosotros
            </motion.span>
          </h2>

          <div className="mt-10 flex items-center gap-5 md:mt-12">
            <button
              type="button"
              aria-label="Anterior"
              onClick={() => advance(-1)}
              className="text-white transition-opacity hover:opacity-70"
            >
              <Arrow dir="prev" />
            </button>
            <div className="relative h-px w-[105px] bg-white/25">
              <motion.div
                className="absolute left-0 top-0 h-px bg-white"
                initial={false}
                animate={{ width: `${((actual + 1) / n) * 100}%` }}
                transition={{ duration: 0.5, ease: EASE_OUT }}
              />
            </div>
            <button
              type="button"
              aria-label="Siguiente"
              onClick={() => advance(1)}
              className="text-white transition-opacity hover:opacity-70"
            >
              <Arrow dir="next" />
            </button>
          </div>
        </div>

        <div
          className="relative mr-[-24px] mt-12 h-[400px] overflow-hidden [--card:85vw] [--gap:16px] md:mr-[-4.3vw] md:mt-0 md:h-[348px] md:[--card:380px] md:[--gap:65px]"
          role="group"
          aria-label="Carrusel de testimonios"
          tabIndex={0}
          onKeyDown={onKeyDown}
        >
          <motion.div
            className="absolute left-0 top-2 flex cursor-grab select-none active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.08}
            onDragEnd={(_, info) => {
              if (info.offset.x < -80 || info.velocity.x < -500) advance(1);
              else if (info.offset.x > 80 || info.velocity.x > 500) advance(-1);
            }}
            animate={{ x: -pos * pitch }}
            transition={reduce || track.instant ? { duration: 0 } : { duration: SLIDE, ease: EASE_INOUT }}
            onAnimationComplete={onTrackComplete}
          >
            {items.map((t, i) => (
              <div
                key={i}
                ref={i === 0 ? itemRef : undefined}
                className="w-[calc(var(--card)+var(--gap))] flex-none"
              >
                <Card t={t} delay={(i % n) * 0.1} reduce={reduce} active={i === pos} instant={track.instant} />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

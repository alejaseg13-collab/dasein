"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import ContactForm from "@/components/ContactForm";

// TODO: cuando llegue la imagen final del mosaico naranja, usar MOSAICO_SRC
// con next/image + object-cover en lugar del fondo provisional CSS.
export const MOSAICO_SRC = "/images/contacto-mosaico.webp";

const PASOS = ["Envías tu solicitud", "Evaluamos tu problemática", "Solucionamos tu necesidad"];
const EASE_OUT = "easeOut" as const;

type Celda = { a: number; target: number; next: number };
type Particula = {
  x: number;
  y: number;
  size: number;
  rgb: string;
  born: number;
  dur: number;
  dist: number;
};

/** Titileo de píxeles + partículas sobre la flor. ~20 fps, solo en pantalla. */
function PanelCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !parent || !ctx) return;

    const CELL = 26;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const rand = (min: number, max: number) => min + Math.random() * (max - min);
    let w = 0;
    let h = 0;
    let cols = 0;
    let celdas: Celda[] = [];
    let particulas: Particula[] = [];
    let raf = 0;
    let last = 0;

    const spawn = (edadRandom = false): Particula => ({
      x: rand(0.12 * w, 0.88 * w),
      y: rand(0.18 * h, 0.62 * h),
      size: CELL * (Math.random() < 0.5 ? 1 : 2),
      rgb: Math.random() < 0.5 ? "255,227,163" : "255,122,47",
      born: performance.now() - (edadRandom ? rand(0, 2500) : 0),
      dur: rand(1500, 3000),
      dist: rand(20, 40),
    });

    const build = () => {
      const rect = parent.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);
      celdas = Array.from({ length: cols * rows }, () => ({
        a: 0,
        target: 0,
        next: performance.now() + rand(600, 2000),
      }));
      particulas = Array.from({ length: w < 640 ? 5 : 10 }, () => spawn(true));
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (now - last < 50) return; // ~20 fps
      const dt = Math.min((now - last) / 1000, 0.2);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (let i = 0; i < celdas.length; i++) {
        const c = celdas[i];
        if (now >= c.next) {
          c.target = Math.random() < 0.45 ? rand(0.04, 0.15) : 0;
          c.next = now + rand(600, 2000);
        }
        if (Math.abs(c.target - c.a) > 0.001) c.a += (c.target - c.a) * Math.min(dt * 2.2, 1);
        if (c.a > 0.004) {
          ctx.fillStyle = `rgba(255,227,163,${c.a.toFixed(3)})`;
          ctx.fillRect((i % cols) * CELL + 1, Math.floor(i / cols) * CELL + 1, CELL - 2, CELL - 2);
        }
      }

      for (let i = 0; i < particulas.length; i++) {
        const p = particulas[i];
        const t = (now - p.born) / p.dur;
        if (t >= 1) {
          particulas[i] = spawn();
          continue;
        }
        const alpha = Math.sin(Math.PI * t) * 0.5;
        ctx.fillStyle = `rgba(${p.rgb},${alpha.toFixed(3)})`;
        ctx.fillRect(p.x + p.dist * t * 0.7, p.y - p.dist * t * 0.7, p.size, p.size);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        last = 0;
        raf = requestAnimationFrame(frame);
      }
    });
    io.observe(parent);
    const ro = new ResizeObserver(build);
    ro.observe(parent);
    build();

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, []);

  if (reduce) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[3] h-full w-full mix-blend-screen"
    />
  );
}

export default function Contact() {
  const reduce = useReducedMotion();
  const [activo, setActivo] = useState(0);
  const [pausado, setPausado] = useState(false);

  useEffect(() => {
    if (reduce || pausado) return;
    const id = window.setInterval(() => setActivo((a) => (a + 1) % PASOS.length), 3000);
    return () => window.clearInterval(id);
  }, [reduce, pausado]);

  return (
    <section id="contacto" className="relative z-10 px-4 py-[56px] md:px-[2.8%] md:py-[80px]">
      <motion.div
        initial={reduce ? false : { opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ duration: 0.9, ease: EASE_OUT }}
        className="rounded-[32px] border border-white/80 bg-[linear-gradient(140deg,rgba(89,21,20,0.78)_0%,rgba(62,13,9,0.62)_100%)] p-3 md:rounded-[60px] md:p-5"
      >
        <div className="md:grid md:grid-cols-[55%_45%]">
          <motion.div
            initial={reduce ? false : { scale: 1.06 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.4, ease: EASE_OUT }}
            className="relative min-h-[620px] overflow-hidden rounded-[24px] bg-black md:min-h-0 md:rounded-[28px]"
          >
            <div
              aria-hidden="true"
              className="absolute inset-0 z-0"
              style={{
                backgroundImage:
                  "radial-gradient(120% 90% at 35% 30%, rgba(255,122,47,0.30) 0%, rgba(89,21,20,0.35) 45%, rgba(0,0,0,0.95) 100%), repeating-linear-gradient(90deg, rgba(255,255,255,0.045) 0px, rgba(255,255,255,0.045) 1px, transparent 1px, transparent 7px)",
                backgroundColor: "#000",
              }}
            />
            {reduce ? (
              <Image
                src="/images/flor_formulario.png"
                alt=""
                fill
                unoptimized
                sizes="(min-width: 768px) 45vw, 100vw"
                className="z-[1] object-cover"
              />
            ) : (
              <video
                className="absolute inset-0 z-[1] h-full w-full object-cover"
                src="/videos/form-video.mp4"
                poster="/images/flor_formulario.png"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                aria-hidden="true"
                tabIndex={-1}
              />
            )}

            {!reduce && (
              <>
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[20%] left-[8%] z-[2] h-[140%] w-[38%] -rotate-[24deg] bg-[linear-gradient(90deg,transparent,rgba(255,227,163,0.07),transparent)]"
                  animate={{ x: ["0%", "3%"] }}
                  transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
                <motion.div
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-[20%] left-[55%] z-[2] h-[140%] w-[30%] -rotate-[24deg] bg-[linear-gradient(90deg,transparent,rgba(255,227,163,0.05),transparent)]"
                  animate={{ x: ["3%", "0%"] }}
                  transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
                />
              </>
            )}

            <PanelCanvas />

            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[62%] bg-gradient-to-t from-black/90 via-black/45 to-transparent"
            />

            <div className="relative z-10 flex h-full flex-col p-6 md:p-11">
              <Image
                src="/logo/Logo%20Dasein%20horizontal.svg"
                alt="Dasein Studio"
                width={130}
                height={32}
                unoptimized
                className="h-auto w-[120px] md:w-[130px]"
              />

              <div className="mt-auto pt-24">
                <h2 className="text-[42px] font-light leading-[1.08] text-white md:text-[64px]">
                  <span className="block">Empecemos</span>
                  <span className="block font-daisy italic">a construir</span>
                </h2>
                <p className="mt-4 text-[14px] font-light text-white md:text-[17px]">
                  3 pasos sencillos al contactar con nosotros.
                </p>
              </div>

              <div
                className="mt-8 flex flex-col gap-2 md:mt-10 md:flex-row md:gap-5"
                onMouseEnter={() => setPausado(true)}
                onMouseLeave={() => setPausado(false)}
              >
                {PASOS.map((paso, i) => {
                  const activa = i === activo;
                  return (
                    <button
                      key={paso}
                      type="button"
                      onMouseEnter={() => setActivo(i)}
                      onClick={() => setActivo(i)}
                      className={`flex flex-row items-center gap-3 rounded-[20px] p-3 text-left transition-colors duration-[600ms] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 md:h-[176px] md:flex-1 md:flex-col md:justify-between md:p-5 ${
                        activa ? "border border-white bg-white" : "border border-white/30 bg-black/35"
                      }`}
                    >
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border text-[12px] font-medium transition-colors duration-[600ms] md:h-[34px] md:w-[34px] md:text-[14px] ${
                          activa ? "border-black bg-black text-white" : "border-white/70 text-white"
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span
                        className={`text-[13px] font-semibold leading-[1.35] transition-colors duration-[600ms] md:text-[15px] ${
                          activa ? "text-neutral-900" : "text-white"
                        }`}
                      >
                        {paso}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>

          <div className="px-5 py-8 md:px-[11%] md:py-[44px]">
            <ContactForm />
          </div>
        </div>
      </motion.div>
    </section>
  );
}

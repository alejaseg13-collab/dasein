"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { serviceCards, serviceList } from "@/data/services";
import Reveal from "@/components/Reveal";

const GAP_MOBILE = 16;
const GAP_DESKTOP = 24;
const STEP_DURATION = 700;
const VISIBLE_DESKTOP = 3;

export default function Services() {
  const reduce = useReducedMotion();
  const count = serviceCards.length;
  const viewportRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef(0);
  const rafRef = useRef(0);
  const animatingRef = useRef(false);
  const [cardW, setCardW] = useState(0);

  const measure = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    const vw = el.clientWidth;
    if (!vw) return;
    const isMobile = window.innerWidth < 768;
    const gap = isMobile ? GAP_MOBILE : GAP_DESKTOP;
    const visible = Math.min(Math.max(count, 1), VISIBLE_DESKTOP);
    const w = isMobile
      ? Math.round(vw * 0.82)
      : Math.round((vw - gap * (visible - 1)) / visible);
    const s = w + gap;
    stepRef.current = s;
    setCardW(w);
    el.scrollLeft = Math.round(el.scrollLeft / (stepRef.current || s)) * s;
    if (count > 1 && el.scrollLeft >= count * s) el.scrollLeft -= count * s;
  }, [count]);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(rafRef.current);
    };
  }, [measure]);

  const wrap = useCallback(
    (el: HTMLElement) => {
      const s = stepRef.current;
      const distance = count * s;
      if (!distance) return;
      while (el.scrollLeft >= distance) el.scrollLeft -= distance;
    },
    [count],
  );

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    const onScroll = () => {
      if (!animatingRef.current) wrap(el);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [wrap]);

  const scrollByCard = useCallback(
    (dir: 1 | -1) => {
      const el = viewportRef.current;
      const s = stepRef.current;
      if (!el || !s || count < 2) return;
      cancelAnimationFrame(rafRef.current);
      const distance = count * s;
      let start = el.scrollLeft;
      let target: number;

      if (dir === -1 && start < s * 0.5) {
        start += distance;
        el.scrollLeft = start;
        target = start - s;
      } else {
        target = start + dir * s;
      }

      const finish = () => {
        animatingRef.current = false;
        el.scrollLeft = Math.round(el.scrollLeft / s) * s;
        wrap(el);
      };

      if (reduce) {
        el.scrollLeft = target;
        finish();
        return;
      }

      animatingRef.current = true;
      const t0 = performance.now();
      const tick = (t: number) => {
        const p = Math.min((t - t0) / STEP_DURATION, 1);
        const eased =
          p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
        el.scrollLeft = start + (target - start) * eased;
        if (p < 1) {
          rafRef.current = requestAnimationFrame(tick);
        } else {
          finish();
        }
      };
      rafRef.current = requestAnimationFrame(tick);
    },
    [count, reduce, wrap],
  );

  const loopCards =
    count > 1
      ? [...serviceCards, ...serviceCards].map((card, i) => ({
          card,
          clone: i >= count,
          delay: (i % count) * 0.08,
        }))
      : serviceCards.map((card, i) => ({ card, clone: false, delay: i * 0.08 }));

  return (
    <MotionConfig reducedMotion="user">
      <section className="relative z-10 pb-[100px] pt-[56px] md:pb-[140px] md:pt-[72px]">
        <div className="h-px w-full bg-white/30" />

        <div className="mt-[64px] flex flex-col gap-12 px-6 md:mt-[88px] md:flex-row md:gap-12 md:px-12">
          <div className="md:w-1/4">
            <Reveal as="h2" delay={0} className="text-[36px] font-light leading-[1.04] text-white md:text-[64px]">
              Nuestros
              <br />
              <span className="font-daisy italic">servicios</span>
            </Reveal>

            <ul className="mt-10 md:mt-14">
              {serviceList.map((item, i) => (
                <Reveal
                  key={item}
                  as="li"
                  delay={0.08 * (i + 1)}
                  className="group border-b border-white/30 transition-colors duration-300 hover:border-white/60"
                >
                  <div className="flex items-center gap-3 py-[13px] md:py-[15px]">
                    <span className="h-[10px] w-[10px] shrink-0 rounded-full bg-[#930ee6] transition-shadow duration-300 group-hover:shadow-[0_0_12px_2px_rgba(147,14,230,0.75)]" />
                    <span className="flex-1 text-[15px] font-light leading-tight text-white md:text-[17px]">
                      {item}
                    </span>
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 14 14"
                      fill="none"
                      aria-hidden="true"
                      className="shrink-0 text-white/70 transition-transform duration-300 ease-out group-hover:translate-x-1"
                    >
                      <path
                        d="M5 3l4 4-4 4"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <div className="w-full [contain:inline-size] md:min-w-0 md:flex-1">
            <div
              ref={viewportRef}
              className="w-full overflow-x-auto overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <div className="flex w-max gap-4 pb-4 pt-1 md:gap-6">
                {loopCards.map(({ card, clone, delay }, i) => (
                  <Reveal
                    key={`${card.title}-${i}`}
                    as="div"
                    aria-hidden={clone}
                    delay={delay}
                    y={16}
                    className="group w-[82vw] shrink-0 md:w-[320px]"
                    style={cardW ? { width: cardW } : undefined}
                  >
                    <div className="transition-transform duration-500 ease-out group-hover:-translate-y-1">
                      <div className="overflow-hidden rounded-[20px]">
                        <div className="aspect-[3/4]">
                          <Image
                            src={card.image}
                            alt={card.alt}
                            width={750}
                            height={1000}
                            unoptimized
                            className="h-full w-full scale-[1.1] object-cover transition-transform duration-500 ease-out group-hover:scale-[1.14]"
                          />
                        </div>
                      </div>
                      <h3 className="mt-4 text-[17px] font-light leading-snug text-white md:mt-5 md:text-[19px]">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-[13px] font-light leading-snug text-white/50 md:text-[14px]">
                        {card.subtitle}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>

            <div className="mt-7 flex justify-end gap-4 md:mt-9 md:gap-5">
              <button
                type="button"
                aria-label="Anterior"
                onClick={() => scrollByCard(-1)}
                disabled={count < 2}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full border border-white/70 text-white transition-colors duration-300 hover:bg-white/10 disabled:opacity-40 md:h-[56px] md:w-[56px]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M11 4L6 9l5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Siguiente"
                onClick={() => scrollByCard(1)}
                disabled={count < 2}
                className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#930ee6] text-white transition-colors duration-300 hover:bg-[#a83af0] disabled:opacity-40 md:h-[56px] md:w-[56px]"
              >
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M7 4l5 5-5 5"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

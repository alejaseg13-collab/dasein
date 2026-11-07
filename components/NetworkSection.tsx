"use client";

import { useRef } from "react";
import { MotionConfig } from "framer-motion";
import Reveal from "@/components/Reveal";
import { useVideoEnVista } from "@/components/useVideoEnVista";

export default function NetworkSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  // Sin autoPlay: el hook lo arranca al entrar en pantalla y lo pausa al salir.
  useVideoEnVista(videoRef);
  return (
    <MotionConfig reducedMotion="user">
      <section className="relative z-10 pt-[64px] pb-[72px] md:pt-[96px] md:pb-[96px]">
        <div className="px-[5.5%] md:grid md:grid-cols-[46%_1fr]">
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
            className="mt-6 text-[15px] font-normal leading-[1.55] text-white/80 md:mt-0 md:text-[19px]"
          >
            Diseñamos para que tu negocio crezca, se diferencie y conecte. Conectamos cada punto
            de tu negocio para crear marcas fuertes, productos que funcionan y experiencias que
            generan resultados.
          </Reveal>
        </div>

        <div className="relative mx-[5.5%] mt-[56px] overflow-hidden md:mt-[80px]">
          <div className="aspect-video w-full">
            <video
              ref={videoRef}
              poster="/videos/poster-adn.jpg"
              muted
              loop
              playsInline
              preload="none"
              aria-hidden="true"
              className="h-full w-full object-cover"
            >
              <source src="/videos/loop-adn.webm" type="video/webm" />
              <source src="/videos/loop-adn.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      </section>
    </MotionConfig>
  );
}

"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import IntroProvider from "@/components/IntroProvider";
import Header from "@/components/Header";
import CtaEmpezar from "@/components/CtaEmpezar";
import Footer from "@/components/Footer";

const clashDisplay = localFont({
  src: "../public/fonts/clash-display/clashdisplay-variable.ttf",
  weight: "200 700",
  display: "swap",
});

const EASE_OUT = "easeOut" as const;

/**
 * Caso de estudio de Blackhost: las secciones exportadas (bh1…bh7, en WebP
 * pre-comprimido con ffmpeg y servidas estáticas), apiladas en ese orden y a
 * sangre entre sí, pero insetadas sobre el fondo plano (los márgenes
 * laterales dejan ver el fondo normal de la página). Sin animación en las
 * imágenes para que no se abra costura entre ellas. Las capturas de modo
 * oscuro y claro (bh5/bh7) ya traen su rótulo "Dark mode"/"Light mode".
 */
const SECCIONES: { src: string; width: number; height: number; alt: string }[] = [
  {
    src: "/images/bh1.webp",
    width: 1304,
    height: 939,
    alt: "Portada de BlackHost: Transformamos inversión en ventas reales con cubos3D e inicio de Lo que hacemos",
  },
  {
    src: "/images/bh2.webp",
    width: 1305,
    height: 890,
    alt: "Brand Logo de BlackHost: logotipo con las anotaciones Ala de halcón y Velocidad y energía, e iconos de la app",
  },
  {
    src: "/images/bh3.webp",
    width: 1305,
    height: 1613,
    alt: "Tipografía Clash Display y paletas de color de BlackHost: principios Innovación, Seguridad y Calma y colores de degradado",
  },
  {
    src: "/images/bh4.webp",
    width: 1304,
    height: 734,
    alt: "Sudadera naranja de BlackHost vista por detrás con el logotipo bordado",
  },
  {
    src: "/images/bh5.webp",
    width: 1304,
    height: 5166,
    alt: "Modo oscuro del sitio de BlackHost: página completa con servicios, proyectos, clientes y formulario",
  },
  {
    src: "/images/bh6.webp",
    width: 1305,
    height: 896,
    alt: "Mockup de portátil con la web de BlackHost junto a la franja naranja Blackhost",
  },
  {
    src: "/images/bh7.webp",
    width: 1304,
    height: 5166,
    alt: "Modo claro del sitio de BlackHost: página completa sobre fondo naranja",
  },
];

export default function ProyectoBlackhost() {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-[#0B0D13]">
      <div className="relative">
        <IntroProvider>
          <Header intro />
        </IntroProvider>

        <main className="px-6 pt-[140px] md:px-[5.5%] md:pt-[150px]">
          {/* Blackhost Web + año */}
          <Reveal y={20} amount={0.6}>
            <div className="flex items-end justify-between gap-6">
              <h1 className="text-[36px] font-light leading-none text-white md:text-[clamp(44px,4vw,58px)]">
                Blackhost <span className="font-daisy italic">Web</span>
              </h1>
              <span
                className={`${clashDisplay.className} text-[46px] font-semibold leading-none text-white md:text-[clamp(56px,5vw,72px)]`}
              >
                2026
              </span>
            </div>
          </Reveal>

          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ amount: 0.6 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="mt-5 h-px w-full origin-left bg-white/40 md:mt-6"
          />

          {/* etiqueta + párrafo de introducción */}
          <Reveal y={16} amount={0.6} delay={0.1}>
            <div className="mt-5 grid gap-3 md:mt-6 md:grid-cols-2 md:gap-8">
              <p className="text-[15px] font-semibold text-white md:text-[17px]">Web Design</p>
              <p className="text-[15px] font-light leading-[1.6] text-white/85 md:text-[17px]">
                Blackhost es una empresa dedicada al Growth &amp; Sales performance, CRM, ERP,
                Sistemas de gestión y consultoría estratégica a empresas, diseñando automatizaciones
                para ventas.
              </p>
            </div>
          </Reveal>

          {/* secciones del caso, apiladas y a sangre dentro del margen */}
          <div className="mt-10 md:mt-16">
            {SECCIONES.map((seccion) => (
              <Image
                key={seccion.src}
                src={seccion.src}
                alt={seccion.alt}
                width={seccion.width}
                height={seccion.height}
                sizes="100vw"
                priority={seccion.src.endsWith("bh1.webp")}
                unoptimized
                className="block h-auto w-full"
              />
            ))}
          </div>
        </main>

        <CtaEmpezar />

        <Footer />
      </div>
    </div>
  );
}

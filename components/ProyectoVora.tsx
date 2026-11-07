"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import IntroProvider from "@/components/IntroProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const clashDisplay = localFont({
  src: "../public/fonts/clash-display/clashdisplay-variable.ttf",
  weight: "200 700",
  display: "swap",
});

const EASE_OUT = "easeOut" as const;

/**
 * Caso de estudio de VORA: las secciones que exportó el diseñador
 * (vora1…vora9, en WebP pre-comprimido con ffmpeg y servidas estáticas),
 * apiladas en ese orden y a sangre entre sí, pero insetadas sobre el fondo
 * verde (los márgenes laterales dejan ver el fondo normal de la página).
 * El cierre ("Gracias por profundizar en Vora") ya viene en vora9.
 */
const SECCIONES: { src: string; width: number; height: number; alt: string }[] = [
  {
    src: "/images/vora1.webp",
    width: 1306,
    height: 1973,
    alt: "Portada del caso VORA: mockup de la app sobre un planeta luminoso con el logotipo VORA de fondo",
  },
  {
    src: "/images/vora2.webp",
    width: 1307,
    height: 876,
    alt: "Vista de Calendario de la app VORA con pantallas de eventos y etiquetas de funcionalidades",
  },
  {
    src: "/images/vora3.webp",
    width: 1306,
    height: 1387,
    alt: "Resumen e información del proyecto VORA junto al logotipo sobre su retícula de construcción",
  },
  {
    src: "/images/vora4.webp",
    width: 1305,
    height: 891,
    alt: "Funcionalidades de VORA: módulos de eventos, estado de actividad, geolocalización y directorio de clubes",
  },
  {
    src: "/images/vora5.webp",
    width: 1305,
    height: 2056,
    alt: "Identidad de VORA: iconos de la aplicación, pantalla de inicio y tarjeta vora.com/app",
  },
  {
    src: "/images/vora6.webp",
    width: 1304,
    height: 2331,
    alt: "Vista de Mapa de VORA: filtros y resultados geolocalizados en pantallas móviles",
  },
  {
    src: "/images/vora7.webp",
    width: 1304,
    height: 1917,
    alt: "Aplicación de la marca VORA en bolsa y camiseta, y sección de mensajes con pantallas de chat",
  },
  {
    src: "/images/vora8.webp",
    width: 1305,
    height: 1632,
    alt: "Colores y tipografías del proyecto VORA: muestra NewBlack y paleta #204AF5, #0C1126 y #FFFFFF",
  },
  {
    src: "/images/vora9.webp",
    width: 1306,
    height: 636,
    alt: "Cierre del caso VORA: Gracias por profundizar en Vora con el contacto contact@daseinstudioco.com",
  },
];

export default function ProyectoVora() {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-[#08090b]">
      {/* Fondo verde detrás de todo (se ve en los márgenes de la página). */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <Image
          src="/images/fondos/fondo-1-verde.png"
          alt=""
          fill
          unoptimized
          sizes="100vw"
          className="object-fill"
        />
      </div>

      <div className="relative">
        <IntroProvider>
          <Header intro />
        </IntroProvider>

        <main className="px-6 pt-[140px] md:px-[5.5%] md:pt-[150px]">
          {/* Vora Brand + año */}
          <Reveal y={20} amount={0.6}>
            <div className="flex items-end justify-between gap-6">
              <h1 className="text-[36px] font-light leading-none text-white md:text-[clamp(44px,4vw,58px)]">
                Vora <span className="font-daisy italic">Brand</span>
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
              <p className="text-[15px] font-semibold text-white md:text-[17px]">
                Branding | Software
              </p>
              <p className="text-[15px] font-light leading-[1.6] text-white/85 md:text-[17px]">
                VORA es una plataforma digital de un ecosistema deportivo global que transforma la
                conexión entre atletas, el acceso a torneos y academias mediante una comunidad sin
                fronteras.
              </p>
            </div>
          </Reveal>

          {/* secciones del caso, apiladas y a sangre dentro del margen.
              Sin animación y sin transform: cada imagen va justo pegada a la
              anterior para que no se abra costura entre ellas. */}
          <div className="mt-10 md:mt-16">
            {SECCIONES.map((seccion) => (
              <Image
                key={seccion.src}
                src={seccion.src}
                alt={seccion.alt}
                width={seccion.width}
                height={seccion.height}
                sizes="100vw"
                priority={seccion.src.endsWith("vora1.webp")}
                unoptimized
                className="block h-auto w-full"
              />
            ))}
          </div>
        </main>

        {/* Banda verde de transición: el fondo de la página asoma entre la
            última imagen y el footer (misma lumina del verde del inicio). */}
        <div className="relative h-24 overflow-hidden" aria-hidden="true">
          <Image
            src="/images/fondos/fondo-1-verde.png"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-cover object-top [mask-image:linear-gradient(to_bottom,transparent_0,black_32px)] [-webkit-mask-image:linear-gradient(to_bottom,transparent_0,black_32px)]"
          />
        </div>

        <Footer />
      </div>
    </div>
  );
}

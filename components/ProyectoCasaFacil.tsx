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
 * Caso de estudio de Casa Fácil: el manual de identidad exportado en secciones
 * (cf1…cf9, en WebP pre-comprimido con ffmpeg y servidas estáticas), apiladas
 * en ese orden y a sangre entre sí, pero insetadas sobre el fondo plano (los
 * márgenes laterales dejan ver el fondo normal de la página). Como en VORA:
 * sin animación en las imágenes para que no se abra costura entre ellas.
 */
const SECCIONES: { src: string; width: number; height: number; alt: string }[] = [
  {
    src: "/images/cf1.webp",
    width: 1305,
    height: 1182,
    alt: "Portada del manual de identidad de Casa Fácil con el índice de contenido: Presentación, Construcción y uso y Aplicaciones",
  },
  {
    src: "/images/cf2.webp",
    width: 1305,
    height: 1061,
    alt: "Presentación del manual: introducción, logotipo e inicio del área de seguridad de Casa Fácil",
  },
  {
    src: "/images/cf3.webp",
    width: 1305,
    height: 1102,
    alt: "Área de seguridad del logotipo con el espacio 1X y tamaños mínimos digitales e impresos",
  },
  {
    src: "/images/cf4.webp",
    width: 1305,
    height: 1482,
    alt: "Tipografía Poppins y paleta de color de Casa Fácil: principal #FF4B39 y secundarios",
  },
  {
    src: "/images/cf5.webp",
    width: 1305,
    height: 1253,
    alt: "Variaciones del logotipo de Casa Fácil y ejemplos de usos correctos e incorrectos",
  },
  {
    src: "/images/cf6.webp",
    width: 1305,
    height: 1470,
    alt: "Texturas de Casa Fácil con opacidades del 1% al 4% y mockup del calendario de escritorio 2023",
  },
  {
    src: "/images/cf7.webp",
    width: 1305,
    height: 1460,
    alt: "Aplicaciones: tarjetas de presentación y nota de periódico con la campaña Comprar casa es cosa fácil",
  },
  {
    src: "/images/cf8.webp",
    width: 1305,
    height: 1621,
    alt: "Aplicaciones: llaveros de madera, publicaciones sociales y banner Con Casa Fácil es cosa fácil",
  },
  {
    src: "/images/cf9.webp",
    width: 1305,
    height: 2245,
    alt: "Aplicaciones finales: valla publicitaria y publicaciones sociales de Casa Fácil",
  },
];

export default function ProyectoCasaFacil() {
  const reduce = useReducedMotion();

  return (
    <div className="relative overflow-hidden bg-[#0B0D13]">
      <div className="relative">
        <IntroProvider>
          <Header intro />
        </IntroProvider>

        <main className="px-6 pt-[140px] md:px-[8%] md:pt-[150px]">
          {/* Casa Fácil Brand + año */}
          <Reveal y={20} amount={0.6}>
            <div className="flex items-end justify-between gap-6">
              <h1 className="text-[36px] font-light leading-none text-white md:text-[clamp(44px,4vw,58px)]">
                Casa Fácil <span className="font-daisy italic">Brand</span>
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
              <p className="text-[15px] font-semibold text-white md:text-[17px]">Branding</p>
              <p className="text-[15px] font-light leading-[1.6] text-white/85 md:text-[17px]">
                Casa Fácil es una compañía que facilita el proceso de compra de propiedad en
                Estados Unidos. Todos deberían tener la oportunidad de tener un hogar y con Casa
                Fácil ese sueño es una realidad.
              </p>
            </div>
          </Reveal>

          {/* secciones del manual, apiladas y a sangre dentro del margen */}
          <div className="mt-10 md:mt-16">
            {SECCIONES.map((seccion) => (
              <Image
                key={seccion.src}
                src={seccion.src}
                alt={seccion.alt}
                width={seccion.width}
                height={seccion.height}
                sizes="100vw"
                priority={seccion.src.endsWith("cf1.webp")}
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

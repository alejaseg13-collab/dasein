"use client";

import Image from "next/image";
import localFont from "next/font/local";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Reveal from "@/components/Reveal";
import IntroProvider from "@/components/IntroProvider";
import Header from "@/components/Header";
import CtaEmpezar from "@/components/CtaEmpezar";
import Footer from "@/components/Footer";
import { useVideoEnVista } from "@/components/useVideoEnVista";

const clashDisplay = localFont({
  src: "../public/fonts/clash-display/clashdisplay-variable.ttf",
  weight: "200 700",
  display: "swap",
});

const EASE_OUT = "easeOut" as const;

type Seccion =
  | { tipo: "imagen"; src: string; width: number; height: number; alt: string }
  | { tipo: "video"; src: string; poster: string; width: number; height: number };

/**
 * Caso de estudio de Scalla: secciones apiladas en orden y a sangre entre sí,
   * insetadas sobre el fondo plano. Las imágenes van en WebP pre-comprimido
 * (servidas estáticas, sin animación para que no se abra costura); sl1 y sl7
 * son vídeos VP9 en bucle que solo se descargan/reproducen con la sección en
 * pantalla (useVideoEnVista) y quedan en su poster con reduced-motion.
 */
const SECCIONES: Seccion[] = [
  {
    tipo: "video",
    src: "/images/sl1.webm",
    poster: "/images/sl1-poster.jpg",
    width: 1400,
    height: 787,
  },
  {
    tipo: "imagen",
    src: "/images/sl2.webp",
    width: 1305,
    height: 1221,
    alt: "Ficha del proyecto Scalla IA y sección Interfaz con el Dashboard de la aplicación",
  },
  {
    tipo: "imagen",
    src: "/images/sl3.webp",
    width: 1305,
    height: 1823,
    alt: "Pantalla Crear nuevo agente de Scalla con la configuración del asistente de IA",
  },
  {
    tipo: "imagen",
    src: "/images/sl4.webp",
    width: 1303,
    height: 1574,
    alt: "Secciones Inbox con los chats y Analytics con métricas y gráficas de Scalla",
  },
  {
    tipo: "imagen",
    src: "/images/sl5.webp",
    width: 1304,
    height: 1956,
    alt: "Sección Integraciones con canales de mensajería y sección Tokens con los planes de consumo",
  },
  {
    tipo: "imagen",
    src: "/images/sl6.webp",
    width: 1304,
    height: 1179,
    alt: "Tipografías Robox y Red Hat Display y paleta de colores de Scalla",
  },
  {
    tipo: "video",
    src: "/images/sl7.webm",
    poster: "/images/sl7-poster.jpg",
    width: 1280,
    height: 720,
  },
];

export default function ProyectoScalla() {
  const reduce = useReducedMotion();
  const refSl1 = useRef<HTMLVideoElement>(null);
  const refSl7 = useRef<HTMLVideoElement>(null);
  // Reproducción por bucle solo con la sección en pantalla (y pausa al salir).
  useVideoEnVista(refSl1);
  useVideoEnVista(refSl7);

  return (
    <div className="relative overflow-hidden bg-[#0B0D13]">
      <div className="relative">
        <IntroProvider>
          <Header intro />
        </IntroProvider>

        <main className="px-6 pt-[140px] md:px-[8%] md:pt-[150px]">
          {/* Scalla UI + año */}
          <Reveal y={20} amount={0.6}>
            <div className="flex items-end justify-between gap-6">
              <h1 className="text-[36px] font-light leading-none text-white md:text-[clamp(44px,4vw,58px)]">
                Scalla <span className="font-daisy italic">UI</span>
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
              <p className="text-[15px] font-semibold text-white md:text-[17px]">Software</p>
              <p className="text-[15px] font-light leading-[1.6] text-white/85 md:text-[17px]">
                Scalla es una plataforma diseñada para que las empresas automaticen y escalen sus
                interacciones con clientes sin perder la esencia humana. Se especializa en el
                despliegue de agentes inteligentes capaces de gestionar ventas, soporte técnico y
                consultas generales en tiempo real.
              </p>
            </div>
          </Reveal>

          {/* secciones del caso: imágenes WebP + dos vídeos en bucle */}
          <div className="mt-10 md:mt-16">
            {SECCIONES.map((seccion, i) =>
              seccion.tipo === "video" ? (
                <video
                  key={seccion.src}
                  ref={i === 0 ? refSl1 : refSl7}
                  width={seccion.width}
                  height={seccion.height}
                  poster={seccion.poster}
                  preload="none"
                  muted
                  loop
                  playsInline
                  aria-hidden="true"
                  className="block h-auto w-full"
                >
                  <source src={seccion.src} type="video/webm" />
                </video>
              ) : (
                <Image
                  key={seccion.src}
                  src={seccion.src}
                  alt={seccion.alt}
                  width={seccion.width}
                  height={seccion.height}
                  sizes="100vw"
                  unoptimized
                  className="block h-auto w-full"
                />
              ),
            )}
          </div>
        </main>

        <CtaEmpezar />

        <Footer />
      </div>
    </div>
  );
}

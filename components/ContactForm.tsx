"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { serviceList } from "@/data/services";
import { enviarSolicitud, type SolicitudDatos } from "@/lib/enviar-solicitud";

const EASE_OUT = "easeOut" as const;

const INPUT_CLASS =
  "w-full rounded-[10px] bg-[#3e0d09] px-4 text-[14px] text-white outline-none transition-shadow duration-300 placeholder:text-[#b3a29a] focus:ring-2 focus:ring-[#ee0f10]/40";

type Errores = Partial<Record<keyof SolicitudDatos, string>>;

const INICIAL: SolicitudDatos = {
  nombre: "",
  correo: "",
  servicio: "",
  proyecto: "",
  privacidad: false,
};

export default function ContactForm() {
  const reduce = useReducedMotion();
  const [valores, setValores] = useState<SolicitudDatos>(INICIAL);
  const [errores, setErrores] = useState<Errores>({});
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  const actualiza = <K extends keyof SolicitudDatos>(campo: K, valor: SolicitudDatos[K]) => {
    setValores((v) => ({ ...v, [campo]: valor }));
    setErrores((e) => ({ ...e, [campo]: undefined }));
  };

  const valida = (): Errores => {
    const e: Errores = {};
    if (!valores.nombre.trim()) e.nombre = "Ingresa tu nombre.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valores.correo.trim()))
      e.correo = "Ingresa un correo válido.";
    if (!valores.servicio) e.servicio = "Selecciona un servicio.";
    if (!valores.proyecto.trim()) e.proyecto = "Cuéntanos un poco de tu proyecto.";
    if (!valores.privacidad) e.privacidad = "Debes aceptar la política de privacidad.";
    return e;
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (enviando) return;
    const e = valida();
    if (Object.values(e).some(Boolean)) {
      setErrores(e);
      return;
    }
    setEnviando(true);
    await enviarSolicitud(valores);
    setEnviando(false);
    setEnviado(true);
  };

  const etiqueta = (htmlFor: string, texto: string) => (
    <label htmlFor={htmlFor} className="mb-2 block text-[15px] font-medium text-white">
      {texto} <span className="text-[#ee0f10]">*</span>
    </label>
  );

  const error = (campo: keyof SolicitudDatos) =>
    errores[campo] ? (
      <p id={`${campo}-error`} className="mt-1.5 text-[12px] text-[#ff8f8f]">
        {errores[campo]}
      </p>
    ) : null;

  return (
    <div>
      <motion.h3
        {...enter(0.05)}
        className="mb-8 text-center text-[30px] font-light leading-[1.15] text-white md:text-[36px]"
      >
        Cuéntanos <span className="font-daisy italic">tu proyecto</span>
      </motion.h3>

      {enviado ? (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="py-16 text-center text-[20px] font-light leading-[1.5] text-white"
        >
          ¡Gracias! Recibimos tu solicitud y te responderemos pronto.
        </motion.p>
      ) : (
        <form noValidate onSubmit={onSubmit} className="space-y-5">
          <motion.div {...enter(0.15)}>
            {etiqueta("contacto-nombre", "Tu nombre")}
            <input
              id="contacto-nombre"
              type="text"
              autoComplete="name"
              placeholder="Ingresa tu nombre completo"
              value={valores.nombre}
              onChange={(e) => actualiza("nombre", e.target.value)}
              aria-invalid={Boolean(errores.nombre)}
              aria-describedby={errores.nombre ? "nombre-error" : undefined}
              className={`${INPUT_CLASS} h-[46px]`}
            />
            {error("nombre")}
          </motion.div>

          <motion.div {...enter(0.23)}>
            {etiqueta("contacto-correo", "Tu correo electrónico")}
            <input
              id="contacto-correo"
              type="email"
              autoComplete="email"
              placeholder="Ejemplo: nombre@dominio.com"
              value={valores.correo}
              onChange={(e) => actualiza("correo", e.target.value)}
              aria-invalid={Boolean(errores.correo)}
              aria-describedby={errores.correo ? "correo-error" : undefined}
              className={`${INPUT_CLASS} h-[46px]`}
            />
            {error("correo")}
          </motion.div>

          <motion.div {...enter(0.31)}>
            {etiqueta("contacto-servicio", "¿Qué servicio necesitas?")}
            <div className="relative">
              <select
                id="contacto-servicio"
                value={valores.servicio}
                onChange={(e) => actualiza("servicio", e.target.value)}
                aria-invalid={Boolean(errores.servicio)}
                aria-describedby={errores.servicio ? "servicio-error" : undefined}
                className={`${INPUT_CLASS} h-[46px] appearance-none pr-12 ${
                  valores.servicio ? "text-white" : "text-[#b3a29a]"
                }`}
              >
                <option value="" disabled hidden>
                  Ejemplo: Branding
                </option>
                {serviceList.map((servicio) => (
                  <option key={servicio} value={servicio}>
                    {servicio}
                  </option>
                ))}
              </select>
              <svg
                viewBox="0 0 16 16"
                className="pointer-events-none absolute right-5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/80"
                fill="none"
                aria-hidden="true"
              >
                <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            {error("servicio")}
          </motion.div>

          <motion.div {...enter(0.39)}>
            {etiqueta("contacto-proyecto", "Háblanos un poco más de tu proyecto")}
            <textarea
              id="contacto-proyecto"
              placeholder="Escribe aquí…"
              value={valores.proyecto}
              onChange={(e) => actualiza("proyecto", e.target.value)}
              aria-invalid={Boolean(errores.proyecto)}
              aria-describedby={errores.proyecto ? "proyecto-error" : undefined}
              className={`${INPUT_CLASS} h-[120px] resize-none py-4`}
            />
            {error("proyecto")}
          </motion.div>

          <motion.div {...enter(0.47)} className="pt-2">
            <label
              htmlFor="contacto-privacidad"
              className="flex cursor-pointer items-center gap-3 text-[13px] text-white/90"
            >
              <input
                id="contacto-privacidad"
                type="checkbox"
                checked={valores.privacidad}
                onChange={(e) => actualiza("privacidad", e.target.checked)}
                aria-invalid={Boolean(errores.privacidad)}
                aria-describedby={errores.privacidad ? "privacidad-error" : undefined}
                className="peer sr-only"
              />
              <span
                aria-hidden="true"
                className={`flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[5px] border border-[#ee0f10] transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#ff8f8f] ${
                  valores.privacidad ? "bg-[#ee0f10]" : "bg-transparent"
                }`}
              >
                {valores.privacidad && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3 text-white" fill="none">
                    <path d="M2 6.5L4.8 9 10 3.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
              <span>Acepto la política de privacidad de Dasein Studio.</span>
            </label>
            {error("privacidad")}
          </motion.div>

          <motion.div {...enter(0.55)}>
            <motion.button
              type="submit"
              disabled={enviando}
              whileHover={reduce ? undefined : { y: -2 }}
              transition={{ duration: 0.2, ease: EASE_OUT }}
              className="h-[44px] w-full rounded-[12px] bg-[#ee0f10] text-[16px] font-semibold text-white transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70 disabled:opacity-60"
            >
              {enviando ? "Enviando…" : "Solicitar propuesta"}
            </motion.button>
            <p className="mt-4 text-[11px] leading-[1.5] text-white/60">
              *Dependiendo de la cantidad de solicitudes te responderemos lo antes posible. Tus
              datos son exclusivamente usados para contactarte.
            </p>
          </motion.div>
        </form>
      )}
    </div>
  );
}

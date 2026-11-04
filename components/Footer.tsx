"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { EMAIL, FACEBOOK_URL, INSTAGRAM_URL, LINKEDIN_URL, PHONE, WHATSAPP_URL } from "@/lib/contact";

const EASE_OUT = "easeOut" as const;

const LOGO_SRC = "/logo/logo-dasein-horizontal-studio.svg";

function WhatsAppIcon() {
  return (
    <Image
      src="/images/wtp.svg"
      alt=""
      width={24}
      height={24}
      unoptimized
      className="h-[18px] w-[18px]"
    />
  );
}

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-[18px] w-[18px]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px]" fill="currentColor" aria-hidden="true">
      <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.97h-1.51c-1.49 0-1.96.93-1.96 1.89v2.25h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <Image
      src="/images/Linkedin.svg"
      alt=""
      width={310}
      height={309}
      unoptimized
      className="h-[18px] w-[18px]"
    />
  );
}

const REDES = [
  { label: "WhatsApp", href: WHATSAPP_URL, Icon: WhatsAppIcon },
  { label: "Instagram", href: INSTAGRAM_URL, Icon: InstagramIcon },
  { label: "Facebook", href: FACEBOOK_URL, Icon: FacebookIcon },
  { label: "LinkedIn", href: LINKEDIN_URL, Icon: LinkedinIcon },
] as const;

export default function Footer() {
  const reduce = useReducedMotion();

  const enter = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, y: 24 } as const),
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  // iconos: fundido + leve escalado, escalonados
  const enterIcono = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0, scale: 0.9 } as const),
    whileInView: { opacity: 1, scale: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.5, ease: EASE_OUT, delay },
  });

  const aparece = (delay: number) => ({
    initial: reduce ? false : ({ opacity: 0 } as const),
    whileInView: { opacity: 1 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.6, ease: EASE_OUT, delay },
  });

  return (
    <footer className="relative z-10 min-h-[380px] bg-black px-[5.5%] pb-[48px] pt-[56px] lg:grid lg:grid-cols-[1fr_auto] lg:pt-[72px]">
      <div className="flex flex-col">
        <motion.div {...enter(0)}>
          <Image
            src={LOGO_SRC}
            alt="Dasein Studio"
            width={300}
            height={74}
            unoptimized
            className="h-auto w-[210px] md:w-[300px]"
          />
        </motion.div>

        <div className="mt-14 lg:mt-auto lg:pt-14">
          <motion.div
            initial={reduce ? false : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.3 }}
            className="h-px w-full origin-left bg-[#191919] lg:max-w-[970px]"
          />
          <motion.p
            {...enter(0.45)}
            className="mt-5 max-w-[500px] text-[15px] font-light leading-[1.55] text-[#8a8a8a]"
          >
            Estudio dedicado al diseño estratégico, estrategia de marca, experiencia de usuario y
            desarrollo de software.
          </motion.p>
        </div>
      </div>

      <div className="mt-14 flex flex-col lg:mt-0">
        {/* grupo de iconos con marco de cuatro esquinas */}
        <div className="group relative inline-flex w-fit gap-2">
          <div aria-hidden="true" className="pointer-events-none absolute -inset-2.5">
            <motion.span
              {...aparece(0.65)}
              className="absolute left-0 top-0 h-[10px] w-[10px] border-l border-t border-[#7e7e7e] transition-transform duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1"
            />
            <motion.span
              {...aparece(0.65)}
              className="absolute right-0 top-0 h-[10px] w-[10px] border-r border-t border-[#7e7e7e] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
            />
            <motion.span
              {...aparece(0.65)}
              className="absolute bottom-0 left-0 h-[10px] w-[10px] border-b border-l border-[#7e7e7e] transition-transform duration-300 group-hover:-translate-x-1 group-hover:translate-y-1"
            />
            <motion.span
              {...aparece(0.65)}
              className="absolute bottom-0 right-0 h-[10px] w-[10px] border-b border-r border-[#7e7e7e] transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
            />
          </div>

          {REDES.map(({ label, href, Icon }, i) => (
            <motion.a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              {...enterIcono(0.65 + i * 0.08)}
              className="flex h-[44px] w-[44px] items-center justify-center rounded-full border border-[#2e2e2e] bg-[#0a0a0a] text-white transition-all duration-300 hover:-translate-y-0.5 hover:border-[#ee0f10] hover:bg-[#ee0f10] focus-visible:-translate-y-0.5 focus-visible:border-[#ee0f10] focus-visible:bg-[#ee0f10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#ee0f10] focus-visible:ring-offset-2 focus-visible:ring-offset-black lg:h-[42px] lg:w-[42px]"
            >
              <Icon />
            </motion.a>
          ))}
        </div>

        <motion.div {...enter(1.05)} className="mt-12 lg:mt-[52px]">
          <p className="text-[15px] font-semibold text-white">Contacto</p>
          <a
            href={`mailto:${EMAIL}`}
            className="mt-3 block text-[15px] font-light text-[#8a8a8a] transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none"
          >
            {EMAIL}
          </a>
          <a
            href={`tel:${PHONE}`}
            className="mt-1 block text-[15px] font-light text-[#8a8a8a] transition-colors duration-300 hover:text-white focus-visible:text-white focus-visible:outline-none"
          >
            {PHONE}
          </a>
        </motion.div>

        <motion.div {...enter(1.15)} className="mt-10 flex flex-wrap gap-x-3 gap-y-4 lg:mt-[52px]">
          <p className="max-w-[170px] text-[15px] font-light leading-[1.5] text-white/75">
            ©2026 Dasein Studio.
            <br />
            All rights reserved.
          </p>
          <a
            href="/politica-de-privacidad"
            className="max-w-[88px] text-[15px] font-light leading-[1.5] text-white transition-colors duration-300 hover:text-white/70 focus-visible:text-white/70 focus-visible:outline-none"
          >
            Política de privacidad
          </a>
        </motion.div>
      </div>
    </footer>
  );
}

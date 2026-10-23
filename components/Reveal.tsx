"use client";

import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { useEffect, useRef, type CSSProperties, type ElementType, type ReactNode, type Ref } from "react";
import { useScrollDirection } from "@/components/useScrollDirection";

const TAGS = {
  div: motion.div,
  span: motion.span,
  p: motion.p,
  h2: motion.h2,
  li: motion.li,
} as const;

type Tag = keyof typeof TAGS;

type RevealProps = {
  as?: Tag;
  delay?: number;
  y?: number;
  amount?: number;
  duration?: number;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean | "true" | "false";
};

/**
 * Entrada de texto (fundido + desplazamiento vertical) orientada a la
 * dirección del scroll: al entrar con el scroll bajando sube desde +y; al
 * entrar mientras el scroll sube cae desde -y. Al salir de pantalla la
 * animación se revierte (se apaga y vuelve a su origen) y al re-entrar se
 * repite.
 */
export default function Reveal({
  as = "div",
  delay = 0,
  y = 24,
  amount = 0.3,
  duration = 0.8,
  children,
  className,
  style,
  ...rest
}: RevealProps) {
  const dir = useScrollDirection();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { amount });

  const yv = useMotionValue(dir === 1 ? y : -y);
  const op = useMotionValue(reduce ? 1 : 0);

  const dirRef = useRef(dir);
  useEffect(() => {
    const changed = dirRef.current !== dir;
    dirRef.current = dir;
    if (changed && !reduce && !inView) yv.set(dir === 1 ? y : -y);
  }, [dir, inView, reduce, y, yv]);

  useEffect(() => {
    if (reduce) {
      op.set(1);
      yv.set(0);
      return;
    }
    const ease = "easeOut" as const;
    const controls = inView
      ? [animate(op, 1, { duration, ease, delay }), animate(yv, 0, { duration, ease, delay })]
      : [animate(op, 0, { duration, ease }), animate(yv, dirRef.current === 1 ? y : -y, { duration, ease })];
    return () => controls.forEach((c) => c.stop());
  }, [inView, reduce, duration, delay, y, op, yv]);

  const Tag = TAGS[as] as ElementType;

  return (
    <Tag
      ref={ref as Ref<never>}
      style={{ y: yv, opacity: op, ...style }}
      className={className}
      {...rest}
    >
      {children}
    </Tag>
  );
}

"use client";

import dynamic from "next/dynamic";
import { Component, useRef, type ReactNode } from "react";
import { useInView } from "framer-motion";

const GlassScene = dynamic(() => import("@/components/GlassScene"), { ssr: false });

/** Si WebGL u otra cosa falla, la sección sigue viéndose bien sin el prisma. */
class Boundary extends Component<{ children: ReactNode }, { error: boolean }> {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? null : this.props.children;
  }
}

/**
 * Prisma de vidrio en 3D (Three.js). Carga la escena con ~600 px de
 * antelación a la entrada de la sección en pantalla.
 */
export default function Prism({ onReady }: { onReady?: () => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const cerca = useInView(ref, { once: true, margin: "0px 0px 600px 0px" });

  return (
    <div ref={ref} className="h-full w-full">
      {cerca && (
        <Boundary>
          <GlassScene onReady={onReady} />
        </Boundary>
      )}
    </div>
  );
}

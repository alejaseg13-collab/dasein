import Image from "next/image";
import type { CSSProperties } from "react";
import Hero from "@/components/Hero";
import IntroProvider from "@/components/IntroProvider";
import Clients from "@/components/Clients";
import Divider from "@/components/Divider";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import NetworkSection from "@/components/NetworkSection";
import Projects from "@/components/Projects";
import Stats from "@/components/Stats";
import Contact from "@/components/Contact";
import Testimonials from "@/components/Testimonials";
import ClosingCta from "@/components/ClosingCta";
import Footer from "@/components/Footer";

// Máscara: el borde superior de la imagen se funde con el fondo anterior
// (90 px de degradado) para que no se vea ninguna línea de costura. Los bordes
// inferiores de cada imagen quedan "enterrados" a 120 px dentro de la zona ya
// opaca del fondo siguiente.
const MASCARA_ARRIBA =
  "linear-gradient(to bottom, rgba(0,0,0,0) 0px, rgba(0,0,0,1) 90px)";

/**
 * Fondo de un grupo de secciones: degradado estirado (object-fill) detrás del
 * contenido.
 * - `style`: posiciona/dimensiona la imagen (subir contenido, extender 1 px o
 *   40 px hacia abajo, máscara de fundido en el borde superior).
 * - `recorta`: si se pasa, la imagen va dentro de un contenedor con
 *   overflow-hidden de esa altura (para recortar por arriba sin tapar el hero).
 */
function Fondo({ src, style, recorta }: { src: string; style?: CSSProperties; recorta?: boolean }) {
  // `style` va en un contenedor propio: `next/image` con `fill` no admite
  // `style.height` (lanza error en dev) aunque en prod lo sobrescribía.
  const imagen = (
    <div className="pointer-events-none absolute inset-0" style={style}>
      <Image
        src={src}
        alt=""
        fill
        unoptimized
        sizes="100vw"
        className="pointer-events-none object-fill"
      />
    </div>
  );

  if (recorta) {
    return (
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[calc(100%+120px)] overflow-hidden">
        {imagen}
      </div>
    );
  }
  return imagen;
}

export default function Home() {
  return (
    <div className="grid flex-1 bg-[#08090b]">
      <main className="relative z-10 col-start-1 row-start-1 w-full self-start">
        <div className="relative">
          <IntroProvider>
            <Hero />
          </IntroProvider>
        </div>
        {/* flow-root: Clients lleva -mt-[110px]; sin BFC ese margen colapsaría
            con el envoltorio y el fondo verde subiría sobre el hero. */}
        <div className="relative flow-root">
          {/* subido 45% (arranca en zona oscura) y extendido 40px hacia abajo
              para que el morado se funda sobre él. */}
          <Fondo
            src="/images/fondos/fondo-1-verde.png"
            recorta
            style={{ top: "-45%", height: "145%" }}
          />
          {/* El hero termina en #08090b: fundido (estilo inline para que aplique
              siempre) para que no se vea corte entre el hero y el primer fondo. */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-[260px]"
            style={{
              backgroundImage:
                "linear-gradient(to bottom, #08090b 0%, rgba(8,9,11,0.55) 55%, rgba(8,9,11,0) 100%)",
            }}
          />
          <Clients />
          <Divider />
          <Manifesto />
        </div>
        <div className="relative flow-root">
          {/* borde superior fundido con el verde + extendido 40px hacia abajo
              para que el rojo se funda sobre él */}
          <Fondo
            src="/images/fondos/fondo-2-morado.png"
            style={{
              top: -1,
              height: "calc(100% + 121px)",
              maskImage: MASCARA_ARRIBA,
              WebkitMaskImage: MASCARA_ARRIBA,
            }}
          />
          <Services />
          <NetworkSection />
          <Projects />
        </div>
        <div className="relative flow-root">
          {/* borde superior fundido con el morado */}
          <Fondo
            src="/images/fondos/fondo-3-rojo.png"
            style={{
              top: -121,
              height: "calc(100% + 121px)",
              maskImage: MASCARA_ARRIBA,
              WebkitMaskImage: MASCARA_ARRIBA,
            }}
          />
          <Stats />
          <Contact />
          <Testimonials />
          <ClosingCta />
        </div>
        <Footer />
      </main>
    </div>
  );
}

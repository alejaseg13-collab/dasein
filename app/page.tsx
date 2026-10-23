import Image from "next/image";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import IntroProvider from "@/components/IntroProvider";
import Clients from "@/components/Clients";
import Divider from "@/components/Divider";
import Manifesto from "@/components/Manifesto";
import Services from "@/components/Services";
import NetworkSection from "@/components/NetworkSection";
import Projects from "@/components/Projects";

const FONDOS = [
  {
    src: "/images/fondos/fondo-1-verde.png",
    width: 2269,
    height: 1276,
    ratio: "aspect-[1512/1411]",
  },
  {
    src: "/images/fondos/fondo-2-morado.png",
    width: 2267,
    height: 2551,
    ratio: "aspect-[1512/2715]",
  },
  {
    src: "/images/fondos/fondo-3-rojo.png",
    width: 2267,
    height: 6836,
    ratio: "aspect-[1512/4222]",
  },
];

export default function Home() {
  return (
    <div className="grid flex-1 bg-[#08090b]">
      <div aria-hidden className="col-start-1 row-start-1 flex flex-col">
        {FONDOS.map((fondo, index) => (
          <div key={fondo.src} className={`relative w-full ${fondo.ratio}`}>
            <Image
              src={fondo.src}
              alt=""
              width={fondo.width}
              height={fondo.height}
              unoptimized
              preload={index === 0}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
        ))}
      </div>
      <main className="relative z-10 col-start-1 row-start-1 w-full self-start">
        <div className="relative">
          <IntroProvider>
            <Hero />
            <Header />
          </IntroProvider>
        </div>
        <Clients />
        <Divider />
        <Manifesto />
        <Services />
        <NetworkSection />
        <Projects />
      </main>
    </div>
  );
}

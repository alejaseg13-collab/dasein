import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/components/Header";
import IntroProvider from "@/components/IntroProvider";
import Footer from "@/components/Footer";
import VolverButton from "@/components/VolverButton";

export const metadata: Metadata = {
  title: "Política de privacidad | Dasein Studio",
  description:
    "Autorización previa, expresa e informada para el tratamiento de datos personales de acuerdo con la Ley 1581 de 2012.",
};

const PROPÓSITOS = [
  "Gestión de solicitudes: Atender consultas, requerimientos de información, asesorías y solicitudes de cotización o propuestas comerciales.",
  "Desarrollo del servicio: Presentar propuestas técnicas y creativas, llevar a cabo la comunicación operativa de los proyectos contratados y gestionar entregables.",
  "Comunicación comercial: Mantener comunicación directa sobre nuevos servicios, metodologías, casos de estudio o novedades relacionadas con las actividades del estudio de diseño.",
];

export default function PoliticaDePrivacidad() {
  return (
    <div className="min-h-screen bg-[#08090b]">
      <div className="relative overflow-hidden">
        {/* fondo verde (mismo de la portada, subido para arrancar en tono medio) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <Image
            src="/images/fondos/fondo-1-verde.png"
            alt=""
            fill
            unoptimized
            sizes="100vw"
            className="object-fill"
            style={{ top: "-45%", height: "145%" }}
          />
        </div>

        <div className="relative">
          <IntroProvider>
            <Header />
          </IntroProvider>

          <main className="relative z-10 px-[4.4%] pb-[80px] pt-[150px] md:pt-[190px]">
            <h1 className="text-[40px] font-light leading-[1.1] text-white md:text-[56px]">
              Política <span className="font-daisy italic">de privacidad</span>
            </h1>

            <div className="mt-8 space-y-6 text-[17px] font-light leading-[1.7] text-white/90 md:text-[19px]">
              <p>
                En cumplimiento de la Ley 1581 de 2012, el Decreto 1074 de 2015 y demás normas
                vigentes que regulan la protección de datos personales en Colombia, autorizo de
                manera previa, expresa e informada a Dasein Studio para recolectar, almacenar y
                tratar los datos personales suministrados a través de los formularios de este sitio
                web.
              </p>

              <p>La información será utilizada exclusivamente con las siguientes finalidades:</p>

              <ul className="space-y-3">
                {PROPÓSITOS.map((proposito) => (
                  <li key={proposito} className="flex gap-2.5">
                    <span aria-hidden="true">·</span>
                    <span>{proposito}</span>
                  </li>
                ))}
              </ul>

              <p>
                Para solicitar la actualización o eliminación de datos, el titular podrá ponerse en
                contacto a través del correo electrónico:{" "}
                <a
                  href="mailto:contact@daseinstudioco.com"
                  className="font-semibold text-white transition-colors duration-300 hover:underline focus-visible:underline focus-visible:outline-none"
                >
                  contact@daseinstudioco.com
                </a>
                <br />
                Al seleccionar la casilla de aceptación y enviar cualquier formulario dentro de este
                sitio web, manifiesto que he leído, comprendido y aceptado la presente autorización,
                otorgando mi consentimiento libre, previo, expreso e informado para el tratamiento
                de mis datos personales.
              </p>
            </div>

            <VolverButton />
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

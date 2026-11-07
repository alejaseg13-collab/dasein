import type { Metadata } from "next";
import ProyectoCasaFacil from "@/components/ProyectoCasaFacil";

export const metadata: Metadata = {
  title: "Casa Fácil – Manual de identidad | Dasein Studio",
  description:
    "Caso de estudio de Casa Fácil: logotipo, área de seguridad, tipografía, paleta de color, texturas y aplicaciones del manual de identidad.",
};

export default function CasaFacilPage() {
  return <ProyectoCasaFacil />;
}

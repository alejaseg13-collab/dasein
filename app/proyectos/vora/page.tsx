import type { Metadata } from "next";
import ProyectoVora from "@/components/ProyectoVora";

export const metadata: Metadata = {
  title: "VORA – App Comunidad deportiva | Dasein Studio",
  description:
    "Caso de estudio de VORA: identidad de marca, diseño de interfaz y app móvil para una comunidad deportiva global.",
};

export default function VoraPage() {
  return <ProyectoVora />;
}

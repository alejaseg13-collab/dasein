import type { Metadata } from "next";
import ProyectoScalla from "@/components/ProyectoScalla";

export const metadata: Metadata = {
  title: "Scalla UI – Software | Dasein Studio",
  description:
    "Caso de estudio de Scalla: plataforma de agentes inteligentes para automatizar y escalar las interacciones con clientes en tiempo real.",
};

export default function ScallaPage() {
  return <ProyectoScalla />;
}

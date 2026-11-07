import type { Metadata } from "next";
import ProyectoBlackhost from "@/components/ProyectoBlackhost";

export const metadata: Metadata = {
  title: "Blackhost – Web Design | Dasein Studio",
  description:
    "Caso de estudio de Blackhost: marca, tipografía, paletas de color y sitio web en modo oscuro y claro.",
};

export default function BlackhostPage() {
  return <ProyectoBlackhost />;
}

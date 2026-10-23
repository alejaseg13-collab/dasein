export type Project = {
  nombre: string;
  anio: string;
  imagen: string;
  alt: string;
};

/**
 * Tarjetas del carrusel de "Nuestros trabajos". Para agregar un proyecto
 * basta con añadir un objeto a este arreglo; el carrusel funciona con
 * cualquier número de proyectos (2 o más).
 */
export const projects: Project[] = [
  {
    nombre: "VORA BRAND",
    anio: "© 2026.",
    imagen: "/images/proyecto-vora.webp",
    alt: "Bolso deportivo azul con el logotipo de VORA BRAND",
  },
  {
    nombre: "SCALLA UI",
    anio: "© 2026.",
    imagen: "/images/proyecto-scalla.webp",
    alt: "Portátil mostrando la interfaz de SCALLA UI",
  },
];

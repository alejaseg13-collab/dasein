export type Project = {
  nombre: string;
  anio: string;
  imagen: string;
  alt: string;
  /** Si existe, la tarjeta enlaza a la página del caso de estudio. */
  href?: string;
  /** Clases extra para el <img> (p. ej. object-bottom cuando el recorte
   *  central del carrusel cortaría contenido importante de la portada). */
  imgClass?: string;
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
    href: "/proyectos/vora",
  },
  {
    nombre: "SCALLA UI",
    anio: "© 2026.",
    imagen: "/images/proyecto-scalla.webp",
    alt: "Portátil mostrando la interfaz de SCALLA UI",
    href: "/proyectos/scalla",
  },
  {
    nombre: "CASA FÁCIL",
    anio: "© 2026.",
    imagen: "/images/casafacil-portada.png",
    alt: "Escenario iluminado con el mensaje En Casa Fácil tú eres el protagonista y el logotipo de Casa Fácil",
    href: "/proyectos/casa-facil",
    // El recorte central del carrusel (1.64:1) cortaría la franja inferior
    // con el teléfono y los logotipos: se alinea el recorte al pie.
    imgClass: "object-bottom",
  },
  {
    nombre: "BLACKHOST",
    anio: "© 2026.",
    imagen: "/images/portada-2.png",
    alt: "Tablet sobre fondo naranja con la página de BlackHost: Transformamos inversión en ventas reales",
    href: "/proyectos/blackhost",
  },
];

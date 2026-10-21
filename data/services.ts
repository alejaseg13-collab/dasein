export type ServiceCard = {
  title: string;
  subtitle: string;
  image: string;
  alt: string;
};

export const serviceList: string[] = [
  "Identidad visual",
  "Desarrollo Web / Software",
  "Marketing digital",
  "Gestión de redes sociales",
];

/**
 * Tarjetas del carrusel. Para cambiar una imagen basta con reemplazar el
 * archivo en /public/images con el mismo nombre, o editar la línea `image`.
 * El carrusel funciona con cualquier número de tarjetas (3 o más).
 */
export const serviceCards: ServiceCard[] = [
  {
    title: "Identidades poderosas",
    subtitle: "Lleva tus ideas a una identidad única",
    image: "/images/servicio-identidad.webp",
    alt: "Silla suspendida sobre una niebla morada, representando una identidad visual",
  },
  {
    title: "Estrategias de marca",
    subtitle: "Pauta y parrillas de contenido",
    image: "/images/servicio-estrategia.webp",
    alt: "Cubo metálico flotando entre esferas brillantes, representando estrategia de marca",
  },
  {
    title: "Sitios web y automatizaciones",
    subtitle: "Desarrollamos tus ideas digitales",
    image: "/images/servicio-web.webp",
    alt: "Forma abstracta brillante sobre fondo morado, representando sitios web y automatizaciones",
  },
];

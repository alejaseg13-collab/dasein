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
 * Lista de la sección "Nuestros servicios": nombre + detalle que se expande
 * en el acordeón. (serviceList de arriba es para el select del formulario.)
 */
export const serviceCatalog: { nombre: string; detalle: string[] }[] = [
  {
    nombre: "Identidad visual",
    detalle: ["Estrategia de marca", "Arquitectura de marca", "Diseño de marca"],
  },
  {
    nombre: "Desarrollo Web / Software",
    detalle: [
      "Diseño web",
      "UI/UX",
      "Programación web",
      "Software a medida",
      "Automatizaciones",
    ],
  },
  {
    nombre: "Comunicación digital",
    detalle: [
      "Pauta y campañas digitales",
      "Estrategia de contenidos",
      "Diseño de contenidos",
      "Gestión de redes sociales",
    ],
  },
];

/**
 * Tarjetas del carrusel. Para cambiar una imagen basta con reemplazar el
 * archivo en /public/images con el mismo nombre, o editar la línea `image`.
 * El carrusel funciona con cualquier número de tarjetas (3 o más).
 */
export const serviceCards: ServiceCard[] = [
  {
    title: "Presencia digital",
    subtitle: "Gestión de canales y diseño de contenido",
    image: "/images/Presencia%20digital.png",
    alt: "Plumínero negro dejando caer una gota de tinta sobre una piedra oscura",
  },
  {
    title: "Identidades poderosas",
    subtitle: "Lleva tus ideas a una identidad única",
    image: "/images/Identidades%20poderosas.png",
    alt: "Gota de cristal suspendida de una rama con una luz en su interior, sobre fondo morado",
  },
  {
    title: "Estrategias de marca",
    subtitle: "Pauta y campañas que funcionan",
    image: "/images/Estrategias%20de%20marca.png",
    alt: "Carretera nocturna iluminada por rayos de luz que se pierden hacia el horizonte",
  },
  {
    title: "Sitios web y automatizaciones",
    subtitle: "Desarrollamos tus ideas digitales",
    image: "/images/Sitios%20web.png",
    alt: "Dos cables eléctricos conectados con un destello de luz entre sus puntas",
  },
];

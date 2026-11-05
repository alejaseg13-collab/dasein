export interface Testimonial {
  texto: string;
  nombre: string;
  empresa: string;
  foto: string;
  alt: string;
}

export const testimonials: Testimonial[] = [
  {
    texto:
      "No solo diseñan, resuelven problemas complicados. Tenia unas etiquetas con las que sufría por organizar mi información y los tamaños, e hicieron un rediseño increible",
    nombre: "Aura Pachón",
    empresa: "LOLAREPA",
    foto: "/images/Lolarepa.jpeg",
    alt: "Foto de Aura Pachón",
  },
  {
    texto:
      "Entendieron que queríamos con la marca, con una identidad que nos encantó y una web que impulsó nuestras conversiones.",
    nombre: "Ernesto Ruíz",
    empresa: "Atria Group",
    foto: "/images/Atria_Group.jpeg",
    alt: "Foto de Ernesto Ruíz",
  },
  {
    texto:
      "Nos entregaron más de lo que esperábamos en la línea gráfica de Casa Fácil, esperaba algo sencillo porque así veía a mi marca, pero me enamoré con el resultado",
    nombre: "Nicolás Rodriguez",
    empresa: "Casa Fácil",
    foto: "/images/CasaFacil.jpeg",
    alt: "Foto de Nicolás Rodriguez",
  },
  {
    texto:
      "Son muy directos, me gustó que la idea inicial con la que llegué no fue con la que terminé, propusieron un servicio diferente y tuve grandes mejoras en mis ventas",
    nombre: "Rosa Molina",
    empresa: "Boko",
    foto: "/images/Boko.jpeg",
    alt: "Foto de Rosa Molina",
  },
];

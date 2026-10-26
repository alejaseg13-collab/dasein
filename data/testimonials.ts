export interface Testimonial {
  texto: string;
  nombre: string;
  empresa: string;
  foto: string;
  alt: string;
}

// TODO: nombre y empresa son PROVISIONALES (las tres tarjetas llevan los mismos).
// Las fotos aún no existen: las rutas quedan listas para reemplazar el círculo
// de iniciales por la imagen real cuando lleguen.
export const testimonials: Testimonial[] = [
  {
    texto:
      "Entendieron el ADN de nuestra marca desde el primer día. Pasamos de una identidad desordenada a un sistema visual sólido que impulsó nuestras conversiones.",
    nombre: "Daniel Pachón",
    empresa: "LOLAREPA",
    foto: "/images/testimonios/avatar-1.webp",
    alt: "Foto de Daniel Pachón",
  },
  {
    texto:
      "No solo diseñan, resuelven problemas complejos. La arquitectura de interfaz que desarrollaron para nuestro producto digital redujo la fricción de los usuarios de inmediato.",
    nombre: "Daniel Pachón",
    empresa: "LOLAREPA",
    foto: "/images/testimonios/avatar-2.webp",
    alt: "Foto de Daniel Pachón",
  },
  {
    // TODO: TEXTO PROVISIONAL, reemplazar por el real
    // (la tercera tarjeta aparece cortada en design/08-testimonios.jpg).
    texto: "Un equipo cercano y claro en cada etapa. Todo el proceso fue ordenado y sin fricciones.",
    nombre: "Daniel Pachón",
    empresa: "LOLAREPA",
    foto: "/images/testimonios/avatar-3.webp",
    alt: "Foto de Daniel Pachón",
  },
];

# PROGRESO — Dasein Studio

## 1) Secciones terminadas
- **Header** (`components/Header.tsx`) — sin cambios.
- **Hero** (`components/Hero.tsx`) — sin cambios; ya aprobado.
- Fondos apilados en `app/page.tsx` (fondo-1/2/3) — sin cambios.

## 2) Secciones a medias
- **Sección 3 — Nuestros clientes** (`components/Clientes.tsx`):
  - Hecho: título "Nuestros *clientes*" (Swarsh Daisy Italic) y subtítulo con "clientes satisfechos" en negrita, con fundido de entrada.
  - Estado: NO tiene la cinta de logos (solo un TODO). No se ha ajustado aún a `design/02-clientes-manifiesto.png`.
  - Pendiente de ajuste (medido sobre la referencia): subtítulo ~19 px (hoy 15 px), una sola línea; separación con los logos ~88 px.
- **Sección 4 — Divider**: NO existe (`components/Divider.tsx` sin crear).
- **Sección 5 — Manifiesto**: NO existe (`components/Manifesto.tsx` sin crear).

## 3) Qué falta por hacer
- **Clients.tsx**: crear/renombrar desde `Clientes.tsx`, añadir la cinta de logos en bucle infinito (duplicar lista, translateX 0 → -50 %, pausa con mouse, se detiene con `prefers-reduced-motion`, `overflow-hidden`), textos de relleno (BURBERRY, adidas, ENSIGNA, STATIONERY, MEXICANA, gpsnvision, LOGISTICS) con TODO para sustituir por SVG.
- **Divider.tsx**: línea fina + "© 2026." + isotipo + icono de dos líneas. Nota: en `/public/logo` NO hay isotipo suelto; la opción es extraer los 8 rects del isotipo desde `Logo Dasein vertical.svg` (inline) o usar el logo vertical pequeño → confirmar con el usuario.
- **Manifesto.tsx**: etiqueta, titular de 3 líneas (Clash Display ~117 px, cargar con `next/font/local` en el componente porque no se puede tocar `layout.tsx`), bloque cian + 3 barras + "GANADORA", texto "Cuéntanos que tienes en mente" y botón "Hablemos".
- `app/page.tsx`: importar y montar Clients → Divider → Manifesto después del hero (único cambio permitido ahí).
- Borrar `components/Clientes.tsx` al renombrar a `Clients.tsx`.
- Verificar: sin scroll horizontal a 1440 px y hero intacto.
- Secciones 6 a 13 (servicios, red, trabajos, equipo, contacto, testimonios, CTA, footer): pendientes.

Nota de trabajo de esta sesión: solo hubo análisis de la referencia (`design/02-clientes-manifiesto.png`) y mediciones; no se modificó ningún archivo de código.

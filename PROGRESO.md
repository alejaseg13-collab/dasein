# PROGRESO — Dasein Studio

## 1) Secciones terminadas
- **Header** (`components/Header.tsx`) — sin cambios.
- **Hero** (`components/Hero.tsx`) — sin cambios; verificado intacto en navegador.
- Fondos apilados en `app/page.tsx` (fondo-1/2/3) — sin cambios.
- **Sección 3 — Nuestros clientes** (`components/Clients.tsx`):
  - Título "Nuestros *clientes*" (Swarsh Daisy Italic), subtítulo 19 px en una línea con "clientes satisfechos" en negrita.
  - Cinta de logos a sangre en bucle infinito (`translateX 0 → -50%`, CSS), pausa al pasar el mouse, se detiene con `prefers-reduced-motion`, `overflow-hidden` + track `absolute` (evita scroll horizontal).
  - Logos: textos de relleno con estilo por marca (BURBERRY, adidas, ENSIGNA, STATIONERY, MEXICANA, gpsnvision, LOGISTICS). **Falta:** sustituir por los SVG reales de los clientes cuando estén en `/public/logo`.
- **Sección 4 — Divider** (`components/Divider.tsx`):
  - "© 2026." + isotipo + icono de dos líneas (superior más corta), línea tenue sobre la fila y línea clara debajo.
  - El isotipo no existe suelto en `/public/logo`: se inlinearon los 8 rects exactos del marca de cruz de `Logo Dasein vertical studio.svg`. Si prefieres el logo vertical completo, avisar.
- **Sección 5 — Manifiesto** (`components/Manifesto.tsx`):
  - Etiqueta, titular Clash Display 700 (`next/font/local`, no se tocó `layout.tsx`), "SOMOS UNA" + texto lateral + botón "Hablemos" (flecha se mueve en hover), "AGENCIA DIGITAL", bloque cian + 3 barras + "GANADORA".
  - Animaciones: palabras con desenfoque al entrar en viewport, bloque cian se desliza; respetan `prefers-reduced-motion`.
  - En móvil el bloque cian usa tamaños fijos legibles y "GANADORA" salta a su propia línea.
- `app/page.tsx`: importa y monta `Clients → Divider → Manifesto` después del hero (único cambio ahí). `components/Clientes.tsx` borrado.

## 2) Verificado en navegador (Chrome headless)
- 1440 px: sin scroll horizontal (`scrollWidth == clientWidth`), hero idéntico al anterior.
- 390 px (móvil): sin scroll horizontal, secciones apiladas correctamente.
- `prefers-reduced-motion`: el contenido queda visible (sin animación de por vida).

## 3) Pendiente (siguientes tareas)
- Secciones 6 a 13 (servicios, red, trabajos, equipo, contacto, testimonios, CTA, footer).
- Logos reales de clientes en SVG (`/public/logo`).
- El manifiesto de la referencia parece traer "GANADORA" en un ancho distinto al de Clash 700; se dejó la mejor versión con la fuente actual.

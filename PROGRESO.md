# PROGRESO — Dasein Studio

## 1) Estado general
- **Front completo: secciones 1–13 construidas, verificadas y commiteadas** (ver historial de commits).
- Página nueva `/politica-de-privacidad` con botón Volver que restaura el scroll de origen y el formulario intacto (persistencia en `sessionStorage`, se borra al enviar con éxito).
- Rutas de `/public/fonts` y `/public/logo` renombradas a minúsculas y con guiones (deploy en Netlify/Linux); `npm run lint` y `npm run build` pasan limpios.

## 2) Secciones terminadas
- **Header** (`components/Header.tsx`) — logo, datos y botón; dentro de `IntroProvider`.
- **Hero** (`components/Hero.tsx`) — titular, astronauta, niebla, tarjeta de vidrio; verificado intacto.
- Fondos apilados en `app/page.tsx` (fondo-1/2/3) — subida de 45 %, máscaras de 90 px y extensiones de 120 px; `Fondo` usa un `<div>` contenedor para `style` (error de `next/image` con `fill` + `style.height` solo existía en dev; fix en `8f0f8af`).
- **Sección 3 — Nuestros clientes** (`components/Clients.tsx`): cinta en bucle infinito, pausa con hover, con `prefers-reduced-motion`. Logos = textos de relleno; **faltan los SVG reales**.
- **Sección 4 — Divider** (`components/Divider.tsx`): "© 2026." + isotipo inline (8 rects del logo vertical) + icono de dos líneas.
- **Sección 5 — Manifiesto** (`components/Manifesto.tsx`): titular con desenfoque al entrar, bloque cian + barras + "GANADORA". Nota: "GANADORA" en la referencia parece otro ancho; se dejó la mejor versión con Clash 700.
- **Sección 6 — Servicios** (`components/Services.tsx`): lista + carrusel de 3 tarjetas.
- **Sección 7 — Frase y red** (`components/NetworkSection.tsx`): frase por líneas + `fondo-red.webp` con paneo/zoom lentos y destello.
- **Sección 8 — Nuestros trabajos** (`components/Projects.tsx`): carrusel en bucle con botón circular; entradas reversibles por dirección del scroll.
- **Sección 9 — Equipo y cifras** (`components/Stats.tsx`): contadores al entrar (una sola vez), cifras a peso 600.
- **Sección 10 — Contacto** (`components/Contact.tsx`): tarjeta de pasos + formulario compacto con `form-video.mp4` en el panel; enlace a la política en la casilla. **Envío pendiente de servicio** (PENDIENTE en DESIGN).
- **Sección 11 — Testimonios** (`components/Testimonials.tsx`): carrusel en bucle con animación al cambiar de tarjeta.
- **Sección 12 — CTA final** (`components/ClosingCta.tsx`): prisma de cristal 3D (three/fiber/drei, `GlassScene.tsx` + `Prism.tsx`), título Clash Display mayúsculas, botón "Hablemos por WhatsApp".
- **Sección 13 — Footer** (`components/Footer.tsx`): logo, redes (WhatsApp usa `public/images/wtp.svg`), contacto y enlace legal a "Política de privacidad".
- Animaciones: sistema reversible (entra/revierte/repite según dirección) vía `Reveal.tsx` + `useScrollDirection.ts`; secciones con `once` solo donde aplica (Prism, contadores).

## 3) Verificado en navegador (Chrome headless CDP)
- 1440 px y 390 px: sin scroll horizontal en toda la página (`scrollWidth ≤ ancho`).
- `prefers-reduced-motion`: contenido visible, sin animaciones de por vida.
- Dev (`next dev`) sin errores de runtime (fix de `Fondo`); `next build` y lint limpios.
- Rutas nuevas de fuentes/logos devuelven 200; las viejas, 404.

## 4) Pendiente / avisos
- **Servicio de envío del formulario** (PENDIENTE en DESIGN; hoy solo interfaz + `sessionStorage`).
- **Dos números de WhatsApp distintos**: `lib/contact.ts` usa `573122148910` (footer/redes) y `ClosingCta.tsx` usa `573122468060` (botón del cierre); ambos con `TODO`. Unificar cuando el diseñador confirme.
- `lib/contact.ts` sigue marcado "datos provisionales" (`EMAIL` ya es `contact@daseinstudioco.com`; `PHONE`/`WHATSAPP` sin cambiar).
- La página `/politica-de-privacidad` muestra el correo escrito a mano (no usa la constante `EMAIL`); el botón "Empezar proyecto" del Header apunta a `#contacto` y no funciona en esa página.
- Logos reales de clientes en SVG (faltan; hoy textos de relleno).
- `DESIGN.md` y comentarios de `Divider`/`Clients`/`PROGRESO` aún citan `Logo Dasein vertical studio.svg`, borrado en la limpieza de assets; se dejó sin tocar salvo lo pedido.

## 5) Commits recientes
- `11b9a9e` actualiza EMAIL en lib/contact.ts
- `12c44b4` archivos renombrados (fonts/logo → minúsculas y guiones)
- `8f0f8af` antes de renombrar (política de privacidad + wtp.svg + fix de Fondo)
- `e1a1956` limpieza de assets no usados

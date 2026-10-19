# DESIGN.md — Dasein Studio

> Guía para el agente. Léela completa antes de tocar el código.
> Lo marcado con (PENDIENTE) falta confirmarlo con el diseñador. No lo inventes: pregunta.

## Concepto
Página de un solo scroll para un estudio creativo colombiano (desarrollo web/software, marketing digital y branding). Ambiente oscuro y cinematográfico: verde azulado arriba, morado en el centro y rojo vino hacia abajo. El hero tiene un astronauta (casco entre nubes). Los titulares mezclan una sans limpia con palabras en cursiva serif.

## Colores
- Verde: `#025c63`
- Rojo: `#551311`, `#3e1010`
- Morado: `#2d0630`, `#3f0863`
- Oscuros: `#00243a`, `#08090b`, `#031e31`
- Cian del bloque "Un estudio creativo desde Colombia": (PENDIENTE)
- Rojo del botón "Solicitar propuesta": (PENDIENTE)
- Los colores se usan para textos, botones, bordes y detalles. Los fondos son imágenes (ver "Recursos").

## Tipografía (archivos en /public/fonts)
Carpetas: `Clash Display` (ClashDisplay-Variable.ttf), `Sharp Sans` (pesos Thin a ExtraBold, con sus cursivas, en .otf) y `Swarsh Daisy` (Regular e Italic, en .ttf).
Uso propuesto (confirmar comparando con la referencia en /design):
- Texto, menús, botones y formularios: Sharp Sans (Light, Regular, Medium).
- Palabras en cursiva serif de los títulos (ej. *Se diseña.*, *clientes*, *servicios*, *tu proyecto*): Swarsh Daisy Italic.
- Titulares grandes en mayúsculas ("SOMOS UNA AGENCIA DIGITAL GANADORA", "DEMOS FORMA Y DIRECCIÓN A TUS PROYECTOS") y cifras (+35, +4): probar Clash Display con peso alto; si no coincide con la referencia, usar Sharp Sans ExtraBold.
- Cargar con `next/font/local` y solo los pesos que se usen. Los nombres de archivo tienen espacios: cuidar las rutas.
- Si una fuente no coincide con el diseño, no inventar: avisar y dejar un comentario `TODO: fuente`.
- Licencias: confirmar con el diseñador que cubren uso web.

## Recursos (todo en /public; las rutas empiezan con /)

### Fondos de página: /images/fondos
Tres imágenes PNG que se apilan en este orden, al 100 % del ancho, sin deformar y sin costuras:
1. `fondo-1-verde.png`: parte alta (menú, hero, clientes, manifiesto).
2. `fondo-2-morado.png`: parte media (servicios, red, proyectos).
3. `fondo-3-rojo.png`: parte final (equipo, contacto, testimonios, cierre, footer).
Son degradados oscuros: usarlas como PNG (en WebP salen bandas). Color de respaldo: `#08090b`.

### Imágenes: /images
- `hero-astronauta.webp`: astronauta con nubes, fondo del hero.
- `hero-astronauta-cuadro.webp`: el mismo astronauta en formato cuadrado (opcional, para celular).
- `hero-niebla.webp`: niebla con fondo transparente, va encima del astronauta.
- `fondo-red.webp`: red de puntos y líneas rosadas (sección de la imagen ancha).
- `servicio-identidad.webp`, `servicio-estrategia.webp`, `servicio-web.webp`: imágenes de las 3 tarjetas de servicios. Son PROVISIONALES: dicen "STNDOUT" y traen elementos de interfaz de redes sociales. No publicar hasta confirmar con el diseñador.
- `proyecto-vora.webp`, `proyecto-scalla.webp`: proyectos del carrusel.

### Logos: /logo (SVG; los nombres tienen espacios)
- `Logo Dasein horizontal studio.svg`: header y footer (confirmar contra la referencia).
- `Logo Dasein horizontal.svg`, `Logo Dasein vertical studio.svg`, `Logo Dasein vertical.svg`: alternativos.
- Los SVG se muestran con `<img>` o con `next/image` y `unoptimized`. Cuidar los espacios del nombre en la ruta.

### Videos: /videos (PLAN B, no usar en la primera versión)
- `hero-astronauta.mp4` y `fondo-red.mp4`: animaciones hechas con IA. La animación se hace por código; los videos solo se usan si el resultado por código no convence.

### Faltan (PENDIENTE)
Logos de clientes, imagen naranja de la tarjeta de contacto, prisma de cristal del cierre, foto de quien da el testimonio y comentarios de animación de Figma.

## Principios de movimiento (suaves, no cargados)
- Máximo 1 o 2 elementos animados a la vez por pantalla.
- Entradas lentas: 0.8 a 1.2 s con ease-out.
- Desplazamientos pequeños (20 a 40 px). Nada de saltos ni giros bruscos.
- Parallax sutil. El texto que se está leyendo no se mueve.
- Mucho espacio vacío alrededor de cada bloque.
- Respetar `prefers-reduced-motion` (sin movimiento si está activado).

## Secciones (en orden) y animación propuesta
Si en Figma hay un comentario del diseñador para una sección, ese comentario manda sobre la propuesta.

1. **Header**: logo, descripción corta, horario y botón "Empezar proyecto". Animación: aparece con fundido; el botón sube un poco al pasar el mouse.
2. **Hero**: etiqueta "Todo tu proyecto a medida", titular "La presencia no se encuentra, *Se diseña.*", astronauta entre nubes, tarjeta de cristal abajo a la derecha. Animación (por código, con las imágenes fijas):
   - Astronauta: zoom lento de 100 % a 108 % en unos 20 s, de ida y vuelta.
   - Niebla (`hero-niebla.webp`): se desplaza despacio de lado a lado.
   - Mouse: movimiento mínimo (máximo 12 px) del astronauta.
   - Brillo suave que late cerca del visor (ciclo de unos 6 s).
   - Titular línea por línea; la tarjeta aparece con fundido.
3. **Nuestros clientes**: título, subtítulo y fila de logos. Animación: cinta continua y lenta que se detiene al pasar el mouse.
4. **Separador**: "© 2026.", logo central e ícono de menú. Sin animación.
5. **Manifiesto**: "Diseño y estrategia de marca / SOMOS UNA AGENCIA DIGITAL GANADORA", bloque cian "Un estudio creativo desde Colombia" y botón "Hablemos". Animación: las palabras pasan de desenfocadas a nítidas con el scroll; el bloque cian se desliza suave.
6. **Nuestros servicios**: lista (Identidad visual, Desarrollo Web / Software, Marketing digital, Gestión de redes sociales) y carrusel de 3 tarjetas moradas (Identidades poderosas, Estrategias de marca, Sitios web y automatizaciones). Animación: flecha que se desplaza al pasar el mouse; la tarjeta activa un poco más grande.
7. **Frase y red de puntos**: "Diseñamos de forma increíble. Creamos de forma eficiente." y la imagen ancha `fondo-red.webp`. Animación: texto con fundido por líneas; la imagen hace paneo y zoom muy lentos (de 105 % a 115 % en unos 30 s, de ida y vuelta) con un destello de luz suave que la recorre.
8. **Nuestros trabajos**: carrusel horizontal (VORA BRAND, SCALLA UI) con botón circular de flecha. Animación: arrastrar o usar la flecha; la imagen hace zoom leve al pasar el mouse.
9. **Equipo y cifras**: "+35 proyectos creativos" y "+4 años de experiencia", con 5 estrellas. Animación: los números cuentan hacia arriba al entrar en pantalla.
10. **Contacto**: tarjeta grande con "Empecemos a construir" y 3 pasos (Envías tu solicitud, Evaluamos tu problemática, Solucionamos tu necesidad), y formulario "Cuéntanos tu proyecto" (nombre, correo, servicio, mensaje, política de privacidad, botón "Solicitar propuesta"). Animación: los pasos se resaltan de a uno; los campos tienen un brillo suave al enfocarlos.
11. **Testimonios**: "Esto dicen de nosotros", carrusel de tarjetas con estrellas y autor, y línea de progreso. Animación: deslizamiento suave entre tarjetas.
12. **CTA final**: "DEMOS FORMA Y DIRECCIÓN A TUS PROYECTOS" con un prisma de cristal y botón "Hablemos por WhatsApp". Animación: el prisma flota y rota muy despacio; el título aparece con fundido.
13. **Footer**: logo, redes sociales, correo, teléfono, términos y © 2026. Animación: fundido al entrar.

## Comentarios de animación del diseñador (PENDIENTE)
Pegar aquí los comentarios de Figma, indicando la sección:

-

## Reglas técnicas
- Next.js (App Router) + TypeScript + Tailwind + Framer Motion.
- Un componente por sección en `/components`.
- Referencias visuales en `/design`. Recursos en `/public`.
- Diseño responsive: escritorio y móvil.
- El formulario de contacto necesita un servicio que envíe los correos (PENDIENTE: definir cuál). Mientras tanto, solo la interfaz.
- No inventes textos, colores, fuentes ni imágenes. Si falta algo, pregunta.
- No instales librerías nuevas sin avisar antes.
- Al terminar cada tarea, resume qué archivos cambiaste.
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->


## Proyecto Dasein Studio
- Antes de empezar cualquier tarea, lee DESIGN.md: ahí están los recursos, el orden de las secciones y las reglas de movimiento.
- Las imágenes de referencia del diseño están en /design.
- Stack: Next.js (App Router), TypeScript, Tailwind y Framer Motion. No instales librerías nuevas sin avisar.
- Un componente por sección en /components.
- Usa solo los recursos de /public. No inventes textos, colores, fuentes ni imágenes.
- Las animaciones se hacen por código y son suaves (ver "Principios de movimiento" en DESIGN.md). Respeta prefers-reduced-motion.
- Trabaja una tarea a la vez y no toques otras secciones.
- No modifiques archivos de secciones ya terminadas (Header, Hero) salvo que se pida de forma explícita. Si crees que hay que cambiarlos, pregunta primero.
- Al terminar, resume en pocas líneas qué archivos cambiaste y cómo probarlo en http://localhost:3000.
- Si algo está marcado como PENDIENTE o falta, pregunta en vez de adivinar.
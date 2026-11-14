# Dasein Studio

Sitio web oficial de **Dasein Studio**, estudio independiente colombiano de desarrollo web/software, marketing digital y branding.

🔗 **Sitio:** [daseinstudioco.com](https://daseinstudioco.com)

![Captura de Dasein Studio](./docs/captura-home.png)

## Secciones del sitio

- **Hero** con el astronauta animado, animación de entrada y llamado a la acción.
- **Clientes:** carrusel en bucle con los logos de las marcas con las que han trabajado.
- **Servicios:** identidad visual, desarrollo web/software y comunicación digital.
- **Portafolio:** carrusel de proyectos (Vora, Scalla UI, Casa Fácil, BlackHost).
- **Formulario de contacto** para solicitar una propuesta, con el proceso explicado en 3 pasos.
- **Testimonios** de clientes, contacto por WhatsApp y política de privacidad.

## Tecnologías

- **Next.js 16** (App Router), **React** y **TypeScript**
- **Tailwind CSS** para los estilos
- **Framer Motion** para las animaciones de entrada, de scroll y los carruseles
- **Nodemailer** para el envío del formulario por SMTP, desde una ruta API de Next.js
- **next/font/local** para las tipografías propias
- Desplegado en **Netlify**; dominio y correo en **Hostinger**

## Aspectos destacados

- **Animaciones suaves** y coordinadas, que respetan la preferencia `prefers-reduced-motion`.
- **Formulario seguro:** validación en el cliente y en el servidor, campo trampa anti-spam (honeypot), límite de envíos por IP y correo enviado por SMTP. Las credenciales viven solo en variables de entorno del servidor y nunca llegan al navegador.
- **Rendimiento:** imágenes optimizadas (WebP) y carga diferida de lo que no es crítico.
- **Diseño responsive** para escritorio y celular.
- **Contenido editable:** los datos de proyectos, testimonios y contacto están en archivos aparte, así que agregar o cambiar uno no requiere tocar los componentes.

## Mi rol

Desarrollo front-end del sitio a partir del diseño en Figma de Dasein Studio: maquetación responsive, animaciones, integración del formulario con envío real de correo, y publicación (despliegue en Netlify y conexión del dominio con DNS en Hostinger).

## Cómo ejecutarlo en local

Requiere Node.js 20 o superior.

```bash
git clone https://github.com/alejaseg13-collab/dasein.git
cd dasein
npm install
copy .env.example .env.local   # en macOS o Linux: cp .env.example .env.local
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Variables de entorno

Para que el formulario envíe correos, completa `.env.local` (nunca lo subas al repositorio):

| Variable | Para qué sirve |
|---|---|
| `SMTP_HOST` | Servidor de salida del correo |
| `SMTP_PORT` | Puerto del servidor (465 o 587) |
| `SMTP_USER` | Cuenta de correo que envía |
| `SMTP_PASS` | Contraseña de esa cuenta |
| `CONTACT_TO` | Correo donde llegan las solicitudes |

## Despliegue

El sitio está conectado a Netlify, que lo publica automáticamente con cada cambio en la rama `main`. El dominio se compró en Hostinger y apunta a Netlify mediante registros DNS, y el correo del estudio sigue en Hostinger.

## Créditos y uso

Diseño: Dasein Studio. Desarrollo: Valery Alejandra Liñán Segura ([@alejaseg13-collab](https://github.com/alejaseg13-collab)).

Las marcas, imágenes y tipografías son propiedad de Dasein Studio y de sus respectivos autores. Este repositorio se muestra como parte de un portafolio y no autoriza su reutilización.

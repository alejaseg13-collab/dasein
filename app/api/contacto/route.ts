import nodemailer from "nodemailer";
import { connection } from "next/server";

// `runtime = "nodejs"` no está permitido con cacheComponents (Next 16) y no
// hace falta: Node.js ya es el runtime por defecto de las rutas.

const SERVICIOS_PERMITIDOS = [
  "Identidad visual",
  "Desarrollo Web / Software",
  "Marketing digital",
  "Gestión de redes sociales",
];

const RESPUESTA_OK = { ok: true } as const;
const RESPUESTA_INVALIDA = { ok: false, error: "Solicitud inválida. Revisa los campos." } as const;
const RESPUESTA_ERROR_INTERNO = {
  ok: false,
  error: "No pudimos procesar tu solicitud. Intenta de nuevo más tarde.",
} as const;

/**
 * Límite simple por IP en memoria: máximo 5 solicitudes cada 10 minutos.
 * En serverless no es perfecto: cada instancia mantiene su propio contador
 * y el estado desaparece si el contenedor se recicla, así que solo frena
 * abusos ligeros; para un límite estricto haría un almacén compartido.
 */
const VENTANA_MS = 10 * 60 * 1000;
const MAX_POR_VENTANA = 5;
const intentosPorIp = new Map<string, { inicio: number; cantidad: number }>();

function respuesta(status: number, cuerpo: { ok: boolean; error?: string }): Response {
  return Response.json(cuerpo, { status });
}

const VARIABLES_ENTORNO = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"];

function variablesFaltantes(): string[] {
  return VARIABLES_ENTORNO.filter((nombre) => !process.env[nombre]);
}

function campoDeError(error: unknown, clave: string): string {
  if (typeof error !== "object" || error === null) return "";
  const valor = (error as Record<string, unknown>)[clave];
  if (typeof valor === "string") return valor;
  if (typeof valor === "number") return String(valor);
  return "";
}

function registrarFallo(error?: unknown): void {
  const faltan = variablesFaltantes();
  const partes = [`faltan=[${faltan.join(", ")}]`];
  if (error !== undefined) {
    const mensaje =
      campoDeError(error, "message") || (typeof error === "string" ? error : "");
    partes.push(
      `name=${campoDeError(error, "name")}`,
      `code=${campoDeError(error, "code")}`,
      `responseCode=${campoDeError(error, "responseCode")}`,
      `command=${campoDeError(error, "command")}`,
      `message=${mensaje.slice(0, 200)}`,
    );
  }
  console.error(`[api/contacto] ${partes.join(" ")}`);
}

function escapar(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function superaElLimite(ip: string): boolean {
  const ahora = Date.now();
  if (intentosPorIp.size > 1000) {
    for (const [clave, registro] of intentosPorIp) {
      if (ahora - registro.inicio > VENTANA_MS) intentosPorIp.delete(clave);
    }
  }
  const registro = intentosPorIp.get(ip);
  if (!registro || ahora - registro.inicio > VENTANA_MS) {
    intentosPorIp.set(ip, { inicio: ahora, cantidad: 1 });
    return false;
  }
  registro.cantidad += 1;
  return registro.cantidad > MAX_POR_VENTANA;
}

async function manejarSolicitud(request: Request): Promise<Response> {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "desconocida";

  let cuerpo: Record<string, unknown>;
  try {
    cuerpo = (await request.json()) as Record<string, unknown>;
  } catch {
    return respuesta(400, RESPUESTA_INVALIDA);
  }

  // Honeypot: los humanos nunca ven este campo. Si trae contenido,
  // respondemos ok sin validar ni enviar nada.
  const alt = typeof cuerpo.contacto_alt === "string" ? cuerpo.contacto_alt.trim() : "";
  if (alt !== "") {
    return respuesta(200, RESPUESTA_OK);
  }

  if (superaElLimite(ip)) {
    return respuesta(429, {
      ok: false,
      error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos.",
    });
  }

  const nombre = typeof cuerpo.nombre === "string" ? cuerpo.nombre.trim() : "";
  const email = typeof cuerpo.email === "string" ? cuerpo.email.trim() : "";
  const servicio = typeof cuerpo.servicio === "string" ? cuerpo.servicio.trim() : "";
  const mensaje = typeof cuerpo.mensaje === "string" ? cuerpo.mensaje.trim() : "";
  const consentimiento = cuerpo.consentimiento === true;

  const validacionCorrecta =
    nombre.length >= 2 &&
    nombre.length <= 100 &&
    !/[\r\n]/.test(nombre) &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
    email.length <= 200 &&
    !/[\r\n]/.test(email) &&
    SERVICIOS_PERMITIDOS.includes(servicio) &&
    mensaje.length >= 10 &&
    mensaje.length <= 2000 &&
    consentimiento;

  if (!validacionCorrecta) {
    return respuesta(400, RESPUESTA_INVALIDA);
  }

  const faltan = variablesFaltantes();
  if (faltan.length > 0) {
    registrarFallo();
    return respuesta(500, RESPUESTA_ERROR_INTERNO);
  }

  const puerto = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(puerto) || (puerto !== 465 && puerto !== 587)) {
    registrarFallo();
    return respuesta(500, RESPUESTA_ERROR_INTERNO);
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: puerto,
    // 465 = TLS implícito (secure). 587 = STARTTLS (secure false; nodemailer
    // negocia el upgrade). La verificación de certificados TLS queda activada.
    secure: puerto === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const fecha = new Intl.DateTimeFormat("es-CO", {
    timeZone: "America/Bogota",
    dateStyle: "full",
    timeStyle: "short",
  }).format(new Date());

  const pagina = (request.headers.get("referer") || "No disponible").slice(0, 300);

  const texto = [
    "Nueva solicitud de propuesta - Dasein Studio",
    "",
    `Nombre: ${nombre}`,
    `Correo: ${email}`,
    `Servicio: ${servicio}`,
    "",
    "Mensaje:",
    mensaje,
    "",
    "Aceptó la política de privacidad: Sí",
    `Fecha (America/Bogota): ${fecha}`,
    `Página de origen: ${pagina}`,
  ].join("\n");

  const html = [
    "<h2>Nueva solicitud de propuesta - Dasein Studio</h2>",
    `<p><strong>Nombre:</strong> ${escapar(nombre)}</p>`,
    `<p><strong>Correo:</strong> ${escapar(email)}</p>`,
    `<p><strong>Servicio:</strong> ${escapar(servicio)}</p>`,
    "<p><strong>Mensaje:</strong></p>",
    `<div style="white-space:pre-wrap">${escapar(mensaje)}</div>`,
    "<p><strong>Aceptó la política de privacidad:</strong> Sí</p>",
    `<p><strong>Fecha (America/Bogota):</strong> ${escapar(fecha)}</p>`,
    `<p><strong>Página de origen:</strong> ${escapar(pagina)}</p>`,
  ].join("");

  try {
    await transporter.sendMail({
      from: `"Formulario web Dasein" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_TO,
      replyTo: email,
      subject: "Nueva solicitud de propuesta - Dasein Studio",
      text: texto,
      html,
    });
    return respuesta(200, RESPUESTA_OK);
  } catch (error) {
    registrarFallo(error);
    return respuesta(502, {
      ok: false,
      error: "No pudimos enviar tu solicitud. Intenta de nuevo más tarde.",
    });
  }
}

export async function POST(request: Request): Promise<Response> {
  try {
    return await manejarSolicitud(request);
  } catch (error) {
    registrarFallo(error);
    return respuesta(500, RESPUESTA_ERROR_INTERNO);
  }
}

export async function GET(): Promise<Response> {
  await connection();
  const faltan = variablesFaltantes();
  return Response.json({ configurado: faltan.length === 0, faltan });
}

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

// TODO: QUITAR diag tras diagnosticar
type Diag = { etapa: string; name: string; code: string; invalidas?: string[] };

function respuesta(
  status: number,
  cuerpo: { ok: boolean; error?: string; diag?: Diag },
): Response {
  return Response.json(cuerpo, { status });
}

const VARIABLES_ENTORNO = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_TO"];

// Limpieza tolerante: espacios/saltos de los extremos, comillas simples o
// dobles que envuelvan el valor y caracteres invisibles (saltos, tabs,
// zero-width) del interior, antes de validar.
function limpiarValor(valor: string): string {
  let v = valor;
  for (let i = 0; i < 3; i++) {
    const anterior = v;
    v = v.trim().replace(/^["']|["']$/g, "");
    if (v === anterior) break;
  }
  return v.replace(/[\r\n\t\u200b\u200c\u200d\ufeff]+/g, "");
}

function variable(nombre: string): string {
  return limpiarValor(process.env[nombre] ?? "");
}

function variablesFaltantes(): string[] {
  return VARIABLES_ENTORNO.filter((nombre) => variable(nombre) === "");
}

function campoDeError(error: unknown, clave: string): string {
  if (typeof error !== "object" || error === null) return "";
  const valor = (error as Record<string, unknown>)[clave];
  if (typeof valor === "string") return valor;
  if (typeof valor === "number") return String(valor);
  return "";
}

// TODO: QUITAR diag tras diagnosticar
function diagDe(etapa: string, error?: unknown, invalidas?: string[]): Diag {
  return {
    etapa,
    name: campoDeError(error, "name"),
    code: campoDeError(error, "code"),
    invalidas,
  };
}

function registrarFallo(etapa: string, error?: unknown, invalidas?: string[]): void {
  const faltan = variablesFaltantes();
  const partes = [`etapa=${etapa}`, `faltan=[${faltan.join(", ")}]`];
  if (invalidas) partes.push(`invalidas=[${invalidas.join(", ")}]`);
  if (error !== undefined) {
    const ctor =
      error !== null ? ((error as { constructor?: { name?: string } }).constructor?.name ?? "") : "";
    partes.push(`typeof=${typeof error}`, `ctor=${ctor}`);
    if (error instanceof Error) {
      partes.push(
        `name=${campoDeError(error, "name")}`,
        `code=${campoDeError(error, "code")}`,
        `responseCode=${campoDeError(error, "responseCode")}`,
        `command=${campoDeError(error, "command")}`,
        `message=${campoDeError(error, "message").slice(0, 200)}`,
      );
    }
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
    registrarFallo("config", undefined, faltan);
    return respuesta(500, { ...RESPUESTA_ERROR_INTERNO, diag: diagDe("config", undefined, faltan) });
  }

  const puerto = Number(variable("SMTP_PORT"));
  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    const invalidas = ["SMTP_PORT"];
    registrarFallo("config", undefined, invalidas);
    return respuesta(500, {
      ...RESPUESTA_ERROR_INTERNO,
      diag: diagDe("config", undefined, invalidas),
    });
  }

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

  // Un intento con el puerto del entorno y otro con el otro estándar (465 o
  // 587): si el primero no conecta (filtro del hosting), se prueba el otro.
  // Tiempos acotados para que ambos intentos quepan en el timeout de Netlify.
  // 465 = TLS implícito (secure). 587 = STARTTLS (secure false).
  const puertos = [...new Set([puerto, puerto === 465 ? 587 : 465])];
  let fallo: unknown = undefined;
  for (const p of puertos) {
    try {
      const transporter = nodemailer.createTransport({
        host: variable("SMTP_HOST"),
        port: p,
        secure: p === 465,
        auth: {
          user: variable("SMTP_USER"),
          pass: variable("SMTP_PASS"),
        },
        connectionTimeout: 2000,
        greetingTimeout: 1500,
        socketTimeout: 4000,
      });
      await transporter.sendMail({
        from: `"Formulario web Dasein" <${variable("SMTP_USER")}>`,
        to: variable("CONTACT_TO"),
        replyTo: email,
        subject: "Nueva solicitud de propuesta - Dasein Studio",
        text: texto,
        html,
      });
      return respuesta(200, RESPUESTA_OK);
    } catch (error) {
      fallo = error;
    }
  }
  registrarFallo("enviar", fallo);
  return respuesta(502, {
    ok: false,
    error: "No pudimos enviar tu solicitud. Intenta de nuevo más tarde.",
    // TODO: QUITAR diag tras diagnosticar
    diag: diagDe("enviar", fallo),
  });
}

export async function POST(request: Request): Promise<Response> {
  try {
    return await manejarSolicitud(request);
  } catch (error) {
    registrarFallo("excepcion-inesperada", error);
    return respuesta(500, {
      ...RESPUESTA_ERROR_INTERNO,
      // TODO: QUITAR diag tras diagnosticar
      diag: diagDe("excepcion-inesperada", error),
    });
  }
}

export async function GET(): Promise<Response> {
  await connection();
  const faltan = variablesFaltantes();
  return Response.json({ configurado: faltan.length === 0, faltan });
}

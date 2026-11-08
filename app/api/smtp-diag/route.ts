import nodemailer from "nodemailer";
import { connection } from "next/server";

// TODO: BORRAR esta ruta tras diagnosticar el ESOCKET de producción.
// Prueba la conexión SMTP real (DNS + TCP + TLS + AUTH) con tiempos cortos
// y devuelve solo el estado y el código/mensaje del error (nunca credenciales).

function limpiar(bruto: string): string {
  const v = bruto.trim().replace(/^["']+|["']+$/g, "");
  return v.replace(/[\r\n\t\u200b\u200c\u200d\ufeff]+/g, "");
}

export async function GET(): Promise<Response> {
  await connection();
  const host = limpiar(process.env.SMTP_HOST ?? "");
  const user = limpiar(process.env.SMTP_USER ?? "");
  const pass = limpiar(process.env.SMTP_PASS ?? "");
  const puertoEnv = Number(limpiar(process.env.SMTP_PORT ?? ""));

  const puertos = [...new Set([puertoEnv, puertoEnv === 465 ? 587 : 465])].filter(
    (p) => Number.isInteger(p) && p >= 1 && p <= 65535,
  );

  const resultados: Array<Record<string, unknown>> = [];
  for (const p of puertos.slice(0, 2)) {
    try {
      const t = nodemailer.createTransport({
        host,
        port: p,
        secure: p === 465,
        auth: { user, pass },
        connectionTimeout: 1800,
        greetingTimeout: 1500,
        socketTimeout: 3000,
      });
      await t.verify();
      resultados.push({ puerto: p, ok: true });
    } catch (error) {
      const e = error as Error & { code?: string };
      resultados.push({
        puerto: p,
        ok: false,
        name: e?.name ?? "",
        code: e?.code ?? "",
        message: String(e?.message ?? "").slice(0, 200),
      });
    }
  }

  return Response.json({
    hostDefinido: host !== "",
    puertoEntorno: Number.isInteger(puertoEnv) ? puertoEnv : "invalido",
    resultados,
  });
}

export interface SolicitudDatos {
  nombre: string;
  correo: string;
  servicio: string;
  proyecto: string;
  privacidad: boolean;
}

const TIMEOUT_MS = 15000;

/**
 * Envía la solicitud a la ruta API /api/contacto (SMTP con nodemailer).
 * Se corta a los 15 s con AbortController y devuelve ok:false en cualquier
 * fallo (red, timeout o respuesta no exitosa); el formulario conserva lo
 * que se escribió para poder reintentar.
 */
export async function enviarSolicitud(
  datos: SolicitudDatos,
  contactoAlt = "",
): Promise<{ ok: boolean }> {
  const controlador = new AbortController();
  const reloj = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  try {
    const respuesta = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre: datos.nombre,
        email: datos.correo,
        servicio: datos.servicio,
        mensaje: datos.proyecto,
        consentimiento: datos.privacidad,
        contacto_alt: contactoAlt,
      }),
      signal: controlador.signal,
    });
    const datosRespuesta = (await respuesta.json().catch(() => null)) as { ok?: boolean } | null;
    return { ok: respuesta.ok && datosRespuesta?.ok === true };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(reloj);
  }
}

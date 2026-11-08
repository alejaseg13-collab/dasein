export interface SolicitudDatos {
  nombre: string;
  correo: string;
  servicio: string;
  proyecto: string;
  privacidad: boolean;
}

const TIMEOUT_MS = 15000;

/**
 * Envía la solicitud a Netlify Forms (form-name "contacto") como
 * application/x-www-form-urlencoded al archivo estático /__forms.html, que es
 * el objetivo que Netlify reconoce (ver public/__forms.html). Se corta a los
 * 15 s con AbortController y devuelve ok:false en cualquier fallo (red,
 * timeout o respuesta no exitosa); el formulario conserva lo que se escribió
 * para poder reintentar.
 */
export async function enviarSolicitud(
  datos: SolicitudDatos,
  contactoAlt = "",
): Promise<{ ok: boolean }> {
  const controlador = new AbortController();
  const reloj = setTimeout(() => controlador.abort(), TIMEOUT_MS);
  try {
    const cuerpo = new URLSearchParams();
    cuerpo.set("form-name", "contacto");
    cuerpo.set("nombre", datos.nombre);
    cuerpo.set("correo", datos.correo);
    cuerpo.set("servicio", datos.servicio);
    cuerpo.set("proyecto", datos.proyecto);
    cuerpo.set("privacidad", datos.privacidad ? "on" : "");
    cuerpo.set("contacto_alt", contactoAlt);
    const respuesta = await fetch("/__forms.html", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: cuerpo.toString(),
      signal: controlador.signal,
    });
    return { ok: respuesta.ok };
  } catch {
    return { ok: false };
  } finally {
    clearTimeout(reloj);
  }
}

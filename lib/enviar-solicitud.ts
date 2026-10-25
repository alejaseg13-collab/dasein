export interface SolicitudDatos {
  nombre: string;
  correo: string;
  servicio: string;
  proyecto: string;
  privacidad: boolean;
}

/**
 * TODO: conectar con el servicio real de envío de correos
 * (PENDIENTE definir cuál, ver DESIGN.md — "Reglas técnicas").
 * Por ahora simula la espera de red (~1 s) y devuelve éxito.
 */
export async function enviarSolicitud(datos: SolicitudDatos): Promise<{ ok: boolean }> {
  void datos;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { ok: true };
}

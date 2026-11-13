/**
 * Headers para que el backend limite los intentos de login por la IP del navegador.
 *
 * La web llama a la API desde su servidor, así que la API vería la IP de este servidor (y Vercel
 * sobrescribe `X-Forwarded-For`). Se manda la IP del navegador en `X-Client-IP` junto con el
 * secreto compartido `CLIENT_IP_SECRET`, que la API usa para saber que el header es de fiar.
 */
export function clientIpHeaders(
  incoming: Headers,
  secret: string | undefined,
): Record<string, string> | undefined {
  if (!secret) return undefined
  // En Vercel, el primer valor de X-Forwarded-For es la IP del navegador.
  const ip =
    incoming.get("x-forwarded-for")?.split(",")[0]?.trim() || incoming.get("x-real-ip")?.trim()
  if (!ip) return undefined
  return { "X-Client-IP": ip, "X-Client-IP-Secret": secret }
}

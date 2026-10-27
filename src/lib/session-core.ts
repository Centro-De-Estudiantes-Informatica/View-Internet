import { sealData, unsealData } from "iron-session"
import { env } from "./env"

// Sin `server-only`: este módulo también lo usa `proxy.ts`.

export type Role = "ADMIN" | "ESTUDIANTE"

export interface Session {
  token: string
  userId: string
  role: Role
  fullName: string
  cedula: string
  mustChangePassword: boolean
  /** Vencimiento del token de la API, en milisegundos desde epoch. */
  expiresAt: number
}

export const SESSION_COOKIE = "vi_session"

export async function sealSession(session: Session): Promise<string> {
  const ttl = Math.max(60, Math.floor((session.expiresAt - Date.now()) / 1000))
  return sealData(session, { password: env().SESSION_SECRET, ttl })
}

/** Descifra la cookie. Devuelve `null` si falta, está alterada o venció. */
export async function unsealSession(value: string | undefined): Promise<Session | null> {
  if (!value) return null
  try {
    const session = await unsealData<Session>(value, { password: env().SESSION_SECRET })
    if (!session?.token || session.expiresAt <= Date.now()) return null
    return session
  } catch {
    return null
  }
}

export function homeFor(session: Pick<Session, "role" | "mustChangePassword">): string {
  if (session.mustChangePassword) return "/cambiar-clave"
  return session.role === "ADMIN" ? "/admin" : "/mi-cuenta"
}

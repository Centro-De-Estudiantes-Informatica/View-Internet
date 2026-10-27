import "server-only"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { connection } from "next/server"
import { SESSION_COOKIE, sealSession, unsealSession, type Session } from "./session-core"

export type { Role, Session } from "./session-core"

export async function getSession(): Promise<Session | null> {
  const store = await cookies()
  // La sesión se valida contra la hora actual: siempre en tiempo de petición.
  await connection()
  return unsealSession(store.get(SESSION_COOKIE)?.value)
}

/** Guarda la sesión. Solo en Server Actions o Route Handlers. */
export async function saveSession(session: Session): Promise<void> {
  const store = await cookies()
  store.set(SESSION_COOKIE, await sealSession(session), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Math.max(60, Math.floor((session.expiresAt - Date.now()) / 1000)),
  })
}

/** Borra la sesión. Solo en Server Actions o Route Handlers. */
export async function clearSession(): Promise<void> {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
}

/** Exige una sesión con la contraseña ya cambiada. */
export async function requireSession(): Promise<Session> {
  const session = await getSession()
  if (!session) redirect("/login")
  if (session.mustChangePassword) redirect("/cambiar-clave")
  return session
}

/** Exige el rol de administrador. El backend lo vuelve a validar en cada llamada. */
export async function requireAdmin(): Promise<Session> {
  const session = await requireSession()
  if (session.role !== "ADMIN") redirect("/mi-cuenta")
  return session
}

/** Nombre, cédula y rol de la sesión, sin el token. */
export async function getSessionUser() {
  const session = await getSession()
  return session ? { fullName: session.fullName, cedula: session.cedula, role: session.role } : null
}

import { type NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE, homeFor, unsealSession } from "@/lib/session-core"

/**
 * Chequeo optimista de rutas según la cookie de sesión. La autorización real
 * la hace la API en cada llamada y `requireAdmin()` en cada página.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const session = await unsealSession(request.cookies.get(SESSION_COOKIE)?.value)
  const to = (path: string) => NextResponse.redirect(new URL(path, request.url))

  if (pathname === "/login") return session ? to(homeFor(session)) : NextResponse.next()
  if (!session) return to("/login")
  if (pathname === "/") return to(homeFor(session))

  if (session.mustChangePassword) {
    return pathname === "/cambiar-clave" ? NextResponse.next() : to("/cambiar-clave")
  }
  if (pathname === "/cambiar-clave") return to(homeFor(session))
  if (pathname.startsWith("/admin") && session.role !== "ADMIN") return to("/mi-cuenta")
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/login", "/cambiar-clave", "/admin/:path*", "/mi-cuenta/:path*"],
}

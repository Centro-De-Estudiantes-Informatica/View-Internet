import { type NextRequest, NextResponse } from "next/server"
import { SESSION_COOKIE } from "@/lib/session-core"

const REASONS = new Set(["expirada", "desactivada"])

/** Cierra la sesión desde un Server Component (que no puede borrar cookies). */
export function GET(request: NextRequest) {
  const reason = request.nextUrl.searchParams.get("motivo")
  const target = new URL("/login", request.url)
  if (reason && REASONS.has(reason)) target.searchParams.set("motivo", reason)
  const response = NextResponse.redirect(target)
  response.cookies.delete(SESSION_COOKIE)
  return response
}

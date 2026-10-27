import { type NextRequest, NextResponse } from "next/server"
import { ApiError, api, call } from "@/lib/api/client"

/** Redirige a la URL firmada (5 min) de la captura del pago móvil. Solo administradores. */
export async function GET(_request: NextRequest, ctx: RouteContext<"/admin/pagos/[id]/captura">) {
  const { id } = await ctx.params
  try {
    const client = await api()
    const { url } = await call(client.GET("/payments/{id}/receipt", { params: { path: { id } } }))
    return NextResponse.redirect(url)
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    return new NextResponse(error.userMessage, {
      status: error.status,
      headers: { "content-type": "text/plain; charset=utf-8" },
    })
  }
}

import { getResponse } from "msw"
import { type NextRequest, NextResponse } from "next/server"
import { createHandlers } from "@/mocks/handlers"

// API simulada servida por la propia app cuando API_MOCKING=enabled.
// Configura API_BASE_URL=http://localhost:3001/api/mock para usarla.
const MOCK_ORIGIN = "http://mock.local"
const handlers = createHandlers(MOCK_ORIGIN)

async function handle(request: NextRequest, ctx: RouteContext<"/api/mock/[...path]">) {
  if (process.env.API_MOCKING !== "enabled") return new NextResponse(null, { status: 404 })
  const { path } = await ctx.params
  const url = new URL(`/${path.join("/")}${request.nextUrl.search}`, MOCK_ORIGIN)
  const hasBody = !["GET", "HEAD"].includes(request.method)
  const forwarded = new Request(url, {
    method: request.method,
    headers: request.headers,
    body: hasBody ? await request.arrayBuffer() : undefined,
  })
  const response = await getResponse(handlers, forwarded)
  return (
    response ??
    NextResponse.json({ code: "NOT_FOUND", message: "Ruta simulada inexistente" }, { status: 404 })
  )
}

export { handle as GET, handle as POST, handle as PUT, handle as PATCH, handle as DELETE }

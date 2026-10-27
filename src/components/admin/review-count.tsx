import { api, call } from "@/lib/api/client"
import { getSession } from "@/lib/session"

/** Cantidad de pagos móviles en revisión. Va dentro de un `<Suspense>`. */
export async function ReviewCountBadge() {
  const session = await getSession()
  if (session?.role !== "ADMIN") return null
  const client = await api()
  const page = await call(
    client.GET("/payments", { params: { query: { status: "EN_REVISION", pageSize: 1 } } }),
  ).catch(() => null)
  if (!page?.total) return null
  return (
    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-partial px-1.5 text-[11px] font-semibold text-background">
      <span className="sr-only">, </span>
      {page.total}
      <span className="sr-only"> por revisar</span>
    </span>
  )
}

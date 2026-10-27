import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

/** Paginación con enlaces que conservan los demás filtros. */
export function Pagination({
  page,
  pageSize,
  total,
  pathname,
  params,
}: {
  page: number
  pageSize: number
  total: number
  pathname: string
  params: Record<string, string | undefined>
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize))
  if (pages <= 1) return null
  const href = (target: number) => {
    const query = new URLSearchParams()
    for (const [key, value] of Object.entries(params))
      if (value && key !== "page") query.set(key, value)
    if (target > 1) query.set("page", String(target))
    const qs = query.toString()
    return qs ? `${pathname}?${qs}` : pathname
  }
  const linkClass =
    "inline-flex h-11 items-center gap-1 rounded-[10px] border bg-card px-3.5 text-sm hover:bg-muted"
  return (
    <nav aria-label="Paginación" className="flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={href(page - 1)} className={linkClass}>
          <ChevronLeft className="size-4" aria-hidden="true" />
          Anterior
        </Link>
      ) : (
        <span />
      )}
      <span className="text-sm text-muted-foreground">
        Página {page} de {pages}
      </span>
      {page < pages ? (
        <Link href={href(page + 1)} className={linkClass}>
          Siguiente
          <ChevronRight className="size-4" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  )
}

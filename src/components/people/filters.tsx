"use client"

import { Search } from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef, useState, useTransition } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const selectClass =
  "h-11 w-full rounded-[10px] border border-field-border bg-field px-3 text-[15px] text-foreground"

/** Buscador (espera 300 ms) y filtros; todo queda en la URL para poder compartirlo. */
export function PeopleFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [query, setQuery] = useState(params.get("q") ?? "")
  const [pending, startTransition] = useTransition()
  const first = useRef(true)

  function update(changes: Record<string, string>) {
    const next = new URLSearchParams(params)
    for (const [key, value] of Object.entries(changes)) {
      if (value) next.set(key, value)
      else next.delete(key)
    }
    next.delete("page")
    startTransition(() => router.replace(`${pathname}?${next}`, { scroll: false }))
  }

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const timer = setTimeout(() => update({ q: query.trim() }), 300)
    return () => clearTimeout(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  return (
    <div
      role="search"
      aria-busy={pending}
      className="flex flex-wrap items-end gap-3 rounded-[14px] border bg-card p-4"
    >
      <div className="flex min-w-0 flex-[3_1_280px] flex-col gap-1.5">
        <Label htmlFor="q" className="text-[13px] font-normal text-muted-foreground">
          Buscar
        </Label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />
          <Input
            id="q"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="28123456, V-28.123.456 o “jose”"
            className="h-11 rounded-[10px] border-field-border bg-field pl-10 text-[15px] md:text-[15px]"
          />
        </div>
      </div>
      <div className="flex min-w-0 flex-[1_1_160px] flex-col gap-1.5">
        <Label htmlFor="rol" className="text-[13px] font-normal text-muted-foreground">
          Rol
        </Label>
        <select
          id="rol"
          className={selectClass}
          value={params.get("rol") ?? ""}
          onChange={(e) => update({ rol: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="ESTUDIANTE">Estudiante</option>
          <option value="ADMIN">Administrador</option>
        </select>
      </div>
      <div className="flex min-w-0 flex-[1_1_160px] flex-col gap-1.5">
        <Label htmlFor="estado" className="text-[13px] font-normal text-muted-foreground">
          Estado del mes
        </Label>
        <select
          id="estado"
          className={selectClass}
          value={params.get("estado") ?? ""}
          onChange={(e) => update({ estado: e.target.value })}
        >
          <option value="">Todos</option>
          <option value="AL_DIA">Al día</option>
          <option value="PARCIAL">Parcial</option>
          <option value="EN_REVISION">En revisión</option>
          <option value="PENDIENTE">Pendiente</option>
        </select>
      </div>
    </div>
  )
}

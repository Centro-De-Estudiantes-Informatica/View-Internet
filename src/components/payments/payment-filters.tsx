"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"
import { Label } from "@/components/ui/label"
import { formatPeriodo } from "@/lib/format"

const selectClass =
  "h-11 w-full rounded-[10px] border border-field-border bg-field px-3 text-[15px] text-foreground"

export function PaymentFilters({ periods }: { periods: string[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const params = useSearchParams()
  const [pending, startTransition] = useTransition()

  function update(key: string, value: string) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    next.delete("page")
    startTransition(() => router.replace(`${pathname}?${next}`, { scroll: false }))
  }

  const select = (id: string, label: string, options: [string, string][]) => (
    <div className="flex min-w-0 flex-[1_1_180px] flex-col gap-1.5">
      <Label htmlFor={id} className="text-[13px] font-normal text-muted-foreground">
        {label}
      </Label>
      <select
        id={id}
        className={selectClass}
        value={params.get(id) ?? ""}
        onChange={(e) => update(id, e.target.value)}
      >
        <option value="">Todos</option>
        {options.map(([value, text]) => (
          <option key={value} value={value}>
            {text}
          </option>
        ))}
      </select>
    </div>
  )

  return (
    <div
      aria-busy={pending}
      className="flex flex-wrap items-end gap-3 rounded-[14px] border bg-card p-4"
    >
      {select("estado", "Estado", [
        ["EN_REVISION", "En revisión"],
        ["APROBADO", "Aprobado"],
        ["RECHAZADO", "Rechazado"],
        ["ANULADO", "Anulado"],
      ])}
      {select(
        "periodo",
        "Mes",
        periods.map((p) => [p, formatPeriodo(p)]),
      )}
      {select("metodo", "Método", [
        ["EFECTIVO", "Efectivo"],
        ["PAGO_MOVIL", "Pago móvil"],
      ])}
      {select("moneda", "Moneda", [
        ["USD", "USD"],
        ["VES", "VES"],
        ["COP", "COP"],
      ])}
    </div>
  )
}

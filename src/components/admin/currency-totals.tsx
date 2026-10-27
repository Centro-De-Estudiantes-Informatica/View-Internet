import { TriangleAlert } from "lucide-react"
import Link from "next/link"
import type { BillingCurrent, Summary } from "@/lib/api/types"
import { formatDate, formatMoney, formatRate } from "@/lib/format"

const METHODS: Record<"USD" | "VES" | "COP", string> = {
  USD: "efectivo",
  VES: "pago móvil y efectivo",
  COP: "efectivo",
}

function RateLabel({
  currency,
  rate,
}: {
  currency: "VES" | "COP"
  rate: BillingCurrent["rates"]["VES"]
}) {
  const name = currency === "VES" ? "Bs" : "COP"
  if (!rate) {
    return (
      <Link
        href="/admin/ajustes"
        className="inline-flex items-center gap-1 font-medium text-partial hover:underline"
      >
        <TriangleAlert className="size-3.5" aria-hidden="true" />
        Sin tasa {name} · cargar
      </Link>
    )
  }
  if (rate.stale) {
    return (
      <Link
        href="/admin/ajustes"
        className="inline-flex items-center gap-1 rounded-md bg-partial-soft px-1.5 py-0.5 font-medium text-partial hover:underline"
      >
        <TriangleAlert className="size-3.5" aria-hidden="true" />
        Tasa {name} del {formatDate(rate.effectiveDate).slice(0, 5)} · actualizar
      </Link>
    )
  }
  return <span className="tabular text-foreground/85">{formatRate(rate.ratePerUsd, currency)}</span>
}

export function CurrencyTotals({
  summary,
  billing,
}: {
  summary: Summary
  billing: BillingCurrent
}) {
  return (
    <section aria-labelledby="monedas-t" className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="monedas-t" className="text-lg font-semibold">
          Recaudado por moneda
        </h2>
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-muted-foreground">
          Tasas del día: <RateLabel currency="VES" rate={billing.rates.VES} /> ·{" "}
          <RateLabel currency="COP" rate={billing.rates.COP} />
          <Link href="/admin/ajustes" className="text-primary hover:underline">
            editar
          </Link>
        </p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
        {(["USD", "VES", "COP"] as const).map((currency) => {
          const item = summary.collected[currency]
          return (
            <div
              key={currency}
              className="flex items-center gap-4 rounded-[14px] border bg-card px-5 py-4.5"
            >
              <span className="tabular flex size-12 shrink-0 items-center justify-center rounded-xl bg-accent text-[13px] font-medium text-accent-foreground">
                {currency}
              </span>
              <div className="flex min-w-0 flex-col gap-0.5">
                <span className="tabular truncate text-xl text-foreground">
                  {formatMoney(item.amount, currency)}
                </span>
                <span className="text-[13px] text-muted-foreground">
                  {currency === "USD"
                    ? `${item.count} ${item.count === 1 ? "pago" : "pagos"} · ${METHODS[currency]}`
                    : `≈ ${formatMoney(item.amountUsd, "USD")} · ${item.count} ${item.count === 1 ? "pago" : "pagos"}`}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

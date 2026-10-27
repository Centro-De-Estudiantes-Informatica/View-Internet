import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHeader, Panel, PanelTitle } from "@/components/card"
import { FeeForm, RateForm } from "@/components/settings-forms"
import { CardSkeleton } from "@/components/skeletons"
import { api, call } from "@/lib/api/client"
import type { Rate } from "@/lib/api/types"
import { formatDate, formatMoney, formatPeriodo, formatRate, todayIso } from "@/lib/format"
import { requireAdmin } from "@/lib/session"

export const metadata: Metadata = { title: "Cuota y tasas" }

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Cuota y tasas"
        description="La cuota se cobra en dólares; las tasas convierten los pagos en bolívares y pesos."
      />
      <Suspense fallback={<CardSkeleton />}>
        <Settings />
      </Suspense>
    </div>
  )
}

function RateHistory({ rates, currency }: { rates: Rate[]; currency: "VES" | "COP" }) {
  const list = rates.filter((r) => r.currency === currency)
  if (list.length === 0)
    return <p className="text-sm text-partial">Todavía no hay tasas cargadas.</p>
  return (
    <ul className="flex flex-col">
      {list.map((r, i) => (
        <li
          key={r.id}
          className="flex items-center justify-between gap-3 border-b py-2.5 text-sm last:border-b-0"
        >
          <span className="text-muted-foreground">
            {formatDate(r.effectiveDate)}
            {i === 0 && (
              <span className="ml-2 rounded-full bg-ok-soft px-2 py-0.5 text-xs font-medium text-ok">
                vigente
              </span>
            )}
          </span>
          <span className="tabular text-foreground">{formatRate(r.ratePerUsd, currency)}</span>
        </li>
      ))}
    </ul>
  )
}

async function Settings() {
  await requireAdmin()
  const client = await api()
  const [billing, ves, cop] = await Promise.all([
    call(client.GET("/billing/current")),
    call(client.GET("/billing/rates", { params: { query: { currency: "VES", limit: 7 } } })),
    call(client.GET("/billing/rates", { params: { query: { currency: "COP", limit: 7 } } })),
  ])
  const today = todayIso()

  return (
    <div className="flex flex-col gap-4">
      <Panel aria-labelledby="fee-t">
        <PanelTitle
          id="fee-t"
          aside={`${formatPeriodo(billing.periodo)}: ${formatMoney(billing.feeUsd, "USD")}`}
        >
          Cuota mensual
        </PanelTitle>
        <FeeForm currentFee={Number(billing.feeUsd).toFixed(2)} />
      </Panel>
      <div className="flex flex-wrap gap-4">
        {(["VES", "COP"] as const).map((currency) => {
          const current = billing.rates[currency]
          return (
            <Panel key={currency} aria-labelledby={`t-${currency}`} className="flex-[1_1_360px]">
              <PanelTitle
                id={`t-${currency}`}
                aside={
                  current?.stale ? (
                    <span className="font-medium text-partial">Desactualizada</span>
                  ) : undefined
                }
              >
                {currency === "VES" ? "Bolívares (VES)" : "Pesos colombianos (COP)"}
              </PanelTitle>
              <RateForm currency={currency} today={today} />
              <RateHistory rates={currency === "VES" ? ves : cop} currency={currency} />
            </Panel>
          )
        })}
      </div>
    </div>
  )
}

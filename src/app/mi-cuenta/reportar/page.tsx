import { ChevronLeft } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { CardSkeleton } from "@/components/skeletons"
import { api, call } from "@/lib/api/client"
import { env } from "@/lib/env"
import { formatAmountInput, formatDate, formatMoney, formatRate, todayIso } from "@/lib/format"
import { requireSession } from "@/lib/session"
import { ReportForm } from "./report-form"

export const metadata: Metadata = { title: "Reportar pago móvil" }

export default function ReportPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1">
        <Link
          href="/mi-cuenta"
          aria-label="Volver"
          className="flex size-11 items-center justify-center rounded-lg hover:bg-muted"
        >
          <ChevronLeft className="size-5" aria-hidden="true" />
        </Link>
        <h1 className="text-xl font-semibold">Reportar pago móvil</h1>
      </div>
      <Suspense fallback={<CardSkeleton />}>
        <Report />
      </Suspense>
    </div>
  )
}

function Datum({ label, value, mono }: { label: string; value?: string; mono?: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className={mono ? "tabular text-sm text-foreground" : "text-sm text-foreground"}>
        {value || <span className="text-muted-foreground">Por configurar</span>}
      </dd>
    </div>
  )
}

async function Report() {
  await requireSession()
  const client = await api()
  const [billing, status] = await Promise.all([
    call(client.GET("/billing/current")),
    call(client.GET("/me/status")),
  ])
  const config = env()
  const rate = billing.rates.VES
  // Sugerir lo que falta del mes más antiguo adeudado; si no, la cuota.
  const owed = status.owedPeriods[0]
  const pendingUsd = owed ? Number(owed.balanceUsd) : Number(billing.feeUsd)
  const suggestedVes = rate ? pendingUsd * Number(rate.ratePerUsd) : null

  return (
    <div className="flex flex-col gap-4">
      <section
        aria-labelledby="datos-t"
        className="flex flex-col gap-3 rounded-2xl border border-primary/35 bg-card p-4"
      >
        <h2 id="datos-t" className="text-[13px] font-normal text-muted-foreground">
          Paga a la sede con estos datos
        </h2>
        <dl className="grid grid-cols-2 gap-x-3 gap-y-2.5">
          <Datum label="Banco" value={config.SEDE_PAGO_MOVIL_BANCO} />
          <Datum label="Teléfono" value={config.SEDE_PAGO_MOVIL_TELEFONO} mono />
          <Datum label="Cédula / RIF" value={config.SEDE_PAGO_MOVIL_DOCUMENTO} mono />
          <div className="flex flex-col gap-0.5">
            <dt className="text-xs text-muted-foreground">Monto hoy</dt>
            <dd className="tabular text-sm text-primary">
              {suggestedVes ? formatMoney(suggestedVes, "VES") : "—"}
            </dd>
          </div>
        </dl>
        <p className="text-xs text-muted-foreground">
          {rate
            ? `${formatMoney(pendingUsd, "USD")} a tasa ${formatRate(rate.ratePerUsd, "VES")} del ${formatDate(rate.effectiveDate)}`
            : "La tasa del día todavía no está cargada; consulta el monto con el administrador."}
        </p>
      </section>
      <ReportForm
        suggestedAmount={suggestedVes ? formatAmountInput(suggestedVes, "VES") : ""}
        periodo={owed?.periodo ?? billing.periodo}
        today={todayIso()}
      />
    </div>
  )
}

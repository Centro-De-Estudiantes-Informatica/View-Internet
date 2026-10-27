import Link from "next/link"
import type { Summary } from "@/lib/api/types"
import { formatMoney } from "@/lib/format"
import { cn } from "@/lib/utils"

function Kpi({
  label,
  value,
  children,
  highlight,
}: {
  label: string
  value: React.ReactNode
  children?: React.ReactNode
  highlight?: boolean
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-2.5 rounded-[14px] border bg-card p-5",
        highlight && "border-partial/40",
      )}
    >
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="tabular text-[28px] leading-none font-medium text-foreground sm:text-[30px]">
        {value}
      </span>
      {children}
    </div>
  )
}

export function Kpis({ summary }: { summary: Summary }) {
  const percent = Math.min(100, Number(summary.percentCollected))
  const { students } = summary
  const pendingCount = students.total - students.AL_DIA
  return (
    <section
      aria-label="Indicadores del mes"
      className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4"
    >
      <Kpi label="Recaudado (equiv. USD)" value={formatMoney(summary.totalUsd, "USD")}>
        <span className="text-[13px] text-muted-foreground">Solo pagos aprobados</span>
      </Kpi>
      <Kpi label="Esperado del mes" value={formatMoney(summary.expectedUsd, "USD")}>
        <div className="flex flex-col gap-1.5">
          <div
            className="h-2 overflow-hidden rounded-full bg-muted"
            role="progressbar"
            aria-label="Porcentaje cobrado"
            aria-valuenow={Math.round(percent)}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="h-full rounded-full bg-primary" style={{ width: `${percent}%` }} />
          </div>
          <span className="text-[13px] text-muted-foreground">
            {Math.round(percent)}% cobrado · {students.total} × {formatMoney(summary.feeUsd, "USD")}
          </span>
        </div>
      </Kpi>
      <Kpi
        label="Estudiantes al día"
        value={
          <>
            {students.AL_DIA}
            <span className="text-lg text-muted-foreground"> / {students.total}</span>
          </>
        }
      >
        <Link
          href="/admin/personas?estado=PENDIENTE"
          className="text-[13px] text-primary hover:underline"
        >
          {pendingCount} sin completar · ver lista
        </Link>
      </Kpi>
      <Kpi
        label="Pagos móviles por revisar"
        value={
          <span className={summary.inReview.total ? "text-partial" : undefined}>
            {summary.inReview.total}
          </span>
        }
        highlight={summary.inReview.total > 0}
      >
        <Link
          href="/admin/pagos?estado=EN_REVISION"
          className="text-[13px] text-primary hover:underline"
        >
          {summary.inReview.total ? "Revisar ahora" : "Nada pendiente"}
        </Link>
      </Kpi>
    </section>
  )
}

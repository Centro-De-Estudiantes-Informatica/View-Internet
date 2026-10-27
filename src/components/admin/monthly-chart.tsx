import { Panel, PanelTitle } from "@/components/card"
import type { MonthlyPoint } from "@/lib/api/types"
import { formatPeriodo, formatPeriodoShort } from "@/lib/format"
import { cn } from "@/lib/utils"

/** Barras del recaudado mensual (equivalente USD); el último mes es el actual. */
export function MonthlyChart({
  points,
  expectedUsd,
}: {
  points: MonthlyPoint[]
  expectedUsd: string
}) {
  const values = points.map((p) => Number(p.totalUsd))
  const max = Math.max(Number(expectedUsd), ...values, 1)
  const description = points
    .map((p) => `${formatPeriodo(p.periodo)}: ${Math.round(Number(p.totalUsd))} dólares`)
    .join("; ")

  return (
    <Panel aria-labelledby="chart-t" className="flex-[3_1_420px]">
      <PanelTitle id="chart-t" aside="equivalente en USD">
        Ingresos por mes
      </PanelTitle>
      <div
        role="img"
        aria-label={`Ingresos mensuales. ${description}`}
        className="flex flex-col gap-3"
      >
        <div className="flex h-56 items-end gap-3 border-b border-input pt-6 sm:gap-4">
          {points.map((point, i) => {
            const current = i === points.length - 1
            const value = values[i]!
            return (
              <div
                key={point.periodo}
                className="flex h-full flex-1 flex-col items-center justify-end gap-1.5"
              >
                <span
                  className={cn(
                    "tabular text-xs",
                    current ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {Math.round(value)}
                </span>
                <div
                  className={cn(
                    "w-full max-w-12 rounded-t-md",
                    current ? "bg-primary" : "bg-chart-muted",
                  )}
                  style={{ height: `${Math.max(2, (value / max) * 100)}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="flex gap-3 sm:gap-4" aria-hidden="true">
          {points.map((point, i) => (
            <span
              key={point.periodo}
              className={cn(
                "flex-1 text-center text-[13px]",
                i === points.length - 1 ? "font-medium text-foreground" : "text-muted-foreground",
              )}
            >
              {formatPeriodoShort(point.periodo)}
            </span>
          ))}
        </div>
      </div>
    </Panel>
  )
}

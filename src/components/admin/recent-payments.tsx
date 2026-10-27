import Link from "next/link"
import { Panel, PanelTitle } from "@/components/card"
import type { RecentPayment } from "@/lib/api/types"
import { formatMoney } from "@/lib/format"

export const METHOD_LABELS = { EFECTIVO: "Efectivo", PAGO_MOVIL: "Pago móvil" } as const

export function RecentPayments({ payments }: { payments: RecentPayment[] }) {
  return (
    <Panel aria-labelledby="ult-t" className="flex-[2_1_300px] gap-3">
      <PanelTitle
        id="ult-t"
        aside={
          <Link href="/admin/pagos?estado=APROBADO" className="text-primary hover:underline">
            ver todos
          </Link>
        }
      >
        Últimos pagos aprobados
      </PanelTitle>
      {payments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Todavía no hay pagos aprobados.
        </p>
      ) : (
        <ul className="flex flex-col">
          {payments.map((p) => (
            <li
              key={p.id}
              className="flex items-center justify-between gap-3 border-b py-3 last:border-b-0"
            >
              <div className="flex min-w-0 flex-col gap-0.5">
                <Link
                  href={`/admin/personas/${p.user.id}`}
                  className="truncate text-[15px] text-foreground hover:underline"
                >
                  {p.user.fullName}
                </Link>
                <span className="tabular text-xs text-muted-foreground">
                  {p.user.cedula} · {METHOD_LABELS[p.method]}
                </span>
              </div>
              <span className="tabular text-sm whitespace-nowrap text-foreground">
                {formatMoney(p.amount, p.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  )
}

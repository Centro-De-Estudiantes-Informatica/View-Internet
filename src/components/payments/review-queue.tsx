import Link from "next/link"
import { Panel, PanelTitle } from "@/components/card"
import type { Payment } from "@/lib/api/types"
import { bankName } from "@/lib/banks"
import { formatDate, formatMoney, formatPeriodo } from "@/lib/format"
import { ReviewActions } from "./review-actions"

export function ReceiptLink({ payment }: { payment: Payment }) {
  if (!payment.hasReceipt) return <span className="text-muted-foreground">Sin captura</span>
  return (
    <a
      href={`/admin/pagos/${payment.id}/captura`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary hover:underline"
    >
      Ver captura
      <span className="sr-only"> de {payment.user.fullName} (se abre en otra pestaña)</span>
    </a>
  )
}

/** Pagos móviles `EN_REVISION` con aprobar/rechazar. */
export function ReviewQueue({ payments, total }: { payments: Payment[]; total: number }) {
  return (
    <Panel id="revisar" aria-labelledby="rev-t" className="gap-3">
      <PanelTitle
        id="rev-t"
        aside="Reportados por los estudiantes · verifica la referencia en el banco"
      >
        Pagos móviles por revisar
      </PanelTitle>
      {payments.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          No hay pagos móviles por revisar.
        </p>
      ) : (
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-sm">
            <thead>
              <tr className="text-left text-[13px] text-muted-foreground">
                {["Estudiante", "Mes", "Referencia", "Banco origen", "Monto", "Comprobante"].map(
                  (h) => (
                    <th
                      key={h}
                      scope="col"
                      className="border-b border-input px-3 py-2.5 font-medium"
                    >
                      {h}
                    </th>
                  ),
                )}
                <th
                  scope="col"
                  className="border-b border-input px-3 py-2.5 text-right font-medium"
                >
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className="border-b last:border-b-0">
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <Link
                        href={`/admin/personas/${p.user.id}`}
                        className="text-foreground hover:underline"
                      >
                        {p.user.fullName}
                      </Link>
                      <span className="tabular text-xs text-muted-foreground">{p.user.cedula}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-foreground/85">{formatPeriodo(p.periodo)}</td>
                  <td className="tabular px-3 py-3 text-foreground">{p.reference ?? "—"}</td>
                  <td className="px-3 py-3 text-foreground/85">{bankName(p.bank)}</td>
                  <td className="px-3 py-3">
                    <div className="flex flex-col">
                      <span className="tabular text-foreground">
                        {formatMoney(p.amount, p.currency)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        ≈ {formatMoney(p.amountUsd, "USD")} · {formatDate(p.paidAt)}
                      </span>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <ReceiptLink payment={p} />
                  </td>
                  <td className="px-3 py-3">
                    <ReviewActions payment={p} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {total > payments.length && (
        <Link
          href="/admin/pagos?estado=EN_REVISION"
          className="self-start text-sm text-primary hover:underline"
        >
          Ver los {total} pagos por revisar
        </Link>
      )}
    </Panel>
  )
}

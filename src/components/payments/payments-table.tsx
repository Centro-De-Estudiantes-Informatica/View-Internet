import Link from "next/link"
import { METHOD_LABELS } from "@/components/admin/recent-payments"
import { PaymentStatusBadge } from "@/components/status-badge"
import type { Payment } from "@/lib/api/types"
import { bankName } from "@/lib/banks"
import { formatDate, formatMoney, formatPeriodo } from "@/lib/format"
import { cn } from "@/lib/utils"
import { PaymentRowActions } from "./payment-row-actions"
import { ReceiptLink } from "./review-queue"

function Note({ payment }: { payment: Payment }) {
  const text =
    payment.status === "ANULADO"
      ? `Anulado por ${payment.voidedBy ?? "—"}: ${payment.voidReason ?? ""}`
      : payment.status === "RECHAZADO"
        ? `Rechazado: ${payment.reviewNote ?? ""}`
        : payment.note
  if (!text) return null
  return <span className="text-xs text-muted-foreground">{text}</span>
}

/** Pagos con estado y acciones. `showStudent` agrega la columna del estudiante. */
export function PaymentsTable({
  payments,
  showStudent = true,
}: {
  payments: Payment[]
  showStudent?: boolean
}) {
  if (payments.length === 0) {
    return (
      <p className="rounded-[14px] border bg-card px-5 py-10 text-center text-[15px] text-muted-foreground">
        No hay pagos con estos filtros.
      </p>
    )
  }
  return (
    <div className="relative overflow-x-auto rounded-[14px] border bg-card">
      <table className="w-full min-w-[860px] border-collapse text-sm">
        <thead>
          <tr className="text-left text-[13px] text-muted-foreground">
            {showStudent && (
              <th scope="col" className="border-b border-input px-4 py-3 font-medium">
                Estudiante
              </th>
            )}
            <th scope="col" className="border-b border-input px-3 py-3 font-medium">
              Mes
            </th>
            <th scope="col" className="border-b border-input px-3 py-3 font-medium">
              Método
            </th>
            <th scope="col" className="border-b border-input px-3 py-3 font-medium">
              Monto
            </th>
            <th scope="col" className="border-b border-input px-3 py-3 font-medium">
              Fecha
            </th>
            <th scope="col" className="border-b border-input px-3 py-3 font-medium">
              Estado
            </th>
            <th scope="col" className="border-b border-input px-4 py-3 text-right font-medium">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => {
            const struck = p.status === "ANULADO" || p.status === "RECHAZADO"
            return (
              <tr key={p.id} className="border-b align-top last:border-b-0">
                {showStudent && (
                  <td className="px-4 py-3">
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
                )}
                <td className="px-3 py-3 whitespace-nowrap text-foreground/85">
                  {formatPeriodo(p.periodo)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col">
                    <span className="text-foreground/85">{METHOD_LABELS[p.method]}</span>
                    {p.method === "PAGO_MOVIL" && (
                      <span className="text-xs text-muted-foreground">
                        Ref. <span className="tabular">{p.reference}</span> · {bankName(p.bank)} ·{" "}
                        <ReceiptLink payment={p} />
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col">
                    <span
                      className={cn(
                        "tabular whitespace-nowrap text-foreground",
                        struck && "text-muted-foreground line-through",
                      )}
                    >
                      {formatMoney(p.amount, p.currency)}
                    </span>
                    {p.currency !== "USD" && (
                      <span className="text-xs text-muted-foreground">
                        ≈ {formatMoney(p.amountUsd, "USD")}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-3 py-3 whitespace-nowrap text-foreground/85">
                  {formatDate(p.paidAt)}
                </td>
                <td className="px-3 py-3">
                  <div className="flex max-w-56 flex-col gap-1">
                    <PaymentStatusBadge status={p.status} className="self-start" />
                    <Note payment={p} />
                  </div>
                </td>
                <td className="px-4 py-3">
                  <PaymentRowActions payment={p} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

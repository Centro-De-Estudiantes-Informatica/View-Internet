"use client"

import { Button } from "@/components/ui/button"
import { voidPayment } from "@/lib/actions/payments"
import type { Payment } from "@/lib/api/types"
import { formatMoney, formatPeriodo } from "@/lib/format"
import { ReasonDialog } from "./reason-dialog"
import { ReviewActions } from "./review-actions"

/** Aprobar/rechazar si está en revisión; anular si está aprobado. Nunca borrar. */
export function PaymentRowActions({ payment }: { payment: Payment }) {
  if (payment.status === "EN_REVISION") return <ReviewActions payment={payment} />
  if (payment.status !== "APROBADO") return null
  return (
    <div className="flex justify-end">
      <ReasonDialog
        trigger={
          <Button variant="outline" className="h-10">
            Anular
          </Button>
        }
        title="Anular pago"
        description={
          <>
            {formatMoney(payment.amount, payment.currency)} de {payment.user.fullName} por{" "}
            {formatPeriodo(payment.periodo)}. El pago quedará tachado y dejará de contar en los
            totales. No se puede deshacer.
          </>
        }
        confirmLabel="Anular pago"
        placeholder="Ej.: Registrado al estudiante equivocado"
        onConfirm={(reason) => voidPayment(payment.id, reason)}
      />
    </div>
  )
}

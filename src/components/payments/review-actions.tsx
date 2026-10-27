"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { approvePayment, rejectPayment } from "@/lib/actions/payments"
import type { Payment } from "@/lib/api/types"
import { formatMoney } from "@/lib/format"
import { ReasonDialog } from "./reason-dialog"

export function ReviewActions({ payment }: { payment: Payment }) {
  const [pending, startTransition] = useTransition()
  const who = `${payment.user.fullName} (ref. ${payment.reference ?? "—"})`

  function approve() {
    startTransition(async () => {
      const result = await approvePayment(payment.id)
      if (result?.ok) toast.success(`${result.message}: ${who}`)
      else if (result) toast.error(result.message)
    })
  }

  return (
    <div className="flex justify-end gap-2">
      <ReasonDialog
        trigger={
          <Button variant="outline" className="h-10 text-due" disabled={pending}>
            Rechazar
          </Button>
        }
        title="Rechazar pago móvil"
        description={
          <>
            {who} por {formatMoney(payment.amount, payment.currency)}. El estudiante verá el motivo
            en su historial.
          </>
        }
        confirmLabel="Rechazar pago"
        placeholder="Ej.: La referencia no aparece en el banco"
        onConfirm={(reason) => rejectPayment(payment.id, reason)}
      />
      <Button
        className="h-10 bg-ok font-semibold text-background hover:bg-ok/85"
        onClick={approve}
        disabled={pending}
      >
        {pending ? "Aprobando…" : "Aprobar"}
      </Button>
    </div>
  )
}

"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { Field, FormError, fieldClass } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { registerCashPayment } from "@/lib/actions/payments"
import type { StudentOption } from "@/lib/actions/users"
import type { BillingCurrent, Payment } from "@/lib/api/types"
import type { ActionResult } from "@/lib/errors"
import {
  type Currency,
  formatAmountInput,
  formatDate,
  formatMoney,
  formatPeriodo,
  formatRate,
  shiftPeriodo,
} from "@/lib/format"
import { cn } from "@/lib/utils"
import { StudentPicker } from "./student-picker"

const CURRENCIES: { code: Currency; label: string; symbol: string }[] = [
  { code: "USD", label: "USD · $", symbol: "$" },
  { code: "VES", label: "VES · Bs", symbol: "Bs" },
  { code: "COP", label: "COP · $", symbol: "COP" },
]

function suggested(billing: BillingCurrent, currency: Currency): string {
  const fee = billing.fee[currency]
  return fee ? formatAmountInput(fee, currency) : ""
}

function Equivalence({ billing, currency }: { billing: BillingCurrent; currency: Currency }) {
  const fee = formatMoney(billing.feeUsd, "USD")
  if (currency === "USD") return <>Cuota mensual: {fee}</>
  const rate = billing.rates[currency]
  if (!rate) {
    return (
      <span className="text-partial">
        Falta la tasa {currency === "VES" ? "Bs" : "COP"} del día.{" "}
        <Link href="/admin/ajustes" className="underline">
          Cargarla
        </Link>
      </span>
    )
  }
  return (
    <>
      Cuota {fee} × {formatRate(rate.ratePerUsd, currency)} (tasa del{" "}
      {formatDate(rate.effectiveDate)})
      {rate.stale && <span className="text-partial"> · tasa desactualizada</span>}
    </>
  )
}

export function RegisterPaymentForm({
  billing,
  initialStudent,
  today,
}: {
  billing: BillingCurrent
  initialStudent?: StudentOption
  today: string
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState<ActionResult<Payment>, FormData>(
    registerCashPayment,
    null,
  )
  const failed = state && !state.ok ? state : undefined
  const values = failed?.values ?? {}
  const [currency, setCurrency] = useState<Currency>((values.currency as Currency) || "USD")
  const [amount, setAmount] = useState(values.amount ?? suggested(billing, "USD"))
  const error = (name: string) => failed?.fields?.[name]

  useEffect(() => {
    if (state?.ok) {
      toast.success(
        `Pago registrado: ${state.data.user.fullName}, ${formatPeriodo(state.data.periodo)}`,
      )
      router.push(`/admin/personas/${state.data.user.id}`)
    } else if (failed?.code === "RATE_MISSING") {
      toast.error(failed.message)
    }
  }, [state, failed, router])

  const periods = [-2, -1, 0, 1, 2].map((offset) => shiftPeriodo(billing.periodo, offset))

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      {failed && !failed.fields && <FormError message={failed.message} />}

      <Field id="student" label="Estudiante" className="gap-2">
        <StudentPicker initial={initialStudent} error={error("userId")} />
      </Field>

      <div className="flex flex-wrap gap-4">
        <Field
          id="periodo"
          label="Mes que paga"
          error={error("periodo")}
          className="flex-[1_1_180px]"
        >
          <select
            id="periodo"
            name="periodo"
            defaultValue={values.periodo ?? billing.periodo}
            className="h-12 rounded-[10px] border border-field-border bg-field px-3 text-[15px]"
          >
            {periods.map((p) => (
              <option key={p} value={p}>
                {formatPeriodo(p)}
                {p === billing.periodo ? " (actual)" : ""}
              </option>
            ))}
          </select>
        </Field>
        <Field
          id="paidAt"
          label="Fecha del pago"
          error={error("paidAt")}
          className="flex-[1_1_180px]"
        >
          <Input
            id="paidAt"
            name="paidAt"
            type="date"
            max={today}
            defaultValue={values.paidAt ?? today}
            aria-invalid={error("paidAt") ? true : undefined}
            className={`${fieldClass} tabular`}
          />
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-sm font-medium text-foreground/85">Moneda</legend>
        <input type="hidden" name="currency" value={currency} />
        <div className="grid grid-cols-3 gap-2">
          {CURRENCIES.map((c) => (
            <button
              key={c.code}
              type="button"
              aria-pressed={currency === c.code}
              onClick={() => {
                setCurrency(c.code)
                setAmount(suggested(billing, c.code))
              }}
              className={cn(
                "tabular h-11 rounded-[10px] border text-sm",
                currency === c.code
                  ? "border-primary bg-accent text-accent-foreground"
                  : "border-field-border bg-field text-foreground/85 hover:bg-muted",
              )}
            >
              {c.label}
            </button>
          ))}
        </div>
      </fieldset>

      <Field
        id="amount"
        label="Monto recibido"
        error={error("amount")}
        hint={<Equivalence billing={billing} currency={currency} />}
      >
        <div className="flex h-12 items-center overflow-hidden rounded-[10px] border border-field-border bg-field focus-within:outline-2 focus-within:outline-ring">
          <span className="tabular flex h-full items-center bg-muted px-3.5 text-sm text-muted-foreground">
            {CURRENCIES.find((c) => c.code === currency)!.symbol}
          </span>
          <input
            id="amount"
            name="amount"
            inputMode="decimal"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={error("amount") ? true : undefined}
            aria-describedby={error("amount") ? "amount-error" : "amount-hint"}
            className="tabular h-full min-w-0 flex-1 bg-transparent px-3.5 text-lg text-foreground outline-none"
          />
        </div>
      </Field>

      <p className="rounded-[10px] bg-muted px-3.5 py-2.5 text-[13px] text-muted-foreground">
        Método: <span className="font-medium text-foreground">efectivo</span>. Queda aprobado al
        guardar. Los pagos móviles los reporta el estudiante y se aprueban en “Por revisar”.
      </p>

      <Field id="note" label="Nota (opcional)">
        <Textarea
          id="note"
          name="note"
          rows={2}
          defaultValue={values.note}
          placeholder="Ej.: pagó en la oficina, recibió Luis"
          className="rounded-[10px] border-field-border bg-field"
        />
      </Field>

      <div className="flex flex-wrap justify-end gap-3">
        <Button type="button" variant="outline" className="h-11" onClick={() => router.back()}>
          Cancelar
        </Button>
        <Button type="submit" className="h-11 px-5.5 font-heading font-semibold" disabled={pending}>
          {pending ? "Guardando…" : "Guardar pago"}
        </Button>
      </div>
    </form>
  )
}

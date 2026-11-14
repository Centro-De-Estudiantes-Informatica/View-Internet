"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Field, FormError, fieldClass } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setExchangeRate, setMonthlyFee, setPaymentDestination } from "@/lib/actions/billing"
import type { PaymentDestination } from "@/lib/api/types"
import { BANKS } from "@/lib/banks"
import type { ActionResult } from "@/lib/errors"

function useToastOnSuccess(state: ActionResult, form: React.RefObject<HTMLFormElement | null>) {
  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message)
      form.current?.reset()
    }
  }, [state, form])
}

export function FeeForm({ currentFee }: { currentFee: string }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(setMonthlyFee, null)
  const form = useRef<HTMLFormElement>(null)
  useToastOnSuccess(state, form)
  const failed = state && !state.ok ? state : undefined
  return (
    <form ref={form} action={action} className="flex flex-wrap items-end gap-3" noValidate>
      <Field
        id="feeUsd"
        label="Cuota mensual (USD)"
        error={failed?.fields?.feeUsd}
        className="flex-[1_1_200px]"
        hint="Un cambio no afecta al mes en curso si ya tiene pagos."
      >
        <Input
          id="feeUsd"
          name="feeUsd"
          inputMode="decimal"
          defaultValue={currentFee}
          aria-invalid={failed?.fields?.feeUsd ? true : undefined}
          className={`${fieldClass} tabular`}
        />
      </Field>
      <Button type="submit" className="mb-0.5 h-12 px-5" disabled={pending}>
        {pending ? "Guardando…" : "Guardar cuota"}
      </Button>
      {failed && !failed.fields && <FormError message={failed.message} />}
    </form>
  )
}

export function RateForm({ currency, today }: { currency: "VES" | "COP"; today: string }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(setExchangeRate, null)
  const form = useRef<HTMLFormElement>(null)
  useToastOnSuccess(state, form)
  const failed = state && !state.ok ? state : undefined
  const unit = currency === "VES" ? "Bs por USD" : "COP por USD"
  const rateId = `rate-${currency}`
  const dateId = `date-${currency}`
  return (
    <form ref={form} action={action} className="flex flex-wrap items-end gap-3" noValidate>
      <input type="hidden" name="currency" value={currency} />
      <Field
        id={rateId}
        label={`Tasa del día (${unit})`}
        error={failed?.fields?.ratePerUsd}
        className="flex-[2_1_200px]"
      >
        <Input
          id={rateId}
          name="ratePerUsd"
          inputMode="decimal"
          placeholder={currency === "VES" ? "200,50" : "4.000"}
          aria-invalid={failed?.fields?.ratePerUsd ? true : undefined}
          className={`${fieldClass} tabular`}
        />
      </Field>
      <Field
        id={dateId}
        label="Vigente desde"
        error={failed?.fields?.effectiveDate}
        className="flex-[1_1_160px]"
      >
        <Input
          id={dateId}
          name="effectiveDate"
          type="date"
          max={today}
          defaultValue={today}
          className={`${fieldClass} tabular`}
        />
      </Field>
      <Button type="submit" className="mb-0.5 h-12 px-5" disabled={pending}>
        {pending ? "Guardando…" : "Guardar tasa"}
      </Button>
      {failed && !failed.fields && <FormError message={failed.message} />}
    </form>
  )
}

export function PaymentDestinationForm({ current }: { current: PaymentDestination }) {
  const [state, action, pending] = useActionState<ActionResult, FormData>(
    setPaymentDestination,
    null,
  )
  useEffect(() => {
    if (state?.ok) toast.success(state.message)
  }, [state])
  const failed = state && !state.ok ? state : undefined
  const values = failed?.values ?? {}
  const error = (name: string) => failed?.fields?.[name]
  // Tras un error se muestran los valores enviados; si no, los guardados.
  const value = (name: "bank" | "phone" | "document") => values[name] ?? current[name] ?? ""
  return (
    <form
      key={failed ? JSON.stringify(values) : JSON.stringify(current)}
      action={action}
      className="flex flex-wrap items-end gap-3"
      noValidate
    >
      <Field id="dest-bank" label="Banco" error={error("bank")} className="flex-[1_1_200px]">
        <select
          id="dest-bank"
          name="bank"
          defaultValue={value("bank")}
          aria-invalid={error("bank") ? true : undefined}
          className="h-12 rounded-[10px] border border-field-border bg-field px-3 text-[15px]"
        >
          <option value="" disabled>
            Elige…
          </option>
          {BANKS.map((b) => (
            <option key={b.code} value={b.code}>
              {b.name}
            </option>
          ))}
        </select>
      </Field>
      <Field id="dest-phone" label="Teléfono" error={error("phone")} className="flex-[1_1_180px]">
        <Input
          id="dest-phone"
          name="phone"
          inputMode="tel"
          placeholder="0414-1234567"
          defaultValue={value("phone")}
          aria-invalid={error("phone") ? true : undefined}
          className={`${fieldClass} tabular`}
        />
      </Field>
      <Field
        id="dest-document"
        label="Cédula o RIF"
        error={error("document")}
        className="flex-[1_1_180px]"
      >
        <Input
          id="dest-document"
          name="document"
          placeholder="J-123456789"
          defaultValue={value("document")}
          aria-invalid={error("document") ? true : undefined}
          className={`${fieldClass} tabular`}
        />
      </Field>
      <Button type="submit" className="mb-0.5 h-12 px-5" disabled={pending}>
        {pending ? "Guardando…" : "Guardar datos"}
      </Button>
      {failed && !failed.fields && <FormError message={failed.message} />}
    </form>
  )
}

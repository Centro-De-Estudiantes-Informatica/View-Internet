"use client"

import { useActionState, useEffect, useRef } from "react"
import { toast } from "sonner"
import { Field, FormError, fieldClass } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { setExchangeRate, setMonthlyFee } from "@/lib/actions/billing"
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

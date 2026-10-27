"use client"

import { ImageUp } from "lucide-react"
import { useRouter } from "next/navigation"
import { useActionState, useEffect, useState } from "react"
import { toast } from "sonner"
import { Field, FormError, fieldClass } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { reportMobilePayment } from "@/lib/actions/payments"
import { compressImage } from "@/lib/compress-image"
import type { ActionResult } from "@/lib/errors"
import { BANKS } from "@/lib/banks"
import { MAX_RECEIPT_BYTES, RECEIPT_TYPES } from "@/lib/receipt"

export function ReportForm({
  suggestedAmount,
  periodo,
  today,
}: {
  suggestedAmount: string
  periodo: string
  today: string
}) {
  const router = useRouter()
  const [state, action, pending] = useActionState<ActionResult, FormData>(reportMobilePayment, null)
  const [fileLabel, setFileLabel] = useState<string>()
  const [fileError, setFileError] = useState<string>()
  const failed = state && !state.ok ? state : undefined
  const values = failed?.values ?? {}
  const error = (name: string) => failed?.fields?.[name]
  const described = (name: string) => (error(name) ? `${name}-error` : undefined)

  useEffect(() => {
    if (state?.ok) {
      toast.success(state.message)
      router.push("/mi-cuenta")
    }
  }, [state, router])

  async function onFile(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget
    const original = input.files?.[0]
    setFileError(undefined)
    setFileLabel(undefined)
    if (!original) return
    if (!RECEIPT_TYPES.includes(original.type)) {
      input.value = ""
      setFileError("La captura debe ser una imagen JPG o PNG")
      return
    }
    const file = await compressImage(original)
    if (file.size > MAX_RECEIPT_BYTES) {
      input.value = ""
      setFileError("La captura debe pesar máximo 5 MB")
      return
    }
    if (file !== original) {
      const transfer = new DataTransfer()
      transfer.items.add(file)
      input.files = transfer.files
    }
    setFileLabel(`${file.name} · ${(file.size / 1024).toFixed(0)} KB`)
  }

  const receiptError = fileError ?? error("receipt")

  return (
    <form key={JSON.stringify(values)} action={action} className="flex flex-col gap-4" noValidate>
      {failed && !failed.fields && <FormError message={failed.message} />}
      <input type="hidden" name="periodo" value={periodo} />

      <Field id="reference" label="Número de referencia" error={error("reference")}>
        <Input
          id="reference"
          name="reference"
          inputMode="numeric"
          placeholder="Ej.: 004512"
          defaultValue={values.reference}
          aria-invalid={!!error("reference")}
          aria-describedby={described("reference")}
          className={`${fieldClass} tabular`}
        />
      </Field>
      <div className="flex flex-wrap gap-3">
        <Field id="bank" label="Tu banco" error={error("bank")} className="flex-[1_1_150px]">
          <select
            id="bank"
            name="bank"
            defaultValue={values.bank ?? ""}
            aria-invalid={!!error("bank")}
            aria-describedby={described("bank")}
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
        <Field id="amount" label="Monto (Bs)" error={error("amount")} className="flex-[1_1_150px]">
          <Input
            id="amount"
            name="amount"
            inputMode="decimal"
            defaultValue={values.amount ?? suggestedAmount}
            aria-invalid={!!error("amount")}
            aria-describedby={described("amount")}
            className={`${fieldClass} tabular`}
          />
        </Field>
      </div>
      <div className="flex flex-wrap gap-3">
        <Field
          id="payerPhone"
          label="Teléfono desde el que pagaste"
          error={error("payerPhone")}
          className="flex-[2_1_200px]"
        >
          <Input
            id="payerPhone"
            name="payerPhone"
            type="tel"
            placeholder="0414-1234567"
            defaultValue={values.payerPhone}
            aria-invalid={!!error("payerPhone")}
            aria-describedby={described("payerPhone")}
            className={`${fieldClass} tabular`}
          />
        </Field>
        <Field id="paidAt" label="Fecha" error={error("paidAt")} className="flex-[1_1_140px]">
          <Input
            id="paidAt"
            name="paidAt"
            type="date"
            max={today}
            defaultValue={values.paidAt ?? today}
            className={`${fieldClass} tabular`}
          />
        </Field>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="receipt"
          className="flex min-h-16 cursor-pointer items-center gap-3 rounded-xl border border-dashed border-field-border bg-card/60 px-3.5 py-3 focus-within:outline-2 focus-within:outline-ring"
        >
          <ImageUp className="size-5.5 shrink-0 text-primary" aria-hidden="true" />
          <span className="flex flex-col gap-0.5">
            <span className="text-sm text-foreground">
              {fileLabel ?? "Adjuntar captura (opcional)"}
            </span>
            <span className="text-xs text-muted-foreground">
              JPG o PNG · ayuda a aprobar más rápido
            </span>
          </span>
          <input
            id="receipt"
            name="receipt"
            type="file"
            accept="image/jpeg,image/png"
            onChange={onFile}
            aria-invalid={receiptError ? true : undefined}
            aria-describedby={receiptError ? "receipt-error" : undefined}
            className="sr-only"
          />
        </label>
        {receiptError && (
          <p id="receipt-error" role="alert" className="text-[13px] font-medium text-due">
            {receiptError}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={pending}
        className="mt-2 h-12 rounded-xl font-heading text-base font-semibold"
      >
        {pending ? "Enviando…" : "Enviar para revisión"}
      </Button>
      <p className="text-center text-xs leading-normal text-muted-foreground">
        Tu pago queda “En revisión” hasta que el administrador lo confirme en el banco.
      </p>
    </form>
  )
}

"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Field } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import type { ActionResult } from "@/lib/errors"

/** Diálogo que exige un motivo (rechazar o anular un pago). */
export function ReasonDialog({
  trigger,
  title,
  description,
  confirmLabel,
  placeholder,
  onConfirm,
}: {
  trigger: React.ReactElement
  title: string
  description: React.ReactNode
  confirmLabel: string
  placeholder: string
  onConfirm: (reason: string) => Promise<ActionResult>
}) {
  const [open, setOpen] = useState(false)
  const [reason, setReason] = useState("")
  const [error, setError] = useState<string>()
  const [pending, startTransition] = useTransition()

  function submit(event: React.FormEvent) {
    event.preventDefault()
    if (reason.trim().length < 3) {
      setError("Escribe el motivo")
      return
    }
    startTransition(async () => {
      const result = await onConfirm(reason)
      if (result?.ok) {
        toast.success(result.message)
        setOpen(false)
        setReason("")
        setError(undefined)
      } else if (result) {
        setError(result.fields?.reason ?? result.message)
        if (result.code === "INVALID_PAYMENT_STATE") toast.warning(result.message)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          <Field id="reason" label="Motivo" error={error}>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={placeholder}
              rows={3}
              required
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? "reason-error" : undefined}
              className="rounded-[10px] border-field-border bg-field"
            />
          </Field>
          <DialogFooter>
            <Button type="button" variant="outline" className="h-11" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" variant="destructive" className="h-11" disabled={pending}>
              {pending ? "Guardando…" : confirmLabel}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

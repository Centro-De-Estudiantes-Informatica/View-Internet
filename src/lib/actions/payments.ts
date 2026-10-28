"use server"

import { refresh } from "next/cache"
import { api, call } from "@/lib/api/client"
import type { Payment } from "@/lib/api/types"
import type { ActionResult } from "@/lib/errors"
import { type Currency, parseAmountInput, todayIso } from "@/lib/format"
import { MAX_RECEIPT_BYTES, RECEIPT_TYPES } from "@/lib/receipt"
import { requireAdmin, requireSession } from "@/lib/session"
import { invalid, keepValues, text, toFailure } from "./helpers"

const CURRENCIES: Currency[] = ["USD", "VES", "COP"]
const PERIODO_RE = /^\d{4}-(0[1-9]|1[0-2])$/
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export async function registerCashPayment(
  _prev: ActionResult<Payment>,
  formData: FormData,
): Promise<ActionResult<Payment>> {
  return keepValues(await registerCashPaymentImpl(formData), formData)
}

async function registerCashPaymentImpl(formData: FormData): Promise<ActionResult<Payment>> {
  await requireAdmin()
  const userId = text(formData, "userId")
  const periodo = text(formData, "periodo")
  const currency = text(formData, "currency") as Currency
  const paidAt = text(formData, "paidAt") || todayIso()
  const note = text(formData, "note")

  const fields: Record<string, string> = {}
  if (!userId) fields.userId = "Elige al estudiante"
  if (!PERIODO_RE.test(periodo)) fields.periodo = "Elige el mes que paga"
  if (!CURRENCIES.includes(currency)) fields.currency = "Elige la moneda"
  if (!DATE_RE.test(paidAt) || paidAt > todayIso()) fields.paidAt = "La fecha no puede ser futura"
  const amount = CURRENCIES.includes(currency)
    ? parseAmountInput(text(formData, "amount"), currency)
    : null
  if (!amount) fields.amount = "Escribe un monto mayor que cero"
  if (Object.keys(fields).length) return invalid(fields)

  try {
    const client = await api()
    const payment = await call(
      client.POST("/payments/cash", {
        body: { userId, periodo, currency, amount: amount!, paidAt, note: note || undefined },
      }),
    )
    refresh()
    return { ok: true, data: payment, message: "Pago registrado" }
  } catch (error) {
    return toFailure(error, (code) =>
      code === "DATE_IN_FUTURE" ? { paidAt: "La fecha no puede ser futura" } : undefined,
    )
  }
}

export async function approvePayment(paymentId: string): Promise<ActionResult> {
  await requireAdmin()
  try {
    const client = await api()
    await call(
      client.POST("/payments/{id}/approve", { params: { path: { id: paymentId } }, body: {} }),
    )
    refresh()
    return { ok: true, data: undefined, message: "Pago aprobado" }
  } catch (error) {
    return toFailure(error)
  }
}

async function withReason(
  kind: "reject" | "void",
  paymentId: string,
  reason: string,
): Promise<ActionResult> {
  await requireAdmin()
  const trimmed = reason.trim()
  if (trimmed.length < 3) return invalid({ reason: "Escribe el motivo" })
  try {
    const client = await api()
    const options = { params: { path: { id: paymentId } }, body: { reason: trimmed } }
    await call(
      kind === "reject"
        ? client.POST("/payments/{id}/reject", options)
        : client.POST("/payments/{id}/void", options),
    )
    refresh()
    return {
      ok: true,
      data: undefined,
      message: kind === "reject" ? "Pago rechazado" : "Pago anulado",
    }
  } catch (error) {
    return toFailure(error)
  }
}

export async function rejectPayment(paymentId: string, reason: string) {
  return withReason("reject", paymentId, reason)
}

export async function voidPayment(paymentId: string, reason: string) {
  return withReason("void", paymentId, reason)
}

export async function reportMobilePayment(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  return keepValues(await reportMobilePaymentImpl(formData), formData)
}

async function reportMobilePaymentImpl(formData: FormData): Promise<ActionResult> {
  await requireSession()
  const reference = text(formData, "reference").replace(/\s/g, "")
  const bank = text(formData, "bank")
  const payerPhone = text(formData, "payerPhone").replace(/[\s-]/g, "")
  const paidAt = text(formData, "paidAt") || todayIso()
  const periodo = text(formData, "periodo")
  const receipt = formData.get("receipt")

  const fields: Record<string, string> = {}
  if (!/^\d{4,20}$/.test(reference))
    fields.reference = "Escribe el número de referencia (solo dígitos)"
  if (!/^\d{4}$/.test(bank)) fields.bank = "Elige tu banco"
  if (!/^0\d{10}$/.test(payerPhone)) fields.payerPhone = "Escribe un teléfono como 0414-1234567"
  if (!DATE_RE.test(paidAt) || paidAt > todayIso()) fields.paidAt = "La fecha no puede ser futura"
  const amount = parseAmountInput(text(formData, "amount"), "VES")
  if (!amount) fields.amount = "Escribe el monto en bolívares"
  const file = receipt instanceof File && receipt.size > 0 ? receipt : null
  if (file && (file.size > MAX_RECEIPT_BYTES || !RECEIPT_TYPES.includes(file.type))) {
    fields.receipt = "La captura debe ser JPG o PNG de máximo 5 MB"
  }
  if (Object.keys(fields).length) return invalid(fields)

  const body = new FormData()
  body.set("reference", reference)
  body.set("bank", bank)
  body.set("payerPhone", payerPhone)
  body.set("paidAt", paidAt)
  body.set("amount", amount!)
  body.set("currency", "VES")
  if (PERIODO_RE.test(periodo)) body.set("periodo", periodo)
  if (file) body.set("receipt", file, file.name)

  try {
    const client = await api()
    await call(
      client.POST("/me/payments/mobile", {
        // openapi-fetch serializa JSON por defecto; aquí se envía el FormData tal cual.
        body: body as never,
        bodySerializer: (value) => value as unknown as FormData,
      }),
    )
    refresh()
    return { ok: true, data: undefined, message: "Pago enviado para revisión" }
  } catch (error) {
    return toFailure(error, (code): Record<string, string> | undefined => {
      if (code === "DUPLICATE_REFERENCE") return { reference: "Esta referencia ya fue reportada" }
      if (["INVALID_RECEIPT", "PAYLOAD_TOO_LARGE", "UNSUPPORTED_MEDIA_TYPE"].includes(code)) {
        return { receipt: "La captura debe ser JPG o PNG de máximo 5 MB" }
      }
      return undefined
    })
  }
}

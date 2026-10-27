"use server"

import { refresh } from "next/cache"
import { api, call } from "@/lib/api/client"
import type { ActionResult } from "@/lib/errors"
import { parseAmountInput, todayIso } from "@/lib/format"
import { requireAdmin } from "@/lib/session"
import { invalid, text, toFailure } from "./helpers"

export async function setMonthlyFee(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin()
  const feeUsd = parseAmountInput(text(formData, "feeUsd"), "USD")
  if (!feeUsd) return invalid({ feeUsd: "Escribe una cuota mayor que cero, p. ej. 5.00" })
  try {
    const client = await api()
    const fee = await call(client.PUT("/billing/fee", { body: { feeUsd } }))
    refresh()
    return {
      ok: true,
      data: undefined,
      message:
        fee.feeUsd === fee.currentPeriodFeeUsd
          ? "Cuota actualizada"
          : "Cuota guardada: se aplica desde el próximo mes",
    }
  } catch (error) {
    return toFailure(error)
  }
}

export async function setExchangeRate(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin()
  const currency = text(formData, "currency")
  if (currency !== "VES" && currency !== "COP") return invalid({ currency: "Elige la moneda" })
  // La tasa se escribe con coma decimal en ambos casos (p. ej. 200,50).
  const raw = text(formData, "ratePerUsd").replace(/\./g, "").replace(",", ".")
  const value = Number(raw)
  if (!/^\d+(\.\d{1,4})?$/.test(raw) || !(value > 0)) {
    return invalid({ ratePerUsd: "Escribe una tasa mayor que cero, p. ej. 200,50" })
  }
  const effectiveDate = text(formData, "effectiveDate") || todayIso()
  if (effectiveDate > todayIso()) return invalid({ effectiveDate: "La fecha no puede ser futura" })
  try {
    const client = await api()
    await call(
      client.POST("/billing/rates", { body: { currency, ratePerUsd: raw, effectiveDate } }),
    )
    refresh()
    return {
      ok: true,
      data: undefined,
      message: `Tasa ${currency === "VES" ? "Bs" : "COP"} guardada`,
    }
  } catch (error) {
    return toFailure(error)
  }
}

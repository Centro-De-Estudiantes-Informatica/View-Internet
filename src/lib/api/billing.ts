import "server-only"
import { ApiError, type ApiClient, call } from "./client"
import type { BillingCurrent, PaymentDestination } from "./types"

/** Cuota y tasas vigentes, o `null` si todavía no se configuró la cuota (instalación nueva). */
export async function currentBilling(client: ApiClient): Promise<BillingCurrent | null> {
  try {
    return await call(client.GET("/billing/current"))
  } catch (error) {
    if (error instanceof ApiError && error.code === "FEE_NOT_CONFIGURED") return null
    throw error
  }
}

/** Datos del pago móvil de la sede (banco, teléfono y cédula o RIF) que carga el administrador. */
export async function paymentDestination(client: ApiClient): Promise<PaymentDestination> {
  return call(client.GET("/billing/payment-destination"))
}

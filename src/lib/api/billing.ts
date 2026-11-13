import "server-only"
import { ApiError, type ApiClient, call } from "./client"
import type { BillingCurrent } from "./types"

/** Cuota y tasas vigentes, o `null` si todavía no se configuró la cuota (instalación nueva). */
export async function currentBilling(client: ApiClient): Promise<BillingCurrent | null> {
  try {
    return await call(client.GET("/billing/current"))
  } catch (error) {
    if (error instanceof ApiError && error.code === "FEE_NOT_CONFIGURED") return null
    throw error
  }
}

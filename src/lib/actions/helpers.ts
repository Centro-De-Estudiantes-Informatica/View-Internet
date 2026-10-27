import "server-only"
import { ApiError } from "@/lib/api/client"
import type { ActionResult } from "@/lib/errors"

/** Convierte un `ApiError` en un resultado de acción; relanza todo lo demás (p. ej. `redirect`). */
export function toFailure(
  error: unknown,
  fields?: (code: string) => Record<string, string> | undefined,
) {
  if (!(error instanceof ApiError)) throw error
  const result: ActionResult = {
    ok: false,
    code: error.code,
    message: error.userMessage,
    fields: fields?.(error.code),
  }
  return result
}

export function invalid(
  fields: Record<string, string>,
  message = "Revisa los datos del formulario",
) {
  const result: ActionResult = { ok: false, code: "VALIDATION_ERROR", message, fields }
  return result
}

export const text = (formData: FormData, name: string) => String(formData.get(name) ?? "").trim()

/** Agrega al error los valores de texto enviados (React vacía el formulario tras la acción). */
export function keepValues<R extends ActionResult<unknown>>(result: R, formData: FormData): R {
  if (!result || result.ok) return result
  const values: Record<string, string> = {}
  for (const [key, value] of formData) {
    if (typeof value === "string" && !key.startsWith("$")) values[key] = value
  }
  return { ...result, values }
}

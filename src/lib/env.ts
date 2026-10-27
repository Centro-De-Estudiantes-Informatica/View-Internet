import { z } from "zod"

const schema = z.object({
  API_BASE_URL: z.url().transform((url) => url.replace(/\/+$/, "")),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET debe tener al menos 32 caracteres"),
  API_MOCKING: z.enum(["enabled", "disabled"]).default("disabled"),
  // Datos de pago móvil de la sede que ve el estudiante al reportar.
  SEDE_PAGO_MOVIL_BANCO: z.string().optional(),
  SEDE_PAGO_MOVIL_TELEFONO: z.string().optional(),
  SEDE_PAGO_MOVIL_DOCUMENTO: z.string().optional(),
})

export type Env = z.infer<typeof schema>

let cached: Env | undefined

/** Variables de entorno del servidor, validadas la primera vez que se leen. */
export function env(): Env {
  if (!cached) {
    const result = schema.safeParse(process.env)
    if (!result.success) {
      throw new Error(`Variables de entorno inválidas:\n${z.prettifyError(result.error)}`)
    }
    cached = result.data
  }
  return cached
}

import { z } from "zod"

const schema = z.object({
  API_BASE_URL: z.url().transform((url) => url.replace(/\/+$/, "")),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET debe tener al menos 32 caracteres"),
  API_MOCKING: z.enum(["enabled", "disabled"]).default("disabled"),
  // Secreto compartido con la API para que confíe en la IP del navegador (X-Client-IP).
  CLIENT_IP_SECRET: z
    .string()
    .min(32, "CLIENT_IP_SECRET debe tener al menos 32 caracteres")
    .optional()
    .or(z.literal("").transform(() => undefined)),
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

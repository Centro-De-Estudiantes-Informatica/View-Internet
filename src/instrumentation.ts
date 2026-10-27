export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs") return

  // Falla al arrancar si faltan variables de entorno, no en la primera petición.
  const { env } = await import("@/lib/env")
  const config = env()
  if (config.API_MOCKING === "enabled") {
    console.info(`[mocks] API simulada en /api/mock (API_BASE_URL=${config.API_BASE_URL})`)
  }
}

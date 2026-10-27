import "server-only"
import createClient, { type Client } from "openapi-fetch"
import { redirect } from "next/navigation"
import { env } from "@/lib/env"
import { errorMessage } from "@/lib/errors"
import { getSession } from "@/lib/session"
import type { paths } from "./schema"

export type ApiClient = Client<paths>

/** Error de la API con su código de negocio (`LAST_ADMIN`, `RATE_MISSING`, …). */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly details?: unknown,
  ) {
    super(message)
    this.name = "ApiError"
  }

  /** Mensaje en español para mostrar al usuario. */
  get userMessage(): string {
    return errorMessage(this.code, this.message)
  }
}

function newClient(token?: string): ApiClient {
  return createClient<paths>({
    baseUrl: env().API_BASE_URL,
    cache: "no-store",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
  })
}

/** Cliente sin sesión (solo para el login). */
export function publicApi(): ApiClient {
  return newClient()
}

/** Cliente con el token de la sesión actual. Sin sesión, redirige al login. */
export async function api(): Promise<ApiClient> {
  const session = await getSession()
  if (!session) redirect("/login")
  return newClient(session.token)
}

interface FetchResult<T> {
  data?: T
  error?: unknown
  response: Response
}

interface CallOptions {
  /** Si es `false`, un 401 se lanza como `ApiError` en lugar de cerrar la sesión. */
  handleAuth?: boolean
}

/**
 * Espera una llamada de `openapi-fetch` y devuelve sus datos o lanza `ApiError`.
 * Un 401 (token vencido o invalidado) cierra la sesión; un 403 por contraseña
 * temporal lleva a cambiarla.
 */
export async function call<T>(
  request: Promise<FetchResult<T>>,
  { handleAuth = true }: CallOptions = {},
): Promise<T> {
  let result: FetchResult<T>
  try {
    result = await request
  } catch (cause) {
    console.error("[api] no se pudo conectar con la API:", cause)
    throw new ApiError(503, "SERVICE_UNAVAILABLE", errorMessage("SERVICE_UNAVAILABLE"))
  }
  const { data, error, response } = result
  if (response.ok) return data as T

  const body = (error ?? {}) as { code?: unknown; message?: unknown; details?: unknown }
  const code = typeof body.code === "string" ? body.code : `HTTP_${response.status}`
  const message = typeof body.message === "string" ? body.message : response.statusText

  if (handleAuth) {
    if (response.status === 401) redirect("/salir?motivo=expirada")
    if (code === "PASSWORD_CHANGE_REQUIRED") redirect("/cambiar-clave")
    if (code === "ACCOUNT_DISABLED") redirect("/salir?motivo=desactivada")
  }
  throw new ApiError(response.status, code, message, body.details)
}

"use server"

import { redirect } from "next/navigation"
import { z } from "zod"
import { ApiError, api, call, publicApi } from "@/lib/api/client"
import type { SessionDto } from "@/lib/api/types"
import type { ActionResult } from "@/lib/errors"
import { clearSession, saveSession } from "@/lib/session"
import { homeFor } from "@/lib/session-core"

async function storeSession(dto: SessionDto) {
  await saveSession({
    token: dto.accessToken,
    userId: dto.user.id,
    role: dto.role,
    fullName: dto.user.fullName,
    cedula: dto.user.cedula,
    mustChangePassword: dto.mustChangePassword,
    expiresAt: Date.now() + dto.expiresIn * 1000,
  })
}

export type LoginState = (NonNullable<ActionResult> & { cedula?: string }) | null

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const cedula = String(formData.get("cedula") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  if (!cedula || !password) {
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Escribe tu cédula y tu contraseña",
      cedula,
    }
  }

  let dto: SessionDto
  try {
    dto = await call(publicApi().POST("/auth/login", { body: { cedula, password } }), {
      handleAuth: false,
    })
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    const code = error.status === 401 ? "INVALID_CREDENTIALS" : error.code
    return {
      ok: false,
      code,
      message: new ApiError(error.status, code, error.message).userMessage,
      cedula,
    }
  }
  await storeSession(dto)
  redirect(homeFor(dto))
}

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Escribe tu contraseña actual"),
    newPassword: z.string().min(8, "La nueva contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string(),
  })
  .refine((v) => v.newPassword === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Las contraseñas no coinciden",
  })

export async function changePassword(
  _prev: ActionResult,
  formData: FormData,
): Promise<ActionResult> {
  const parsed = passwordSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    const fields: Record<string, string> = {}
    for (const issue of parsed.error.issues) fields[String(issue.path[0])] ??= issue.message
    return {
      ok: false,
      code: "VALIDATION_ERROR",
      message: "Revisa los datos del formulario",
      fields,
    }
  }

  let dto: SessionDto
  try {
    const client = await api()
    dto = await call(
      client.POST("/auth/change-password", {
        body: {
          currentPassword: parsed.data.currentPassword,
          newPassword: parsed.data.newPassword,
        },
      }),
    )
  } catch (error) {
    if (!(error instanceof ApiError)) throw error
    return { ok: false, code: error.code, message: error.userMessage }
  }
  await storeSession(dto)
  redirect(homeFor(dto))
}

export async function logout(): Promise<void> {
  await clearSession()
  redirect("/login")
}

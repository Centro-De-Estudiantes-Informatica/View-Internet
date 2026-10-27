"use server"

import { refresh } from "next/cache"
import { api, call } from "@/lib/api/client"
import type { Profile, UserRole } from "@/lib/api/types"
import type { ActionResult } from "@/lib/errors"
import { requireAdmin } from "@/lib/session"
import { invalid, keepValues, text, toFailure } from "./helpers"

export type CreatedUser = { user: Profile; temporaryPassword: string }

export async function createUser(
  _prev: ActionResult<CreatedUser>,
  formData: FormData,
): Promise<ActionResult<CreatedUser>> {
  return keepValues(await createUserImpl(formData), formData)
}

async function createUserImpl(formData: FormData): Promise<ActionResult<CreatedUser>> {
  await requireAdmin()
  const cedula = text(formData, "cedula")
  const fullName = text(formData, "fullName").replace(/\s+/g, " ")
  const phone = text(formData, "phone").replace(/[\s-]/g, "")
  const role = (text(formData, "role") || "ESTUDIANTE") as UserRole

  const fields: Record<string, string> = {}
  if (!/^[VvEe]?[\s.-]*\d[\d.\s]{4,}$/.test(cedula))
    fields.cedula = "Escribe una cédula válida, p. ej. V-28.123.456"
  if (fullName.length < 3) fields.fullName = "Escribe el nombre completo"
  if (phone && !/^0\d{10}$/.test(phone)) fields.phone = "Escribe un teléfono como 0414-1234567"
  if (!["ESTUDIANTE", "ADMIN"].includes(role)) fields.role = "Elige el rol"
  if (Object.keys(fields).length) return invalid(fields)

  try {
    const client = await api()
    const data = await call(
      client.POST("/users", { body: { cedula, fullName, phone: phone || undefined, role } }),
    )
    refresh()
    return { ok: true, data, message: `${data.user.fullName} fue registrado` }
  } catch (error) {
    return toFailure(error, (code): Record<string, string> | undefined => {
      if (code === "CEDULA_TAKEN") return { cedula: "Esta cédula ya está registrada" }
      if (code === "INVALID_CEDULA") return { cedula: "La cédula no es válida" }
      return undefined
    })
  }
}

export async function changeRole(userId: string, role: UserRole): Promise<ActionResult<Profile>> {
  await requireAdmin()
  try {
    const client = await api()
    const data = await call(
      client.PATCH("/users/{id}/role", { params: { path: { id: userId } }, body: { role } }),
    )
    refresh()
    return {
      ok: true,
      data,
      message: `${data.fullName} ahora es ${role === "ADMIN" ? "Administrador" : "Estudiante"}`,
    }
  } catch (error) {
    return toFailure(error)
  }
}

export async function resetPassword(
  userId: string,
): Promise<ActionResult<{ temporaryPassword: string }>> {
  await requireAdmin()
  try {
    const client = await api()
    const data = await call(
      client.POST("/users/{id}/reset-password", { params: { path: { id: userId } } }),
    )
    return { ok: true, data }
  } catch (error) {
    return toFailure(error)
  }
}

export async function setUserActive(
  userId: string,
  active: boolean,
): Promise<ActionResult<Profile>> {
  await requireAdmin()
  try {
    const client = await api()
    const data = await call(
      client.PATCH("/users/{id}", { params: { path: { id: userId } }, body: { active } }),
    )
    refresh()
    return { ok: true, data, message: active ? "Cuenta activada" : "Cuenta desactivada" }
  } catch (error) {
    return toFailure(error)
  }
}

export type StudentOption = {
  id: string
  cedula: string
  fullName: string
  status: string | null
}

/** Buscador del formulario "Registrar pago". */
export async function searchStudents(q: string): Promise<StudentOption[]> {
  await requireAdmin()
  const term = q.trim()
  if (term.length < 2) return []
  try {
    const client = await api()
    const page = await call(
      client.GET("/users", { params: { query: { q: term, active: true, pageSize: 8 } } }),
    )
    return page.items.map((u) => ({
      id: u.id,
      cedula: u.cedula,
      fullName: u.fullName,
      status: u.period?.status ?? null,
    }))
  } catch (error) {
    toFailure(error)
    return []
  }
}

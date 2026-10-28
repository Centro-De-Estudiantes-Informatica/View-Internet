"use client"

import { useActionState } from "react"
import { Field, FormError, fieldClass } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { changePassword, logout } from "@/lib/actions/auth"
import type { ActionResult } from "@/lib/errors"

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<ActionResult, FormData>(changePassword, null)
  const failed = state && !state.ok ? state : undefined
  const fieldError = (name: string) => failed?.fields?.[name]

  const input = (name: string, label: string, autoComplete: string) => (
    <Field id={name} label={label} error={fieldError(name)}>
      <Input
        id={name}
        name={name}
        type="password"
        autoComplete={autoComplete}
        required
        minLength={name === "currentPassword" ? undefined : 8}
        maxLength={name === "currentPassword" ? undefined : 72}
        aria-invalid={fieldError(name) ? true : undefined}
        aria-describedby={fieldError(name) ? `${name}-error` : undefined}
        className={fieldClass}
      />
    </Field>
  )

  return (
    <div className="flex flex-col gap-4">
      <form action={action} className="flex flex-col gap-5" noValidate>
        {failed && !failed.fields && <FormError message={failed.message} />}
        {input("currentPassword", "Contraseña actual (temporal)", "current-password")}
        {input("newPassword", "Nueva contraseña", "new-password")}
        {input("confirmPassword", "Repite la nueva contraseña", "new-password")}
        <Button
          type="submit"
          disabled={pending}
          className="h-12 rounded-[10px] font-heading text-base font-semibold"
        >
          {pending ? "Guardando…" : "Guardar y continuar"}
        </Button>
      </form>
      <form action={logout}>
        <Button type="submit" variant="ghost" className="h-11 w-full">
          Cerrar sesión
        </Button>
      </form>
    </div>
  )
}

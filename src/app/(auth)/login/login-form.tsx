"use client"

import { useSearchParams } from "next/navigation"
import { useActionState } from "react"
import { Field, FormError, fieldClass } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { login, type LoginState } from "@/lib/actions/auth"

const NOTICES: Record<string, string> = {
  expirada: "Tu sesión expiró. Vuelve a iniciar sesión.",
  desactivada: "Tu cuenta está desactivada. Habla con el administrador de la sede.",
}

export function SessionNotice() {
  const reason = useSearchParams().get("motivo")
  const notice = reason ? NOTICES[reason] : undefined
  if (!notice) return null
  return (
    <p
      role="status"
      className="rounded-[10px] border border-partial/40 bg-partial-soft px-3.5 py-2.5 text-sm text-partial"
    >
      {notice}
    </p>
  )
}

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, null)
  const error = state && !state.ok ? state.message : undefined

  return (
    <form action={action} className="flex flex-col gap-5" noValidate>
      <FormError message={error} />
      <Field id="cedula" label="Cédula">
        <Input
          id="cedula"
          name="cedula"
          inputMode="text"
          autoComplete="username"
          placeholder="V-28.123.456"
          defaultValue={state?.cedula ?? ""}
          required
          aria-invalid={error ? true : undefined}
          className={`${fieldClass} tabular`}
        />
      </Field>
      <Field id="password" label="Contraseña">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
          aria-invalid={error ? true : undefined}
          className={fieldClass}
        />
      </Field>
      <Button
        type="submit"
        disabled={pending}
        className="h-12 rounded-[10px] font-heading text-base font-semibold"
      >
        {pending ? "Entrando…" : "Entrar"}
      </Button>
    </form>
  )
}

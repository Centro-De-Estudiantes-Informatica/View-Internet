"use client"

import { Plus } from "lucide-react"
import Link from "next/link"
import { useActionState, useState } from "react"
import { Field, FormError, fieldClass } from "@/components/forms/field"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { type CreatedUser, createUser } from "@/lib/actions/users"
import type { ActionResult } from "@/lib/errors"
import { TemporaryPassword } from "./temporary-password"

function CreateUserForm({ onDone }: { onDone: () => void }) {
  const [state, action, pending] = useActionState<ActionResult<CreatedUser>, FormData>(
    createUser,
    null,
  )

  if (state?.ok) {
    return (
      <div className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{state.data.user.fullName} fue registrado</DialogTitle>
          <DialogDescription>
            Cédula <span className="tabular">{state.data.user.cedula}</span>. Ya puede iniciar
            sesión.
          </DialogDescription>
        </DialogHeader>
        <TemporaryPassword value={state.data.temporaryPassword} />
        <DialogFooter>
          <Link
            href={`/admin/personas/${state.data.user.id}`}
            className="inline-flex h-11 items-center justify-center rounded-lg border px-4 text-sm"
          >
            Ver ficha
          </Link>
          <Button type="button" className="h-11" onClick={onDone}>
            Listo
          </Button>
        </DialogFooter>
      </div>
    )
  }

  const failed = state && !state.ok ? state : undefined
  const error = (name: string) => failed?.fields?.[name]
  const described = (name: string) => (error(name) ? `${name}-error` : undefined)
  const values = failed?.values ?? {}

  return (
    <form key={JSON.stringify(values)} action={action} className="flex flex-col gap-4" noValidate>
      <DialogHeader>
        <DialogTitle>Nueva persona</DialogTitle>
        <DialogDescription>
          Se crea con una contraseña temporal que verás al guardar.
        </DialogDescription>
      </DialogHeader>
      {failed && !failed.fields && <FormError message={failed.message} />}
      <Field id="cedula" label="Cédula" error={error("cedula")}>
        <Input
          id="cedula"
          name="cedula"
          defaultValue={values.cedula}
          placeholder="V-28.123.456"
          required
          aria-invalid={!!error("cedula")}
          aria-describedby={described("cedula")}
          className={`${fieldClass} tabular`}
        />
      </Field>
      {failed?.code === "CEDULA_TAKEN" && (
        <Link
          href={`/admin/personas?q=${encodeURIComponent(values.cedula ?? "")}`}
          className="-mt-2 text-[13px] text-primary hover:underline"
        >
          Ver a la persona con esta cédula
        </Link>
      )}
      <Field id="fullName" label="Nombre completo" error={error("fullName")}>
        <Input
          id="fullName"
          name="fullName"
          defaultValue={values.fullName}
          autoComplete="off"
          required
          aria-invalid={!!error("fullName")}
          aria-describedby={described("fullName")}
          className={fieldClass}
        />
      </Field>
      <div className="flex flex-wrap gap-4">
        <Field
          id="phone"
          label="Teléfono (opcional)"
          error={error("phone")}
          className="flex-[1_1_180px]"
        >
          <Input
            id="phone"
            name="phone"
            defaultValue={values.phone}
            type="tel"
            placeholder="0414-1234567"
            aria-invalid={!!error("phone")}
            aria-describedby={described("phone")}
            className={`${fieldClass} tabular`}
          />
        </Field>
        <Field id="role" label="Rol" className="flex-[1_1_160px]">
          <select
            id="role"
            name="role"
            defaultValue={values.role ?? "ESTUDIANTE"}
            className="h-12 rounded-[10px] border border-field-border bg-field px-3 text-[15px]"
          >
            <option value="ESTUDIANTE">Estudiante</option>
            <option value="ADMIN">Administrador</option>
          </select>
        </Field>
      </div>
      <DialogFooter>
        <Button type="button" variant="outline" className="h-11" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" className="h-11" disabled={pending}>
          {pending ? "Guardando…" : "Crear persona"}
        </Button>
      </DialogFooter>
    </form>
  )
}

export function CreateUserDialog() {
  const [open, setOpen] = useState(false)
  // Una `key` nueva en cada apertura reinicia el formulario.
  const [session, setSession] = useState(0)
  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) setSession((s) => s + 1)
      }}
    >
      <DialogTrigger
        render={
          <Button className="h-11 rounded-[10px] px-4.5 font-heading text-[15px] font-semibold">
            <Plus aria-hidden="true" />
            Nueva persona
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <CreateUserForm key={session} onDone={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}

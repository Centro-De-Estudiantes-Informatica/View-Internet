"use client"

import { useId, useState, useTransition } from "react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { changeRole } from "@/lib/actions/users"
import type { UserRole } from "@/lib/api/types"

const LABELS: Record<UserRole, string> = { ESTUDIANTE: "Estudiante", ADMIN: "Administrador" }

/** Cambio de rol con confirmación. Si la API lo rechaza, vuelve al rol anterior. */
export function RoleSelect({
  userId,
  fullName,
  role,
  isSelf,
}: {
  userId: string
  fullName: string
  role: UserRole
  isSelf: boolean
}) {
  const [value, setValue] = useState<UserRole>(role)
  const [proposed, setProposed] = useState<UserRole | null>(null)
  const [pending, startTransition] = useTransition()
  // La lista se muestra como tabla y como tarjetas: los ids deben ser únicos.
  const id = useId()

  function confirm() {
    const next = proposed!
    setProposed(null)
    setValue(next)
    startTransition(async () => {
      const result = await changeRole(userId, next)
      if (result?.ok) {
        toast.success(result.message)
      } else if (result) {
        setValue(role)
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex flex-col gap-0.5">
      <label htmlFor={id} className="sr-only">
        Rol de {fullName}
      </label>
      <select
        id={id}
        value={value}
        disabled={isSelf || pending}
        aria-describedby={isSelf ? `${id}-self` : undefined}
        onChange={(e) => setProposed(e.target.value as UserRole)}
        className="h-10 w-full rounded-lg border border-field-border bg-field px-2.5 text-sm text-foreground disabled:cursor-not-allowed disabled:opacity-55"
      >
        <option value="ESTUDIANTE">Estudiante</option>
        <option value="ADMIN">Administrador</option>
      </select>
      {isSelf && (
        <span id={`${id}-self`} className="text-xs text-muted-foreground">
          Eres tú: no puedes cambiar tu rol
        </span>
      )}
      <AlertDialog open={proposed !== null} onOpenChange={(open) => !open && setProposed(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              ¿Hacer a {fullName} {proposed ? LABELS[proposed] : ""}?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {proposed === "ADMIN"
                ? "Podrá registrar y anular pagos, ver a todas las personas y cambiar roles."
                : "Perderá el acceso al panel de administración."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-11">Cancelar</AlertDialogCancel>
            <AlertDialogAction className="h-11" onClick={confirm}>
              Sí, cambiar rol
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

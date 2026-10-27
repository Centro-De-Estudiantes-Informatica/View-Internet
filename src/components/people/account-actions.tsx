"use client"

import { KeyRound, Power } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { resetPassword, setUserActive } from "@/lib/actions/users"
import { TemporaryPassword } from "./temporary-password"

export function AccountActions({
  userId,
  fullName,
  active,
  isSelf,
}: {
  userId: string
  fullName: string
  active: boolean
  isSelf: boolean
}) {
  const [password, setPassword] = useState<string>()
  const [pending, startTransition] = useTransition()

  function reset() {
    startTransition(async () => {
      const result = await resetPassword(userId)
      if (result?.ok) setPassword(result.data.temporaryPassword)
      else if (result) toast.error(result.message)
    })
  }

  function toggleActive() {
    startTransition(async () => {
      const result = await setUserActive(userId, !active)
      if (result?.ok) toast.success(result.message)
      else if (result) toast.error(result.message)
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <AlertDialog>
          <AlertDialogTrigger
            render={<Button variant="outline" className="h-11" disabled={pending} />}
          >
            <KeyRound aria-hidden="true" />
            Restablecer contraseña
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Restablecer la contraseña de {fullName}?</AlertDialogTitle>
              <AlertDialogDescription>
                Se generará una contraseña temporal y se cerrarán sus sesiones abiertas. Deberá
                cambiarla al ingresar.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="h-11">Cancelar</AlertDialogCancel>
              <AlertDialogAction className="h-11" onClick={reset}>
                Restablecer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        {!isSelf && (
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="outline" className="h-11" disabled={pending} />}
            >
              <Power aria-hidden="true" />
              {active ? "Desactivar cuenta" : "Activar cuenta"}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿{active ? "Desactivar" : "Activar"} la cuenta de {fullName}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {active
                    ? "No podrá iniciar sesión y dejará de contarse en lo esperado de los próximos meses. Su historial se conserva."
                    : "Podrá volver a iniciar sesión y se contará en lo esperado de cada mes."}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="h-11">Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="h-11"
                  variant={active ? "destructive" : "default"}
                  onClick={toggleActive}
                >
                  {active ? "Desactivar" : "Activar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
      {password && <TemporaryPassword value={password} />}
    </div>
  )
}

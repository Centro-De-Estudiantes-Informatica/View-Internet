import type { Metadata } from "next"
import { Brand } from "@/components/brand"
import { ChangePasswordForm } from "./change-password-form"

export const metadata: Metadata = { title: "Cambiar contraseña" }

export default function ChangePasswordPage() {
  return (
    <main className="flex min-h-dvh flex-1 items-center justify-center px-4 py-12">
      <section
        aria-labelledby="cp-title"
        className="flex w-full max-w-[440px] flex-col gap-6 rounded-2xl border bg-card p-6 sm:p-9"
      >
        <Brand />
        <div className="flex flex-col gap-1.5">
          <h1 id="cp-title" className="text-2xl font-semibold">
            Crea tu contraseña
          </h1>
          <p className="text-sm text-muted-foreground">
            Por seguridad, cambia la contraseña temporal que te dio el administrador. Usa al menos 8
            caracteres.
          </p>
        </div>
        <ChangePasswordForm />
      </section>
    </main>
  )
}

import type { Metadata } from "next"
import { Suspense } from "react"
import { Brand } from "@/components/brand"
import { NetBackground } from "@/components/net-background"
import { LoginForm, SessionNotice } from "./login-form"

export const metadata: Metadata = { title: "Iniciar sesión" }

export default function LoginPage() {
  return (
    <main className="relative flex min-h-dvh flex-1 overflow-hidden">
      <NetBackground />
      <div className="relative mx-auto flex w-full max-w-[1120px] flex-wrap items-center gap-10 px-4 py-12 sm:px-6 md:gap-14 md:py-18">
        <section className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <Brand />
          <h1 className="text-[40px] leading-[1.08] font-bold tracking-tight text-foreground sm:text-[52px]">
            El internet de la sede, <span className="text-primary">al día.</span>
          </h1>
          <p className="max-w-[480px] text-lg leading-relaxed text-muted-foreground">
            Consulta tu estado de pago mensual, reporta tu pago móvil y lleva el control de quién
            está conectado.
          </p>
          <ul className="flex flex-wrap gap-3" aria-label="Monedas aceptadas">
            {[
              ["USD", "Dólares"],
              ["VES", "Bolívares"],
              ["COP", "Pesos colombianos"],
            ].map(([code, name]) => (
              <li
                key={code}
                className="inline-flex items-center gap-2 rounded-full border bg-card/80 px-3.5 py-2 text-sm text-foreground/85"
              >
                <span className="tabular text-primary">{code}</span>
                {name}
              </li>
            ))}
          </ul>
        </section>

        <section
          aria-labelledby="login-title"
          className="flex w-full max-w-[420px] min-w-0 flex-[1_1_360px] flex-col gap-5 rounded-2xl border bg-card p-6 shadow-[0_24px_60px_rgb(0_0_0/0.35)] sm:p-9"
        >
          <div className="flex flex-col gap-1.5">
            <h2 id="login-title" className="text-2xl font-semibold">
              Iniciar sesión
            </h2>
            <p className="text-sm text-muted-foreground">
              Usa la cédula y la contraseña que te dio el administrador.
            </p>
          </div>
          <Suspense fallback={null}>
            <SessionNotice />
          </Suspense>
          <LoginForm />
          <p className="text-[13px] leading-normal text-muted-foreground">
            ¿No tienes cuenta o olvidaste tu contraseña? El administrador de la sede te registra o
            te da una nueva. En tu primer ingreso te pediremos cambiarla.
          </p>
        </section>
      </div>
    </main>
  )
}

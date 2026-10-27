import { Plus } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { Panel, PanelTitle } from "@/components/card"
import { PaymentsTable } from "@/components/payments/payments-table"
import { AccountActions } from "@/components/people/account-actions"
import { CardSkeleton } from "@/components/skeletons"
import { EstadoBadge } from "@/components/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { ApiError, api, call } from "@/lib/api/client"
import { formatMoney, formatPeriodo } from "@/lib/format"
import { requireAdmin } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Ficha" }

export default function PersonPage(props: PageProps<"/admin/personas/[id]">) {
  return (
    <div className="flex flex-col gap-6">
      <Link href="/admin/personas" className="self-start text-sm text-primary hover:underline">
        ← Volver a Personas
      </Link>
      <Suspense fallback={<CardSkeleton />}>
        <Person params={props.params} />
      </Suspense>
    </div>
  )
}

async function Person({ params }: { params: PageProps<"/admin/personas/[id]">["params"] }) {
  const session = await requireAdmin()
  const { id } = await params
  const client = await api()

  const user = await call(client.GET("/users/{id}", { params: { path: { id } } })).catch(
    (error) => {
      if (error instanceof ApiError && (error.status === 404 || error.status === 400)) notFound()
      throw error
    },
  )
  const [listing, payments] = await Promise.all([
    call(
      client.GET("/users", {
        params: { query: { q: user.cedula.replace(/\D/g, ""), pageSize: 5 } },
      }),
    ),
    call(client.GET("/payments", { params: { query: { userId: id, pageSize: 100 } } })),
  ])
  const period = listing.items.find((item) => item.id === id)?.period
  const isSelf = id === session.userId

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[28px] font-semibold">{user.fullName}</h1>
          <p className="tabular text-sm text-muted-foreground">
            {user.cedula}
            {user.phone && ` · ${user.phone}`} ·{" "}
            {user.role === "ADMIN" ? "Administrador" : "Estudiante"}
            {!user.active && " · Cuenta desactivada"}
          </p>
        </div>
        <Link
          href={`/admin/pagos/nuevo?userId=${id}`}
          className={cn(
            buttonVariants(),
            "h-11 rounded-[10px] px-4.5 font-heading text-[15px] font-semibold",
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Registrar pago
        </Link>
      </header>

      <div className="flex flex-wrap gap-4">
        <Panel aria-labelledby="estado-t" className="flex-[1_1_280px]">
          <PanelTitle id="estado-t">Estado del mes</PanelTitle>
          {period ? (
            <div className="flex flex-col gap-2">
              <EstadoBadge status={period.status} className="self-start" />
              <p className="text-sm text-muted-foreground">
                {formatPeriodo(period.periodo)}: pagó{" "}
                <span className="tabular text-foreground">
                  {formatMoney(period.paidUsd, "USD")}
                </span>{" "}
                de{" "}
                <span className="tabular text-foreground">{formatMoney(period.feeUsd, "USD")}</span>
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Sin datos del mes.</p>
          )}
        </Panel>
        <Panel aria-labelledby="cuenta-t" className="flex-[2_1_360px]">
          <PanelTitle id="cuenta-t">Cuenta</PanelTitle>
          <AccountActions
            userId={id}
            fullName={user.fullName}
            active={user.active}
            isSelf={isSelf}
          />
          {user.mustChangePassword && (
            <p className="text-[13px] text-muted-foreground">
              Todavía no cambió su contraseña temporal.
            </p>
          )}
        </Panel>
      </div>

      <section aria-labelledby="hist-t" className="flex flex-col gap-3">
        <h2 id="hist-t" className="text-lg font-semibold">
          Historial de pagos
        </h2>
        <PaymentsTable payments={payments.items} showStudent={false} />
      </section>
    </div>
  )
}

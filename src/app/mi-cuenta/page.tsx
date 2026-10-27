import { CircleAlert, CircleCheck, Clock } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { METHOD_LABELS } from "@/components/admin/recent-payments"
import { CardSkeleton } from "@/components/skeletons"
import { EstadoBadge, PaymentStatusBadge } from "@/components/status-badge"
import { buttonVariants } from "@/components/ui/button"
import { api, call } from "@/lib/api/client"
import type { MyStatus, Payment } from "@/lib/api/types"
import { formatDate, formatMoney, formatPeriodo } from "@/lib/format"
import { requireSession } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Mi internet" }

export default function MyAccountPage() {
  return (
    <Suspense fallback={<CardSkeleton />}>
      <MyAccount />
    </Suspense>
  )
}

function owedText(status: MyStatus) {
  const months = status.owedPeriods.map((p) => formatPeriodo(p.periodo).toLowerCase())
  if (months.length === 0) return null
  if (months.length === 1) return `Debes ${months[0]}`
  return `Debes ${months.slice(0, -1).join(", ")} y ${months.at(-1)}`
}

/** `"2026-11"` → `"30 nov 2026"`: último día del mes más lejano ya pagado. */
function coveredUntil(payments: Payment[], current: string): string | null {
  const paid = payments
    .filter((p) => p.status === "APROBADO" && p.periodo >= current)
    .map((p) => p.periodo)
  if (paid.length === 0) return null
  const last = paid.sort().at(-1)!
  const [year, month] = last.split("-").map(Number)
  const day = new Date(Date.UTC(year!, month!, 0)).getUTCDate()
  return `${day} de ${formatPeriodo(last).toLowerCase().replace(" ", " de ")}`
}

function StatusCard({ status, payments }: { status: MyStatus; payments: Payment[] }) {
  const current = status.current
  const owed = owedText(status)
  const upToDate = status.owedPeriods.length === 0
  const inReview = !upToDate && status.owedPeriods.every((p) => p.status === "EN_REVISION")
  const tone = upToDate ? "border-ok/45" : inReview ? "border-review/45" : "border-due/45"
  const Icon = upToDate ? CircleCheck : inReview ? Clock : CircleAlert

  return (
    <section
      aria-label="Estado del mes"
      className={cn(
        "relative flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-5",
        tone,
      )}
    >
      <EstadoBadge
        status={
          upToDate
            ? "AL_DIA"
            : inReview
              ? "EN_REVISION"
              : current.status === "AL_DIA"
                ? "PENDIENTE"
                : current.status
        }
        className="self-start"
      />
      <div className="flex items-start gap-3">
        <Icon
          className={cn(
            "mt-1 size-6 shrink-0",
            upToDate ? "text-ok" : inReview ? "text-review" : "text-due",
          )}
          aria-hidden="true"
        />
        <div className="flex flex-col gap-1">
          <p className="font-heading text-[22px] leading-tight font-semibold text-foreground">
            {upToDate
              ? `Estás al día con ${formatPeriodo(current.periodo).toLowerCase()}`
              : inReview
                ? "Tu pago está en revisión"
                : owed}
          </p>
          {!upToDate && (
            <p className="text-sm text-muted-foreground">
              Pendiente:{" "}
              <span className="tabular text-foreground">
                {formatMoney(status.pending.USD, "USD")}
              </span>
              {status.pending.VES && (
                <>
                  {" "}
                  ≈{" "}
                  <span className="tabular text-foreground">
                    {formatMoney(status.pending.VES, "VES")}
                  </span>
                </>
              )}
              {status.pending.COP && (
                <>
                  {" "}
                  ≈{" "}
                  <span className="tabular text-foreground">
                    {formatMoney(status.pending.COP, "COP")}
                  </span>
                </>
              )}
            </p>
          )}
          {upToDate && coveredUntil(payments, current.periodo) && (
            <p className="text-sm text-muted-foreground">
              Cubierto hasta el {coveredUntil(payments, current.periodo)}.
            </p>
          )}
          {inReview && (
            <p className="text-sm text-muted-foreground">
              El administrador lo confirmará con el banco en breve.
            </p>
          )}
        </div>
      </div>
      {!upToDate && !inReview && (
        <>
          <Link
            href="/mi-cuenta/reportar"
            className={cn(
              buttonVariants(),
              "h-12 rounded-xl font-heading text-[15px] font-semibold",
            )}
          >
            Reportar pago móvil
          </Link>
          <p className="text-center text-[13px] text-muted-foreground">
            ¿Pagas en efectivo? Entrégalo al administrador.
          </p>
        </>
      )}
    </section>
  )
}

function History({ payments }: { payments: Payment[] }) {
  return (
    <section aria-labelledby="hist-t" className="flex flex-col gap-3">
      <h2 id="hist-t" className="text-base font-semibold">
        Historial
      </h2>
      {payments.length === 0 ? (
        <p className="rounded-2xl border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
          Todavía no tienes pagos registrados.
        </p>
      ) : (
        <ul className="flex flex-col overflow-hidden rounded-2xl border bg-card">
          {payments.map((p) => {
            const struck = p.status === "RECHAZADO" || p.status === "ANULADO"
            const detail =
              p.status === "RECHAZADO"
                ? `Rechazado: ${p.reviewNote ?? "sin motivo"}`
                : p.status === "ANULADO"
                  ? `Anulado: ${p.voidReason ?? "sin motivo"}`
                  : p.method === "PAGO_MOVIL"
                    ? `Pago móvil · ref. ${p.reference}`
                    : `${METHOD_LABELS[p.method]} · ${formatDate(p.paidAt)}`
            return (
              <li
                key={p.id}
                className="flex items-center justify-between gap-3 border-b px-4 py-3.5 last:border-b-0"
              >
                <div className="flex min-w-0 flex-col gap-0.5">
                  <span className="text-[15px] text-foreground">{formatPeriodo(p.periodo)}</span>
                  <span
                    className={cn(
                      "text-xs",
                      p.status === "RECHAZADO" ? "text-due" : "text-muted-foreground",
                    )}
                  >
                    {detail}
                  </span>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span
                    className={cn(
                      "tabular text-sm text-foreground",
                      struck && "text-muted-foreground line-through",
                    )}
                  >
                    {formatMoney(p.amount, p.currency)}
                  </span>
                  <PaymentStatusBadge status={p.status} className="h-6 px-2 text-xs" />
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}

async function MyAccount() {
  const session = await requireSession()
  const client = await api()
  const [status, payments] = await Promise.all([
    call(client.GET("/me/status")),
    call(client.GET("/me/payments")),
  ])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-0.5">
        <span className="text-sm text-muted-foreground">Hola,</span>
        <h1 className="text-[26px] font-semibold text-foreground">{session.fullName}</h1>
        <span className="tabular text-[13px] text-muted-foreground">{session.cedula}</span>
      </div>
      <StatusCard status={status} payments={payments} />
      <History payments={payments} />
    </div>
  )
}

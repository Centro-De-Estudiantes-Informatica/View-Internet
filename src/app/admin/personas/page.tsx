import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { PageHeader } from "@/components/card"
import { Pagination } from "@/components/pagination"
import { CreateUserDialog } from "@/components/people/create-user-dialog"
import { PeopleFilters } from "@/components/people/filters"
import { RoleSelect } from "@/components/people/role-select"
import { ListSkeleton } from "@/components/skeletons"
import { EstadoBadge } from "@/components/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { api, call } from "@/lib/api/client"
import type { UserListItem } from "@/lib/api/types"
import { formatMoney, formatPeriodo } from "@/lib/format"
import { oneOf, pageNumber, param } from "@/lib/search-params"
import { requireAdmin } from "@/lib/session"

export const metadata: Metadata = { title: "Personas" }

const PAGE_SIZE = 20
const ROLES = ["ESTUDIANTE", "ADMIN"] as const
const STATES = ["AL_DIA", "PARCIAL", "EN_REVISION", "PENDIENTE"] as const

export default function PeoplePage(props: PageProps<"/admin/personas">) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Personas"
        description="Busca por cédula o nombre, revisa si pagó el mes y cambia el rol."
        actions={<CreateUserDialog />}
      />
      <Suspense fallback={<Skeleton className="h-[104px] rounded-[14px]" />}>
        <PeopleFilters />
      </Suspense>
      <Suspense fallback={<ListSkeleton />}>
        <PeopleList searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}

function periodDetail(user: UserListItem) {
  const period = user.period
  if (!period) return "Sin datos del mes"
  if (period.status === "PARCIAL") {
    return `Abonó ${formatMoney(period.paidUsd, "USD")} de ${formatMoney(period.feeUsd, "USD")}`
  }
  return formatPeriodo(period.periodo)
}

async function PeopleList({
  searchParams,
}: {
  searchParams: PageProps<"/admin/personas">["searchParams"]
}) {
  const session = await requireAdmin()
  const sp = await searchParams
  const q = param(sp.q)
  const role = oneOf(param(sp.rol), ROLES)
  const estado = oneOf(param(sp.estado), STATES)
  const page = pageNumber(param(sp.page))

  const client = await api()
  const result = await call(
    client.GET("/users", { params: { query: { q, role, estado, page, pageSize: PAGE_SIZE } } }),
  )

  if (result.items.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[14px] border bg-card px-5 py-10 text-center">
        <p className="text-[15px] text-muted-foreground">
          {q ? (
            <>Nadie coincide con “{q}”. Revisa la cédula o crea la persona.</>
          ) : (
            "No hay personas con estos filtros."
          )}
        </p>
        {q && <CreateUserDialog />}
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {result.total} {result.total === 1 ? "persona" : "personas"}
      </p>

      {/* Escritorio y tablet: tabla */}
      <div className="relative hidden overflow-x-auto rounded-[14px] border bg-card sm:block">
        <table className="w-full min-w-[760px] border-collapse">
          <thead>
            <tr className="text-left text-[13px] text-muted-foreground">
              <th scope="col" className="border-b border-input px-5 py-3 font-medium">
                Cédula
              </th>
              <th scope="col" className="border-b border-input px-3 py-3 font-medium">
                Nombre
              </th>
              <th scope="col" className="border-b border-input px-3 py-3 font-medium">
                Estado del mes
              </th>
              <th scope="col" className="w-48 border-b border-input px-3 py-3 font-medium">
                Rol
              </th>
              <th scope="col" className="border-b border-input px-5 py-3 text-right font-medium">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {result.items.map((user) => (
              <tr key={user.id} className="border-b last:border-b-0">
                <td className="tabular px-5 py-3 text-sm whitespace-nowrap text-foreground">
                  {user.cedula}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-col">
                    <Link
                      href={`/admin/personas/${user.id}`}
                      className="text-[15px] text-foreground hover:underline"
                    >
                      {user.fullName}
                    </Link>
                    <span className="text-xs text-muted-foreground">
                      {user.active ? periodDetail(user) : "Cuenta desactivada"}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-3">
                  {user.period && <EstadoBadge status={user.period.status} showIcon={false} />}
                </td>
                <td className="px-3 py-3">
                  <RoleSelect
                    userId={user.id}
                    fullName={user.fullName}
                    role={user.role}
                    isSelf={user.id === session.userId}
                  />
                </td>
                <td className="px-5 py-3 text-right">
                  <Link
                    href={`/admin/pagos/nuevo?userId=${user.id}`}
                    className="inline-flex h-10 items-center rounded-lg border border-field-border px-3 text-sm whitespace-nowrap text-primary hover:bg-muted"
                  >
                    Registrar pago
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Teléfono: tarjetas apiladas */}
      <ul className="flex flex-col gap-3 sm:hidden">
        {result.items.map((user) => (
          <li key={user.id} className="flex flex-col gap-3 rounded-[14px] border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 flex-col">
                <Link
                  href={`/admin/personas/${user.id}`}
                  className="truncate text-[15px] font-medium text-foreground"
                >
                  {user.fullName}
                </Link>
                <span className="tabular text-[13px] text-muted-foreground">{user.cedula}</span>
              </div>
              {user.period && <EstadoBadge status={user.period.status} showIcon={false} />}
            </div>
            <span className="text-xs text-muted-foreground">
              {user.active ? periodDetail(user) : "Cuenta desactivada"}
            </span>
            <div className="flex items-start gap-2">
              <div className="flex-1">
                <RoleSelect
                  userId={user.id}
                  fullName={user.fullName}
                  role={user.role}
                  isSelf={user.id === session.userId}
                />
              </div>
              <Link
                href={`/admin/pagos/nuevo?userId=${user.id}`}
                className="inline-flex h-10 items-center rounded-lg border border-field-border px-3 text-sm text-primary"
              >
                Registrar pago
              </Link>
            </div>
          </li>
        ))}
      </ul>

      <Pagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        pathname="/admin/personas"
        params={{ q, rol: role, estado }}
      />
    </div>
  )
}

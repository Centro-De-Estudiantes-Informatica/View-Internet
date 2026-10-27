import { Plus } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { PageHeader } from "@/components/card"
import { Pagination } from "@/components/pagination"
import { PaymentFilters } from "@/components/payments/payment-filters"
import { PaymentsTable } from "@/components/payments/payments-table"
import { ListSkeleton } from "@/components/skeletons"
import { buttonVariants } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { api, call } from "@/lib/api/client"
import { shiftPeriodo } from "@/lib/format"
import { oneOf, pageNumber, param } from "@/lib/search-params"
import { requireAdmin } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Pagos" }

const PAGE_SIZE = 25
const STATUSES = ["EN_REVISION", "APROBADO", "RECHAZADO", "ANULADO"] as const
const METHODS = ["EFECTIVO", "PAGO_MOVIL"] as const
const CURRENCIES = ["USD", "VES", "COP"] as const

type SearchParams = PageProps<"/admin/pagos">["searchParams"]

export default function PaymentsPage(props: PageProps<"/admin/pagos">) {
  return (
    <div className="flex flex-col gap-6">
      <Suspense fallback={<Skeleton className="h-16 w-64" />}>
        <Header searchParams={props.searchParams} />
      </Suspense>
      <Suspense fallback={<ListSkeleton />}>
        <PaymentsList searchParams={props.searchParams} />
      </Suspense>
    </div>
  )
}

async function Header({ searchParams }: { searchParams: SearchParams }) {
  const reviewing = param((await searchParams).estado) === "EN_REVISION"
  return (
    <PageHeader
      title={reviewing ? "Pagos por revisar" : "Pagos"}
      description={
        reviewing
          ? "Pagos móviles reportados por los estudiantes. Verifica la referencia en el banco antes de aprobar."
          : "Todos los pagos registrados. Los pagos no se borran: se anulan con un motivo."
      }
      actions={
        <Link
          href="/admin/pagos/nuevo"
          className={cn(
            buttonVariants(),
            "h-11 rounded-[10px] px-4.5 font-heading text-[15px] font-semibold",
          )}
        >
          <Plus className="size-4" aria-hidden="true" />
          Registrar pago
        </Link>
      }
    />
  )
}

async function PaymentsList({ searchParams }: { searchParams: SearchParams }) {
  await requireAdmin()
  const sp = await searchParams
  const status = oneOf(param(sp.estado), STATUSES)
  const periodo = param(sp.periodo)
  const method = oneOf(param(sp.metodo), METHODS)
  const currency = oneOf(param(sp.moneda), CURRENCIES)
  const page = pageNumber(param(sp.page))

  const client = await api()
  const [result, billing] = await Promise.all([
    call(
      client.GET("/payments", {
        params: {
          query: {
            status,
            periodo: periodo && /^\d{4}-\d{2}$/.test(periodo) ? periodo : undefined,
            method,
            currency,
            page,
            pageSize: PAGE_SIZE,
          },
        },
      }),
    ),
    call(client.GET("/billing/current")),
  ])
  const periods = Array.from({ length: 12 }, (_, i) => shiftPeriodo(billing.periodo, 1 - i))

  return (
    <div className="flex flex-col gap-4">
      <PaymentFilters periods={periods} />
      <p className="text-sm text-muted-foreground" aria-live="polite">
        {result.total} {result.total === 1 ? "pago" : "pagos"}
      </p>
      <PaymentsTable payments={result.items} />
      <Pagination
        page={result.page}
        pageSize={result.pageSize}
        total={result.total}
        pathname="/admin/pagos"
        params={{ estado: status, periodo, metodo: method, moneda: currency }}
      />
    </div>
  )
}

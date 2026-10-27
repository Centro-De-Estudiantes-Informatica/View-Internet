import { Plus } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import { Suspense } from "react"
import { CurrencyTotals } from "@/components/admin/currency-totals"
import { Kpis } from "@/components/admin/kpis"
import { MonthlyChart } from "@/components/admin/monthly-chart"
import { RecentPayments } from "@/components/admin/recent-payments"
import { PageHeader } from "@/components/card"
import { DashboardSkeleton } from "@/components/skeletons"
import { ReviewQueue } from "@/components/payments/review-queue"
import { buttonVariants } from "@/components/ui/button"
import { api, call } from "@/lib/api/client"
import { formatPeriodo } from "@/lib/format"
import { requireAdmin } from "@/lib/session"
import { cn } from "@/lib/utils"

export const metadata: Metadata = { title: "Panel" }

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <Dashboard />
    </Suspense>
  )
}

async function Dashboard() {
  await requireAdmin()
  const client = await api()
  const [summary, billing, monthly, recent, review] = await Promise.all([
    call(client.GET("/metrics/summary")),
    call(client.GET("/billing/current")),
    call(client.GET("/metrics/monthly", { params: { query: { months: 6 } } })),
    call(client.GET("/metrics/recent", { params: { query: { limit: 5 } } })),
    call(client.GET("/payments", { params: { query: { status: "EN_REVISION", pageSize: 5 } } })),
  ])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        eyebrow="Periodo actual"
        title={formatPeriodo(summary.periodo)}
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
      <Kpis summary={summary} />
      <CurrencyTotals summary={summary} billing={billing} />
      <div className="flex flex-wrap gap-4">
        <MonthlyChart points={monthly} expectedUsd={summary.expectedUsd} />
        <RecentPayments payments={recent} />
      </div>
      <ReviewQueue payments={review.items} total={review.total} />
    </div>
  )
}

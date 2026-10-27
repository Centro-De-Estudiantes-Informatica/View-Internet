import type { Metadata } from "next"
import { Suspense } from "react"
import { PageHeader } from "@/components/card"
import { RegisterPaymentForm } from "@/components/payments/register-payment-form"
import { CardSkeleton } from "@/components/skeletons"
import type { StudentOption } from "@/lib/actions/users"
import { ApiError, api, call } from "@/lib/api/client"
import { todayIso } from "@/lib/format"
import { param } from "@/lib/search-params"
import { requireAdmin } from "@/lib/session"

export const metadata: Metadata = { title: "Registrar pago" }

export default function NewPaymentPage(props: PageProps<"/admin/pagos/nuevo">) {
  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <PageHeader
        title="Registrar pago"
        description="Pago en efectivo en dólares, bolívares o pesos."
      />
      <div className="rounded-2xl border bg-card p-5 sm:p-7">
        <Suspense fallback={<CardSkeleton />}>
          <NewPayment searchParams={props.searchParams} />
        </Suspense>
      </div>
    </div>
  )
}

async function NewPayment({
  searchParams,
}: {
  searchParams: PageProps<"/admin/pagos/nuevo">["searchParams"]
}) {
  await requireAdmin()
  const userId = param((await searchParams).userId)
  const client = await api()
  const billing = await call(client.GET("/billing/current"))

  let initialStudent: StudentOption | undefined
  if (userId) {
    try {
      const user = await call(client.GET("/users/{id}", { params: { path: { id: userId } } }))
      const listing = await call(
        client.GET("/users", {
          params: { query: { q: user.cedula.replace(/\D/g, ""), pageSize: 5 } },
        }),
      )
      const status = listing.items.find((u) => u.id === user.id)?.period?.status ?? null
      initialStudent = { id: user.id, cedula: user.cedula, fullName: user.fullName, status }
    } catch (error) {
      if (!(error instanceof ApiError)) throw error
    }
  }

  return (
    <RegisterPaymentForm billing={billing} initialStudent={initialStudent} today={todayIso()} />
  )
}

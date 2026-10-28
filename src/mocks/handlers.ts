/**
 * API simulada para desarrollar sin el backend (`API_MOCKING=enabled`).
 * Reproduce los endpoints y las reglas principales de View-Internet-Backend
 * con datos en memoria. Contraseña de todas las cuentas: `demo1234`.
 */
import { http, HttpResponse } from "msw"
import type { components } from "@/lib/api/schema"

type S = components["schemas"]
type Currency = "USD" | "VES" | "COP"
type PaymentStatus = S["PaymentDto"]["status"]

const PASSWORD = "demo1234"
const TODAY = "2026-10-26"
const PERIODO = "2026-10"
const FEE_USD = 5

interface MockUser {
  id: string
  cedula: string
  fullName: string
  phone: string | null
  role: "ADMIN" | "ESTUDIANTE"
  active: boolean
  mustChangePassword: boolean
  createdAt: string
}

const users: MockUser[] = [
  ["u1", "V-25.000.789", "Ana Gómez", "ADMIN"],
  ["u2", "V-28.123.456", "María Pérez", "ESTUDIANTE"],
  ["u3", "V-30.555.111", "José Rodríguez", "ESTUDIANTE"],
  ["u4", "E-84.002.311", "Camila Duarte", "ESTUDIANTE"],
  ["u5", "V-29.874.120", "Daniel Suárez", "ESTUDIANTE"],
  ["u6", "V-27.410.902", "Luis Méndez", "ADMIN"],
  ["u7", "V-31.220.457", "Valentina Ríos", "ESTUDIANTE"],
  ["u8", "V-26.993.004", "Andrés Peña", "ESTUDIANTE"],
].map(([id, cedula, fullName, role]) => ({
  id: id!,
  cedula: cedula!,
  fullName: fullName!,
  phone: null,
  role: role as MockUser["role"],
  active: true,
  mustChangePassword: false,
  createdAt: "2026-05-02T13:00:00.000Z",
}))

const rates: S["RateDto"][] = [
  {
    id: "r1",
    currency: "VES",
    ratePerUsd: "200.0000",
    effectiveDate: TODAY,
    createdAt: `${TODAY}T12:00:00.000Z`,
  },
  {
    id: "r2",
    currency: "COP",
    ratePerUsd: "4000.0000",
    effectiveDate: TODAY,
    createdAt: `${TODAY}T12:00:00.000Z`,
  },
]

let nextId = 100
const id = (prefix: string) => `${prefix}${nextId++}`

function rateFor(currency: Currency): number {
  if (currency === "USD") return 1
  const rate = rates.find((r) => r.currency === currency)
  return rate ? Number(rate.ratePerUsd) : NaN
}

function payment(
  userId: string,
  periodo: string,
  currency: Currency,
  amount: number,
  status: PaymentStatus,
  extra: Partial<S["PaymentDto"]> = {},
): S["PaymentDto"] {
  const user = users.find((u) => u.id === userId)!
  const rate = rateFor(currency)
  return {
    id: id("p"),
    user: { id: user.id, cedula: user.cedula, fullName: user.fullName },
    periodo,
    method: "EFECTIVO",
    currency,
    amount: amount.toFixed(2),
    rate: rate.toFixed(4),
    rateDate: currency === "USD" ? null : TODAY,
    amountUsd: (amount / rate).toFixed(2),
    status,
    reference: null,
    bank: null,
    payerPhone: null,
    paidAt: TODAY,
    hasReceipt: false,
    note: null,
    registeredBy: status === "APROBADO" ? "Luis Méndez" : null,
    reviewedBy: null,
    reviewedAt: null,
    reviewNote: null,
    voidedBy: null,
    voidedAt: null,
    voidReason: null,
    createdAt: `${TODAY}T14:00:00.000Z`,
    ...extra,
  }
}

const mobile = (reference: string, bank: string) => ({
  method: "PAGO_MOVIL" as const,
  reference,
  bank,
  payerPhone: "04141234567",
  hasReceipt: true,
})

const payments: S["PaymentDto"][] = [
  payment("u2", PERIODO, "VES", 1000, "APROBADO", mobile("552310", "0134")),
  payment("u2", "2026-11", "USD", 5, "APROBADO"),
  payment("u3", "2026-09", "USD", 5, "APROBADO", { paidAt: "2026-09-12" }),
  payment("u3", "2026-08", "VES", 960, "RECHAZADO", {
    ...mobile("552301", "0105"),
    reviewNote: "La referencia no aparece en el banco",
    paidAt: "2026-08-10",
  }),
  payment("u4", PERIODO, "COP", 20000, "APROBADO"),
  payment("u5", PERIODO, "VES", 600, "EN_REVISION", mobile("118094", "0105")),
  payment("u6", PERIODO, "USD", 5, "APROBADO"),
  payment("u1", PERIODO, "VES", 1000, "EN_REVISION", mobile("004512", "0134")),
  payment("u7", PERIODO, "VES", 1000, "EN_REVISION", mobile("773201", "0102")),
]

const history: Record<string, number> = {
  "2026-05": 380,
  "2026-06": 412,
  "2026-07": 395,
  "2026-08": 430,
  "2026-09": 433,
}

// ---------------------------------------------------------------- helpers

const ok = <T>(body: T, status = 200) => HttpResponse.json(body as never, { status })
const fail = (status: number, code: string, message: string) =>
  HttpResponse.json({ code, message }, { status })

function currentUser(request: Request): MockUser | null {
  const token = request.headers.get("authorization")?.replace(/^Bearer mock:/, "")
  return users.find((u) => u.id === token && u.active) ?? null
}

type Guard = { user: MockUser } | { response: Response }

function guard(request: Request, role?: "ADMIN"): Guard {
  const user = currentUser(request)
  if (!user) return { response: fail(401, "UNAUTHORIZED", "Sesión inválida") }
  if (user.mustChangePassword && !new URL(request.url).pathname.endsWith("/change-password")) {
    return { response: fail(403, "PASSWORD_CHANGE_REQUIRED", "Debe cambiar la contraseña") }
  }
  if (role && user.role !== role) return { response: fail(403, "FORBIDDEN", "Sin permiso") }
  return { user }
}

const digits = (text: string) => text.replace(/\D/g, "")
const fold = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()

function session(user: MockUser): S["SessionDto"] {
  return {
    accessToken: `mock:${user.id}`,
    tokenType: "Bearer",
    expiresIn: 8 * 3600,
    role: user.role,
    mustChangePassword: user.mustChangePassword,
    user,
  }
}

function balance(userId: string, periodo: string): S["PeriodBalanceDto"] {
  const own = payments.filter((p) => p.user.id === userId && p.periodo === periodo)
  const paid = own
    .filter((p) => p.status === "APROBADO")
    .reduce((sum, p) => sum + Number(p.amountUsd), 0)
  const inReviewCount = own.filter((p) => p.status === "EN_REVISION").length
  const status =
    paid >= FEE_USD - 0.05
      ? "AL_DIA"
      : paid > 0
        ? "PARCIAL"
        : inReviewCount > 0
          ? "EN_REVISION"
          : "PENDIENTE"
  return {
    periodo,
    status,
    feeUsd: FEE_USD.toFixed(2),
    paidUsd: paid.toFixed(2),
    balanceUsd: Math.max(0, FEE_USD - paid).toFixed(2),
    inReviewCount,
  }
}

function inCurrencies(usd: number): S["AmountByCurrencyDto"] {
  return {
    USD: usd.toFixed(2),
    VES: (usd * rateFor("VES")).toFixed(2),
    COP: (usd * rateFor("COP")).toFixed(2),
  }
}

function paginate<T>(items: T[], url: URL) {
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1))
  const pageSize = Math.min(100, Math.max(1, Number(url.searchParams.get("pageSize") ?? 20)))
  return {
    items: items.slice((page - 1) * pageSize, page * pageSize),
    total: items.length,
    page,
    pageSize,
  }
}

function review(
  request: Request,
  paymentId: string,
  from: PaymentStatus,
  apply: (p: S["PaymentDto"], admin: MockUser) => void,
) {
  const g = guard(request, "ADMIN")
  if ("response" in g) return g.response
  const p = payments.find((x) => x.id === paymentId)
  if (!p) return fail(404, "PAYMENT_NOT_FOUND", "Pago no encontrado")
  if (p.status !== from) return fail(409, "INVALID_PAYMENT_STATE", "El pago ya fue revisado")
  apply(p, g.user)
  return ok(p)
}

// ---------------------------------------------------------------- handlers

export function createHandlers(baseUrl: string) {
  const u = (path: string) => `${baseUrl}${path}`

  return [
    http.get(u("/health"), () => ok({ status: "ok" })),

    http.post(u("/auth/login"), async ({ request }) => {
      const body = (await request.json()) as { cedula: string; password: string }
      const user = users.find((x) => digits(x.cedula) === digits(body.cedula))
      if (!user || body.password !== PASSWORD) {
        return fail(401, "INVALID_CREDENTIALS", "Credenciales inválidas")
      }
      if (!user.active) return fail(403, "ACCOUNT_DISABLED", "Cuenta desactivada")
      return ok(session(user))
    }),

    http.post(u("/auth/change-password"), async ({ request }) => {
      const g = guard(request)
      if ("response" in g) return g.response
      const body = (await request.json()) as { currentPassword: string; newPassword: string }
      if (body.currentPassword !== PASSWORD) {
        return fail(422, "INVALID_CURRENT_PASSWORD", "Contraseña actual incorrecta")
      }
      g.user.mustChangePassword = false
      return ok(session(g.user))
    }),

    http.get(u("/me"), ({ request }) => {
      const g = guard(request)
      return "response" in g ? g.response : ok(g.user)
    }),

    http.get(u("/billing/current"), ({ request }) => {
      const g = guard(request)
      if ("response" in g) return g.response
      const current = (c: "VES" | "COP") => {
        const r = rates.find((x) => x.currency === c)
        return r
          ? {
              ratePerUsd: r.ratePerUsd,
              effectiveDate: r.effectiveDate,
              stale: r.effectiveDate < "2026-10-25",
            }
          : null
      }
      return ok({
        periodo: PERIODO,
        feeUsd: FEE_USD.toFixed(2),
        fee: inCurrencies(FEE_USD),
        rates: { VES: current("VES"), COP: current("COP") },
      })
    }),

    http.put(u("/billing/fee"), async ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const body = (await request.json()) as { feeUsd: string }
      return ok({
        feeUsd: body.feeUsd,
        currentPeriod: PERIODO,
        currentPeriodFeeUsd: FEE_USD.toFixed(2),
      })
    }),

    http.get(u("/billing/rates"), ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const currency = new URL(request.url).searchParams.get("currency")
      return ok(rates.filter((r) => !currency || r.currency === currency))
    }),

    http.post(u("/billing/rates"), async ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const body = (await request.json()) as {
        currency: "VES" | "COP"
        ratePerUsd: string
        effectiveDate?: string
      }
      const rate = {
        id: id("r"),
        currency: body.currency,
        ratePerUsd: Number(body.ratePerUsd).toFixed(4),
        effectiveDate: body.effectiveDate ?? TODAY,
        createdAt: new Date().toISOString(),
      }
      rates.unshift(rate)
      return ok(rate)
    }),

    http.get(u("/users"), ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const url = new URL(request.url)
      const q = url.searchParams.get("q")?.trim() ?? ""
      const role = url.searchParams.get("role")
      const estado = url.searchParams.get("estado")
      const periodo = url.searchParams.get("periodo") ?? PERIODO
      const items = users
        .filter((x) => !role || x.role === role)
        .filter((x) => {
          if (!q) return true
          const d = digits(q)
          return d.length >= 3 ? digits(x.cedula).includes(d) : fold(x.fullName).includes(fold(q))
        })
        .map((x) => {
          const b = balance(x.id, periodo)
          return {
            ...x,
            period: { periodo, status: b.status, paidUsd: b.paidUsd, feeUsd: b.feeUsd },
          }
        })
        .filter((x) => !estado || x.period.status === estado)
      return ok(paginate(items, url))
    }),

    http.post(u("/users"), async ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const body = (await request.json()) as {
        cedula: string
        fullName: string
        phone?: string
        role?: MockUser["role"]
      }
      const d = digits(body.cedula)
      if (d.length < 5) return fail(422, "INVALID_CEDULA", "Cédula inválida")
      if (users.some((x) => digits(x.cedula) === d))
        return fail(409, "CEDULA_TAKEN", "Cédula registrada")
      const prefix = /^\s*e/i.test(body.cedula) ? "E" : "V"
      const user: MockUser = {
        id: id("u"),
        cedula: `${prefix}-${d.replace(/\B(?=(\d{3})+(?!\d))/g, ".")}`,
        fullName: body.fullName.trim(),
        phone: body.phone ?? null,
        role: body.role ?? "ESTUDIANTE",
        active: true,
        mustChangePassword: true,
        createdAt: new Date().toISOString(),
      }
      users.push(user)
      return ok({ user, temporaryPassword: PASSWORD }, 201)
    }),

    http.get(u("/users/:id"), ({ request, params }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const user = users.find((x) => x.id === params.id)
      return user ? ok(user) : fail(404, "USER_NOT_FOUND", "No existe")
    }),

    http.patch(u("/users/:id"), async ({ request, params }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const user = users.find((x) => x.id === params.id)
      if (!user) return fail(404, "USER_NOT_FOUND", "No existe")
      const body = (await request.json()) as Partial<MockUser>
      if (body.active === false && user.id === g.user.id) {
        return fail(409, "CANNOT_DEACTIVATE_SELF", "No puede desactivarse")
      }
      Object.assign(user, body)
      return ok(user)
    }),

    http.patch(u("/users/:id/role"), async ({ request, params }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const user = users.find((x) => x.id === params.id)
      if (!user) return fail(404, "USER_NOT_FOUND", "No existe")
      const { role } = (await request.json()) as { role: MockUser["role"] }
      if (user.id === g.user.id) return fail(409, "CANNOT_CHANGE_OWN_ROLE", "Propio rol")
      const admins = users.filter((x) => x.role === "ADMIN" && x.active)
      if (user.role === "ADMIN" && role !== "ADMIN" && admins.length <= 1) {
        return fail(409, "LAST_ADMIN", "Último administrador")
      }
      user.role = role
      return ok(user)
    }),

    http.post(u("/users/:id/reset-password"), ({ request, params }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const user = users.find((x) => x.id === params.id)
      if (!user) return fail(404, "USER_NOT_FOUND", "No existe")
      user.mustChangePassword = true
      return ok({ temporaryPassword: PASSWORD })
    }),

    http.get(u("/payments"), ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const url = new URL(request.url)
      const f = (k: string) => url.searchParams.get(k)
      const items = payments.filter(
        (p) =>
          (!f("status") || p.status === f("status")) &&
          (!f("periodo") || p.periodo === f("periodo")) &&
          (!f("userId") || p.user.id === f("userId")) &&
          (!f("method") || p.method === f("method")) &&
          (!f("currency") || p.currency === f("currency")),
      )
      return ok(paginate(items, url))
    }),

    http.post(u("/payments/cash"), async ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const body = (await request.json()) as {
        userId: string
        periodo: string
        currency: Currency
        amount: string
        paidAt?: string
        note?: string
      }
      if (!users.some((x) => x.id === body.userId)) return fail(404, "USER_NOT_FOUND", "No existe")
      if (Number.isNaN(rateFor(body.currency))) return fail(422, "RATE_MISSING", "Sin tasa")
      const p = payment(body.userId, body.periodo, body.currency, Number(body.amount), "APROBADO", {
        paidAt: body.paidAt ?? TODAY,
        note: body.note ?? null,
        registeredBy: g.user.fullName,
        createdAt: new Date().toISOString(),
      })
      payments.unshift(p)
      return ok(p, 201)
    }),

    http.post(u("/payments/:id/approve"), ({ request, params }) =>
      review(request, String(params.id), "EN_REVISION", (p, admin) => {
        p.status = "APROBADO"
        p.reviewedBy = admin.fullName
        p.reviewedAt = new Date().toISOString()
      }),
    ),

    http.post(u("/payments/:id/reject"), async ({ request, params }) => {
      const { reason } = (await request.clone().json()) as { reason: string }
      return review(request, String(params.id), "EN_REVISION", (p, admin) => {
        p.status = "RECHAZADO"
        p.reviewedBy = admin.fullName
        p.reviewedAt = new Date().toISOString()
        p.reviewNote = reason
      })
    }),

    http.post(u("/payments/:id/void"), async ({ request, params }) => {
      const { reason } = (await request.clone().json()) as { reason: string }
      return review(request, String(params.id), "APROBADO", (p, admin) => {
        p.status = "ANULADO"
        p.voidedBy = admin.fullName
        p.voidedAt = new Date().toISOString()
        p.voidReason = reason
      })
    }),

    http.get(u("/payments/:id/receipt"), ({ request, params }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const p = payments.find((x) => x.id === params.id)
      if (!p?.hasReceipt) return fail(404, "RECEIPT_NOT_FOUND", "Sin captura")
      return ok({
        url: "https://placehold.co/600x1000/png?text=Captura+de+pago+movil",
        expiresIn: 300,
      })
    }),

    http.get(u("/me/status"), ({ request }) => {
      const g = guard(request)
      if ("response" in g) return g.response
      const current = balance(g.user.id, PERIODO)
      const owed = ["2026-08", "2026-09", PERIODO]
        .map((periodo) => balance(g.user.id, periodo))
        .filter((b) => b.status !== "AL_DIA")
      const pending = owed.reduce((sum, b) => sum + Number(b.balanceUsd), 0)
      return ok({ current, owedPeriods: owed, pending: inCurrencies(pending) })
    }),

    http.get(u("/me/payments"), ({ request }) => {
      const g = guard(request)
      if ("response" in g) return g.response
      return ok(payments.filter((p) => p.user.id === g.user.id))
    }),

    http.post(u("/me/payments/mobile"), async ({ request }) => {
      const g = guard(request)
      if ("response" in g) return g.response
      const form = await request.formData()
      const reference = String(form.get("reference") ?? "")
      const bank = String(form.get("bank") ?? "")
      // Igual que el backend: código SUDEBAN de 4 dígitos y referencia de 4 a 20 dígitos.
      if (!/^\d{4}$/.test(bank) || !/^\d{4,20}$/.test(reference)) {
        return fail(422, "VALIDATION_ERROR", "Datos inválidos")
      }
      const duplicate = payments.some(
        (p) =>
          p.bank === bank &&
          p.reference === reference &&
          ["EN_REVISION", "APROBADO"].includes(p.status),
      )
      if (duplicate) return fail(409, "DUPLICATE_REFERENCE", "Referencia duplicada")
      const p = payment(
        g.user.id,
        String(form.get("periodo") || PERIODO),
        "VES",
        Number(form.get("amount")),
        "EN_REVISION",
        {
          method: "PAGO_MOVIL",
          reference,
          bank,
          payerPhone: String(form.get("payerPhone") ?? ""),
          paidAt: String(form.get("paidAt") ?? TODAY),
          hasReceipt: form.get("receipt") instanceof File,
          createdAt: new Date().toISOString(),
        },
      )
      payments.unshift(p)
      return ok(p, 201)
    }),

    http.get(u("/metrics/summary"), ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const periodo = new URL(request.url).searchParams.get("periodo") ?? PERIODO
      const approved = payments.filter((p) => p.periodo === periodo && p.status === "APROBADO")
      const collected = (c: Currency) => {
        const list = approved.filter((p) => p.currency === c)
        return {
          amount: list.reduce((s, p) => s + Number(p.amount), 0).toFixed(2),
          amountUsd: list.reduce((s, p) => s + Number(p.amountUsd), 0).toFixed(2),
          count: list.length,
        }
      }
      const totalUsd = approved.reduce((s, p) => s + Number(p.amountUsd), 0)
      const students = users.filter((x) => x.active && x.role === "ESTUDIANTE")
      const counts = { AL_DIA: 0, PARCIAL: 0, EN_REVISION: 0, PENDIENTE: 0 }
      for (const s of students) counts[balance(s.id, periodo).status]++
      const expected = students.length * FEE_USD
      const inReview = payments.filter((p) => p.status === "EN_REVISION")
      return ok({
        periodo,
        feeUsd: FEE_USD.toFixed(2),
        collected: { USD: collected("USD"), VES: collected("VES"), COP: collected("COP") },
        totalUsd: totalUsd.toFixed(2),
        expectedUsd: expected.toFixed(2),
        percentCollected: expected ? ((totalUsd / expected) * 100).toFixed(1) : "0.0",
        students: { total: students.length, ...counts },
        inReview: {
          period: inReview.filter((p) => p.periodo === periodo).length,
          total: inReview.length,
        },
      })
    }),

    http.get(u("/metrics/monthly"), ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const months = Number(new URL(request.url).searchParams.get("months") ?? 6)
      const current = payments
        .filter((p) => p.periodo === PERIODO && p.status === "APROBADO")
        .reduce((s, p) => s + Number(p.amountUsd), 0)
      const series = [
        ...Object.entries(history).map(([periodo, total]) => ({
          periodo,
          totalUsd: total.toFixed(2),
        })),
        { periodo: PERIODO, totalUsd: current.toFixed(2) },
      ]
      return ok(series.slice(-months))
    }),

    http.get(u("/metrics/recent"), ({ request }) => {
      const g = guard(request, "ADMIN")
      if ("response" in g) return g.response
      const limit = Number(new URL(request.url).searchParams.get("limit") ?? 10)
      return ok(
        payments
          .filter((p) => p.status === "APROBADO")
          .slice(0, limit)
          .map((p) => ({
            id: p.id,
            user: p.user,
            method: p.method,
            currency: p.currency,
            amount: p.amount,
            amountUsd: p.amountUsd,
            periodo: p.periodo,
            paidAt: p.paidAt,
            approvedAt: p.reviewedAt ?? p.createdAt,
          })),
      )
    }),
  ]
}

export type Currency = "USD" | "VES" | "COP"

const TIME_ZONE = "America/Caracas"

const MONEY: Record<Currency, { prefix: string; locale: string; decimals: number }> = {
  USD: { prefix: "$", locale: "en-US", decimals: 2 },
  VES: { prefix: "Bs", locale: "es-VE", decimals: 2 },
  COP: { prefix: "COP", locale: "es-CO", decimals: 0 },
}

function formatNumber(value: number, locale: string, decimals: number): string {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    useGrouping: "always",
  }).format(value)
}

/** `"1000.00"`, `"VES"` → `"Bs 1.000,00"`. Los montos llegan de la API como strings decimales. */
export function formatMoney(amount: string | number, currency: Currency): string {
  const { prefix, locale, decimals } = MONEY[currency]
  return `${prefix} ${formatNumber(Number(amount), locale, decimals)}`
}

/** Tasa por USD: `"200.0000"`, `"VES"` → `"200,00 Bs/USD"`. */
export function formatRate(rate: string | number, currency: Exclude<Currency, "USD">): string {
  const { locale, decimals } = MONEY[currency]
  const unit = currency === "VES" ? "Bs/USD" : "COP/USD"
  return `${formatNumber(Number(rate), locale, decimals)} ${unit}`
}

/** Monto para un campo de formulario, sin prefijo: `"1000.00"` → `"1.000,00"`. */
export function formatAmountInput(amount: string | number, currency: Currency): string {
  const { locale, decimals } = MONEY[currency]
  return formatNumber(Number(amount), locale, decimals)
}

/**
 * Convierte lo escrito por el usuario a un decimal para la API.
 * Bs y COP usan coma decimal (`1.000,50`); USD usa punto (`1,000.50`).
 * Devuelve `null` si no es un monto positivo con hasta 2 decimales.
 */
export function parseAmountInput(input: string, currency: Currency): string | null {
  let text = input.trim().replace(/\s/g, "")
  if (!text) return null
  if (currency === "USD") {
    text = text.replace(/,/g, "")
  } else {
    text = text.replace(/\./g, "").replace(",", ".")
  }
  if (!/^\d+(\.\d{1,2})?$/.test(text)) return null
  const value = Number(text)
  if (!(value > 0)) return null
  return value.toFixed(2)
}

const MONTHS = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
]

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

/** `"2026-10"` → `"Octubre 2026"`. */
export function formatPeriodo(periodo: string): string {
  const [year, month] = periodo.split("-").map(Number)
  const name = MONTHS[month - 1]
  return name ? `${capitalize(name)} ${year}` : periodo
}

/** `"2026-10"` → `"Oct"`. */
export function formatPeriodoShort(periodo: string): string {
  const month = Number(periodo.split("-")[1])
  const name = MONTHS[month - 1]
  return name ? capitalize(name.slice(0, 3)) : periodo
}

/** `"2026-10"` → `"2026-11"` (con `offset` meses). */
export function shiftPeriodo(periodo: string, offset: number): string {
  const [year, month] = periodo.split("-").map(Number)
  const index = year * 12 + (month - 1) + offset
  return `${Math.floor(index / 12)}-${String((index % 12) + 1).padStart(2, "0")}`
}

/** Fecha `AAAA-MM-DD` o ISO → `26/10/2026` en hora de Venezuela. */
export function formatDate(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-")
    return `${d}/${m}/${y}`
  }
  return new Intl.DateTimeFormat("es-VE", {
    timeZone: TIME_ZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value))
}

/** Fecha de hoy en Venezuela como `AAAA-MM-DD`. */
export function todayIso(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(now)
}

/** Iniciales para un avatar: `"María Pérez"` → `"MP"`. */
export function initials(fullName: string): string {
  return fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("")
}

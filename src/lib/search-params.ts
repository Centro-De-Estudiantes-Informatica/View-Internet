/** Primer valor de un parámetro de búsqueda, o `undefined`. */
export function param(value: string | string[] | undefined): string | undefined {
  const first = Array.isArray(value) ? value[0] : value
  return first?.trim() || undefined
}

/** Valor permitido de una lista, o `undefined`. */
export function oneOf<T extends string>(
  value: string | undefined,
  allowed: readonly T[],
): T | undefined {
  return allowed.includes(value as T) ? (value as T) : undefined
}

export function pageNumber(value: string | undefined): number {
  const n = Number(value)
  return Number.isInteger(n) && n > 0 ? n : 1
}

import { describe, expect, it } from "vitest"
import {
  formatAmountInput,
  formatDate,
  formatMoney,
  formatPeriodo,
  formatPeriodoShort,
  formatRate,
  initials,
  parseAmountInput,
  shiftPeriodo,
  todayIso,
} from "./format"

describe("formatMoney", () => {
  it("formatea cada moneda con su convención", () => {
    expect(formatMoney("5", "USD")).toBe("$ 5.00")
    expect(formatMoney("1000.00", "VES")).toBe("Bs 1.000,00")
    expect(formatMoney("41600.5", "VES")).toBe("Bs 41.600,50")
    expect(formatMoney("232000.00", "COP")).toBe("COP 232.000")
  })
})

describe("formatRate", () => {
  it("muestra la unidad de la tasa", () => {
    expect(formatRate("200.0000", "VES")).toBe("200,00 Bs/USD")
    expect(formatRate("4000.0000", "COP")).toBe("4.000 COP/USD")
  })
})

describe("parseAmountInput", () => {
  it("acepta coma decimal en Bs y COP", () => {
    expect(parseAmountInput("1.000,50", "VES")).toBe("1000.50")
    expect(parseAmountInput("20.000", "COP")).toBe("20000.00")
  })

  it("acepta punto decimal en USD", () => {
    expect(parseAmountInput("5", "USD")).toBe("5.00")
    expect(parseAmountInput("1,250.75", "USD")).toBe("1250.75")
  })

  it("rechaza montos vacíos, cero, negativos o con más de 2 decimales", () => {
    expect(parseAmountInput("", "USD")).toBeNull()
    expect(parseAmountInput("0", "USD")).toBeNull()
    expect(parseAmountInput("-5", "USD")).toBeNull()
    expect(parseAmountInput("5.123", "USD")).toBeNull()
    expect(parseAmountInput("abc", "VES")).toBeNull()
  })

  it("es inversa de formatAmountInput", () => {
    expect(parseAmountInput(formatAmountInput("1000.00", "VES"), "VES")).toBe("1000.00")
    expect(parseAmountInput(formatAmountInput("20000.00", "COP"), "COP")).toBe("20000.00")
  })
})

describe("periodos y fechas", () => {
  it("nombra el mes en español", () => {
    expect(formatPeriodo("2026-10")).toBe("Octubre 2026")
    expect(formatPeriodoShort("2026-09")).toBe("Sep")
  })

  it("desplaza periodos cruzando el año", () => {
    expect(shiftPeriodo("2026-12", 1)).toBe("2027-01")
    expect(shiftPeriodo("2026-01", -1)).toBe("2025-12")
    expect(shiftPeriodo("2026-10", 0)).toBe("2026-10")
  })

  it("formatea fechas AAAA-MM-DD sin zona horaria", () => {
    expect(formatDate("2026-10-26")).toBe("26/10/2026")
  })

  it("calcula hoy en hora de Venezuela", () => {
    // 02:00 UTC del 27 = 22:00 del 26 en Caracas (UTC-4).
    expect(todayIso(new Date("2026-10-27T02:00:00Z"))).toBe("2026-10-26")
  })
})

describe("initials", () => {
  it("toma las dos primeras iniciales", () => {
    expect(initials("María Pérez")).toBe("MP")
    expect(initials("  ana  ")).toBe("A")
  })
})

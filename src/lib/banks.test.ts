import { describe, expect, it } from "vitest"
import { BANKS, bankName } from "./banks"

describe("bancos", () => {
  it("usan códigos de 4 dígitos únicos, como exige el backend", () => {
    const codes = BANKS.map((b) => b.code)
    expect(codes.every((c) => /^\d{4}$/.test(c))).toBe(true)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it("traduce el código al nombre", () => {
    expect(bankName("0134")).toBe("Banesco")
    expect(bankName("9999")).toBe("9999")
    expect(bankName(null)).toBe("—")
  })
})

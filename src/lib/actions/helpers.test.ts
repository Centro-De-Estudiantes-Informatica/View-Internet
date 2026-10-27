import { describe, expect, it } from "vitest"
import { ApiError } from "@/lib/api/client"
import type { ActionResult } from "@/lib/errors"
import { keepValues, toFailure } from "./helpers"

describe("keepValues", () => {
  it("devuelve los textos enviados junto al error, sin archivos ni campos internos", () => {
    const form = new FormData()
    form.set("cedula", "V-28.123.456")
    form.set("$ACTION_ID_abc", "x")
    form.set("receipt", new File(["x"], "c.png", { type: "image/png" }))
    const failure: ActionResult = { ok: false, code: "VALIDATION_ERROR", message: "m" }
    const result = keepValues(failure, form)
    expect(result).toMatchObject({ values: { cedula: "V-28.123.456" } })
    expect(result && !result.ok && result.values).not.toHaveProperty("receipt")
    expect(result && !result.ok && result.values).not.toHaveProperty("$ACTION_ID_abc")
  })

  it("no toca los resultados exitosos", () => {
    const ok = { ok: true as const, data: undefined }
    expect(keepValues(ok, new FormData())).toBe(ok)
  })
})

describe("toFailure", () => {
  it("traduce el código de la API a un mensaje en español", () => {
    const result = toFailure(new ApiError(409, "LAST_ADMIN", "Último administrador"))
    expect(result).toMatchObject({
      ok: false,
      code: "LAST_ADMIN",
      message: "Debe quedar al menos un administrador",
    })
  })

  it("relanza lo que no es un ApiError (p. ej. redirect)", () => {
    expect(() => toFailure(new Error("NEXT_REDIRECT"))).toThrow("NEXT_REDIRECT")
  })
})

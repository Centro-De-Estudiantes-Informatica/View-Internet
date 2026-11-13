import { describe, expect, it } from "vitest"
import { clientIpHeaders } from "./client-ip"

const SECRET = "s".repeat(32)

describe("clientIpHeaders", () => {
  it("manda la primera IP de X-Forwarded-For con el secreto", () => {
    const headers = new Headers({ "x-forwarded-for": "190.1.2.3, 10.0.0.1" })
    expect(clientIpHeaders(headers, SECRET)).toEqual({
      "X-Client-IP": "190.1.2.3",
      "X-Client-IP-Secret": SECRET,
    })
  })

  it("usa X-Real-IP si no hay X-Forwarded-For", () => {
    const headers = new Headers({ "x-real-ip": "190.4.5.6" })
    expect(clientIpHeaders(headers, SECRET)?.["X-Client-IP"]).toBe("190.4.5.6")
  })

  it("no manda nada sin secreto o sin IP", () => {
    expect(
      clientIpHeaders(new Headers({ "x-forwarded-for": "1.1.1.1" }), undefined),
    ).toBeUndefined()
    expect(clientIpHeaders(new Headers(), SECRET)).toBeUndefined()
  })
})

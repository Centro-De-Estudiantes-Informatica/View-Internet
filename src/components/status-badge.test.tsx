import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { EstadoBadge, PaymentStatusBadge } from "./status-badge"

describe("EstadoBadge", () => {
  it.each([
    ["AL_DIA", "Al día"],
    ["PARCIAL", "Parcial"],
    ["EN_REVISION", "En revisión"],
    ["PENDIENTE", "Pendiente"],
  ] as const)("muestra %s con texto, no solo color", (status, label) => {
    render(<EstadoBadge status={status} />)
    expect(screen.getByText(label)).toBeInTheDocument()
  })

  it("incluye un ícono decorativo oculto a lectores de pantalla", () => {
    const { container } = render(<EstadoBadge status="PENDIENTE" />)
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true")
  })

  it("puede omitir el ícono", () => {
    const { container } = render(<EstadoBadge status="AL_DIA" showIcon={false} />)
    expect(container.querySelector("svg")).toBeNull()
  })
})

describe("PaymentStatusBadge", () => {
  it("traduce los estados del pago", () => {
    render(
      <>
        <PaymentStatusBadge status="APROBADO" />
        <PaymentStatusBadge status="RECHAZADO" />
        <PaymentStatusBadge status="ANULADO" />
      </>,
    )
    expect(screen.getByText("Aprobado")).toBeInTheDocument()
    expect(screen.getByText("Rechazado")).toBeInTheDocument()
    expect(screen.getByText("Anulado")).toBeInTheDocument()
  })
})

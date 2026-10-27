import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Field, FormError } from "./field"

describe("Field", () => {
  it("asocia la etiqueta al control", () => {
    render(
      <Field id="cedula" label="Cédula">
        <input id="cedula" />
      </Field>,
    )
    expect(screen.getByLabelText("Cédula")).toBeInTheDocument()
  })

  it("muestra el error como alerta con el id esperado por aria-describedby", () => {
    render(
      <Field id="amount" label="Monto" error="Escribe un monto mayor que cero" hint="Cuota $5.00">
        <input id="amount" aria-describedby="amount-error" />
      </Field>,
    )
    const alert = screen.getByRole("alert")
    expect(alert).toHaveTextContent("Escribe un monto mayor que cero")
    expect(alert).toHaveAttribute("id", "amount-error")
    expect(screen.getByLabelText("Monto")).toHaveAccessibleDescription(
      "Escribe un monto mayor que cero",
    )
    // Con error, la ayuda se oculta.
    expect(screen.queryByText("Cuota $5.00")).toBeNull()
  })
})

describe("FormError", () => {
  it("no renderiza nada sin mensaje", () => {
    const { container } = render(<FormError />)
    expect(container).toBeEmptyDOMElement()
  })
})

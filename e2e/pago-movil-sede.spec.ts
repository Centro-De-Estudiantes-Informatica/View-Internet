import { expect, test } from "@playwright/test"
import { loginAsAdmin, loginAsStudent } from "./helpers"

test("el administrador cambia los datos de pago móvil y el estudiante los ve", async ({
  browser,
}) => {
  const admin = await browser.newPage()
  await loginAsAdmin(admin)
  await admin.goto("/admin/ajustes")
  const panel = admin.getByRole("region", { name: "Pago móvil de la sede" })
  await panel.getByLabel("Teléfono").fill("12")
  await panel.getByRole("button", { name: "Guardar datos" }).click()
  await expect(panel.getByText("Escribe el teléfono, p. ej. 0414-1234567")).toBeVisible()

  await panel.getByLabel("Banco").selectOption("Mercantil")
  await panel.getByLabel("Teléfono").fill("0412-7654321")
  await panel.getByLabel("Cédula o RIF").fill("v 12.345.678")
  await panel.getByRole("button", { name: "Guardar datos" }).click()
  await expect(admin.getByText("Datos de pago móvil guardados")).toBeVisible()
  await expect(panel.getByLabel("Cédula o RIF")).toHaveValue("V-12345678")

  const student = await browser.newPage()
  await loginAsStudent(student)
  await student.goto("/mi-cuenta/reportar")
  const data = student.getByRole("region", { name: "Paga a la sede con estos datos" })
  await expect(data.getByText("Mercantil")).toBeVisible()
  await expect(data.getByText("04127654321")).toBeVisible()
  await expect(data.getByText("V-12345678")).toBeVisible()
})

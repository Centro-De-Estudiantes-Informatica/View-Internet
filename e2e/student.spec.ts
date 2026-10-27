import { expect, test } from "@playwright/test"
import { STUDENT, expectNoHorizontalScroll, loginAsStudent } from "./helpers"

test("el estudiante ve su estado y reporta un pago móvil", async ({ page }) => {
  await loginAsStudent(page)
  await expect(page.getByRole("heading", { name: STUDENT.name })).toBeVisible()
  await expect(page.getByRole("region", { name: "Estado del mes" })).toBeVisible()
  await expect(page.getByText("Rechazado: La referencia no aparece en el banco")).toBeVisible()
  await expectNoHorizontalScroll(page)

  const report = page.getByRole("link", { name: "Reportar pago móvil" })
  test.skip(!(await report.isVisible()), "El estudiante ya no tiene meses pendientes")
  await report.click()
  const reference = String(Date.now()).slice(-8)
  await page.getByLabel("Número de referencia").fill(reference)
  await page.getByLabel("Tu banco").selectOption("Mercantil")
  await page.getByLabel("Teléfono desde el que pagaste").fill("0414-7654321")
  await expectNoHorizontalScroll(page)
  await page.getByRole("button", { name: "Enviar para revisión" }).click()
  await expect(page).toHaveURL(/\/mi-cuenta$/)
  await expect(page.getByText(`Pago móvil · ref. ${reference}`)).toBeVisible()
})

test("una referencia repetida se marca en el campo", async ({ page }) => {
  await loginAsStudent(page)
  await page.goto("/mi-cuenta/reportar")
  await page.getByLabel("Número de referencia").fill("004512")
  await page.getByLabel("Tu banco").selectOption("Banesco")
  await page.getByLabel("Teléfono desde el que pagaste").fill("0414-7654321")
  await page.getByRole("button", { name: "Enviar para revisión" }).click()
  await expect(page.getByText("Esta referencia ya fue reportada")).toBeVisible()
  await expect(page.getByLabel("Número de referencia")).toHaveValue("004512")
})

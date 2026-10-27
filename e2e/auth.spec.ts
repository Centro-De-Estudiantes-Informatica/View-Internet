import { expect, test } from "@playwright/test"
import { STUDENT, expectNoHorizontalScroll, login, loginAsAdmin } from "./helpers"

test("credenciales inválidas muestran un error genérico y conservan la cédula", async ({
  page,
}) => {
  await login(page, "28.123.456", "incorrecta")
  await expect(page.getByRole("alert").filter({ hasText: "Cédula" })).toHaveText(
    "Cédula o contraseña incorrecta",
  )
  await expect(page.getByLabel("Cédula")).toHaveValue("28.123.456")
  await expectNoHorizontalScroll(page)
})

test("sin sesión, las rutas protegidas llevan al login", async ({ page }) => {
  await page.goto("/admin/personas")
  await expect(page).toHaveURL(/\/login$/)
})

test("el administrador entra al panel", async ({ page }) => {
  await loginAsAdmin(page)
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/\w+ \d{4}/)
  await expect(page.getByText("Recaudado (equiv. USD)")).toBeVisible()
  await expectNoHorizontalScroll(page)
})

test("un estudiante no puede entrar a /admin", async ({ page }) => {
  await login(page, STUDENT.cedula)
  await expect(page).toHaveURL(/\/mi-cuenta$/)
  await page.goto("/admin")
  await expect(page).toHaveURL(/\/mi-cuenta$/)
})

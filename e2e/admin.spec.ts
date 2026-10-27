import { expect, test } from "@playwright/test"
import { ADMIN, expectNoHorizontalScroll, loginAsAdmin } from "./helpers"

test.beforeEach(async ({ page }) => {
  await loginAsAdmin(page)
})

test("registrar un pago en efectivo en bolívares", async ({ page }) => {
  await page.goto("/admin/pagos/nuevo")
  await page.getByPlaceholder("Cédula o nombre del estudiante").fill("andres")
  await page.getByRole("button", { name: /Andrés Peña/ }).click()
  await page.getByRole("button", { name: "VES · Bs" }).click()
  await expect(page.locator("#amount")).toHaveValue("1.000,00")
  await expect(page.getByText(/Cuota \$ 5\.00 × 200,00 Bs\/USD/)).toBeVisible()
  await expectNoHorizontalScroll(page)
  await page.getByRole("button", { name: "Guardar pago" }).click()
  await expect(page).toHaveURL(/\/admin\/personas\//)
  await expect(page.getByRole("heading", { name: "Andrés Peña" })).toBeVisible()
})

test("un monto inválido se marca sin perder lo escrito", async ({ page }) => {
  await page.goto("/admin/pagos/nuevo")
  await page.locator("#amount").fill("0")
  await page.getByLabel("Nota (opcional)").fill("prueba")
  await page.getByRole("button", { name: "Guardar pago" }).click()
  await expect(page.getByText("Elige al estudiante")).toBeVisible()
  await expect(page.getByText("Escribe un monto mayor que cero")).toBeVisible()
  await expect(page.getByLabel("Nota (opcional)")).toHaveValue("prueba")
})

test("aprobar un pago móvil en revisión", async ({ page }) => {
  await page.goto("/admin/pagos?estado=EN_REVISION")
  const rows = page.locator("tbody tr")
  const before = await rows.count()
  test.skip(before === 0, "No quedan pagos en revisión en la API simulada")
  await rows.first().getByRole("button", { name: "Aprobar" }).click()
  await expect(page.getByText(/Pago aprobado/)).toBeVisible()
  await expect(rows).toHaveCount(before - 1)
})

test("rechazar exige un motivo", async ({ page }) => {
  await page.goto("/admin/pagos?estado=EN_REVISION")
  const rows = page.locator("tbody tr")
  test.skip((await rows.count()) === 0, "No quedan pagos en revisión en la API simulada")
  await rows.first().getByRole("button", { name: "Rechazar" }).click()
  const dialog = page.getByRole("dialog")
  await dialog.getByRole("button", { name: "Rechazar pago" }).click()
  await expect(dialog.getByRole("alert")).toHaveText("Escribe el motivo")
  await dialog.getByRole("button", { name: "Cancelar" }).click()
})

test("cambiar el rol pide confirmación y la propia cuenta está bloqueada", async ({ page }) => {
  await page.goto(`/admin/personas?q=${encodeURIComponent("camila")}`)
  // En teléfono la tabla se oculta y se muestran tarjetas: usar el control visible.
  const select = page.getByLabel("Rol de Camila Duarte").filter({ visible: true })
  const target = (await select.inputValue()) === "ADMIN" ? "ESTUDIANTE" : "ADMIN"
  await select.selectOption(target)
  await expect(page.getByRole("alertdialog")).toContainText("¿Hacer a Camila Duarte")
  await page.getByRole("button", { name: "Sí, cambiar rol" }).click()
  await expect(
    page.getByText(`Camila Duarte ahora es ${target === "ADMIN" ? "Administrador" : "Estudiante"}`),
  ).toBeVisible()

  await page.goto(`/admin/personas?q=${encodeURIComponent(ADMIN.name)}`)
  await expect(page.getByLabel(`Rol de ${ADMIN.name}`).filter({ visible: true })).toBeDisabled()
  await expect(
    page.getByText("Eres tú: no puedes cambiar tu rol").filter({ visible: true }),
  ).toBeVisible()
})

test("la búsqueda ignora puntos y acentos", async ({ page }) => {
  await page.goto("/admin/personas")
  await page.getByRole("searchbox", { name: "Buscar", exact: true }).fill("28.123")
  await expect(
    page.getByRole("link", { name: "María Pérez" }).filter({ visible: true }),
  ).toBeVisible()
  await expect(page).toHaveURL(/q=28\.123/)
  await page.getByRole("searchbox", { name: "Buscar", exact: true }).fill("jose")
  await expect(
    page.getByRole("link", { name: "José Rodríguez" }).filter({ visible: true }),
  ).toBeVisible()
  await expectNoHorizontalScroll(page)
})

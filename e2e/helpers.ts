import { type Page, expect } from "@playwright/test"

export const ADMIN = { cedula: "V-25.000.789", name: "Ana Gómez" }
export const STUDENT = { cedula: "30555111", name: "José Rodríguez" }
export const PASSWORD = "demo1234"

export async function login(page: Page, cedula: string, password = PASSWORD) {
  await page.goto("/login")
  await page.getByLabel("Cédula").fill(cedula)
  await page.getByLabel("Contraseña").fill(password)
  await page.getByRole("button", { name: "Entrar" }).click()
}

export async function loginAsStudent(page: Page) {
  await login(page, STUDENT.cedula)
  await expect(page).toHaveURL(/\/mi-cuenta$/, { timeout: 20_000 })
}

export async function loginAsAdmin(page: Page) {
  await login(page, ADMIN.cedula)
  await expect(page).toHaveURL(/\/admin$/, { timeout: 20_000 })
}

/** La página no debe desplazarse horizontalmente (diseño responsive). */
export async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  )
  expect(overflow).toBeLessThanOrEqual(1)
}

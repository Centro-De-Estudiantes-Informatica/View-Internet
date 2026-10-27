import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"
import { loginAsAdmin, loginAsStudent } from "./helpers"

// Recorre varias páginas; en `next dev` la primera visita compila cada una.
test.describe.configure({ timeout: 120_000 })

const PAGES = {
  admin: ["/admin", "/admin/personas", "/admin/pagos", "/admin/pagos/nuevo", "/admin/ajustes"],
  student: ["/mi-cuenta", "/mi-cuenta/reportar"],
}

async function audit(page: import("@playwright/test").Page, path: string, theme: "light" | "dark") {
  await page.emulateMedia({ colorScheme: theme })
  await page.goto(path)
  await page.waitForLoadState("networkidle")
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    // El overlay de Next.js solo existe en desarrollo.
    .exclude("nextjs-portal")
    .analyze()
  const summary = violations.map(
    (v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(" | ")}`,
  )
  expect(summary, `${path} (${theme})`).toEqual([])
}

for (const theme of ["light", "dark"] as const) {
  test(`login sin violaciones AA (${theme})`, async ({ page }) => {
    await audit(page, "/login", theme)
  })

  test(`pantallas del administrador sin violaciones AA (${theme})`, async ({ page }) => {
    await loginAsAdmin(page)
    for (const path of PAGES.admin) await audit(page, path, theme)
  })

  test(`pantallas del estudiante sin violaciones AA (${theme})`, async ({ page }) => {
    await loginAsStudent(page)
    for (const path of PAGES.student) await audit(page, path, theme)
  })
}

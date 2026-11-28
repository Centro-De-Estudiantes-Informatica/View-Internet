import { deflateSync, crc32 } from "node:zlib"
import { randomBytes } from "node:crypto"
import { expect, test } from "@playwright/test"
import { login, loginAsAdmin, loginAsStudent } from "./helpers"

/** PNG de ruido: casi no se comprime, así que sigue pesando más de 1 MB como JPEG. */
function noisePng(size: number): Buffer {
  const chunk = (type: string, data: Buffer) => {
    const body = Buffer.concat([Buffer.from(type), data])
    const length = Buffer.alloc(4)
    length.writeUInt32BE(data.length)
    const crc = Buffer.alloc(4)
    crc.writeUInt32BE(crc32(body) >>> 0)
    return Buffer.concat([length, body, crc])
  }
  const header = Buffer.alloc(13)
  header.writeUInt32BE(size, 0)
  header.writeUInt32BE(size, 4)
  header.set([8, 2, 0, 0, 0], 8)
  const rows = Array.from({ length: size }, () =>
    Buffer.concat([Buffer.from([0]), randomBytes(size * 3)]),
  )
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(Buffer.concat(rows), { level: 1 })),
    chunk("IEND", Buffer.alloc(0)),
  ])
}

const uniqueCedula = () => String(10_000_000 + Math.floor(Math.random() * 80_000_000))

test.describe.configure({ timeout: 60_000 })

test("primer arranque: sin cuota, el admin llega a Ajustes y la configura", async ({
  page,
  request,
}) => {
  await request.post("/api/mock/__test/clear-fee")
  await loginAsAdmin(page)
  await expect(
    page.getByRole("heading", { name: "Falta configurar la cuota mensual" }),
  ).toBeVisible()
  await page.goto("/admin/pagos/nuevo")
  await expect(
    page.getByRole("heading", { name: "Falta configurar la cuota mensual" }),
  ).toBeVisible()
  await page.goto("/admin/pagos")
  await expect(page.getByRole("heading", { name: "Pagos", exact: true })).toBeVisible()
  await page.goto("/admin/personas?estado=PENDIENTE")
  await expect(
    page.getByRole("heading", { name: "Falta configurar la cuota mensual" }),
  ).toBeVisible()

  await page.goto("/admin")
  await page.getByRole("link", { name: "Ir a Cuota y tasas" }).click()
  await expect(page).toHaveURL(/\/admin\/ajustes$/)
  await expect(page.getByLabel("Cuota mensual (USD)")).toHaveValue("")
  await page.getByLabel("Cuota mensual (USD)").fill("5.00")
  await page.getByRole("button", { name: "Guardar cuota" }).click()
  await expect(page.getByText("Cuota actualizada")).toBeVisible()
  await page.goto("/admin")
  await expect(page.getByText("Recaudado (equiv. USD)")).toBeVisible()
})

test("primer arranque: el estudiante ve un aviso en lugar de un error", async ({
  page,
  request,
}) => {
  await request.post("/api/mock/__test/clear-fee")
  await loginAsStudent(page)
  await expect(
    page.getByRole("heading", { name: "Todavía no hay cuota configurada" }),
  ).toBeVisible()
  await page.goto("/mi-cuenta/reportar")
  await expect(
    page.getByRole("heading", { name: "Todavía no hay cuota configurada" }),
  ).toBeVisible()
  await request.put("/api/mock/billing/fee", {
    headers: { authorization: "Bearer mock:u1" },
    data: { feeUsd: "5.00" },
  })
})

test("una captura de más de 1 MB se envía sin romper el formulario", async ({ page }) => {
  await login(page, "26.993.004")
  await expect(page).toHaveURL(/\/mi-cuenta$/, { timeout: 20_000 })
  await page.goto("/mi-cuenta/reportar")
  const reference = String(Date.now()).slice(-8)
  await page.getByLabel("Número de referencia").fill(reference)
  await page.getByLabel("Tu banco").selectOption("Banesco")
  await page.getByLabel("Teléfono desde el que pagaste").fill("0414-7654321")
  await page.locator("#receipt").setInputFiles({
    name: "captura.png",
    mimeType: "image/png",
    buffer: noisePng(1400),
  })
  const label = page.getByText(/captura\.jpg · \d+ KB/)
  await expect(label).toBeVisible({ timeout: 15_000 })
  const kb = Number((await label.innerText()).match(/(\d+) KB/)![1])
  expect(kb).toBeGreaterThan(1024)
  await page.getByRole("button", { name: "Enviar para revisión" }).click()
  await expect(page).toHaveURL(/\/mi-cuenta$/, { timeout: 20_000 })
  await expect(page.getByText(`Pago móvil · ref. ${reference}`)).toBeVisible()
})

test("una captura que no entra en el límite se rechaza antes de enviar", async ({ page }) => {
  await loginAsStudent(page)
  await page.goto("/mi-cuenta/reportar")
  const enorme = {
    name: "enorme.jpg",
    mimeType: "image/jpeg",
    buffer: randomBytes(4 * 1024 * 1024 + 1),
  }
  // En el build de producción el HTML llega antes de que React hidrate el formulario: un archivo
  // adjuntado en ese intervalo no dispara el manejador. Se vuelve a adjuntar hasta que responda.
  await expect(async () => {
    await page.locator("#receipt").setInputFiles(enorme)
    await expect(page.getByText("La captura debe ser JPG o PNG de máximo 4 MB")).toBeVisible({
      timeout: 2000,
    })
  }).toPass({ timeout: 20_000 })
})

test("los diálogos de la cuenta se cierran y dejan ver la contraseña temporal", async ({
  page,
}) => {
  await loginAsAdmin(page)
  await page.goto("/admin/personas")
  await page.getByRole("button", { name: "Nueva persona" }).first().click()
  const create = page.getByRole("dialog")
  const cedula = uniqueCedula()
  await create.getByLabel("Cédula").fill(cedula)
  await create.getByLabel("Nombre completo").fill(`Prueba Diálogos ${cedula}`)
  await create.getByRole("button", { name: "Crear persona" }).click()
  await create.getByRole("link", { name: "Ver ficha" }).click()
  await expect(page).toHaveURL(/\/admin\/personas\/u/)

  await page.getByRole("button", { name: "Restablecer contraseña" }).click()
  await page.getByRole("alertdialog").getByRole("button", { name: "Restablecer" }).click()
  await expect(page.getByRole("alertdialog")).toBeHidden()
  await expect(page.getByRole("button", { name: "Copiar" })).toBeVisible()

  await page.getByRole("button", { name: "Desactivar cuenta" }).click()
  await page.getByRole("alertdialog").getByRole("button", { name: "Desactivar" }).click()
  await expect(page.getByRole("alertdialog")).toBeHidden()
  await expect(page.getByRole("button", { name: "Activar cuenta" })).toBeVisible()
})

test("si le quitan el rol con la sesión abierta, vuelve a entrar con avisos claros", async ({
  page,
  browser,
}) => {
  await loginAsAdmin(page)
  const context = await browser.newContext({ baseURL: "http://localhost:3001" })
  const other = await context.newPage()
  await login(other, "V-27.410.902")
  await expect(other).toHaveURL(/\/admin$/, { timeout: 20_000 })

  const setRole = async (role: "ADMIN" | "ESTUDIANTE", done: string) => {
    await page.goto("/admin/personas?q=27410902")
    await page.getByLabel("Rol de Luis Méndez").filter({ visible: true }).selectOption(role)
    await page.getByRole("button", { name: "Sí, cambiar rol" }).click()
    await expect(page.getByText(done)).toBeVisible()
  }
  await setRole("ESTUDIANTE", "Luis Méndez ahora es Estudiante")
  await other.goto("/admin")
  await expect(other).toHaveURL(/\/login\?motivo=permisos/, { timeout: 15_000 })
  await expect(other.getByText("Tus permisos cambiaron")).toBeVisible()
  await setRole("ADMIN", "Luis Méndez ahora es Administrador")
  await context.close()
})

test("un administrador no entra al portal del estudiante", async ({ page }) => {
  await loginAsAdmin(page)
  await page.goto("/mi-cuenta/reportar")
  await expect(page).toHaveURL(/\/admin$/)
})

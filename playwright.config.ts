import { defineConfig, devices } from "@playwright/test"

const PORT = 3001
const baseURL = `http://localhost:${PORT}`

// Las pruebas usan la API simulada (src/mocks), cuyo estado vive en memoria:
// corren en serie y no asumen datos que otra prueba pudo haber cambiado.
export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: { baseURL, trace: "retain-on-failure", locale: "es-VE", timezoneId: "America/Caracas" },
  projects: [
    { name: "telefono", use: { ...devices["Pixel 7"], viewport: { width: 390, height: 844 } } },
    {
      name: "escritorio",
      use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: `${baseURL}/login`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      API_MOCKING: "enabled",
      API_BASE_URL: `${baseURL}/api/mock`,
      SESSION_SECRET: "e2e-session-secret-at-least-32-characters-long",
    },
  },
})

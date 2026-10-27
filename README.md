# View-Internet

App web para controlar el pago mensual del internet de la sede de Informática. Tiene dos roles:

- **Administrador**: panel de ingresos (USD, VES y COP), personas (búsqueda por cédula o nombre y cambio de rol), registro de pagos en efectivo, revisión de pagos móviles, cuota mensual y tasas del día.
- **Estudiante**: estado del mes, historial de pagos y reporte de pago móvil.

Toda la lógica de negocio vive en [View-Internet-Backend](../View-Internet-Backend); esta app solo presenta datos y envía acciones.

## Stack

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · shadcn/ui (Base UI) · iron-session · openapi-fetch.

## Puesta en marcha

```bash
npm install
cp .env.example .env.local   # completar API_BASE_URL y SESSION_SECRET
npm run dev                  # http://localhost:3001 (la API usa el 3000)
```

| Variable                                                                         | Descripción                                                                       |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| `API_BASE_URL`                                                                   | URL de la API, sin barra final                                                    |
| `SESSION_SECRET`                                                                 | Clave de al menos 32 caracteres para cifrar la cookie (`openssl rand -base64 32`) |
| `API_MOCKING`                                                                    | `enabled` para usar la API simulada                                               |
| `SEDE_PAGO_MOVIL_BANCO`, `SEDE_PAGO_MOVIL_TELEFONO`, `SEDE_PAGO_MOVIL_DOCUMENTO` | Datos de pago móvil que ve el estudiante (opcionales)                             |

### Sin backend (API simulada)

```env
API_MOCKING=enabled
API_BASE_URL=http://localhost:3001/api/mock
```

Cuentas de prueba, todas con contraseña `demo1234`: administradora `V-25.000.789` (Ana Gómez) y estudiante `V-30.555.111` (José Rodríguez). Los datos viven en memoria y se reinician con el servidor.

## Scripts

| Script                                                  | Qué hace                                                                                                                    |
| ------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm run api:types`                                     | Regenera `src/lib/api/schema.d.ts` desde el OpenAPI del backend (`OPENAPI_SOURCE` acepta una ruta o la URL de `/docs-json`) |
| `npm run typecheck` / `npm run lint` / `npm run format` | Tipos, ESLint, Prettier                                                                                                     |
| `npm test`                                              | Pruebas unitarias (Vitest)                                                                                                  |
| `npm run test:e2e`                                      | Pruebas e2e y de accesibilidad (Playwright + axe) a 390 px y 1440 px, contra la API simulada                                |
| `npm run build`                                         | Build de producción                                                                                                         |

## Estructura

```
src/
  app/(auth)/        login y cambio de contraseña
  app/admin/         panel, personas, pagos, ajustes
  app/mi-cuenta/     portal del estudiante
  app/api/mock/      API simulada (solo con API_MOCKING=enabled)
  lib/api/           cliente tipado de la API y tipos generados
  lib/actions/       Server Actions (auth, usuarios, pagos, cuota y tasas)
  lib/session*.ts    sesión cifrada en cookie httpOnly
  proxy.ts           redirecciones por rol
e2e/                 pruebas Playwright
```

## Documentación

En [`docs/`](docs/README.md): [arquitectura](docs/arquitectura.md), [flujos](docs/flujos.md), [pantallas](docs/pantallas.md) y [desarrollo](docs/desarrollo.md). La especificación y el diseño originales están en `openspec/changes/add-payment-control-web/`.

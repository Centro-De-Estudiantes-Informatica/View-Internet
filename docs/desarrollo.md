# Desarrollo

## Requisitos

- Node.js 22 o superior.
- El backend corriendo en local (ver [su documentación de operación](https://github.com/Centro-De-Estudiantes-Informatica/View-Internet-Backend/blob/main/docs/operacion.md)), o la API simulada de este repo.

## Instalación

```bash
npm install
cp .env.example .env.local
npm run dev        # http://localhost:3001
```

La web corre en el puerto **3001** porque la API usa el 3000.

### Variables de entorno

| Variable                    | Obligatoria | Descripción                                                                                                                           |
| --------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `API_BASE_URL`              | Sí          | URL de la API sin barra final, p. ej. `http://localhost:3000`                                                                         |
| `SESSION_SECRET`            | Sí          | Clave de al menos 32 caracteres para cifrar la cookie. Genera una con `openssl rand -base64 32`. Cambiarla cierra todas las sesiones. |
| `API_MOCKING`               | No          | `enabled` activa la API simulada en `/api/mock`                                                                                       |
| `SEDE_PAGO_MOVIL_BANCO`     | No          | Banco de la sede para el pago móvil                                                                                                   |
| `SEDE_PAGO_MOVIL_TELEFONO`  | No          | Teléfono de la sede para el pago móvil                                                                                                |
| `SEDE_PAGO_MOVIL_DOCUMENTO` | No          | Cédula o RIF de la sede                                                                                                               |

Se validan al arrancar (`src/instrumentation.ts`): si falta alguna obligatoria, el servidor no inicia y dice cuál.

## Trabajar sin backend: API simulada

```env
API_MOCKING=enabled
API_BASE_URL=http://localhost:3001/api/mock
```

`src/app/api/mock/[...path]/route.ts` sirve los mismos endpoints que el backend usando los handlers de MSW en `src/mocks/handlers.ts`, con los datos del diseño y reglas básicas (roles, último administrador, referencia duplicada, banco de 4 dígitos). El estado vive en memoria y se reinicia con el servidor.

| Cuenta                      | Cédula         | Contraseña |
| --------------------------- | -------------- | ---------- |
| Administradora (Ana Gómez)  | `V-25.000.789` | `demo1234` |
| Administrador (Luis Méndez) | `V-27.410.902` | `demo1234` |
| Estudiante (José Rodríguez) | `V-30.555.111` | `demo1234` |

La API simulada no reemplaza las pruebas contra el backend real: no replica todas sus validaciones. Cuando la API cambie, actualiza también los handlers.

## Tipos de la API

```bash
npm run api:types                                              # desde ../View-Internet-Backend/openapi.json
OPENAPI_SOURCE=http://localhost:3000/docs-json npm run api:types  # desde la API en marcha
```

Genera `src/lib/api/schema.d.ts` (no se edita a mano). El script `scripts/gen-api-types.mjs` corrige `page` y `pageSize`, que el backend publica como `Object` en vez de enteros. Después de regenerar, `npm run typecheck` muestra lo que hay que ajustar.

## Scripts

| Script                            | Qué hace                                          |
| --------------------------------- | ------------------------------------------------- |
| `npm run dev`                     | Servidor de desarrollo en :3001                   |
| `npm run build` / `npm start`     | Build y servidor de producción                    |
| `npm run typecheck`               | TypeScript sin emitir                             |
| `npm run lint`                    | ESLint                                            |
| `npm run format` / `format:check` | Prettier                                          |
| `npm test`                        | Pruebas unitarias (Vitest)                        |
| `npm run test:e2e`                | Pruebas e2e y de accesibilidad (Playwright + axe) |
| `npm run api:types`               | Regenera los tipos de la API                      |

## Pruebas

### Unitarias (Vitest)

Archivos `*.test.ts(x)` junto al código: formato de dinero y fechas, bancos, badges de estado, campos de formulario y helpers de las Server Actions.

### E2E y accesibilidad (Playwright)

`npm run test:e2e` levanta `next dev` con la API simulada (o reutiliza el que esté corriendo en :3001) y prueba en dos tamaños: **teléfono (390 px)** y **escritorio (1440 px)**.

| Archivo               | Qué cubre                                                                 |
| --------------------- | ------------------------------------------------------------------------- |
| `e2e/auth.spec.ts`    | Login, error genérico, rutas protegidas, estudiante sin acceso a `/admin` |
| `e2e/admin.spec.ts`   | Registrar pago, validaciones, aprobar y rechazar, cambio de rol, búsqueda |
| `e2e/student.spec.ts` | Estado, historial, reporte de pago móvil, referencia duplicada            |
| `e2e/a11y.spec.ts`    | axe (WCAG 2.1 AA) en todas las pantallas, en modo claro y oscuro          |

Todas las pruebas verifican también que no haya desplazamiento horizontal.

> **Cuidado:** no corras dos `next dev` a la vez sobre esta carpeta. Comparten `.next/` y se pisan entre sí, lo que provoca recompilaciones y recargas en bucle. Si pasa, detén todos (`lsof -i:3001`), borra `.next/` y vuelve a arrancar uno solo.

## Convenciones

- **Una página nueva** sigue el patrón de las existentes: parte estática fuera de `<Suspense>` y un componente asíncrono adentro que llama a `requireAdmin()`/`requireSession()` y luego a la API. Si la sección necesita un error propio, `error.tsx` usa `ErrorState`.
- **Un formulario nuevo** usa `useActionState` con una Server Action en `src/lib/actions/` que valida, llama a la API, hace `refresh()` y devuelve un `ActionResult`. Envuelve la acción con `keepValues()` para no vaciar el formulario al fallar.
- **Un error nuevo de la API**: agrega su `code` y su mensaje en español a `src/lib/errors.ts`.
- **Dinero**: nunca operar montos en la web. Formatear con `formatMoney` y convertir lo escrito con `parseAmountInput`. Bs y COP usan coma decimal; USD, punto.
- **Accesibilidad**: cada control con su `<label>`; errores con `role="alert"` y `aria-describedby`; objetivos táctiles de al menos 44 px; los estados llevan texto, no solo color.
- **Next.js 16**: esta versión cambió APIs (Proxy en vez de Middleware, Cache Components, `refresh()`). Ante dudas, la documentación instalada está en `node_modules/next/dist/docs/`.

## Despliegue (Vercel)

1. Importar el repositorio en Vercel (framework Next.js, sin configuración extra).
2. Variables de entorno: `API_BASE_URL` (URL pública de la API), `SESSION_SECRET` (distinta en cada entorno) y los `SEDE_PAGO_MOVIL_*`. **No** definir `API_MOCKING` en producción.
3. En el backend, `TRUST_PROXY` debe ser mayor que 0 para que el límite de intentos por IP use el `X-Forwarded-For` que envía la web.
4. Probar el flujo completo en la vista previa (login del administrador, registrar un pago, reportar y aprobar un pago móvil) antes de promover a producción.

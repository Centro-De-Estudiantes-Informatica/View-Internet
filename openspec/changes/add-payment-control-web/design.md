## Context

App web para el control de la cuota mensual de internet de la sede de Informática. La lógica de negocio (estados, conversiones, reglas de roles) vive en `View-Internet-Backend` (cambio `add-payment-control-api`); esta web solo presenta datos y envía acciones. El diseño visual de referencia está en el canvas "View Internet · Diseño" (https://claude.ai/artifact/XKeh3iN1uskhqoUvhtPG7z): login, panel, personas, registrar pago, inicio del estudiante y reporte de pago móvil.

## Goals / Non-Goals

**Goals:**
- Dos experiencias claras: administrador (escritorio primero, usable en teléfono) y estudiante (teléfono primero).
- Cero lógica de dinero en el cliente: montos y estados vienen de la API como strings decimales y se formatean con `Intl.NumberFormat`.
- Accesible (AA) y responsive desde 360 px.

**Non-Goals:**
- Autorregistro de estudiantes y notificaciones.
- PWA u offline (puede evaluarse después).
- Control del router o hotspot (fase 2).

## Decisions

### 1. Next.js App Router + Tailwind + shadcn/ui en Vercel
Server Components para las páginas de datos (sin estados de carga en cascada), Server Actions para los formularios y shadcn/ui (Radix) para diálogos, selects y toasts accesibles. Recharts (o barras con CSS) para el gráfico mensual.
- *Alternativa*: SPA con Vite → habría que exponer el token al navegador y manejar CORS con credenciales.

### 2. Patrón BFF para la sesión
`POST /auth/login` se llama desde una Server Action. El JWT se guarda cifrado en una cookie httpOnly de la propia web (`iron-session`, con `SESSION_SECRET`). Todas las llamadas a la API salen del servidor de Next con `Authorization: Bearer`. `src/proxy.ts` (en Next 16, Middleware pasó a llamarse Proxy) hace el chequeo optimista de `/admin/**` y `/mi-cuenta/**` según el rol; cada página vuelve a exigir la sesión con `requireAdmin()`/`requireSession()` y la API valida todo de nuevo (defensa en profundidad). Un 401 de la API lleva a `/salir`, una Route Handler que borra la cookie (los Server Components no pueden hacerlo).

### 3. Cliente tipado desde OpenAPI
`openapi-typescript` + `openapi-fetch` generan tipos desde el OpenAPI del backend (`npm run api:types`, script `scripts/gen-api-types.mjs`). El script corrige `page`/`pageSize`, que el backend publica como `allOf: [Object]` en vez de enteros. `src/lib/api/client.ts` centraliza la URL base, el token y el error `ApiError`; `src/lib/errors.ts` traduce cada `{ code }` a un mensaje en español.

### 4. Rutas
```
/login                      público
/cambiar-clave              sesión con mustChangePassword
/admin                      panel
/admin/personas             listado (?q=&rol=&estado=&page=)
/admin/personas/[id]        ficha + historial + registrar pago
/admin/pagos                pagos (?estado=EN_REVISION)
/admin/ajustes              cuota y tasas
/mi-cuenta                  estado + historial
/mi-cuenta/reportar         reportar pago móvil
```
"Registrar pago" es una página propia (`/admin/pagos/nuevo?userId=`), responsive, a la que se llega desde el panel, Personas, la ficha y la lista de pagos. Se descartó el diálogo con ruta interceptada del plan original: añadía complejidad sin ventaja real, y una página ya tiene URL propia y funciona igual en teléfono.

### 5. Estado y frescura
La app usa Cache Components (por defecto en Next 16): las lecturas son `fetch` sin caché (`no-store`) dentro de `<Suspense>` con esqueletos, porque leer la sesión o los `searchParams` exige un límite de Suspense. `getSession()` llama a `connection()` porque valida la sesión contra la hora actual. Tras cada mutación, la Server Action llama a `refresh()` para actualizar la vista. Las actualizaciones optimistas solo se usan en el selector de rol, que vuelve atrás si la API rechaza. Los formularios devuelven lo enviado en los errores (`keepValues`), porque React 19 vacía el formulario después de cada acción.

### 6. Tema
Tokens en CSS (`:root` + `[data-theme="light"|"dark"]` + `prefers-color-scheme`) mapeados en Tailwind. El fondo de malla es un `radial-gradient` repetido en `body`; las líneas de nodos y las ondas Wi-Fi del login son un SVG decorativo en línea. Las fuentes se cargan con `next/font` (Sora, IBM Plex Sans, JetBrains Mono).

### 7. Formato de dinero y cédula
`Intl.NumberFormat('es-VE')` para Bs (`1.000,00`), `es-CO` para COP (`232.000`) y `en-US` para USD (`5.00`). La cédula se muestra como `V-28.123.456`; la búsqueda envía el texto tal cual y el backend lo normaliza.

### 8. API simulada para desarrollo y pruebas
Con `API_MOCKING=enabled`, `src/app/api/mock/[...path]` sirve con MSW (`getResponse`) los mismos endpoints del backend, con los datos del diseño y estado en memoria (contraseña `demo1234`). Se sirve desde una Route Handler y no interceptando `fetch` con `setupServer`, porque en Next 16 el render de páginas no siempre corre en el contexto donde se instaló el interceptor.

### 9. Datos de pago móvil de la sede
Banco, teléfono y cédula/RIF salen de variables de entorno opcionales (`SEDE_PAGO_MOVIL_*`); si faltan, la pantalla muestra "Por configurar".

## Risks / Trade-offs

- [El backend todavía no existe y el contrato puede cambiar] → Generar los tipos desde OpenAPI y usar una API simulada (MSW) con los datos del mockup mientras tanto.
- [Arranque en frío de la API] → Esqueletos de carga en Server Components con `loading.tsx`.
- [Conexiones lentas en el campus] → Páginas livianas, captura comprimida en el cliente antes de subirla y pocas fuentes.
- [Un error del administrador al cambiar roles] → Confirmación en los cambios a/desde Administrador y mensajes claros para `LAST_ADMIN`.

## Migration Plan

Proyecto nuevo. Crear el proyecto en Vercel, configurar `API_BASE_URL` y `SESSION_SECRET`, desplegar una vista previa contra la rama `dev` de la API y promover a producción cuando la API esté publicada.

## Open Questions

- Nombre y logo definitivos (en el mockup: "View Internet · Sede de Informática"); ¿la sede tiene colores institucionales?
- Datos de pago móvil de la sede (banco, teléfono, cédula/RIF): ¿fijos en configuración o editables en Ajustes?
- ¿El administrador necesita exportar a Excel/CSV los pagos del mes?

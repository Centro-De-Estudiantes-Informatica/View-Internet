## 1. Base del proyecto

- [x] 1.1 Crear la app Next.js (App Router, TypeScript estricto) con ESLint y Prettier
- [x] 1.2 Instalar Tailwind CSS y shadcn/ui; agregar button, input, select, dialog, sheet, table, badge, toast y dropdown-menu
- [x] 1.3 Variables de entorno validadas (`API_BASE_URL`, `SESSION_SECRET`)
- [x] 1.4 Generar el cliente tipado desde el OpenAPI del backend y crear `lib/api.ts` con el mapa de códigos de error en español
- [x] 1.5 API simulada (MSW) con los datos del mockup para trabajar sin backend

## 2. Tema visual

- [x] 2.1 Tokens de color en CSS (oscuro por defecto, claro, `prefers-color-scheme`) mapeados en Tailwind
- [x] 2.2 Fuentes con `next/font`: Sora, IBM Plex Sans y JetBrains Mono
- [x] 2.3 Fondo de malla de puntos global y SVG de nodos + ondas Wi-Fi para el login
- [x] 2.4 Componente `EstadoBadge` (al día, parcial, en revisión, pendiente) con texto e icono
- [x] 2.5 Selector de modo claro/oscuro persistido
- [x] 2.6 Utilidades de formato de moneda (USD/VES/COP) y de cédula

## 3. Autenticación

- [x] 3.1 Página `/login` y Server Action de login con cookie cifrada httpOnly
- [x] 3.2 Página `/cambiar-clave` y bloqueo de rutas mientras `mustChangePassword` esté activo
- [x] 3.3 Middleware de protección por rol y redirecciones
- [x] 3.4 Manejo global del 401 (sesión expirada) y "Cerrar sesión"

## 4. Layout del administrador

- [x] 4.1 Menú lateral en escritorio y barra inferior en teléfono, con el contador "Por revisar"
- [x] 4.2 Buscador global por cédula o nombre en la cabecera

## 5. Panel

- [x] 5.1 Indicadores del periodo desde `/metrics/summary`
- [x] 5.2 Tarjetas de recaudado por moneda y tasas del día con aviso de tasa vieja
- [x] 5.3 Gráfico de los últimos 6 meses con descripción accesible
- [x] 5.4 Últimos pagos y cola de revisión con aprobar/rechazar

## 6. Personas

- [x] 6.1 Listado con búsqueda (300 ms de espera), filtros en la URL y paginación; tarjetas en teléfono
- [x] 6.2 Selector de rol con confirmación, deshabilitado en la propia cuenta y manejo de `LAST_ADMIN`
- [x] 6.3 Diálogo "Nueva persona" y "Restablecer contraseña" que muestran la contraseña temporal una sola vez
- [x] 6.4 Ficha `/admin/personas/[id]` con historial y acceso a registrar pago

## 7. Pagos

- [x] 7.1 Diálogo / hoja inferior "Registrar pago" con buscador de estudiante, moneda y equivalencia en vivo
- [x] 7.2 Página `/admin/pagos` con filtros por estado y periodo
- [x] 7.3 Rechazar con motivo obligatorio y anular con motivo y confirmación
- [x] 7.4 Visor de captura del pago móvil (URL firmada)
- [x] 7.5 Página `/admin/ajustes`: cuota mensual y tasas VES/COP con historial

## 8. Portal del estudiante

- [x] 8.1 `/mi-cuenta`: tarjeta de estado, meses adeudados y monto en $ y Bs
- [x] 8.2 Historial con pagos rechazados y su motivo
- [x] 8.3 `/mi-cuenta/reportar`: datos de pago móvil de la sede, formulario y captura validada y comprimida

## 9. Calidad y despliegue

- [x] 9.1 Pruebas de componentes (Vitest + Testing Library) para formatos, `EstadoBadge` y formularios
- [x] 9.2 Pruebas e2e (Playwright) de login, registrar pago, aprobar pago móvil y cambiar rol, a 390 px y a 1440 px
- [x] 9.3 Revisión de accesibilidad (axe) y contraste en los dos modos
- [ ] 9.4 Proyecto en Vercel con variables de entorno, vista previa contra la API `dev` y promoción a producción

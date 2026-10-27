## Why

La sede de Informática va a cobrar una cuota mensual por el internet y necesita una app web donde el administrador vea cuánto dinero entra y quién pagó, y donde cada estudiante consulte su estado y reporte su pago móvil. Toda la lógica de negocio vive en `View-Internet-Backend` (cambio `add-payment-control-api`); este repo es la interfaz: responsive, con dos roles y una identidad visual de "red y conectividad".

## What Changes

- App web nueva en **Next.js (App Router) + TypeScript + Tailwind CSS + shadcn/ui**, desplegada en Vercel.
- Inicio de sesión por **cédula + contraseña** y cambio de contraseña obligatorio en el primer ingreso; la sesión se guarda en una cookie httpOnly y la web llama a la API desde el servidor (BFF).
- **Panel del administrador**: indicadores del mes (recaudado en equivalente USD, esperado, estudiantes al día, pagos móviles por revisar), recaudado por moneda (USD, VES, COP), gráfico de los últimos 6 meses, últimos pagos y cola de revisión.
- **Personas**: listado con búsqueda por cédula o nombre, filtros por rol y estado, cambio de rol (con las protecciones del backend), alta de personas y restablecimiento de contraseña.
- **Pagos**: formulario "Registrar pago" (efectivo en USD/VES/COP con equivalencia en vivo), aprobar o rechazar pagos móviles con motivo y anular pagos.
- **Portal del estudiante** (pensado primero para móvil): estado del mes, cuánto debe en cada moneda, historial (incluidos los rechazos con su motivo) y formulario para reportar un pago móvil con captura.
- **Tema visual**: fondo de malla de nodos de red con ondas Wi-Fi, modo oscuro por defecto con modo claro, estados con texto e icono (no solo color).
- Diseño de referencia: canvas "View Internet · Diseño" (https://claude.ai/artifact/XKeh3iN1uskhqoUvhtPG7z).

## Capabilities

### New Capabilities
- `web-auth`: pantalla de login, cambio de contraseña obligatorio, manejo de la sesión y redirección según el rol.
- `admin-dashboard`: panel con indicadores, totales por moneda, gráfico mensual, últimos pagos y tasas del día.
- `people-management-ui`: listado, búsqueda, filtros, alta, cambio de rol y restablecimiento de contraseña.
- `payments-ui`: registrar pago en efectivo, cola de revisión de pagos móviles, aprobar/rechazar y anular.
- `student-portal`: estado del estudiante, historial y reporte de pago móvil.
- `visual-theme`: tokens de color, tipografía, fondo de red, modo oscuro/claro y comportamiento responsive.

### Modified Capabilities
<!-- Ninguna: el repositorio no tiene specs previas. -->

## Impact

- **Repositorio nuevo**: `View-Internet` pasa de vacío a una app Next.js.
- **Dependencia**: requiere la API de `View-Internet-Backend` (`API_BASE_URL`) y su OpenAPI para generar el cliente tipado.
- **Hosting**: proyecto en Vercel con variables de entorno `API_BASE_URL` y `SESSION_SECRET`.
- **Accesibilidad**: contraste AA, objetivos táctiles de 44 px como mínimo y navegación completa con teclado.

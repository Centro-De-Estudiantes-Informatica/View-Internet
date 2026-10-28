# Pantallas

Todas las pantallas funcionan desde 360 px de ancho. En el administrador, a partir de 1024 px se muestra un menú lateral; por debajo, una barra inferior con Panel, Personas, Pagos y Ajustes.

## Acceso

| Ruta             | Quién                          | Contenido                                                                                         | API                          |
| ---------------- | ------------------------------ | ------------------------------------------------------------------------------------------------- | ---------------------------- |
| `/login`         | Público                        | Cédula y contraseña. Muestra avisos si la sesión expiró o la cuenta fue desactivada (`?motivo=`). | `POST /auth/login`           |
| `/cambiar-clave` | Sesión con contraseña temporal | Contraseña actual, nueva y confirmación.                                                          | `POST /auth/change-password` |
| `/salir`         | Cualquiera                     | Borra la cookie y vuelve al login.                                                                | —                            |
| `/`              | Cualquiera                     | Redirige a `/admin`, `/mi-cuenta` o `/login` según la sesión.                                     | —                            |

## Administrador

| Ruta                        | Contenido                                                                                                                                                                                                                                                                   | API                                                                                                               |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `/admin`                    | **Panel**: recaudado del mes (equivalente USD), esperado con barra de progreso, estudiantes al día, pagos móviles por revisar; recaudado por moneda con tasas del día; gráfico de 6 meses; últimos pagos aprobados; cola de revisión con Aprobar/Rechazar.                  | `GET /metrics/summary`, `/metrics/monthly`, `/metrics/recent`, `/billing/current`, `/payments?status=EN_REVISION` |
| `/admin/personas`           | **Personas**: búsqueda por cédula o nombre (espera 300 ms tras escribir), filtros por rol y estado del mes, selector de rol por fila, "Nueva persona", paginación de 20. En teléfono, cada persona es una tarjeta. Los filtros quedan en la URL (`?q=&rol=&estado=&page=`). | `GET /users`, `POST /users`, `PATCH /users/{id}/role`                                                             |
| `/admin/personas/{id}`      | **Ficha**: datos, estado del mes, restablecer contraseña, activar/desactivar, historial de pagos con Anular.                                                                                                                                                                | `GET /users/{id}`, `GET /users?q=`, `GET /payments?userId=`                                                       |
| `/admin/pagos`              | **Pagos**: lista con filtros por estado, mes, método y moneda (`?estado=&periodo=&metodo=&moneda=&page=`), paginación de 25. Con `?estado=EN_REVISION` se titula "Pagos por revisar".                                                                                       | `GET /payments`, `GET /billing/current`                                                                           |
| `/admin/pagos/nuevo`        | **Registrar pago en efectivo**. `?userId=` preselecciona al estudiante.                                                                                                                                                                                                     | `GET /billing/current`, `GET /users`, `POST /payments/cash`                                                       |
| `/admin/pagos/{id}/captura` | Redirige a la URL firmada de la captura del pago móvil (vence en 5 min).                                                                                                                                                                                                    | `GET /payments/{id}/receipt`                                                                                      |
| `/admin/ajustes`            | **Cuota y tasas**: cuota mensual en USD; tasa del día de Bs y COP con su historial reciente.                                                                                                                                                                                | `GET /billing/current`, `GET /billing/rates`, `PUT /billing/fee`, `POST /billing/rates`                           |

La cabecera tiene un buscador global (lleva a `/admin/personas?q=`), el botón de tema y el menú de usuario con "Cerrar sesión". El ítem "Por revisar" del menú muestra cuántos pagos móviles esperan revisión.

## Estudiante

| Ruta                  | Contenido                                                                                                                                                | API                                                                  |
| --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| `/mi-cuenta`          | Nombre y cédula; tarjeta de estado (al día, en revisión o lo que debe, con el monto en $, Bs y COP); botón para reportar pago móvil; historial de pagos. | `GET /me/status`, `GET /me/payments`                                 |
| `/mi-cuenta/reportar` | Datos de pago móvil de la sede y monto de hoy en Bs; formulario con referencia, banco, monto, teléfono, fecha y captura opcional.                        | `GET /billing/current`, `GET /me/status`, `POST /me/payments/mobile` |

Los datos de pago móvil de la sede (banco, teléfono, cédula/RIF) salen de las variables `SEDE_PAGO_MOVIL_*`; si faltan, se muestra "Por configurar".

## Estados que se muestran

**Estado del mes de una persona** (lo calcula la API):

| Estado      | Significado                                        | Color |
| ----------- | -------------------------------------------------- | ----- |
| Al día      | Lo aprobado cubre la cuota del mes                 | verde |
| Parcial     | Pagó una parte                                     | ámbar |
| En revisión | No tiene nada aprobado, pero reportó un pago móvil | azul  |
| Pendiente   | No ha pagado nada                                  | rojo  |

**Estado de un pago**:

| Estado      | Significado                                                    |
| ----------- | -------------------------------------------------------------- |
| Aprobado    | Cuenta para el estado y las métricas                           |
| En revisión | Pago móvil reportado, esperando al administrador               |
| Rechazado   | El administrador no lo encontró en el banco; muestra el motivo |
| Anulado     | Se registró por error; muestra quién lo anuló y por qué        |

## Cargas y errores

- Mientras llegan los datos, cada página muestra un esqueleto con la forma del contenido.
- Si la API no responde, la sección muestra "No se pudo cargar esta página" con un botón **Reintentar** (`error.tsx`).
- Los errores de un formulario aparecen junto al campo correspondiente; los generales, arriba del formulario. Las confirmaciones aparecen como avisos emergentes (_toasts_).

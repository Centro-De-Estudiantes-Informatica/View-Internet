## ADDED Requirements

### Requirement: Estado del estudiante
La página `/mi-cuenta` SHALL mostrar el nombre y la cédula del estudiante y una tarjeta de estado del mes con insignia de texto e icono (`Al día`, `Parcial`, `En revisión`, `Pendiente`), los meses adeudados y el monto pendiente en USD y en Bs a la tasa vigente.

#### Scenario: Estudiante pendiente
- **WHEN** un estudiante que debe octubre abre `/mi-cuenta`
- **THEN** ve "Pendiente · Debes octubre 2026", la cuota en $ y en Bs, y el botón "Reportar pago móvil"

#### Scenario: Estudiante al día
- **WHEN** un estudiante con el mes pagado abre `/mi-cuenta`
- **THEN** ve "Al día" y hasta qué fecha está cubierto, sin botón de reportar

### Requirement: Historial de pagos
La página SHALL listar los pagos del estudiante del más reciente al más antiguo, con mes, método, referencia, monto en su moneda y estado. Los rechazados MUST mostrar su motivo.

#### Scenario: Pago rechazado
- **WHEN** un pago móvil del estudiante fue rechazado
- **THEN** el historial lo muestra tachado como "Rechazado" con el motivo

### Requirement: Reportar pago móvil
La página `/mi-cuenta/reportar` SHALL mostrar los datos de pago móvil de la sede (banco, teléfono, cédula/RIF) y el monto de hoy en Bs, y SHALL pedir referencia, banco de origen, teléfono de origen, monto y una captura opcional (JPG/PNG, máximo 5 MB, validada antes de subirla).

#### Scenario: Reporte enviado
- **WHEN** el estudiante envía un reporte válido
- **THEN** la web lo lleva a `/mi-cuenta`, donde el pago aparece como "En revisión"

#### Scenario: Referencia duplicada
- **WHEN** la API responde `DUPLICATE_REFERENCE`
- **THEN** el campo referencia muestra "Esta referencia ya fue reportada"

#### Scenario: Captura demasiado grande
- **WHEN** el estudiante elige una imagen de más de 5 MB
- **THEN** la web la rechaza antes de enviar e indica el límite

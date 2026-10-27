## ADDED Requirements

### Requirement: Indicadores del periodo
El panel `/admin` SHALL mostrar el periodo actual y cuatro indicadores: recaudado (equivalente USD), esperado con barra de progreso y porcentaje, estudiantes al día sobre el total, y pagos móviles por revisar. Los números MUST venir de `GET /metrics/summary`; la web no recalcula totales.

#### Scenario: Ver el panel
- **WHEN** un administrador abre `/admin`
- **THEN** ve los cuatro indicadores del periodo actual con los montos en fuente monoespaciada

#### Scenario: Ir a los pendientes
- **WHEN** el administrador pulsa "ver lista" en el indicador de estudiantes al día
- **THEN** la web abre `/admin/personas?estado=PENDIENTE`

### Requirement: Recaudado por moneda y tasas del día
El panel SHALL mostrar el recaudado de USD, VES y COP en su moneda original y su equivalente en USD, junto con las tasas vigentes y la fecha de cada una. Si alguna tasa tiene más de un día, MUST mostrar un aviso con acceso a actualizarla.

#### Scenario: Tasa desactualizada
- **WHEN** la última tasa VES es de hace dos días
- **THEN** el panel muestra "Tasa Bs del 24/10 · actualizar" resaltado en ámbar

### Requirement: Gráfico de ingresos mensuales
El panel SHALL mostrar un gráfico de barras con el recaudado equivalente en USD de los últimos 6 meses, resaltando el mes actual, con una descripción accesible de los valores.

#### Scenario: Mes en curso
- **WHEN** el periodo actual todavía no cerró
- **THEN** su barra usa el color primario y las demás un tono atenuado

### Requirement: Últimos pagos y cola de revisión en el panel
El panel SHALL mostrar los últimos pagos aprobados y una tabla de pagos móviles `EN_REVISION` con estudiante, referencia, banco, monto, enlace a la captura y botones "Aprobar" y "Rechazar".

#### Scenario: Aprobar desde el panel
- **WHEN** el administrador pulsa "Aprobar" en un pago en revisión
- **THEN** el pago sale de la cola, los indicadores se actualizan y aparece una confirmación

## ADDED Requirements

### Requirement: Registrar pago en efectivo
El administrador SHALL poder abrir "Registrar pago" desde el panel, desde Personas o desde la ficha de un estudiante. El formulario SHALL pedir estudiante (buscador por cédula o nombre), mes que paga, fecha, moneda (USD/VES/COP), monto y nota opcional. Al elegir la moneda, el monto MUST rellenarse con la cuota en esa moneda y mostrar la tasa usada con su fecha.

#### Scenario: Cambiar moneda
- **WHEN** el administrador selecciona `VES` con cuota $5.00 y tasa 200,00
- **THEN** el monto sugerido es `1.000,00` y se muestra "Cuota $5.00 × 200,00 Bs/USD (tasa del día)"

#### Scenario: Guardar pago
- **WHEN** el administrador guarda un pago válido
- **THEN** la web confirma "Pago registrado", cierra el formulario y actualiza el estado del estudiante

#### Scenario: Falta la tasa
- **WHEN** la API responde `RATE_MISSING`
- **THEN** la web indica que primero hay que cargar la tasa del día, con un enlace a hacerlo

### Requirement: Revisión de pagos móviles
La web SHALL ofrecer en `/admin/pagos?estado=EN_REVISION` la cola de pagos móviles reportados, con acceso a ver la captura. "Rechazar" MUST pedir un motivo obligatorio.

#### Scenario: Rechazar con motivo
- **WHEN** el administrador rechaza escribiendo "La referencia no aparece en el banco"
- **THEN** el pago sale de la cola y el estudiante verá ese motivo

#### Scenario: Otro administrador ya lo revisó
- **WHEN** la API responde 409 al aprobar
- **THEN** la web avisa que el pago ya fue revisado y refresca la cola

### Requirement: Anular pagos
La ficha de un pago aprobado SHALL ofrecer "Anular" con un motivo obligatorio y confirmación. La web MUST NOT ofrecer borrar pagos.

#### Scenario: Anular
- **WHEN** el administrador anula un pago con motivo
- **THEN** el pago se muestra tachado como "Anulado" y deja de contar en los totales

### Requirement: Cuota y tasas
La página `/admin/ajustes` SHALL permitir actualizar la cuota mensual en USD y registrar la tasa del día de VES y COP, mostrando el historial reciente de tasas.

#### Scenario: Registrar tasa del día
- **WHEN** el administrador guarda 200,00 Bs/USD
- **THEN** la tasa aparece como vigente con la fecha de hoy y el aviso de tasa desactualizada desaparece

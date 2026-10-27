## ADDED Requirements

### Requirement: Listado y búsqueda de personas
La página `/admin/personas` SHALL listar personas con cédula, nombre, estado del mes, rol y acciones. SHALL ofrecer un buscador único por cédula o nombre (con espera de 300 ms tras escribir), filtros por rol y estado, y paginación. Los filtros MUST reflejarse en la URL para poder compartirlos.

#### Scenario: Buscar por cédula
- **WHEN** el administrador escribe `28123456`
- **THEN** la lista muestra a la persona con cédula `V-28.123.456`

#### Scenario: Sin resultados
- **WHEN** la búsqueda no encuentra a nadie
- **THEN** la página muestra "Nadie coincide con “<término>”" y un botón para crear la persona

#### Scenario: Vista en teléfono
- **WHEN** el ancho de pantalla es menor a 640 px
- **THEN** cada persona se muestra como una tarjeta apilada en lugar de una fila de tabla

### Requirement: Cambio de rol desde la lista
Cada fila SHALL tener un selector de rol (`Estudiante`/`Administrador`). Promover a administrador o quitar ese rol MUST pedir confirmación. El selector de la propia cuenta MUST estar deshabilitado con el texto "Eres tú: no puedes cambiar tu rol". Los errores `LAST_ADMIN` y `CANNOT_CHANGE_OWN_ROLE` de la API MUST mostrarse con mensajes claros.

#### Scenario: Promover con confirmación
- **WHEN** el administrador cambia a "Ana Gómez" a Administrador y confirma
- **THEN** la web llama a la API, actualiza la fila y muestra "Ana Gómez ahora es Administrador"

#### Scenario: Último administrador
- **WHEN** la API responde `LAST_ADMIN`
- **THEN** la fila vuelve al rol anterior y se muestra "Debe quedar al menos un administrador"

### Requirement: Alta de personas y restablecimiento de contraseña
La página SHALL ofrecer "Nueva persona" (cédula, nombre, teléfono opcional y rol). Al crearla o al restablecer su contraseña, la web MUST mostrar la contraseña temporal una sola vez, con un botón para copiarla.

#### Scenario: Crear estudiante
- **WHEN** el administrador crea a un estudiante con datos válidos
- **THEN** la web muestra la contraseña temporal y la persona aparece en el listado

#### Scenario: Cédula repetida
- **WHEN** la API responde 409 por cédula duplicada
- **THEN** el campo cédula muestra "Esta cédula ya está registrada" con un enlace a esa persona

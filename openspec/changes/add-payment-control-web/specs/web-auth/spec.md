## ADDED Requirements

### Requirement: Pantalla de inicio de sesión
La web SHALL mostrar un formulario de inicio de sesión con los campos "Cédula" y "Contraseña" y SHALL enviar las credenciales a la API desde el servidor. Ante un error, MUST mostrar un mensaje genérico que no revele cuál de los dos datos falló.

#### Scenario: Ingreso de un administrador
- **WHEN** un administrador inicia sesión con credenciales válidas
- **THEN** la web guarda la sesión en una cookie httpOnly, `Secure`, `SameSite=Lax`, y lo lleva a `/admin`

#### Scenario: Ingreso de un estudiante
- **WHEN** un estudiante inicia sesión con credenciales válidas
- **THEN** la web lo lleva a `/mi-cuenta`

#### Scenario: Credenciales inválidas
- **WHEN** la API responde 401
- **THEN** la web muestra "Cédula o contraseña incorrecta" y conserva la cédula escrita

#### Scenario: Demasiados intentos
- **WHEN** la API responde 429
- **THEN** la web indica que espere unos minutos antes de volver a intentar

### Requirement: Cambio de contraseña obligatorio
La web SHALL redirigir a `/cambiar-clave` a toda sesión con `mustChangePassword` y MUST impedir el acceso a otras rutas hasta completar el cambio.

#### Scenario: Primer ingreso
- **WHEN** un estudiante con contraseña temporal inicia sesión
- **THEN** la web muestra el formulario de nueva contraseña (mínimo 8 caracteres, con confirmación) y, al guardarla, lo lleva a su inicio

### Requirement: Protección de rutas por rol
La web SHALL proteger en el servidor las rutas `/admin/**` para el rol `ADMIN` y `/mi-cuenta/**` para cualquier sesión válida. Sin sesión, MUST redirigir al login.

#### Scenario: Estudiante entra a una ruta de administrador
- **WHEN** un estudiante abre `/admin/personas`
- **THEN** la web lo redirige a `/mi-cuenta`

#### Scenario: Sesión vencida
- **WHEN** la API responde 401 por un token vencido o invalidado
- **THEN** la web borra la cookie y redirige al login con el aviso "Tu sesión expiró"

### Requirement: Cerrar sesión
La web SHALL ofrecer "Cerrar sesión" en el menú, que elimina la cookie de sesión.

#### Scenario: Cerrar sesión
- **WHEN** el usuario elige "Cerrar sesión"
- **THEN** la cookie se elimina y se muestra el login

## ADDED Requirements

### Requirement: Identidad visual "red y conectividad"
La web SHALL usar un fondo de malla de puntos (nodos de red) en todas las pantallas; en el login SHALL sumar líneas entre nodos y ondas Wi-Fi concéntricas detrás del formulario. Dentro de la app, el patrón MUST ser tenue (opacidad ≤ 8 %) para no competir con los datos. Los elementos decorativos MUST tener `aria-hidden`.

#### Scenario: Login
- **WHEN** se abre la pantalla de login
- **THEN** se ve el fondo de red completo con las ondas Wi-Fi detrás del formulario

#### Scenario: Pantallas de datos
- **WHEN** se abre el panel o Personas
- **THEN** el fondo muestra solo la malla tenue de puntos

### Requirement: Tokens de diseño y modos claro/oscuro
La web SHALL definir los colores como variables CSS: fondo `#0B1220`, superficie `#111A2E`, borde `#1E2A44`, primario cian `#22D3EE`, y los estados al día `#34D399`, parcial `#FBBF24`, en revisión `#93C5FD` y pendiente `#FCA5A5` en modo oscuro (por defecto), con equivalentes de contraste AA en modo claro. La tipografía SHALL ser Sora (títulos), IBM Plex Sans (texto) y JetBrains Mono (cédulas, montos y referencias). El modo MUST seguir la preferencia del sistema y poder cambiarse a mano.

#### Scenario: Preferencia del sistema
- **WHEN** el sistema operativo está en modo claro y el usuario no eligió ningún modo
- **THEN** la web se muestra en modo claro

#### Scenario: Estados distinguibles sin color
- **WHEN** se muestra el estado de un estudiante
- **THEN** la insignia incluye texto (y en el portal también un icono), no solo color

### Requirement: Diseño responsive
La web SHALL funcionar desde 360 px de ancho sin desplazamiento horizontal de la página. En escritorio (≥ 1024 px) el administrador ve un menú lateral; por debajo, el menú pasa a una barra inferior o desplegable. Las tablas anchas MUST desplazarse dentro de su contenedor o convertirse en tarjetas. Los objetivos táctiles MUST medir al menos 44 × 44 px.

#### Scenario: Panel en teléfono
- **WHEN** un administrador abre `/admin` en un teléfono de 390 px
- **THEN** los indicadores se apilan en una columna y el menú está en la barra inferior

#### Scenario: Teclado
- **WHEN** alguien navega solo con el teclado
- **THEN** todos los controles reciben foco visible con anillo cian

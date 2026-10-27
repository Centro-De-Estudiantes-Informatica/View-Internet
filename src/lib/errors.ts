/** Mensajes en español para los códigos `{ code }` que devuelve la API. */
const MESSAGES: Record<string, string> = {
  INVALID_CREDENTIALS: "Cédula o contraseña incorrecta",
  UNAUTHORIZED: "Tu sesión expiró. Vuelve a iniciar sesión.",
  TOO_MANY_ATTEMPTS: "Demasiados intentos. Espera unos minutos antes de volver a intentar.",
  TOO_MANY_REQUESTS: "Demasiados intentos. Espera unos minutos antes de volver a intentar.",
  ACCOUNT_DISABLED: "Tu cuenta está desactivada. Habla con el administrador de la sede.",
  PASSWORD_CHANGE_REQUIRED: "Debes cambiar tu contraseña antes de continuar.",
  INVALID_CURRENT_PASSWORD: "La contraseña actual no es correcta",
  PASSWORD_REUSED: "La nueva contraseña debe ser distinta a la actual",
  FORBIDDEN: "No tienes permiso para hacer esto",
  LAST_ADMIN: "Debe quedar al menos un administrador",
  CANNOT_CHANGE_OWN_ROLE: "No puedes cambiar tu propio rol",
  CANNOT_DEACTIVATE_SELF: "No puedes desactivar tu propia cuenta",
  CEDULA_TAKEN: "Esta cédula ya está registrada",
  INVALID_CEDULA: "La cédula no es válida",
  USER_NOT_FOUND: "La persona no existe",
  PAYMENT_NOT_FOUND: "El pago no existe",
  INVALID_PAYMENT_STATE: "Este pago ya fue revisado por otro administrador",
  DUPLICATE_REFERENCE: "Esta referencia ya fue reportada",
  MOBILE_PAYMENT_VES_ONLY: "El pago móvil solo se acepta en bolívares",
  RATE_MISSING: "Primero hay que cargar la tasa del día",
  FEE_NOT_CONFIGURED: "Falta configurar la cuota mensual",
  INVALID_PERIOD: "El mes indicado no es válido",
  DATE_IN_FUTURE: "La fecha no puede ser futura",
  INVALID_RECEIPT: "La captura debe ser una imagen JPG o PNG de máximo 5 MB",
  PAYLOAD_TOO_LARGE: "La captura debe pesar máximo 5 MB",
  UNSUPPORTED_MEDIA_TYPE: "La captura debe ser una imagen JPG o PNG",
  RECEIPT_NOT_FOUND: "Este pago no tiene captura",
  STORAGE_NOT_CONFIGURED: "El almacenamiento de capturas no está disponible",
  VALIDATION_ERROR: "Revisa los datos del formulario",
  BAD_REQUEST: "Revisa los datos del formulario",
  NOT_FOUND: "No se encontró lo que buscabas",
  CONFLICT: "El registro ya existe",
  SERVICE_UNAVAILABLE: "No se pudo conectar con el servidor. Intenta de nuevo.",
  DB_UNAVAILABLE: "No se pudo conectar con el servidor. Intenta de nuevo.",
  INTERNAL_ERROR: "Ocurrió un error inesperado. Intenta de nuevo.",
}

export function errorMessage(code: string, fallback?: string): string {
  return MESSAGES[code] ?? fallback ?? MESSAGES.INTERNAL_ERROR
}

/** Resultado de una Server Action con formulario. */
export type ActionResult<T = undefined> =
  | { ok: true; data: T; message?: string }
  | {
      ok: false
      code: string
      message: string
      fields?: Record<string, string>
      /** Lo que se envió, para no vaciar el formulario al mostrar el error. */
      values?: Record<string, string>
    }
  | null

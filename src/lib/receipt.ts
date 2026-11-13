/**
 * Límites de la captura del pago móvil en la web. El backend acepta 5 MB, pero la petición pasa
 * por el servidor de Next: Vercel corta en 4,5 MB, y `serverActions.bodySizeLimit` en
 * `next.config.ts` debe quedar por encima de este valor (con margen para el multipart).
 */
export const MAX_RECEIPT_BYTES = 4 * 1024 * 1024
export const RECEIPT_TYPES = ["image/jpeg", "image/png"]
export const RECEIPT_ERROR = "La captura debe ser JPG o PNG de máximo 4 MB"

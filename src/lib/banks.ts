/** Bancos venezolanos con su código SUDEBAN de 4 dígitos (el backend guarda el código). */
export const BANKS: { code: string; name: string }[] = [
  { code: "0102", name: "Banco de Venezuela" },
  { code: "0104", name: "Venezolano de Crédito" },
  { code: "0105", name: "Mercantil" },
  { code: "0108", name: "Provincial" },
  { code: "0114", name: "Bancaribe" },
  { code: "0115", name: "Exterior" },
  { code: "0128", name: "Caroní" },
  { code: "0134", name: "Banesco" },
  { code: "0137", name: "Sofitasa" },
  { code: "0138", name: "Banco Plaza" },
  { code: "0151", name: "BFC Banco Fondo Común" },
  { code: "0156", name: "100% Banco" },
  { code: "0157", name: "DelSur" },
  { code: "0163", name: "Banco del Tesoro" },
  { code: "0166", name: "Banco Agrícola de Venezuela" },
  { code: "0168", name: "Bancrecer" },
  { code: "0169", name: "R4 Banco Microfinanciero" },
  { code: "0171", name: "Banco Activo" },
  { code: "0172", name: "Bancamiga" },
  { code: "0174", name: "Banplus" },
  { code: "0175", name: "Banco Digital de los Trabajadores" },
  { code: "0177", name: "Banfanb" },
  { code: "0191", name: "BNC" },
]

const NAMES = new Map(BANKS.map((b) => [b.code, b.name]))

/** `"0134"` → `"Banesco"`; si el código no está en la lista, lo devuelve tal cual. */
export function bankName(code: string | null | undefined): string {
  if (!code) return "—"
  return NAMES.get(code) ?? code
}

import { Settings } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/** Instalación nueva: sin cuota no hay periodos, estados ni métricas. */
export function FeeSetupNotice() {
  return (
    <section
      aria-labelledby="fee-setup-t"
      className="mx-auto flex w-full max-w-xl flex-col gap-4 rounded-2xl border border-partial/40 bg-card p-6"
    >
      <h2 id="fee-setup-t" className="text-xl font-semibold">
        Falta configurar la cuota mensual
      </h2>
      <p className="text-[15px] text-muted-foreground">
        Sin la cuota no se pueden registrar pagos ni calcular quién está al día. Configúrala y carga
        las tasas del día de bolívares y pesos para empezar.
      </p>
      <Link
        href="/admin/ajustes"
        className={cn(buttonVariants(), "h-11 self-start rounded-[10px] px-4.5 font-semibold")}
      >
        <Settings className="size-4" aria-hidden="true" />
        Ir a Cuota y tasas
      </Link>
    </section>
  )
}

/** Lo que ve un estudiante si el administrador aún no terminó la configuración inicial. */
export function FeePendingNotice() {
  return (
    <section
      aria-labelledby="fee-pending-t"
      className="flex flex-col gap-2 rounded-2xl border bg-card p-6"
    >
      <h2 id="fee-pending-t" className="text-lg font-semibold">
        Todavía no hay cuota configurada
      </h2>
      <p className="text-sm text-muted-foreground">
        El administrador de la sede aún no define la cuota mensual. Vuelve a entrar más tarde.
      </p>
    </section>
  )
}

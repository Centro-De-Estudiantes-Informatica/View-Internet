import { Ban, CircleAlert, CircleCheck, CircleDashed, Clock, CircleX } from "lucide-react"
import type { PaymentStatus, PeriodStatus } from "@/lib/api/types"
import { cn } from "@/lib/utils"

type Tone = "ok" | "partial" | "review" | "due" | "muted"

const TONES: Record<Tone, string> = {
  ok: "bg-ok-soft text-ok",
  partial: "bg-partial-soft text-partial",
  review: "bg-review-soft text-review",
  due: "bg-due-soft text-due",
  muted: "bg-muted text-muted-foreground",
}

const PERIOD: Record<PeriodStatus, { label: string; tone: Tone; icon: typeof CircleCheck }> = {
  AL_DIA: { label: "Al día", tone: "ok", icon: CircleCheck },
  PARCIAL: { label: "Parcial", tone: "partial", icon: CircleDashed },
  EN_REVISION: { label: "En revisión", tone: "review", icon: Clock },
  PENDIENTE: { label: "Pendiente", tone: "due", icon: CircleAlert },
}

const PAYMENT: Record<PaymentStatus, { label: string; tone: Tone; icon: typeof CircleCheck }> = {
  APROBADO: { label: "Aprobado", tone: "ok", icon: CircleCheck },
  EN_REVISION: { label: "En revisión", tone: "review", icon: Clock },
  RECHAZADO: { label: "Rechazado", tone: "due", icon: CircleX },
  ANULADO: { label: "Anulado", tone: "muted", icon: Ban },
}

function Pill({
  label,
  tone,
  icon: Icon,
  showIcon,
  className,
}: {
  label: string
  tone: Tone
  icon: typeof CircleCheck
  showIcon: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex h-7 shrink-0 items-center gap-1.5 rounded-full px-3 text-[13px] font-medium whitespace-nowrap",
        TONES[tone],
        className,
      )}
    >
      {showIcon && <Icon className="size-3.5" aria-hidden="true" />}
      {label}
    </span>
  )
}

/** Estado mensual del estudiante: siempre con texto, no solo color. */
export function EstadoBadge({
  status,
  showIcon = true,
  className,
}: {
  status: PeriodStatus
  showIcon?: boolean
  className?: string
}) {
  return <Pill {...PERIOD[status]} showIcon={showIcon} className={className} />
}

export function PaymentStatusBadge({
  status,
  showIcon = false,
  className,
}: {
  status: PaymentStatus
  showIcon?: boolean
  className?: string
}) {
  return <Pill {...PAYMENT[status]} showIcon={showIcon} className={className} />
}

export const PERIOD_STATUS_LABELS: Record<PeriodStatus, string> = {
  AL_DIA: PERIOD.AL_DIA.label,
  PARCIAL: PERIOD.PARCIAL.label,
  EN_REVISION: PERIOD.EN_REVISION.label,
  PENDIENTE: PERIOD.PENDIENTE.label,
}

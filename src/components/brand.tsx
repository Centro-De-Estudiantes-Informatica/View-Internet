import { Wifi } from "lucide-react"
import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-primary/35 bg-primary/12 text-primary",
        className,
      )}
    >
      <Wifi className="size-5" aria-hidden="true" />
    </span>
  )
}

export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <BrandMark className={compact ? "size-9" : undefined} />
      <span className="flex flex-col leading-tight">
        <span className="font-heading text-[15px] font-semibold text-foreground">
          View Internet
        </span>
        <span className="text-xs text-muted-foreground">Sede de Informática</span>
      </span>
    </span>
  )
}

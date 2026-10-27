import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

/** Etiqueta + control + error accesible (`aria-describedby`). */
export function Field({
  id,
  label,
  error,
  hint,
  className,
  children,
}: {
  id: string
  label: React.ReactNode
  error?: string
  hint?: React.ReactNode
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={id} className="text-sm font-medium text-foreground/85">
        {label}
      </Label>
      {children}
      {hint && !error && (
        <p id={`${id}-hint`} className="text-[13px] text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="text-[13px] font-medium text-due" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const fieldClass =
  "h-12 rounded-[10px] border-field-border bg-field px-3.5 text-[15px] dark:bg-field md:text-[15px]"

export function FormError({ message }: { message?: string }) {
  if (!message) return null
  return (
    <p
      role="alert"
      className="rounded-[10px] border border-due/40 bg-due-soft px-3.5 py-2.5 text-sm font-medium text-due"
    >
      {message}
    </p>
  )
}

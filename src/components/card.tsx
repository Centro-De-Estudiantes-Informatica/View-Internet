import { cn } from "@/lib/utils"

export function Panel({ className, children, ...props }: React.ComponentProps<"section">) {
  return (
    <section
      className={cn("flex min-w-0 flex-col gap-4 rounded-[14px] border bg-card p-5", className)}
      {...props}
    >
      {children}
    </section>
  )
}

export function PanelTitle({
  id,
  children,
  aside,
}: {
  id?: string
  children: React.ReactNode
  aside?: React.ReactNode
}) {
  return (
    <div className="flex flex-wrap items-baseline justify-between gap-2">
      <h2 id={id} className="text-lg font-semibold text-foreground">
        {children}
      </h2>
      {aside && <div className="text-[13px] text-muted-foreground">{aside}</div>}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        {eyebrow && (
          <span className="text-[13px] tracking-[0.08em] text-muted-foreground uppercase">
            {eyebrow}
          </span>
        )}
        <h1 className="text-[28px] font-semibold text-foreground sm:text-[30px]">{title}</h1>
        {description && <p className="text-[15px] text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-3">{actions}</div>}
    </header>
  )
}
